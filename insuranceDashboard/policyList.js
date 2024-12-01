console.log('Policies:', policies);

// Sample data for insurance policies
const policies = [
    {
        id: "POL-2024-001",
        policyNumber: "MOT-24-1001",
        status: "active",
        policyholder: {
            name: "John Smith",
            phone: "+852 9123 4567",
            email: "john.smith@email.com"
        },
        vehicle: {
            make: "Toyota",
            model: "Camry",
            year: 2022,
            type: "sedan",
            value: 280000,
            bodyType: "Sedan"
        },
        coverageType: "comprehensive",
        premium: 12800,
        startDate: "2024-01-01",
        endDate: "2024-12-31",
        riskScore: 85,
        claimsCount: 0,
        lastClaim: null,
        additionalCoverage: ["windscreen", "floodDamage", "personalAccident"]
    },
    {
        id: "POL-2024-002",
        policyNumber: "MOT-24-1002",
        status: "pending",
        policyholder: {
            name: "Sarah Wong",
            phone: "+852 9876 5432",
            email: "sarah.w@email.com"
        },
        vehicle: {
            make: "Tesla",
            model: "Model 3",
            year: 2023,
            type: "sedan",
            value: 420000,
            bodyType: "Electric Sedan"
        },
        coverageType: "comprehensive",
        premium: 15600,
        startDate: "2024-02-15",
        endDate: "2025-02-14",
        riskScore: 92,
        claimsCount: 0,
        lastClaim: null,
        additionalCoverage: ["electricVehicle", "zeroDep", "roadside"]
    },
    {
        id: "POL-2024-003",
        policyNumber: "MOT-24-1003",
        status: "expired",
        policyholder: {
            name: "Michael Chan",
            phone: "+852 9234 5678",
            email: "mchan@email.com"
        },
        vehicle: {
            make: "Honda",
            model: "CR-V",
            year: 2021,
            type: "suv",
            value: 320000,
            bodyType: "SUV"
        },
        coverageType: "thirdPartyFire",
        premium: 8900,
        startDate: "2023-01-15",
        endDate: "2024-01-14",
        riskScore: 78,
        claimsCount: 1,
        lastClaim: "2023-08-22",
        additionalCoverage: ["floodDamage", "roadside"]
    },
    {
        id: "POL-2024-004",
        policyNumber: "MOT-24-1004",
        status: "active",
        policyholder: {
            name: "Emily Lau",
            phone: "+852 9345 6789",
            email: "emily.l@email.com"
        },
        vehicle: {
            make: "BMW",
            model: "X5",
            year: 2023,
            type: "suv",
            value: 680000,
            bodyType: "Luxury SUV"
        },
        coverageType: "comprehensive",
        premium: 22400,
        startDate: "2023-12-01",
        endDate: "2024-11-30",
        riskScore: 95,
        claimsCount: 0,
        lastClaim: null,
        additionalCoverage: ["luxuryCar", "zeroDep", "personalAccident", "roadside"]
    },
    {
        id: "POL-2024-005",
        policyNumber: "MOT-24-1005",
        status: "pending",
        policyholder: {
            name: "David Lee",
            phone: "+852 9456 7890",
            email: "david.lee@email.com"
        },
        vehicle: {
            make: "Yamaha",
            model: "MT-07",
            year: 2022,
            type: "motorcycle",
            value: 120000,
            bodyType: "Motorcycle"
        },
        coverageType: "thirdParty",
        premium: 5600,
        startDate: "2024-03-01",
        endDate: "2025-02-28",
        riskScore: 82,
        claimsCount: 0,
        lastClaim: null,
        additionalCoverage: ["personalAccident", "roadside"]
    }
];

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

document.addEventListener('DOMContentLoaded', function() {
    initializeMetrics();
    initializeFilters();
    updateTimelines();
    addCardInteractions();
});

// Initialize metric circles animation
function initializeMetrics() {
    document.querySelectorAll('.metric-circle').forEach(metric => {
        const percentage = parseInt(metric.style.getPropertyValue('--percentage'));
        animateMetric(metric, percentage);
    });
}

// Animate metric circles
function animateMetric(element, targetPercentage) {
    let current = 0;
    const duration = 1500;
    const steps = 60;
    const increment = targetPercentage / steps;
    const interval = duration / steps;

    const animation = setInterval(() => {
        current += increment;
        if (current >= targetPercentage) {
            current = targetPercentage;
            clearInterval(animation);
        }
        element.style.setProperty('--percentage', current);
    }, interval);
}

// Initialize filter functionality
function initializeFilters() {
    // Quick filters
    document.querySelectorAll('.quick-filter').forEach(filter => {
        filter.addEventListener('click', function() {
            const filterType = this.dataset.filter;
            applyQuickFilter(filterType);
        });
    });

    // Coverage type filters
    document.querySelectorAll('[data-coverage]').forEach(btn => {
        btn.addEventListener('click', function() {
            const coverage = this.dataset.coverage;
            filterByCoverage(coverage);
        });
    });

    // Vehicle type filters
    document.querySelectorAll('[data-vehicle]').forEach(btn => {
        btn.addEventListener('click', function() {
            const vehicle = this.dataset.vehicle;
            filterByVehicle(vehicle);
        });
    });

    // Premium range slider
    const rangeSlider = document.querySelector('.range-slider input');
    if (rangeSlider) {
        rangeSlider.addEventListener('input', function() {
            updatePremiumFilter(this.value);
        });
    }
}

// Update policy timelines
function updateTimelines() {
    document.querySelectorAll('.policy-timeline').forEach(timeline => {
        const progress = calculateTimelineProgress(
            timeline.querySelector('.start .date').textContent,
            timeline.querySelector('.end .date').textContent
        );
        timeline.querySelector('.progress-bar').style.setProperty('--progress', `${progress}%`);
    });
}

// Calculate timeline progress
function calculateTimelineProgress(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    const total = end - start;
    const elapsed = today - start;
    return Math.max(0, Math.min(100, (elapsed / total) * 100));
}

// Filter functions
function applyQuickFilter(filterType) {
    const cards = document.querySelectorAll('.policy-card');
    cards.forEach(card => {
        switch(filterType) {
            case 'high-risk':
                const riskScore = parseInt(card.dataset.risk);
                card.style.display = riskScore > 80 ? 'block' : 'none';
                break;
            case 'expiring':
                const progress = calculateTimelineProgress(
                    card.querySelector('.start .date').textContent,
                    card.querySelector('.end .date').textContent
                );
                card.style.display = progress > 80 ? 'block' : 'none';
                break;
            case 'claims':
                const claims = parseInt(card.querySelector('.metric-circle:nth-child(3) .metric-value').textContent);
                card.style.display = claims > 0 ? 'block' : 'none';
                break;
        }
    });
}

// Add card interactions
function addCardInteractions() {
    document.querySelectorAll('.policy-card').forEach(card => {
        // Hover effects
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });

        // Button clicks
        card.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                handleButtonClick(this, card);
            });
        });
    });
}

// Handle button clicks
function handleButtonClick(button, card) {
    const action = button.classList.contains('primary') ? 'details' :
                  button.classList.contains('secondary') ? 'analytics' : 'support';
    
    switch(action) {
        case 'details':
            showPolicyDetails(card.querySelector('.policy-number').textContent);
            break;
        case 'analytics':
            showPolicyAnalytics(card.querySelector('.policy-number').textContent);
            break;
        case 'support':
            openSupportChat(card.querySelector('.policy-number').textContent);
            break;
    }
}

// Utility functions for actions
function showPolicyDetails(policyNumber) {
    console.log(`Showing details for policy ${policyNumber}`);
    // Implement your details view logic
}

function showPolicyAnalytics(policyNumber) {
    console.log(`Showing analytics for policy ${policyNumber}`);
    // Implement your analytics view logic
}

function openSupportChat(policyNumber) {
    console.log(`Opening support chat for policy ${policyNumber}`);
    // Implement your support chat logic
}