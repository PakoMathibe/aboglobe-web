document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const form = document.getElementById('resetForm');
    const emailInput = document.getElementById('email');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = document.getElementById('btnText');
    const btnSpinner = document.getElementById('btnSpinner');
    const resendBtn = document.getElementById('resendBtn');
    const resendText = document.getElementById('resendText');

    // Step Containers
    const stepRequest = document.getElementById('stepRequest');
    const stepSuccess = document.getElementById('stepSuccess');
    const sentEmailSpan = document.getElementById('sentEmail');

    // Store the last submitted email for the resend function
    let currentEmail = '';

    // ==========================================
    // 1. TOAST NOTIFICATION SYSTEM
    // ==========================================
    function showToast(message, type = 'success') {
        const container = document.getElementById('toastContainer');
        
        // Remove existing toast to prevent stacking
        const existing = container.querySelector('.toast-item');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = `toast-item animate-toast flex items-center gap-3 p-4 rounded-xl shadow-xl border-l-4 bg-white min-w-[300px] ${
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
    // 2. VALIDATION HELPERS
    // ==========================================
    function setError(input, message) {
        const group = input.closest('.group');
        const errorEl = group.querySelector('.error-msg');
        
        input.classList.remove('border-gray-300', 'focus:ring-brand-brown');
        input.classList.add('border-red-500', 'focus:ring-red-500', 'bg-red-50');
        
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.classList.remove('hidden');
        }
    }

    function clearError(input) {
        const group = input.closest('.group');
        const errorEl = group.querySelector('.error-msg');
        
        input.classList.remove('border-red-500', 'focus:ring-red-500', 'bg-red-50');
        input.classList.add('border-gray-300', 'focus:ring-brand-brown');
        
        if (errorEl) errorEl.classList.add('hidden');
    }

    emailInput.addEventListener('input', () => clearError(emailInput));

    // ==========================================
    // 3. STEP TRANSITION HELPER
    // ==========================================
    function showStep(showEl, hideEl) {
        hideEl.classList.add('hidden');
        showEl.classList.remove('hidden');
        showEl.classList.add('step-enter');
        
        // Remove animation class after it completes so it can re-animate later
        setTimeout(() => showEl.classList.remove('step-enter'), 500);
    }

    // ==========================================
    // 4. FORM SUBMISSION (STEP 1)
    // ==========================================
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = emailInput.value.trim();

        // Validate
        if (!email) {
            setError(emailInput, 'Email address is required.');
            return;
        }
        
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError(emailInput, 'Please enter a valid email address.');
            return;
        }

        // --- Loading State ---
        submitBtn.disabled = true;
        btnText.classList.add('opacity-0');
        btnSpinner.classList.remove('hidden');

        try {
            await simulateResetRequest(email);
            
            // Store email for resend
            currentEmail = email;
            
            // Update success screen
            sentEmailSpan.textContent = email;
            
            // Transition to Step 2
            showStep(stepSuccess, stepRequest);
            
            // Success toast
            showToast('Reset link sent successfully!', 'success');

        } catch (error) {
            showToast(error.message, 'error');
            setError(emailInput, 'Unable to process request. Try again.');
        } finally {
            submitBtn.disabled = false;
            btnText.classList.remove('opacity-0');
            btnSpinner.classList.add('hidden');
        }
    });

    // ==========================================
    // 5. RESEND EMAIL (STEP 2)
    // ==========================================
    resendBtn.addEventListener('click', async () => {
        if (!currentEmail) return;

        resendBtn.disabled = true;
        const originalResendText = resendText.textContent;
        resendText.textContent = 'Sending...';

        try {
            await simulateResetRequest(currentEmail);
            
            // Visual feedback
            showToast('Reset link resent successfully!', 'success');
            resendText.textContent = 'Email sent!';
            
            // Reset after 3 seconds
            setTimeout(() => {
                resendText.textContent = originalResendText;
                resendBtn.disabled = false;
            }, 3000);

        } catch (error) {
            showToast('Failed to resend. Please try again.', 'error');
            resendText.textContent = originalResendText;
            resendBtn.disabled = false;
        }
    });

    // ==========================================
    // 6. MOCK API
    // ==========================================
    function simulateResetRequest(email) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Demo: Simulate a failure for non-existent emails
                if (email === "unknown@example.com") {
                    reject(new Error("No account found with that email."));
                } else {
                    // In a real app, we would ALWAYS resolve here, even if the email doesn't exist
                    // This prevents "user enumeration" attacks (a fintech security best practice)
                    resolve({ email });
                }
            }, 1500);
        });
    }
});