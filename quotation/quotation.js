$(document).ready(function () {
    const submittedApplications = new Map();

    function initializeApp() {
        $('#insuranceForm, #applicationHistory, #reviewSection, #confirmationSection, #websiteGuide').hide();
        $('#insuranceGuide').show();
        $('.nav-button').removeClass('active');
    }

    function initializeForm() {
        $('#insuranceForm')[0].reset();
        $('.error').remove();
        $('.input-error').removeClass('input-error');
        $('#progressBar div').width('0%').text('');
        $('#vehicleSection').show();
        $('#personalSection').hide();
        $('#reviewSection').hide();
        $('#confirmationSection').hide();
        $('#insuranceForm').fadeIn(300);
        $('.nav-button').removeClass('active');
        $('.nav-button[data-section="insuranceForm"]').addClass('active');
    }
    const hints = {
        'vehicleYear': 'Enter 4 digits for year (2000-2024)',
        'seatingCapacity': 'Enter seating capacity (2-9)',
        'cylinderCapacity': 'Enter CC value (500-8000)',
        'vehicleValue': 'Enter vehicle value should be higher than HKD$ 50000',
        'drivingExperience': 'Enter years of driving experience (1-70)',
        'paymentMethod' : 'Enter your payment method'
    };

    Object.entries(hints).forEach(([id, hint]) => {
        const input = $(`#${id}`);
        const hintDiv = $('<div>').addClass('input-hint').text(hint);
        input.closest('.form-group').append(hintDiv);
    });

    function showSection(sectionId) {
        $('#insuranceForm, #applicationHistory, #reviewSection, #confirmationSection, #insuranceGuide, #websiteGuide').hide();
        $(`#${sectionId}`).show();
        $('.nav-button').removeClass('active');
        $(`.nav-button[data-section="${sectionId}"]`).addClass('active');
        $('#coverage-option').show()

        if (sectionId === 'applicationHistory') {
            $('#progressBar').hide();
            $('#coverage-option').hide()
        } else if (sectionId === 'insuranceForm') {
            $('#progressBar').show();
            $('#coverage-option').hide()
        }
    }

    const carModels = {
        'Audi': ['A6 2.4', 'A8 L', 'Q8 e-tron'],
        'BMW': ['X3', 'X5', 'Z4'],
        'Ford': ['Mustang', 'Explorer', 'F-150'],
        'Porsche': ['Cayenne S Coupé', '911 Carrera S', '911 GT3'],
        'Toyota': ['Corolla', 'Camry', 'RAV4', 'Prius', 'Yaris']
    };

    $('#vehicleMake').on('change', function () {
        const selectedMake = $(this).val();
        const $modelSelect = $('#vehicleModel');
        $modelSelect.empty().append('<option value="">Select Model</option>');

        if (carModels[selectedMake]) {
            carModels[selectedMake].forEach(model => {
                $modelSelect.append(`<option value="${model}">${model}</option>`);
            });
        }
    });

    function updateProgressBar() {
        const totalRequired = $('#insuranceForm').find('input[required], select[required]').length;
        const filledRequired = $('#insuranceForm').find('input[required], select[required]').filter(function () {
            if ($(this).attr('type') === 'radio') {
                return $(`input[name="${$(this).attr('name')}"]:checked`).length > 0;
            }
            return $(this).val() !== '';
        }).length;
        const progress = (filledRequired / totalRequired) * 100;
        const roundedProgress = Math.round(progress);

        $('#progressBar div')
            .width(progress + '%')
            .text(roundedProgress + '%')
            .removeClass('warning success')
            .addClass(progress === 100 ? 'success' : 'warning');
    }

    $('#insuranceForm').on('input', updateProgressBar);

    $('#insuranceForm').submit(function (e) {
        e.preventDefault();
        const $submitButton = $(this).find('button[type="submit"]');
        $submitButton.prop('disabled', true); 
        if (validateForm()) {
            const applicationData = collectFormData();
            displayReview(applicationData);
            $('#insuranceForm').hide();
            $('#reviewSection').show();
        }
        else {
            $submitButton.prop('disabled', false); // Re-enable the button if validation fails
        }
    });

    $('#nextButton').click(function () {
        if (validateVehicleSection()) {
            $('#vehicleSection').slideUp(300);
            $('#personalSection').delay(300).slideDown(300);
            updateProgressBar();
        }
        else{
            alert('Please input all the required information.');
        }
    });

    $('#backButton').click(function () {
        $('#personalSection').slideUp(300);
        $('#vehicleSection').delay(300).slideDown(300);
    });

    $('#confirmButton').click(function () {
        const applicationData = collectFormData();
        submittedApplications.set(applicationData.id, applicationData);
        showConfirmation(applicationData);
    });

    $('#editButton').click(function () {
        $('#reviewSection').hide();
        $('#insuranceForm').show();
        $('#vehicleSection').show();
        $('#personalSection').hide();
        updateProgressBar();
    });

    $('#proceedToForm').click(function () {
        initializeForm();
        showSection('insuranceForm');
    });

    $(document).on('click', '#applyNow', function () {
        initializeForm();
        showSection('insuranceForm');
    });

    function validateVehicleSection() {
        let isValid = true;
        $('.error').remove();
        $('#vehicleSection input, #vehicleSection select').each(function () {
            if (!$(this).val()) {
                showError($(this), 'This field is required');
                isValid = false;
            }
        });
        const vehicleYear = $('#vehicleYear');
        const currentYear = 2024;
        if (vehicleYear.val() < 1999 || vehicleYear.val() > currentYear) {
            showError(vehicleYear, `Please enter a valid year between 1900 and ${currentYear}`);
            isValid = false;
        }
        return isValid;
    }

    $('#phoneNumber').on('blur', function () {
        if ($(this).val() && !/^\d{8}$/.test($(this).val())) {
            showError($(this), 'Please enter a valid phone number (8 digits)');
        }
    }).on('focus', function () {
        $(this).removeClass('input-error');
        $(this).closest('.form-group').find('.error').remove();
    });

    function showError($input, message) {
        $input.closest('.form-group').find('.error').remove();
        const $error = $('<div>')
            .addClass('error')
            .text(message)
            .hide();
        $input.closest('.form-group').append($error);
        $error.fadeIn(300);
        $input.addClass('input-error');
        $input.one('input', function () {
            $(this).removeClass('input-error');
            $error.fadeOut(300, function () {
                $(this).remove();
            });
        });
    }

    function validateForm() {
        $('.error').remove();
        let isValid = true;
        let errorMessages = [];

        const vehicleValidation = {
            'vehicleMake': 'Please select a vehicle brand',
            'vehicleModel': 'Please select a vehicle model',
            'vehicleYear': {
                required: 'Please enter the manufacturing year',
                range: `Year must be between 1900 and ${new Date().getFullYear()}`
            },
            'bodyType': 'Please select a body type',
            'seatingCapacity': {
                required: 'Please enter seating capacity',
                range: 'Seating capacity must be between 2 and 9'
            },
            'cylinderCapacity': {
                required: 'Please enter cylinder capacity',
                range: 'Cylinder capacity must be between 500 and 8000 CC'
            },
            'vehicleValue': {
                required: 'Please enter vehicle value',
                min: 'Vehicle value must be greater than 0'
            }
        };

        const personalValidation = {
            'fullName': {
                required: 'Please enter your full name',
                pattern: 'Please enter a valid name (letters only)'
            },
            'email': {
                required: 'Please enter your email address',
                pattern: 'Please enter a valid email address'
            },
            'phoneNumber': {
                required: 'Please enter your phone number',
                pattern: 'Please enter a valid phone number (8 digits)',
                hint: 'Enter your 8-digit phone number (e.g., 12345678)'
            },
            'drivingExperience': {
                required: 'Please enter your driving experience',
                range: 'Driving experience must be between 0 and 70 years'
            },
            'coveragePlan': 'Please select a coverage plan',

            'paymentMethod': 'Please select a valid payment method'
        };

        Object.entries(vehicleValidation).forEach(([field, rules]) => {
            const $field = $(`[name="${field}"]`);
            if (!$field.val()) {
                showError($field, typeof rules === 'object' ? rules.required : rules);
                errorMessages.push(typeof rules === 'object' ? rules.required : rules); 
                isValid = false;
                alert('Please enter validate information!')
            } else if (rules.range) {
                switch (field) {
                    case 'vehicleYear':
                        if ($field.val() < 1900 || $field.val() > 2024) {
                            showError($field, rules.range);
                            isValid = false;
                        }
                        break;
                    case 'seatingCapacity':
                        if ($field.val() < 2 || $field.val() > 9) {
                            showError($field, rules.range);
                            isValid = false;
                        }
                        break;
                }
            }
        });

        Object.entries(personalValidation).forEach(([field, rules]) => {
            const $field = $(`#${field}`);
            if (!$field.val()) {
                showError($field, typeof rules === 'object' ? rules.required : rules);
                errorMessages.push(typeof rules === 'object' ? rules.required : rules); 
                isValid = false;
            } else if (rules.pattern) {
                switch (field) {
                    case 'email':
                        if (!/^\S+@\S+\.\S+$/.test($field.val())) {
                            showError($field, rules.pattern);
                            isValid = false;
                        }
                        break;
                    case 'phoneNumber':
                        if (!/^\d{8}$/.test($field.val())) {
                            showError($field, rules.pattern);
                            isValid = false;
                        }
                        break;
                }
            }
        });

        return isValid;
    }

    

    function collectFormData() {
        const formData = new FormData(document.getElementById('insuranceForm'));
        return {
            id: 'INS' + Math.random().toString(36).substr(2, 9).toUpperCase(),
            date: new Date().toLocaleDateString(),
            status: 'Pending Review',
            coverage: $('#coveragePlan').val(),
            vehicleMake: formData.get('vehicleMake'),
            vehicleModel: formData.get('vehicleModel'),
            bodyType: formData.get('bodyType'),
            fullName: formData.get('fullName'),
            email: formData.get('email'),
            paymentMethod: formData.get('paymentMethod')
        };
    }

    function displayReview(data) {
        $('#insuranceForm').hide();
        $('#reviewSection').show();
        $('#reviewContent').html(`
          <div class="review-details">
              <table class="confirmation-table">
                  <tr>
                      <th>Reference Number</th>
                      <td>${data.id}</td>
                  </tr>
                  <tr>
                      <th>Status</th>
                      <td>${data.status}</td>
                  </tr>
                  <tr>
                      <th>Coverage Plan</th>
                      <td>${data.coverage}</td>
                  </tr>
                  <tr>
                      <th>Vehicle</th>
                      <td>${data.vehicleMake} ${data.vehicleModel}</td>
                  </tr>
                  <tr>
                      <th>Body Type</th>
                      <td>${data.bodyType}</td>
                  </tr>
                  <tr>
                      <th>Full Name</th>
                      <td>${data.fullName}</td>
                  </tr>
                  <tr>
                      <th>Email</th>
                      <td>${data.email}</td>
                  </tr>
                  <tr>
                      <th>Payment Method</th>
                      <td>${data.paymentMethod}</td>
                  </tr>
              </table>
          </div>
      `);
    }

    function showConfirmation(data) {
        $('#reviewSection').hide();
        const confirmationHTML = `
          <h2>Application Submitted Successfully</h2>
          <p>Your application has been submitted successfully!</p>
          <div class="confirmation-details">
              <table class="confirmation-table">
                  <tr>
                      <th>Reference Number:</th>
                      <td>${data.id}</td>
                  </tr>
                  <tr>
                      <th>Status:</th>
                      <td>${data.status}</td>
                  </tr>
              </table>
          </div>
          <p>You can track your application status using this reference number in the application history.</p>
          <button id="viewApplicationHistory" class="nav-button">Go to Application History</button>
      `;
        $('#confirmationSection').html(confirmationHTML).fadeIn(300);
    }

    $(document).on('click', '#viewApplicationHistory', function () {
        showApplicationHistory();
    });

    function showApplicationHistory() {
        $('#confirmationSection').hide();
        $('#progressBar').hide();
        updateApplicationHistory();
        showSection('applicationHistory');
    }

    function updateApplicationHistory() {
        const searchResults = $('#searchResults');
        searchResults.empty();

        if (submittedApplications.size === 0) {
            searchResults.html(`
              <p>No insurance applications found.</p>
              <div class="action-buttons">
                  <button id="applyNow" class="btn">Apply Now</button>
              </div>
          `);
            return;
        }

        let historyHTML = '<div class="applications-list">';

        submittedApplications.forEach((app, id) => {
            historyHTML += `
              <div class="application-card">
                  <h3>Application ${app.id}</h3>
                  <table class="confirmation-table">
                      <tr>
                          <th>Status:</th>
                          <td>${app.status}</td>
                      </tr>
                      <tr>
                          <th>Date:</th>
                          <td>${app.date}</td>
                      </tr>
                      <tr>
                          <th>Vehicle:</th>
                          <td>${app.vehicleMake} ${app.vehicleModel}</td>
                      </tr>
                      <tr>
                          <th>Coverage:</th>
                          <td>${app.coverage}</td>
                      </tr>
                  </table>
                  <div class="action-buttons">
                      <button class="view-details-btn" data-id="${id}">View Details</button>
                      <button class="delete-app" data-id="${id}">Delete Application</button>
                  </div>
              </div>
          `;
        });

        historyHTML += `
          <div class="action-buttons">
              <button id="applyNow" class="btn">Apply Now</button>
          </div>
      `;

        searchResults.html(historyHTML);
    }

    $('#searchBtn').click(function () {
        const searchTerm = $('#searchReference').val().trim().toUpperCase();
        const searchResults = $('#searchResults');
        searchResults.empty();

        if (!searchTerm) {
            updateApplicationHistory();
            return;
        }

        const matchingApplications = Array.from(submittedApplications.entries())
            .filter(([id, app]) =>
                id.includes(searchTerm) ||
                app.email.toLowerCase().includes(searchTerm.toLowerCase())
            );

        if (matchingApplications.length === 0) {
            searchResults.html('<p>No matching applications found.</p>');
            return;
        }

        matchingApplications.forEach(([id, app]) => {
            const applicationCard = `
              <div class="application-card">
                  <h3>Application ${app.id}</h3>
                  <p>Status: ${app.status}</p>
                  <p>Vehicle: ${app.vehicleMake} ${app.vehicleModel}</p>
                  <button class="view-details-btn" data-id="${id}">View Details</button>
                  <button class="delete-app" data-id="${id}">Delete Application</button>
              </div>
          `;
            searchResults.append(applicationCard);
        });
    });

    $('#themeToggle').click(function () {
        const currentTheme = $('body').attr('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        $('body').attr('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    $('.nav-button').click(function () {
        const section = $(this).data('section');
        $('#websiteGuide, #insuranceForm, #applicationHistory, #reviewSection, #confirmationSection, #insuranceGuide').hide();
        $('#progressBar').hide();

        if (section === 'insuranceForm') {
            initializeForm();
            showSection('insuranceForm');
            $('#progressBar').show();
        } else if (section === 'applicationHistory') {
            showApplicationHistory();
        } else if (section === 'insuranceGuide') {
            $('#insuranceGuide').show();
            $('#coverage-option').show()
        } else {
            $('#websiteGuide').show();
        }

        $('.nav-button').removeClass('active');
        $(this).addClass('active');
    });

    $(document).on('click', '.view-details-btn', function () {
        const appId = $(this).data('id');
        const application = submittedApplications.get(appId);

        if (application) {
            $('#searchResults').html(`
              <div class="application-card">
                  <h3>Application Details</h3>
                  <table class="confirmation-table">
                      <tr><th>Reference Number</th><td>${application.id}</td></tr>
                      <tr><th>Status</th><td>${application.status}</td></tr>
                      <tr><th>Date</th><td>${application.date}</td></tr>
                      <tr><th>Coverage Plan</th><td>${application.coverage}</td></tr>
                      <tr><th>Vehicle</th><td>${application.vehicleMake} ${application.vehicleModel}</td></tr>
                      <tr><th>Body Type</th><td>${application.bodyType}</td></tr>
                      <tr><th>Full Name</th><td>${application.fullName}</td></tr>
                      <tr><th>Email</th><td>${application.email}</td></tr>
                  </table>
                  
              </div>
          `);
        }
    });

    $(document).on('click', '.delete-app', function () {
        const appId = $(this).data('id');
        if (confirm('Are you sure you want to delete this application?')) {
            submittedApplications.delete(appId);
            updateApplicationHistory();
        }
    });

    initializeApp();
});