<script>
function togglePasswordVisibility(inputId, iconId) {
  const passwordInput = document.getElementById(inputId);
  const icon = document.getElementById(iconId);
  passwordInput.type =
    passwordInput.type === "password" ? "text" : "password";
  icon.classList.toggle("fa-eye");
  icon.classList.toggle("fa-eye-slash");
}

function updateStrengthBar(password) {
  const strengthMessage = document.getElementById('strengthMessage');
  const min = document.getElementById('min');
  const oneUpper = document.getElementById('oneUpper');
  const oneNum = document.getElementById('oneNum');
  const oneSpecial = document.getElementById('oneSpecial');
  const bar = document.querySelector('.strength-bar-fill');
  let strength = 0;

  // Clear requirement colors initially
  min.style.color = 'black';
  oneUpper.style.color = 'black';
  oneNum.style.color = 'black';
  oneSpecial.style.color = 'black';

  // Check if the password has any length
  if (password.length > 0) {
    if (password.length >= 8) {
      strength += 25;
      min.style.color = 'green';
    } else {
      min.style.color = 'red';
    }

    if (/[A-Z]/.test(password)) {
      strength += 25;
      oneUpper.style.color = 'green';
    } else {
      oneUpper.style.color = 'red';
    }

    if (/\d/.test(password)) {
      strength += 25;
      oneNum.style.color = 'green';
    } else {
      oneNum.style.color = 'red';
    }

    if (/_$&@!%*?/.test(password)) {
      strength += 25;
      oneSpecial.style.color = 'green';
    } else {
      oneSpecial.style.color = 'red';
    }
  }

  // Set bar width
  bar.style.width = strength + '%';

  // Update bar color based on strength
  if (strength === 0) {
    bar.style.background = '#e0e0e0'; // Default color
    strengthMessage.textContent = '';
  } else if (strength <= 25) {
    bar.style.background = 'red'; // Weak
    strengthMessage.textContent = 'Weak';
    strengthMessage.style.color = 'red';
  } else if (strength <= 50) {
    bar.style.background = 'orange'; // Medium
    strengthMessage.textContent = 'Medium';
    strengthMessage.style.color = 'orange';
  } else if (strength <= 75) {
    bar.style.background = '#9cab81'; // Good
    strengthMessage.textContent = 'Good';
    strengthMessage.style.color = '#9cab81';
  } else {
    bar.style.background = 'green'; // Strong
    strengthMessage.textContent = 'Strong';
    strengthMessage.style.color = 'green';
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector('form');
  const submitBtn = document.querySelector('.submit-btn');
  const inputs = form.querySelectorAll('input, select');

  function validateForm() {
    let isValid = true;

    inputs.forEach(input => {
      if (input.value === "") {
        isValid = false;
      }
    });

    if (isValid) {
      submitBtn.classList.add('valid');
      submitBtn.disabled = false;
      submitBtn.style.cursor = 'pointer';
    } else {
      submitBtn.classList.remove('valid');
      submitBtn.disabled = true;
      submitBtn.style.cursor = 'not-allowed';
    }
  }

  inputs.forEach(input => {
    input.addEventListener('input', validateForm);
  });

  // Initial validation on page load
  validateForm();
});
</script>