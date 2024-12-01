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
});