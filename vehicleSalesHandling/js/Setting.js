class Settings {
    constructor() {
        this.settings = {
            theme: localStorage.getItem('theme') || 'light',
            emailNotifications: localStorage.getItem('emailNotifications') === 'true',
            desktopNotifications: localStorage.getItem('desktopNotifications') === 'true',
            language: localStorage.getItem('language') || 'en'
        };

        // Apply theme immediately on load
        this.applyCurrentTheme();
        
        // Initialize if we're on the settings page
        if (document.querySelector('.settings-container')) {
            this.initializeSettings();
            this.setupEventListeners();
        }
    }

    applyCurrentTheme() {
        const currentTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', currentTheme);
    }

    initializeSettings() {
        // Set initial theme
        $(`.theme-btn[data-theme="${this.settings.theme}"]`).addClass('active');

        // Set initial notification states
        $('#emailNotifications').prop('checked', this.settings.emailNotifications);
        $('#desktopNotifications').prop('checked', this.settings.desktopNotifications);

        // Set initial language
        $('#language').val(this.settings.language);
    }

    setupEventListeners() {
        // Theme selection
        $('.theme-btn').click(e => {
            const theme = $(e.currentTarget).data('theme');
            this.updateTheme(theme);
        });

        // Notification toggles
        $('#emailNotifications').change(e => {
            this.updateSetting('emailNotifications', e.target.checked);
        });

        $('#desktopNotifications').change(e => {
            this.updateSetting('desktopNotifications', e.target.checked);
        });

        // Language selection
        $('#language').change(e => {
            this.updateSetting('language', e.target.value);
        });
    }

    updateTheme(theme) {
        // Update theme buttons
        $('.theme-btn').removeClass('active');
        $(`.theme-btn[data-theme="${theme}"]`).addClass('active');

        // Update document theme
        document.documentElement.setAttribute('data-theme', theme);

        // Save to localStorage
        this.updateSetting('theme', theme);

        // Broadcast theme change to other pages
        this.broadcastSettingChange('theme', theme);
    }

    updateSetting(key, value) {
        this.settings[key] = value;
        localStorage.setItem(key, value);
        this.broadcastSettingChange(key, value);
    }

    broadcastSettingChange(key, value) {
        // Use BroadcastChannel API to sync settings across tabs
        const channel = new BroadcastChannel('settings-channel');
        channel.postMessage({ key, value });
    }

    // Static method to initialize settings listener on other pages
    static initializeSettingsListener() {
        // Apply current theme immediately
        const currentTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', currentTheme);

        // Listen for changes
        const channel = new BroadcastChannel('settings-channel');
        channel.onmessage = (event) => {
            const { key, value } = event.data;
            
            // Handle theme changes
            if (key === 'theme') {
                document.documentElement.setAttribute('data-theme', value);
            }
            
            // Handle other settings as needed
            localStorage.setItem(key, value);
        };
    }
}

// Initialize settings on page load
document.addEventListener('DOMContentLoaded', () => {
    // Initialize settings for all pages
    new Settings();
    
    // Add listener for all pages
    Settings.initializeSettingsListener();
});

// Ensure theme is applied even before DOMContentLoaded
(function() {
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
})();
