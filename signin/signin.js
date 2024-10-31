function toggleTheme() {
  const body = document.body;
  if (body.getAttribute('data-theme') === 'dark') {
    body.removeAttribute('data-theme');
  } else {
    body.setAttribute('data-theme', 'dark');
  }
}

function switchTab(tab) {
  const tabs = document.querySelectorAll('.tab');
  tabs.forEach(t => t.classList.remove('active'));

  document.querySelector(`.tab[data-tab="${tab}"]`).classList.add('active');

  document.getElementById('login-form').style.display = tab === 'login' ? 'block' : 'none';
  document.getElementById('register-form').style.display = tab === 'register' ? 'block' : 'none';
  document.getElementById('registration-details').style.display = 'none';
}

function updateLoginForm() {
  const loginType = document.getElementById('login-type').value;
  const usernameEmailLabel = document.getElementById('username-email-label');

  if (loginType === 'insurance-sales') {
    usernameEmailLabel.textContent = 'Username';
  } else {
    usernameEmailLabel.textContent = 'Email Address*';
  }
}

function showRegistrationForm(role) {
  currentRole = role;
  document.getElementById('register-form').style.display = 'none';
  document.getElementById('registration-details').style.display = 'block';
  document.getElementById('registration-title').textContent = `${role.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} Registration`;

  const staffNumberContainer = document.getElementById('staff-number-container');
  const usernameContainer = document.getElementById('username-container');

  if (role === 'vehicle-sales' || role === 'insurance-sales') {
    staffNumberContainer.style.display = 'block';
  } else {
    staffNumberContainer.style.display = 'none';
  }

  if (role === 'insurance-sales') {
    usernameContainer.style.display = 'block';
  } else {
    usernameContainer.style.display = 'none';
  }
}

function showForgotPassword() {
  const modal = document.getElementById('forgot-password-modal');
  modal.style.display = 'flex';
  document.getElementById('reset-email').focus();
}

function hideForgotPassword() {
  document.getElementById('forgot-password-modal').style.display = 'none';
}

// Add ESC key handler
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    hideForgotPassword();
  }
});

// Close modal when clicking outside
document.getElementById('forgot-password-modal').addEventListener('click', function (e) {
  if (e.target === this) {
    hideForgotPassword();
  }
});

function handleForgotPassword(event) {
  event.preventDefault();
  try {
    const email = document.getElementById('reset-email').value;
    alert('Password reset instructions have been sent to ' + email);
    hideForgotPassword();
  } catch (err) {
    console.error('Password reset error:', err);
  }
}

function handleLogin(event) {
  event.preventDefault();
  try {
    const loginType = document.getElementById('login-type')?.value || '';
    const usernameEmail = document.getElementById('username-email')?.value || '';
    const password = document.getElementById('password')?.value || '';

    console.log('Login attempted:', { loginType, usernameEmail, password });
  } catch (err) {
    console.error('Login error:', err);
  }
}

function handleRegistration(event) {
  if (!event) return;
  event.preventDefault();

  try {
    // Initialize currentRole if not set
    if (typeof currentRole === 'undefined') {
      currentRole = '';
    }

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
    const nameInput = document.getElementById('reg-name');
    if (nameInput && (!nameInput.value || !nameInput.value.trim())) {
      nameInput.classList.add('error');
      const nameError = document.getElementById('name-error');
      if (nameError) nameError.style.display = 'block';
      hasErrors = true;
      errorFields.push('Full Name');
    }

    // Validate email
    const emailInput = document.getElementById('reg-email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailInput && (!emailInput.value || !emailRegex.test(emailInput.value))) {
      emailInput.classList.add('error');
      const emailError = document.getElementById('email-error');
      if (emailError) emailError.style.display = 'block';
      hasErrors = true;
      errorFields.push('Email Address');
    }

    // Validate phone
    const phoneInput = document.getElementById('reg-phone');
    const phoneRegex = /^\d{8}$/;
    if (phoneInput && (!phoneInput.value || !phoneRegex.test(phoneInput.value))) {
      phoneInput.classList.add('error');
      const phoneError = document.getElementById('phone-error');
      if (phoneError) phoneError.style.display = 'block';
      hasErrors = true;
      errorFields.push('Phone Number');
    }

    // Validate password
    const passwordInput = document.getElementById('reg-password');
    const confirmInput = document.getElementById('reg-confirm-password');

    if (passwordInput && confirmInput && passwordInput.value !== confirmInput.value) {
      confirmInput.classList.add('error');
      const matchError = document.getElementById('password-match-error');
      if (matchError) matchError.style.display = 'block';
      hasErrors = true;
      errorFields.push('Password Match');
    }

    const termsCheckbox = document.querySelector('#registration-details input[type="checkbox"]');
    const submitButton = document.querySelector('#registration-details button[type="submit"]');
    if (submitButton) {
      if (hasErrors || !termsCheckbox.checked) {
        submitButton.disabled = true;
        submitButton.setAttribute('data-tooltip', 'Please complete: ' + errorFields.join(', ') + (termsCheckbox.checked ? '' : ', agree to terms'));
      } else {
        submitButton.disabled = false;
        submitButton.removeAttribute('data-tooltip');
      }
    }

    // Show success message if no errors
    if (!hasErrors) {
      const messageElement = document.getElementById('registration-message');
      if (messageElement) {
        messageElement.style.display = 'block';
        messageElement.textContent = currentRole === 'insurance-sales'
          ? 'Your registration will be validated by an admin. You will be notified once approved.'
          : 'Registration successful! You can now login.';
      }
    }

  } catch (err) {
    console.error('Registration error:', err);
  }
}

// Add toggle password functionality
document.addEventListener('DOMContentLoaded', function () {
  const togglePassword = document.querySelectorAll('.password-toggle');

  togglePassword.forEach(toggle => {
    toggle.addEventListener('click', function () {
      const passwordInput = this.previousElementSibling;
      if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        this.classList.remove('fa-eye');
        this.classList.add('fa-eye-slash');
      } else {
        passwordInput.type = 'password';
        this.classList.remove('fa-eye-slash');
        this.classList.add('fa-eye');
      }
    });
  });
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', function () {
  try {
    currentRole = '';

    // Get password input and requirements list
    const passwordInput = document.getElementById('reg-password');
    const confirmInput = document.getElementById('reg-confirm-password');
    const strengthBar = document.querySelector('.strength-bar-fill');
    const strengthMessage = document.getElementById('strength-message');

    const minReq = document.getElementById('min');
    const upperReq = document.getElementById('oneUpper');
    const numReq = document.getElementById('oneNum');
    const specialReq = document.getElementById('oneSpecial');

    // Add input event listener to password field
    passwordInput.addEventListener('input', function () {
      const password = this.value;

      // Check requirements
      const hasMinLength = password.length >= 8;
      const hasUpper = /[A-Z]/.test(password);
      const hasNumber = /[0-9]/.test(password);
      const hasSpecial = /[!@#$%^&*]/.test(password);

      // Update requirement indicators
      minReq.classList.toggle('valid', hasMinLength);
      upperReq.classList.toggle('valid', hasUpper);
      numReq.classList.toggle('valid', hasNumber);
      specialReq.classList.toggle('valid', hasSpecial);

      // Calculate strength
      let strength = 0;
      if (hasMinLength) strength += 25;
      if (hasUpper) strength += 25;
      if (hasNumber) strength += 25;
      if (hasSpecial) strength += 25;

      // Update strength bar
      strengthBar.style.width = strength + '%';

      // Set color based on strength
      if (strength <= 25) {
        strengthBar.style.backgroundColor = '#ff4444';
        strengthMessage.textContent = 'Weak';
      } else if (strength <= 50) {
        strengthBar.style.backgroundColor = '#ffbb33';
        strengthMessage.textContent = 'Fair';
      } else if (strength <= 75) {
        strengthBar.style.backgroundColor = '#00C851';
        strengthMessage.textContent = 'Good';
      } else {
        strengthBar.style.backgroundColor = '#007E33';
        strengthMessage.textContent = 'Strong';
      }

      validateForm();
    });

    // Add validation for confirm password
    confirmInput.addEventListener('input', validateForm);

    // Form validation function
    function validateForm() {
      const password = passwordInput.value;
      const confirmPassword = confirmInput.value;
      const form = document.querySelector('#registration-details form');
      const submitButton = form.querySelector('button[type="submit"]');
      const termsCheckbox = form.querySelector('input[type="checkbox"]');

      const requiredFields = form.querySelectorAll('input[required]');
      let allFieldsFilled = true;

      requiredFields.forEach(field => {
        if (!field.value) {
          allFieldsFilled = false;
        }
      });

      // Check password requirements
      const meetsRequirements =
        password.length >= 8 &&
        /[A-Z]/.test(password) &&
        /[0-9]/.test(password) &&
        /[!@#$%^&*]/.test(password);

      // Enable button only if all conditions are met
      submitButton.disabled = !(allFieldsFilled && meetsRequirements &&
        password === confirmPassword &&
        termsCheckbox.checked);
    }

    // Add event listener for checkbox
    const termsCheckbox = document.querySelector('#registration-details input[type="checkbox"]');
    if (termsCheckbox) {
      termsCheckbox.addEventListener('change', validateForm);
    }

    // Add validation to all required fields
    const form = document.querySelector('#registration-details form');
    if (form) {
      form.querySelectorAll('input[required]').forEach(input => {
        input.addEventListener('input', validateForm);
      });
    }

  } catch (err) {
    console.error('Initialization error:', err);
  }
});