// Premium ranges for different coverage types
const premiumRanges = {
    basic: {
        comprehensive: { base: 5000, rate: 0.025 },
        thirdParty: { base: 3000, rate: 0.015 },
        thirdPartyFire: { base: 3500, rate: 0.02 }
    },
    addons: {
        windscreen: 800,
        floodDamage: 1200,
        personalAccident: 1500,
        zeroDep: 2000,
        roadside: 600,
        electricVehicle: 1800,
        luxuryCar: 3000
    }
};

// Enhanced filter management
class FilterManager {
    constructor() {
        this.state = {
            status: 'all',
            coverage: 'all',
            vehicle: 'all'
        };
        
        this.initializeEventListeners();
        this.updateUI();
        this.updateTotalPolicies();
        this.initializeThemeToggle();
    }

    initializeEventListeners() {
        // Filter button clicks
        document.querySelectorAll('[data-filter]').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleFilterClick(e));
        });
    }

    handleFilterClick(event) {
        const button = event.currentTarget;
        const filterType = button.dataset.filter;
        const value = button.dataset.value;

        // Update active state in button group
        const buttonGroup = button.closest('.filter-buttons');
        buttonGroup.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        button.classList.add('active');

        // Update filter state
        this.state[filterType] = value;
        this.updateUI();
    }

    applyFilters(policies) {
        // Get all policy cards from the DOM
        const policyCards = document.querySelectorAll('.policy-card');
        let visiblePolicies = Array.from(policyCards);

        // Apply each filter
        visiblePolicies = visiblePolicies.filter(card => {
            // Status filter
            if (this.state.status !== 'all') {
                const cardStatus = card.dataset.status;
                if (cardStatus !== this.state.status) return false;
            }

            // Coverage filter
            if (this.state.coverage !== 'all') {
                const cardCoverage = card.dataset.coverage;
                if (cardCoverage !== this.state.coverage) return false;
            }

            // Vehicle filter
            if (this.state.vehicle !== 'all') {
                const cardVehicle = card.dataset.vehicle;
                if (cardVehicle !== this.state.vehicle) return false;
            }

            return true;
        });

        return visiblePolicies;
    }

    updateUI() {
        const filteredPolicies = this.applyFilters();
        
        this.updateFilterCounts(filteredPolicies);
        this.updatePolicyList(filteredPolicies);
        this.updateShortlistInfo(filteredPolicies.length);
        this.updateTotalPolicies();
    }

    updateFilterCounts(filteredPolicies) {
        // Status counts
        const statusCounts = {
            all: filteredPolicies.length,
            active: 0,
            pending: 0,
            expired: 0
        };

        // Coverage counts
        const coverageCounts = {
            all: filteredPolicies.length,
            comprehensive: 0,
            'third-party': 0
        };

        // Vehicle counts
        const vehicleCounts = {
            all: filteredPolicies.length,
            sedan: 0,
            suv: 0,
            luxury: 0
        };

        // Count each type
        filteredPolicies.forEach(card => {
            statusCounts[card.dataset.status]++;
            coverageCounts[card.dataset.coverage]++;
            vehicleCounts[card.dataset.vehicle]++;
        });

        // Update status filter counts
        document.querySelectorAll('#statusFilters .filter-btn').forEach(btn => {
            const value = btn.dataset.value;
            btn.querySelector('.count').textContent = statusCounts[value] || 0;
        });

        // Update coverage filter counts
        document.querySelectorAll('#coverageFilters .filter-btn').forEach(btn => {
            const value = btn.dataset.value;
            btn.querySelector('.count').textContent = coverageCounts[value] || 0;
        });

        // Update vehicle filter counts
        document.querySelectorAll('#vehicleFilters .filter-btn').forEach(btn => {
            const value = btn.dataset.value;
            btn.querySelector('.count').textContent = vehicleCounts[value] || 0;
        });
    }

    updatePolicyList(visiblePolicies) {
        // Hide all policy cards first
        document.querySelectorAll('.policy-card').forEach(card => {
            card.style.display = 'none';
        });

        // Show only filtered cards
        visiblePolicies.forEach(card => {
            card.style.display = 'block';
        });
    }

    updateShortlistInfo(totalItems) {
        const shortlistInfo = document.getElementById('shortlistInfo');
        if (shortlistInfo) {
            shortlistInfo.textContent = `Showing ${totalItems} of ${document.querySelectorAll('.policy-card').length} policies`;
        }
    }

    updateTotalPolicies() {
        const totalPolicies = document.querySelectorAll('.policy-card').length;
        const activePolicies = document.querySelectorAll('.policy-card[data-status="active"]').length;
        const pendingPolicies = document.querySelectorAll('.policy-card[data-status="pending"]').length;
        const expiredPolicies = document.querySelectorAll('.policy-card[data-status="expired"]').length;

        // Update total policies count
        document.querySelector('.total-policies .stat-value').textContent = totalPolicies;

        // Update breakdown counts
        const breakdownItems = document.querySelectorAll('.total-policies .breakdown-item');
        breakdownItems.forEach(item => {
            const label = item.querySelector('.item-label').textContent.toLowerCase();
            if (label === 'active') {
                item.querySelector('.item-value').textContent = activePolicies;
            } else if (label === 'pending') {
                item.querySelector('.item-value').textContent = pendingPolicies;
            } else if (label === 'expired') {
                item.querySelector('.item-value').textContent = expiredPolicies;
            }
        });
    }

    initializeThemeToggle() {
        const themeToggleBtn = $('#themeToggleBtn');
        const body = $('body');
        const themeText = $('.theme-text');
        const lightIcon = $('.theme-icon.light');
        const darkIcon = $('.theme-icon.dark');
        
        // Check for saved theme preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            body.addClass('dark-mode');
            themeText.text('Light Mode');
            lightIcon.hide();
            darkIcon.show();
        } else {
            lightIcon.show();
            darkIcon.hide();
        }
        
        // Theme toggle click handler
        themeToggleBtn.on('click', function() {
            const isDarkMode = body.hasClass('dark-mode');
            body.toggleClass('dark-mode');
            localStorage.setItem('theme', isDarkMode ? 'light' : 'dark');
            
            // Update text and icons
            themeText.text(isDarkMode ? 'Dark Mode' : 'Light Mode');
            if (isDarkMode) {
                lightIcon.show();
                darkIcon.hide();
            } else {
                lightIcon.hide();
                darkIcon.show();
            }
            
            showNotification(`Switched to ${isDarkMode ? 'light' : 'dark'} mode`);
        });
    }
}

// Initialize filter manager when document is ready
document.addEventListener('DOMContentLoaded', () => {
    window.filterManager = new FilterManager();
});