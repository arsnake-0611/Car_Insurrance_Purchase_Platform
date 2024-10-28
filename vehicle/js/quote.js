$(document).ready(function () {
    // Mobile menu functionality
    $(".menu-icon-close").hide();
    $(".menu-icon-open").click(function () {
        $(".mobile-menu").show();
        $(".menu-icon-open").hide();
        $(".menu-icon-close").show();
    });
    $(".menu-icon-close").click(function () {
        $(".mobile-menu").hide();
        $(".menu-icon-close").hide();
        $(".menu-icon-open").show();
    });



});

function handleQuote(event) {
    if (!event) return;
    event.preventDefault();

    try {
        // Reset all errors
        const errorMessages = document.querySelectorAll('.error-message');
        if (errorMessages) {
            errorMessages.forEach(msg => {
                msg.style.display = 'none';
            });
        }

        const inputFields = document.querySelectorAll('.input-field');
        if (inputFields) {
            inputFields.forEach(input => {
                input.classList.remove('error');
            });
        }

        let hasErrors = false;
        let errorFields = [];

        // Validate name
        const nameInput = document.getElementById('request-name');
        if (nameInput && (!nameInput.value ||!nameInput.value.trim())) {
            nameInput.classList.add('error');
            const nameError = document.getElementById('name-error');
            if (nameError) nameError.style.display = 'block';
            hasErrors = true;
            errorFields.push('Full Name');
        }

        // Validate email
        const emailInput = document.getElementById('request-email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailInput && (!emailInput.value ||!emailRegex.test(emailInput.value))) {
            emailInput.classList.add('error');
            const emailError = document.getElementById('email-error');
            if (emailError) emailError.style.display = 'block';
            hasErrors = true;
            errorFields.push('Email Address');
        }

        // Validate phone
        const phoneInput = document.getElementById('request-phone');
        const phoneRegex = /^\d{8}$/;
        if (phoneInput && (!phoneInput.value ||!phoneRegex.test(phoneInput.value))) {
            phoneInput.classList.add('error');
            const phoneError = document.getElementById('phone-error');
            if (phoneError) phoneError.style.display = 'block';
            hasErrors = true;
            errorFields.push('Phone Number');
        }

        const termsCheckbox = document.querySelector('#quoteForm input[type="checkbox"]');
        const submitButton = document.querySelector('#quoteForm button[type="submit"]');
        if (submitButton) {
            if (hasErrors ||!termsCheckbox.checked) {
                submitButton.disabled = true;
                submitButton.setAttribute('data-tooltip', 'Please complete: ' + errorFields.join(', ') + (termsCheckbox.checked? '' : ', agree to terms'));
            } else {
                submitButton.disabled = false;
                submitButton.removeAttribute('data-tooltip');

                // Show payment section
                document.getElementById('quoteForm').style.display = 'none';
                document.getElementById('paymentForm').style.display = 'block';
            }
        }
    } catch (err) {
        console.error('Quote error:', err);
    }
}