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
            vehicle: 'all',
            search: '',
            sort: {
                field: 'policyNumber',
                direction: 'desc'
            }
        };
        
        this.initializeEventListeners();
        this.updateUI();
    }

    initializeEventListeners() {
        // Filter button clicks
        document.querySelectorAll('[data-filter]').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleFilterClick(e));
        });

        // Sort button clicks
        document.querySelectorAll('[data-sort]').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleSortClick(e));
        });

        // Search input
        const searchInput = document.getElementById('policySearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.handleSearch(e));
        }
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

    handleSortClick(event) {
        const button = event.currentTarget;
        const sortField = button.dataset.sort;
        
        // Toggle sort direction if clicking same field
        if (this.state.sort.field === sortField) {
            this.state.sort.direction = this.state.sort.direction === 'asc' ? 'desc' : 'asc';
        } else {
            this.state.sort.field = sortField;
            this.state.sort.direction = 'desc';
        }

        // Update sort button states
        document.querySelectorAll('[data-sort]').forEach(btn => {
            btn.classList.remove('active');
            const icon = btn.querySelector('.sort-icon');
            icon.textContent = '↓';
        });

        button.classList.add('active');
        const icon = button.querySelector('.sort-icon');
        icon.textContent = this.state.sort.direction === 'asc' ? '↑' : '↓';

        this.updateUI();
    }

    handleSearch(event) {
        this.state.search = event.target.value;
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

            // Search filter
            if (this.state.search) {
                const searchText = card.textContent.toLowerCase();
                if (!searchText.includes(this.state.search.toLowerCase())) return false;
            }

            return true;
        });

        return visiblePolicies;
    }

    applySorting(policyCards) {
        const { field, direction } = this.state.sort;
        
        return Array.from(policyCards).sort((a, b) => {
            let valueA = this.getSortValue(a, field);
            let valueB = this.getSortValue(b, field);
            
            const sortOrder = direction === 'asc' ? 1 : -1;
            return (valueA > valueB ? 1 : valueA < valueB ? -1 : 0) * sortOrder;
        });
    }

    getSortValue(card, field) {
        switch (field) {
            case 'premium':
                return parseFloat(card.dataset.premium) || 0;
            case 'riskScore':
                return parseFloat(card.dataset.risk) || 0;
            case 'endDate':
                const endDateElement = card.querySelector('.timeline-marker.end .date');
                return endDateElement ? new Date(endDateElement.textContent) : new Date(0);
            default:
                const policyNumber = card.querySelector('.policy-number');
                return policyNumber ? policyNumber.textContent : '';
        }
    }

    updateUI() {
        const filteredPolicies = this.applyFilters();
        const sortedPolicies = this.applySorting(filteredPolicies);
        
        this.updateFilterCounts(filteredPolicies);
        this.updatePolicyList(sortedPolicies);
        this.updateShortlistInfo(sortedPolicies.length);
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

        // Show only filtered and sorted cards
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
}

// Initialize filter manager when document is ready
document.addEventListener('DOMContentLoaded', () => {
    window.filterManager = new FilterManager();
});