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
        if (password.length >= 8) { // Minimum length
            strength += 25;
            min.style.color = 'green';
        } else {
            min.style.color = 'red';
        }

        if (/[A-Z]/.test(password)) {
            strength += 25; // Uppercase letter
            oneUpper.style.color = 'green';
        } else {
            oneUpper.style.color = 'red';
        }

        if (/\d/.test(password)) {
            strength += 25; // Number
            oneNum.style.color = 'green';
        } else {
            oneNum.style.color = 'red';
        }

        if (/[_$&@!%*?]/.test(password)) {
            strength += 25; // Special character
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
        bar.style.background = '#9cab81'; // Medium
        strengthMessage.textContent = 'Good';
        strengthMessage.style.color = '#9cab81';
    } else {
        bar.style.background = 'green'; // Strong
        strengthMessage.textContent = 'Strong';
        strengthMessage.style.color = 'green';
    }
}

  $(document).ready(function () {
    function validateForm(formId) {
      const form = $(formId);
      let valid = true;

      form.find("input[required], select[required]").each(function () {
        if ($(this).val().trim() === "") {
          valid = false;
        }
      });

      if (formId === "#registerForm" && !$("#terms").is(":checked")) {
        valid = false;
      }
  

      if (formId === "#registerForm") {
        const password = $("#password").val();
        const confirmPassword = $("#confirmPassword").val();
        if (password !== confirmPassword) {
          valid = false;
        }
      }

      return valid;
    }

    function deselectButtons() {
      $(".role-button").removeClass("selected").css("filter", "blur(1px)");
      $("#loginFields").hide();
    }

    $("#registerUserType").change(function () {
      const isStaff =
        $(this).val() === "vehicleSales" ||
        $(this).val() === "insuranceSales";
      $("#staffNumberSection").toggle(isStaff);
      $("#staffNumber").prop("required", isStaff);
    });

    $(".role-button").hover(
      function () {
        if (!$(this).hasClass("selected")) {
          $(this).css("filter", "blur(0)");
        }
      },
      function () {
        if (!$(this).hasClass("selected")) {
          $(this).css("filter", "blur(1px)");
        }
      }
    );

    $(".role-button").click(function () {
      deselectButtons();
      $(this).addClass("selected").css("filter", "blur(0)");
      const selectedRole = $(this).data("role");
      $("#loginUserType").val(selectedRole);
      $("#loginEmail").attr(
        "placeholder",
        selectedRole === "customer" ? "Your Username" : "Your Email Address"
      );
      $("#loginFields").fadeIn(200);

      if (selectedRole === "customer") {
        $('label[for="loginEmail"]').text("Username:");
        $("#loginEmail").attr("placeholder", "Your Username");
      } else if (selectedRole === "vehicleSales") {
        $('label[for="loginEmail"]').text("Email Address:");
        $("#loginEmail").attr("placeholder", "Your Email Address");
      } else if (selectedRole === "insuranceSales") {
        $('label[for="loginEmail"]').text("Email Address:");
        $("#loginEmail").attr("placeholder", "Your Email Address");
      }
    });

    $("#registerForm input, #registerForm select").on(
      "input change",
      function () {
        const isValid = validateForm("#registerForm");
        $("#registerButton")
          .prop("disabled", !isValid)
          .toggleClass("valid", isValid);
      }
    );

    $("#loginForm input").on("input", function () {
      const isValid = validateForm("#loginForm");
      $("#loginButton")
        .prop("disabled", !isValid)
        .toggleClass("valid", isValid);
    });

    $("#password").on("input", function () {
      updateStrengthBar($(this).val());
    });

    $("#registerForm input, #registerForm select").on("input change", function () {
      const isValid = validateForm("#registerForm");
      $("#registerButton").prop("disabled", !isValid).toggleClass("valid", isValid);
    });

    $("#registerForm").on("submit", function (event) {
      event.preventDefault();
      if (!validateForm("#registerForm")) {
        alert("Please fill in all required fields correctly.and agree to the terms and conditions.");
        return;
      }
      alert("Account created successfully!");
      $("#registerContainer").hide();
      $("#loginContainer").show();
    });

    $("#loginForm").on("submit", function (event) {
      if (!validateForm("#loginForm")) {
        alert("Please fill in all required fields.");
        event.preventDefault();
      }
    });

    $("#returnToLogin, #returnToLoginFromLogin").click(function () {
      $("#registerContainer").toggle();
      $("#loginContainer").toggle();
      deselectButtons();
    });

    $("#toggleToLogin").click(function () {
      $("#registerContainer").hide();
      $("#loginContainer").show();
      deselectButtons();
    });

    $("#toggleToRegister").click(function () {
      $("#loginContainer").hide();
      $("#registerContainer").show();
    });
  });