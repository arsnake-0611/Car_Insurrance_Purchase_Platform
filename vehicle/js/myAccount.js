$(document).ready(function () {
    // Mobile menu handling
    $('.menu-icon-close').hide();
    $('.menu-icon-open').click(function () {
        $('.mobile-menu').show();
        $('.menu-icon-open').hide();
        $('.menu-icon-close').show();
    });
    $('.menu-icon-close').click(function () {
        $('.mobile-menu').hide();
        $('.menu-icon-close').hide();
        $('.menu-icon-open').show();
    });

    // Load user data from localStorage
    function loadUserData() {
        const defaultData = {
            fullName: 'Chris Wong',
            email: 'chris.wong@gmail.com',
            phone: '9111 1111',
            address: '123 Luxury Lane, Beverly Hills, CA 90210',
            emailNotifications: 'All notifications',
            memberSince: 'October 2024',
            profileImage: null
        };

        const userData = JSON.parse(localStorage.getItem('userData')) || defaultData;

        // Update form fields
        $('#profile-form input[type="text"]').first().val(userData.fullName);
        $('#profile-form input[type="email"]').val(userData.email);
        $('#profile-form input[type="tel"]').val(userData.phone);
        $('#user-address').val(userData.address);
        $('#settings-form select').val(userData.emailNotifications);

        // Update header
        $('.account-header h2').text(`Welcome, ${userData.fullName}`);
        $('.account-header p').text(`Member since ${userData.memberSince}`);
        $('.profile-picture').text(getInitials(userData.fullName));

        // Handle profile image
        if (userData.profileImage) {
            $('.profile-picture')
                .css('background-image', `url(${userData.profileImage})`)
                .text('')
                .addClass('has-image');
            $('#profile-preview')
                .attr('src', userData.profileImage)
                .show();
            $('.remove-image-btn').show();
        } else {
            $('.profile-picture')
                .css('background-image', 'none')
                .text(getInitials(userData.fullName))
                .removeClass('has-image');
            $('#profile-preview').hide();
            $('.remove-image-btn').hide();
        }
    }

    // Helper functions
    function getInitials(name) {
        return name.split(' ').map(word => word[0]).join('');
    }

    function showFieldError(field, message) {
        field.addClass('error');
        $(`<div class="error-message">${message}</div>`).insertAfter(field);
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function showNotification(message, type) {
        const notification = $(`<div class="notification ${type}">${message}</div>`)
            .css({
                'position': 'fixed',
                'top': '20px',
                'right': '20px',
                'padding': '15px 25px',
                'border-radius': '5px',
                'background-color': type === 'success' ? '#4CAF50' : '#f44336',
                'color': 'white',
                'z-index': 1000,
                'opacity': 0
            });

        $('body').append(notification);
        notification.animate({ opacity: 1 }, 300);
        setTimeout(() => {
            notification.animate({ opacity: 0 }, 300, function() {
                $(this).remove();
            });
        }, 3000);
    }

    // Form submissions
    $('#profile-form').on('submit', function(e) {
        e.preventDefault();
        
        const fullName = $('#profile-form input[type="text"]').first().val().trim();
        const email = $('#profile-form input[type="email"]').val().trim();
        const phone = $('#profile-form input[type="tel"]').val().trim();
        const address = $('#user-address').val().trim();
        
        // Clear previous errors
        $('.form-control').removeClass('error');
        $('.error-message').remove();
        
        // Validation
        let hasError = false;
        if (!fullName) {
            showFieldError($('#profile-form input[type="text"]').first(), 'Full Name is required');
            hasError = true;
        }
        if (!email) {
            showFieldError($('#profile-form input[type="email"]'), 'Email is required');
            hasError = true;
        } else if (!isValidEmail(email)) {
            showFieldError($('#profile-form input[type="email"]'), 'Please enter a valid email');
            hasError = true;
        }
        if (!phone) {
            showFieldError($('#profile-form input[type="tel"]'), 'Phone number is required');
            hasError = true;
        }
        if (!address) {
            showFieldError($('#user-address'), 'Address is required');
            hasError = true;
        }
        
        if (hasError) return;
        
        // Get existing data to preserve other fields
        const existingData = JSON.parse(localStorage.getItem('userData')) || {};
        
        // Save data
        const userData = {
            ...existingData,
            fullName,
            email,
            phone,
            address,
            memberSince: existingData.memberSince || 'October 2024'
        };
        
        localStorage.setItem('userData', JSON.stringify(userData));
        
        // Update UI
        $('.account-header h2').text(`Welcome, ${userData.fullName}`);
        
        // Reset profile image preview and remove button
        $('#profile-preview').hide();
        $('.remove-image-btn').hide();
        $('#profile-upload').val('');
        
        // Update profile picture with initials if no image
        if (!userData.profileImage) {
            $('.profile-picture')
                .removeClass('has-image')
                .css('background-image', 'none')
                .text(getInitials(userData.fullName));
        }
        
        showNotification('Profile updated successfully!', 'success');
    });

    $('#settings-form').on('submit', function(e) {
        e.preventDefault();
        
        const currentPassword = $('input[placeholder="Current Password"]').val();
        const newPassword = $('input[placeholder="New Password"]').val();
        const confirmPassword = $('input[placeholder="Confirm New Password"]').val();
        const emailNotifications = $('#settings-form select').val();

        // Clear previous errors
        $('.form-control').removeClass('error');
        $('.error-message').remove();

        // Password validation
        if (newPassword || confirmPassword || currentPassword) {
            if (!currentPassword) {
                showFieldError($('input[placeholder="Current Password"]'), 'Current password is required');
                return;
            }
            if (newPassword !== confirmPassword) {
                showFieldError($('input[placeholder="Confirm New Password"]'), 'Passwords do not match');
                return;
            }
        }

        // Get existing data and update settings
        const userData = JSON.parse(localStorage.getItem('userData')) || {};
        userData.emailNotifications = emailNotifications;
        
        // Save updated data
        localStorage.setItem('userData', JSON.stringify(userData));
        
        // Clear password fields
        $('#settings-form input[type="password"]').val('');
        
        showNotification('Settings saved successfully!', 'success');
    });

    // Tab switching
    $('.tab').click(function() {
        $('.tab, .tab-pane').removeClass('active');
        $(this).addClass('active');
        $(`#${$(this).data('tab')}`).addClass('active');
    });

    // Initialize
    loadUserData();
    handleProfileImage();
});

// Update the handleProfileImage function
function handleProfileImage() {
    $('#profile-upload').on('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const imageData = e.target.result;
                
                // Update preview and profile picture
                $('#profile-preview').attr('src', imageData).show();
                $('.profile-picture')
                    .css('background-image', `url(${imageData})`)
                    .text('')
                    .addClass('has-image');
                $('.remove-image-btn').show();

                // Save to localStorage
                const userData = JSON.parse(localStorage.getItem('userData')) || {};
                userData.profileImage = imageData;
                localStorage.setItem('userData', JSON.stringify(userData));
            };
            reader.readAsDataURL(file);
        }
    });

    // Add remove image functionality
    $('.remove-image-btn').click(function() {
        const userData = JSON.parse(localStorage.getItem('userData')) || {};
        const fullName = userData.fullName || $('#profile-form input[type="text"]').first().val();
        
        $('#profile-preview').hide().attr('src', '');
        $('.profile-picture')
            .css('background-image', 'none')
            .text(getInitials(fullName))
            .removeClass('has-image');
        $(this).hide();
        $('#profile-upload').val('');

        // Update localStorage
        userData.profileImage = null;
        localStorage.setItem('userData', JSON.stringify(userData));
    });
}
