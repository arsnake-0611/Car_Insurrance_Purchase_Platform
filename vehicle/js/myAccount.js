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

document.getElementById('logoLink').addEventListener('click', function(event) {
    event.preventDefault();
    window.location.href = 'home.html';
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
