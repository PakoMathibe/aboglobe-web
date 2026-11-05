document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const form = document.getElementById('signupForm');
    const fullNameInput = document.getElementById('fullName');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmInput = document.getElementById('confirmPassword');
    const termsInput = document.getElementById('terms');
    
    // Strength Meter
    const strengthBars = document.querySelectorAll('.strength-bar');
    const strengthText = document.getElementById('strengthText');
    
    // Button
    const submitBtn = document.getElementById('submitBtn');
    const btnText = document.getElementById('btnText');
    const btnSpinner = document.getElementById('btnSpinner');

    // ==========================================
    // 1. PASSWORD VISIBILITY TOGGLES
    // ==========================================
    const eyeOpen = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>`;
    const eyeClosed = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>`;

    // Attach toggle logic to BOTH password fields
    document.querySelectorAll('.toggle-password').forEach(btn => {
        btn.addEventListener('click', () => {
            const wrapper = btn.closest('.relative');
            const input = wrapper.querySelector('input');
            const icon = btn.querySelector('.eye-icon');
            
            const isPassword = input.getAttribute('type') === 'password';
            input.setAttribute('type', isPassword ? 'text' : 'password');
            icon.innerHTML = isPassword ? eyeClosed : eyeOpen;
        });
    });

    // ==========================================
    // 2. TOAST NOTIFICATION SYSTEM
    // ==========================================
    function showToast(message, type = 'success') {
        const container = document.getElementById('toastContainer');
        
        const toast = document.createElement('div');
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
    // 3. PASSWORD STRENGTH METER
    // ==========================================
    function calculateStrength(password) {
        let score = 0;
        if (password.length >= 8) score++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
        if (/\d/.test(password)) score++;
        if (/[^a-zA-Z0-9]/.test(password)) score++;

        // Update UI
        strengthBars.forEach(bar => bar.className = 'strength-bar flex-1 rounded-full bg-gray-200');
        strengthText.className = 'text-xs mt-1.5 transition-colors';
        strengthText.textContent = '';

        if (password.length === 0) return score;

        const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
        const states = ['', 'weak', 'fair', 'good', 'strong'];

        for (let i = 0; i < score; i++) {
            strengthBars[i].classList.add(states[score]);
        }
        
        strengthText.textContent = labels[score] + ' password';
        strengthText.classList.add(states[score]);

        return score;
    }

    passwordInput.addEventListener('input', (e) => {
        calculateStrength(e.target.value);
    });

    // ==========================================
    // 4. VALIDATION HELPERS
    // ==========================================
    function setError(inputId, message) {
        const group = document.getElementById(inputId + 'Group');
        const input = document.getElementById(inputId);
        const errorEl = group.querySelector('.error-msg');
        
        if (input) {
            input.classList.remove('border-gray-300', 'focus:ring-brand-brown');
            input.classList.add('border-red-500', 'focus:ring-red-500', 'bg-red-50');
        }
        
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.classList.remove('hidden');
        }
    }

    function clearError(inputId) {
        const group = document.getElementById(inputId + 'Group');
        const input = document.getElementById(inputId);
        const errorEl = group.querySelector('.error-msg');
        
        if (input) {
            input.classList.remove('border-red-500', 'focus:ring-red-500', 'bg-red-50');
            input.classList.add('border-gray-300', 'focus:ring-brand-brown');
        }
        
        if (errorEl) errorEl.classList.add('hidden');
    }

    // Clear errors on input
    ['fullName', 'email', 'password', 'confirmPassword', 'terms'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', () => clearError(id));
            el.addEventListener('change', () => clearError(id));
        }
    });

    // ==========================================
    // 5. FORM SUBMISSION
    // ==========================================
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const fullName = fullNameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const confirm = confirmInput.value;
        const termsAccepted = termsInput.checked;
        let isValid = true;

        // Validate Name
        if (!fullName) {
            setError('fullName', 'Full name is required.');
            isValid = false;
        } else if (fullName.length < 2) {
            setError('fullName', 'Name must be at least 2 characters.');
            isValid = false;
        }

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
        } else if (password.length < 8) {
            setError('password', 'Password must be at least 8 characters.');
            isValid = false;
        } else if (calculateStrength(password) < 2) {
            setError('password', 'Password is too weak. Use uppercase, numbers, and symbols.');
            isValid = false;
        }

        // Validate Confirm Password
        if (!confirm) {
            setError('confirmPassword', 'Please confirm your password.');
            isValid = false;
        } else if (password !== confirm) {
            setError('confirmPassword', 'Passwords do not match.');
            isValid = false;
        }

        // Validate Terms
        if (!termsAccepted) {
            setError('terms', 'You must accept the terms to continue.');
            isValid = false;
        }

        if (!isValid) {
            // Scroll to first error
            const firstError = document.querySelector('.border-red-500');
            if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        // --- UI Loading State ---
        submitBtn.disabled = true;
        btnText.classList.add('opacity-0');
        btnSpinner.classList.remove('hidden');

        try {
            await simulateSignup(fullName, email, password);
            showToast(`Account created for ${fullName}! Redirecting...`, 'success');
            
            // Reset form
            form.reset();
            calculateStrength(''); // Reset strength meter
            
            // Optional: Redirect to login after 2 seconds
            // setTimeout(() => window.location.href = 'index.html', 2000);

        } catch (error) {
            showToast(error.message, 'error');
            setError('email', 'An account with this email already exists.');
        } finally {
            submitBtn.disabled = false;
            btnText.classList.remove('opacity-0');
            btnSpinner.classList.add('hidden');
        }
    });

    // ==========================================
    // 6. MOCK API
    // ==========================================
    function simulateSignup(name, email, password) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Demo: "taken@example.com" simulates an existing account
                if (email === "taken@example.com") {
                    reject(new Error("This email is already registered."));
                } else {
                    resolve({ user: { name, email } });
                }
            }, 1800);
        });
    }
});