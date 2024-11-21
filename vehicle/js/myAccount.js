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
        
        $('.form-control').removeClass('error');
        $('.error-message').remove();
        
        // Validation
        if (!fullName || !email || !phone || !address || !isValidEmail(email)) {
            !fullName && showFieldError($('#profile-form input[type="text"]').first(), 'Full Name is required');
            !email && showFieldError($('#profile-form input[type="email"]'), 'Email is required');
            email && !isValidEmail(email) && showFieldError($('#profile-form input[type="email"]'), 'Please enter a valid email');
            !phone && showFieldError($('#profile-form input[type="tel"]'), 'Phone number is required');
            !address && showFieldError($('#user-address'), 'Address is required');
            return;
        }
        
        // Save data
        const userData = {
            fullName,
            email,
            phone,
            address,
            emailNotifications: $('#settings-form select').val(),
            memberSince: JSON.parse(localStorage.getItem('userData'))?.memberSince || 'October 2024',
            profileImage: JSON.parse(localStorage.getItem('userData'))?.profileImage || null
        };
        
        localStorage.setItem('userData', JSON.stringify(userData));
        showNotification('Profile updated successfully!', 'success');
        $('.account-header h2').text(`Welcome, ${userData.fullName}`);
        $('.profile-picture').text(getInitials(userData.fullName));
    });

    $('#settings-form').on('submit', function(e) {
        e.preventDefault();
        const newPassword = $('input[placeholder="New Password"]').val();
        const confirmPassword = $('input[placeholder="Confirm New Password"]').val();

        if (newPassword && newPassword !== confirmPassword) {
            showNotification('New passwords do not match!', 'error');
            return;
        }

        const userData = JSON.parse(localStorage.getItem('userData')) || {};
        userData.emailNotifications = $('#settings-form select').val();
        localStorage.setItem('userData', JSON.stringify(userData));
        
        showNotification('Settings saved successfully!', 'success');
        $('#settings-form input[type="password"]').val('');
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
