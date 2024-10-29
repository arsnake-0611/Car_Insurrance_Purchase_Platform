$(document).ready(function () {
    //$('.payment-form').hide();
    $('.btn-next').click(function () {
        if (validateForms()) {
            $('.payment-form').show();
            $('.person-info').hide();
        }
    });

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

function validateForms(event) {
    if (!event) return false;
    event.preventDefault();

    try {
        // Reset all errors
        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(msg => (msg.style.display = 'none'));

        const inputFields = document.querySelectorAll('.input-field');
        inputFields.forEach(input => input.classList.remove('error'));

        let hasErrors = false;
        let errorFields = [];

        // Validate name
        const nameInput = document.getElementById('request-name');
        const nameErrorMsg =!nameInput.value?.trim()? 'Please enter your full name.' : '';
        if (nameErrorMsg) {
            nameInput.classList.add('error');
            const nameError = document.getElementById('name-error');
            if (nameError) nameError.style.display = 'block';
            hasErrors = true;
            errorFields.push(nameErrorMsg);
        }

        // Validate email
        const emailInput = document.getElementById('request-email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const emailErrorMsg = emailInput.value &&!emailRegex.test(emailInput.value)? 'Please enter a valid email address.' : '';
        if (emailErrorMsg) {
            emailInput.classList.add('error');
            const emailError = document.getElementById('email-error');
            if (emailError) emailError.style.display = 'block';
            hasErrors = true;
            errorFields.push(emailErrorMsg);
        }

        // Validate phone
        const phoneInput = document.getElementById('request-phone');
        const phoneRegex = /^\d{8}$/;
        const phoneErrorMsg = phoneInput.value &&!phoneRegex.test(phoneInput.value)? 'Please enter a valid 8-digit phone number.' : '';
        if (phoneErrorMsg) {
            phoneInput.classList.add('error');
            const phoneError = document.getElementById('phone-error');
            if (phoneError) phoneError.style.display = 'block';
            hasErrors = true;
            errorFields.push(phoneErrorMsg);
        }

        // Validate checkbox
        const termsCheckbox = document.querySelector('#quoteForm input[type="checkbox"]');
        const checkboxErrorMsg =!termsCheckbox.checked? 'Please check the box to agree to the terms and conditions.' : '';
        if (checkboxErrorMsg) {
            hasErrors = true;
            const checkboxError = document.querySelector('.checkbox-error');
            if (checkboxError) checkboxError.style.display = 'block';
            errorFields.push(checkboxErrorMsg);
        }

        const submitButton = document.querySelector('#quoteForm button[type="submit"]');
        if (submitButton) {
            if (hasErrors) {
                submitButton.disabled = true;
                submitButton.setAttribute('data-tooltip', errorFields.join(', '));
            } else {
                submitButton.disabled = false;
                submitButton.removeAttribute('data-tooltip');
            }
        }

        return!hasErrors;
    } catch (err) {
        console.error('Quote error:', err);
        return false;
    }
}