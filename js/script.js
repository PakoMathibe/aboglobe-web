document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const form = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const togglePasswordBtn = document.getElementById('togglePassword');
    const eyeIcon = document.getElementById('eyeIcon');
    
    // Button Elements
    const submitBtn = document.getElementById('submitBtn');
    const btnText = document.getElementById('btnText');
    const btnSpinner = document.getElementById('btnSpinner');

    // ==========================================
    // 1. PASSWORD VISIBILITY TOGGLE
    // ==========================================
    const eyeOpen = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>`;
    const eyeClosed = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>`;

    togglePasswordBtn.addEventListener('click', () => {
        const isPassword = passwordInput.getAttribute('type') === 'password';
        passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
        eyeIcon.innerHTML = isPassword ? eyeClosed : eyeOpen;
    });

    // ==========================================
    // 2. TOAST NOTIFICATION SYSTEM
    // ==========================================
    function showToast(message, type = 'success') {
        const container = document.getElementById('toastContainer');
        
        const toast = document.createElement('div');
        // Base Tailwind classes for toast
        toast.className = `animate-toast flex items-center gap-3 p-4 rounded-xl shadow-xl border-l-4 bg-white min-w-[300px] ${
            type === 'success' ? 'border-green-500' : 'border-red-500'
        }`;

        const iconColor = type === 'success' ? 'text-green-500' : 'text-red-500';
        const iconSvg = type === 'success' 
            ? `<svg class="w-6 h-6 ${iconColor}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`
            : `<svg class="w-6 h-6 ${iconColor}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;

        toast.innerHTML = `
            <div class="flex-shrink-0">${iconSvg}</div>
            <div class="flex-1 text-sm font-semibold text-gray-800">${message}</div>
            <button class="text-gray-400 hover:text-gray-600 transition-colors" onclick="this.parentElement.remove()">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
        `;

        container.appendChild(toast);

        // Auto remove after 4 seconds
        setTimeout(() => {
            if (toast.parentElement) {
                toast.style.opacity = '0';
                toast.style.transform = 'translateX(100%)';
                toast.style.transition = 'all 0.3s ease';
                setTimeout(() => toast.remove(), 300);
            }
        }, 4000);
    }

    // ==========================================
    // 3. VALIDATION HELPERS
    // ==========================================
    function setError(inputId, message) {
        const group = document.getElementById(inputId + 'Group');
        const input = document.getElementById(inputId);
        const errorEl = group.querySelector('.error-msg');
        
        // Add Tailwind error classes
        input.classList.remove('border-gray-300', 'focus:ring-brand-brown');
        input.classList.add('border-red-500', 'focus:ring-red-500', 'bg-red-50');
        
        errorEl.textContent = message;
        errorEl.classList.remove('hidden');
    }

    function clearError(inputId) {
        const group = document.getElementById(inputId + 'Group');
        const input = document.getElementById(inputId);
        const errorEl = group.querySelector('.error-msg');
        
        input.classList.remove('border-red-500', 'focus:ring-red-500', 'bg-red-50');
        input.classList.add('border-gray-300', 'focus:ring-brand-brown');
        
        errorEl.classList.add('hidden');
    }

    // Clear errors on typing
    emailInput.addEventListener('input', () => clearError('email'));
    passwordInput.addEventListener('input', () => clearError('password'));

    // ==========================================
    // 4. FORM SUBMISSION
    // ==========================================
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        let isValid = true;

        // Validate Email
        if (!email) {
            setError('email', 'Email address is required.');
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError('email', 'Please enter a valid email address.');
            isValid = false;
        }

        // Validate Password
        if (!password) {
            setError('password', 'Password is required.');
            isValid = false;
        } else if (password.length < 6) {
            setError('password', 'Password must be at least 6 characters.');
            isValid = false;
        }

        if (!isValid) return;

        // --- UI Loading State ---
        submitBtn.disabled = true;
        btnText.classList.add('opacity-0');
        btnSpinner.classList.remove('hidden');

        try {
            // Simulate API Call
            await simulateLogin(email, password);

            // Success
            showToast('Authentication successful. Redirecting...', 'success');
            
            // Reset form
            form.reset();
            
            // Optional: Redirect after 1.5s
            // setTimeout(() => window.location.href = 'dashboard.html', 1500);

        } catch (error) {
            // Failure
            showToast(error.message, 'error');
            setError('password', 'Invalid credentials.');
        } finally {
            // Reset UI Loading State
            submitBtn.disabled = false;
            btnText.classList.remove('opacity-0');
            btnSpinner.classList.add('hidden');
        }
    });

    // ==========================================
    // 5. MOCK API
    // ==========================================
    function simulateLogin(email, password) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Demo: Use "password123" to succeed
                if (password === "password123") {
                    resolve({ user: email });
                } else {
                    reject(new Error("Access Denied. Try password: 'password123'"));
                }
            }, 1800);
        });
    }
});