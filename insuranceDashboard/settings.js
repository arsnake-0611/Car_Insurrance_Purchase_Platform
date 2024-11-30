$(document).ready(function() {
    // Theme initialization
    const currentTheme = localStorage.getItem('theme') || 'light';
    if (currentTheme === 'dark') {
        $('body').addClass('dark-mode');
        $('#themeToggle').prop('checked', true);
    }

    // Theme toggle handler
    $('#themeToggle').on('change', function() {
        if (this.checked) {
            $('body').addClass('dark-mode');
            localStorage.setItem('theme', 'dark');
            showNotification('Dark mode enabled');
        } else {
            $('body').removeClass('dark-mode');
            localStorage.setItem('theme', 'light');
            showNotification('Light mode enabled');
        }
    });

    // Handle profile form submission
    $('#profileForm').on('submit', function(e) {
        e.preventDefault();
        showNotification('Profile updated successfully!');
    });

    // Handle security form submission
    $('#securityForm').on('submit', function(e) {
        e.preventDefault();
        const currentPassword = $('#currentPassword').val();
        const newPassword = $('#newPassword').val();
        const confirmPassword = $('#confirmPassword').val();

        if (!currentPassword) {
            showNotification('Please enter your current password');
            return;
        }

        if (newPassword !== confirmPassword) {
            showNotification('New passwords do not match!');
            return;
        }

        if (newPassword.length < 8) {
            showNotification('Password must be at least 8 characters long');
            return;
        }

        // Simulate password change
        showNotification('Password changed successfully!');
        this.reset();
    });

    // Handle system settings save
    $('.btn-primary').on('click', function() {
        const language = $('#language').val();
        const timezone = $('#timezone').val();
        
        // Save settings to localStorage
        localStorage.setItem('language', language);
        localStorage.setItem('timezone', timezone);
        
        showNotification('System settings saved successfully!');
    });

    // Enhanced notification function
    function showNotification(message) {
        const notification = $('#notification');
        notification
            .text(message)
            .fadeIn()
            .css({
                'background': $('body').hasClass('dark-mode') ? '#3d3d3d' : '#ffffff',
                'color': $('body').hasClass('dark-mode') ? '#ffffff' : '#333333',
                'border': $('body').hasClass('dark-mode') ? '1px solid #4d4d4d' : '1px solid #dddddd'
            });

        setTimeout(() => notification.fadeOut(), 3000);
    }

    // Load saved settings on page load
    function loadSavedSettings() {
        const savedLanguage = localStorage.getItem('language');
        const savedTimezone = localStorage.getItem('timezone');
        
        if (savedLanguage) {
            $('#language').val(savedLanguage);
        }
        if (savedTimezone) {
            $('#timezone').val(savedTimezone);
        }
    }

    // Initialize saved settings
    loadSavedSettings();
});