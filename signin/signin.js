let userData = null;

window.addEventListener('unload', function() {
  localStorage.removeItem('userData');
});

function toggleTheme() {
  const body = document.body;
  if (body.getAttribute('data-theme') === 'dark') {
    body.removeAttribute('data-theme');
  } else {
    body.setAttribute('data-theme', 'dark');
  }
}

function initializeUserData() {
  fetch('../data/users.json')
      .then(response => response.json())
      .then(data => {
          userData = data;
          localStorage.setItem('userData', JSON.stringify(userData));
      })
      .catch(err => console.error('Error loading user data:', err));
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
    const loginType = document.getElementById('login-type').value;
    const usernameEmail = document.getElementById('username-email').value;
    const password = document.getElementById('password').value;

    // Get stored user data
    const userData = JSON.parse(localStorage.getItem('userData'));
    
    if (!userData) {
      alert('No user data found. Please register first.');
      return;
    }

    let isValidLogin = false;

    if (loginType === 'insurance-sales') {
      // Check insurance sales array
      isValidLogin = userData['insurance-sales'].some(user => 
        user.username === usernameEmail && user.password === password
      );
    } else {
      // Check customer or vehicle-sales object
      const user = userData[loginType];
      isValidLogin = user && user.email === usernameEmail && user.password === password;
    }

    if (isValidLogin) {
      window.location.href = '../option.html';
    } else {
      alert('Invalid credentials. Please try again.');
    }

  } catch (err) {
    console.error('Login error:', err);
    alert('An error occurred during login. Please try again.');
  }
}

document.addEventListener('DOMContentLoaded', initializeUserData);

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
    errorMessages.forEach(msg => msg.style.display = 'none');

    const inputFields = document.querySelectorAll('.input-field');
    inputFields.forEach(input => input.classList.remove('error'));

    let hasErrors = false;
    let errorFields = [];

    // Validate name
    const nameInput = document.getElementById('reg-name');
    if (!nameInput.value || !nameInput.value.trim()) {
      nameInput.classList.add('error');
      document.getElementById('name-error').style.display = 'block';
      hasErrors = true;
      errorFields.push('Full Name');
    }

    // Validate email
    const emailInput = document.getElementById('reg-email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value || !emailRegex.test(emailInput.value)) {
      emailInput.classList.add('error');
      document.getElementById('email-error').style.display = 'block';
      hasErrors = true;
      errorFields.push('Email Address');
    }

    // Validate phone
    const phoneInput = document.getElementById('reg-phone');
    const phoneRegex = /^\d{8}$/;
    if (!phoneInput.value || !phoneRegex.test(phoneInput.value)) {
      phoneInput.classList.add('error');
      document.getElementById('phone-error').style.display = 'block';
      hasErrors = true;
      errorFields.push('Phone Number');
    }

    // Validate password
    const passwordInput = document.getElementById('reg-password');
    const confirmInput = document.getElementById('reg-confirm-password');
    if (passwordInput.value !== confirmInput.value) {
      confirmInput.classList.add('error');
      document.getElementById('password-match-error').style.display = 'block';
      hasErrors = true;
      errorFields.push('Password Match');
    }

    if (!hasErrors) {
      // Get existing users or initialize new object
      let userData = JSON.parse(localStorage.getItem('userData')) || {
        "customer": {},
        "vehicle-sales": {},
        "insurance-sales": []
      };

      // Create new user object
      const newUser = {
        fullName: nameInput.value,
        email: emailInput.value,
        phone: phoneInput.value,
        password: passwordInput.value
      };

      // Add role-specific fields for insurance sales
      if (currentRole === 'insurance-sales') {
        newUser.staffNumber = document.getElementById('staff-number').value;
        newUser.username = document.getElementById('username').value;
        userData['insurance-sales'].push(newUser);
      } else {
        // For customer and vehicle-sales, just update the object
        userData[currentRole] = newUser;
      }

      // Save to localStorage
      localStorage.setItem('userData', JSON.stringify(userData));

      // Show success message
      const messageElement = document.getElementById('registration-message');
      messageElement.style.display = 'block';
      messageElement.textContent = 'Registration successful! You can now login.';

      // Clear form
      event.target.reset();
      
      // Reset password strength indicators
      document.querySelectorAll('.password-requirements li').forEach(li => {
        li.classList.remove('valid');
      });
      const strengthBar = document.querySelector('.strength-bar-fill');
      if (strengthBar) {
        strengthBar.style.width = '0%';
      }
    }

  } catch (err) {
    console.error('Registration error:', err);
    alert('An error occurred during registration. Please try again.');
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