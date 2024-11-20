$(document).ready(function () {
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
        const userData = JSON.parse(localStorage.getItem('userData')) || {
            fullName: 'Chris Wong',
            email: 'chris.wong@gmail.com',
            phone: '9111 1111',
            address: '123 Luxury Lane, Beverly Hills, CA 90210',
            emailNotifications: 'All notifications',
            memberSince: 'October 2024',
            profileImage: null
        };

        // Update profile form
        $('#profile-form input[type="text"]').val(userData.fullName);
        $('#profile-form input[type="email"]').val(userData.email);
        $('#profile-form input[type="tel"]').val(userData.phone);
        $('#profile-form input[type="text"][placeholder="Address"]').val(userData.address);

        // Update settings form
        $('#settings-form select').val(userData.emailNotifications);

        // Update header
        $('.account-header h2').text(`Welcome, ${userData.fullName}`);
        $('.account-header p').text(`Member since ${userData.memberSince}`);
        $('.profile-picture').text(getInitials(userData.fullName));

        // Load profile image if exists
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

    // Get initials from full name
    function getInitials(name) {
        return name.split(' ').map(word => word[0]).join('');
    }

    // Handle profile form submission
    $('#profile-form').on('submit', function(e) {
        e.preventDefault();
        
        const userData = {
            fullName: $('#profile-form input[type="text"]').val(),
            email: $('#profile-form input[type="email"]').val(),
            phone: $('#profile-form input[type="tel"]').val(),
            address: $('#profile-form input[type="text"][placeholder="Address"]').val(),
            emailNotifications: $('#settings-form select').val(),
            memberSince: JSON.parse(localStorage.getItem('userData'))?.memberSince || 'October 2024'
        };

        localStorage.setItem('userData', JSON.stringify(userData));
        
        // Show success message with animation
        showNotification('Profile updated successfully!', 'success');
        
        // Update header and initials
        $('.account-header h2').text(`Welcome, ${userData.fullName}`);
        $('.profile-picture').text(getInitials(userData.fullName));
    });

    // Handle settings form submission
    $('#settings-form').on('submit', function(e) {
        e.preventDefault();
        
        const currentPassword = $('input[placeholder="Current Password"]').val();
        const newPassword = $('input[placeholder="New Password"]').val();
        const confirmPassword = $('input[placeholder="Confirm New Password"]').val();

        // Basic password validation
        if (newPassword && (newPassword !== confirmPassword)) {
            showNotification('New passwords do not match!', 'error');
            return;
        }

        // Update email notifications preference
        const userData = JSON.parse(localStorage.getItem('userData')) || {};
        userData.emailNotifications = $('#settings-form select').val();
        localStorage.setItem('userData', JSON.stringify(userData));

        // Show success message
        showNotification('Settings saved successfully!', 'success');
        
        // Clear password fields
        $('#settings-form input[type="password"]').val('');
    });

    // Notification function
    function showNotification(message, type) {
        const notification = $(`
            <div class="notification ${type}">
                ${message}
            </div>
        `).css({
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

    // Tab switching functionality
    $('.tab').click(function() {
        $('.tab').removeClass('active');
        $('.tab-pane').removeClass('active');
        
        $(this).addClass('active');
        $(`#${$(this).data('tab')}`).addClass('active');
    });

    // Profile image handling
    function handleProfileImage() {
        const profileUpload = $('#profile-upload');
        const profilePreview = $('#profile-preview');
        const profilePicture = $('.profile-picture');
        
        // Click profile picture to trigger file upload
        profilePicture.click(function() {
            profileUpload.click();
        });

        profileUpload.on('change', function(e) {
            const file = e.target.files[0];
            
            if (file) {
                // Validate file size (max 5MB)
                if (file.size > 5 * 1024 * 1024) {
                    showNotification('Image size should be less than 5MB', 'error');
                    return;
                }

                const reader = new FileReader();
                reader.onload = function(event) {
                    const imageData = event.target.result;
                    
                    // Update preview
                    profilePreview.attr('src', imageData).show();
                    
                    // Update profile picture
                    profilePicture
                        .css('background-image', `url(${imageData})`)
                        .text('')
                        .addClass('has-image');

                    // Show remove button
                    $('.remove-image-btn').show();

                    // Save to localStorage
                    const userData = JSON.parse(localStorage.getItem('userData')) || {};
                    userData.profileImage = imageData;
                    localStorage.setItem('userData', JSON.stringify(userData));

                    showNotification('Profile picture updated successfully!', 'success');
                };
                reader.readAsDataURL(file);
            }
        });

        // Add remove image button
        const removeBtn = $('<button>')
            .addClass('remove-image-btn')
            .text('Remove Image')
            .insertAfter(profilePreview);

        removeBtn.click(function() {
            // Clear image
            profilePreview.attr('src', '#').hide();
            profilePicture
                .css('background-image', 'none')
                .text(getInitials($('#profile-form input[type="text"]').val()))
                .removeClass('has-image');
            profileUpload.val('');
            $(this).hide();

            // Update localStorage
            const userData = JSON.parse(localStorage.getItem('userData')) || {};
            delete userData.profileImage;
            localStorage.setItem('userData', JSON.stringify(userData));

            showNotification('Profile picture removed', 'success');
        });
    }

    // Initial load
    loadUserData();

    // Initialize profile image handling
    handleProfileImage();
});