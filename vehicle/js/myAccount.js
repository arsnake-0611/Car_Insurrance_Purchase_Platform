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
});

// Tab switching functionality
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        // Remove active class from all tabs
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));

        // Add active class to clicked tab
        tab.classList.add('active');
        document.getElementById(tab.dataset.tab).classList.add('active');
    });
});

// Form submission handling
document.getElementById('profile-form').addEventListener('submit', (e) => {
    e.preventDefault();
    // Add profile update logic here
    alert('Profile updated successfully!');
});

document.getElementById('settings-form').addEventListener('submit', (e) => {
    e.preventDefault();
    // Add settings update logic here
    alert('Settings saved successfully!');
});