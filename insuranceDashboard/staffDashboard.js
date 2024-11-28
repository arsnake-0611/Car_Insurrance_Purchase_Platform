// Sample data for demonstration
let quotes = [
    {
        id: 1,
        referenceNumber: 'QT2023001',
        customerName: 'John Doe',
        date: '2024-01-15',
        status: 'pending',
        vehicleDetails: 'Toyota Camry 2020',
        coverageType: 'Comprehensive'
    },
    {
        id: 2,
        referenceNumber: 'QT2023002',
        customerName: 'Jane Smith',
        date: '2024-01-14',
        status: 'approved',
        vehicleDetails: 'Honda Civic 2021',
        coverageType: 'Third Party'
    },
    {
        id: 3,
        referenceNumber: 'QT2023003',
        customerName: 'Mike Johnson',
        date: '2024-01-13',
        status: 'rejected',
        vehicleDetails: 'BMW X5 2019',
        coverageType: 'Comprehensive'
    }
];

// Activity log data
let activities = [
    {
        type: 'new_quote',
        message: 'New quotation submitted by John Doe',
        timestamp: '2024-01-15 09:30:00'
    },
    {
        type: 'status_change',
        message: 'Quotation QT2023002 approved',
        timestamp: '2024-01-14 14:45:00'
    },
    {
        type: 'status_change',
        message: 'Quotation QT2023003 rejected',
        timestamp: '2024-01-13 16:20:00'
    }
];

// Initialize dashboard
$(document).ready(function() {
    updateStatistics();
    updateActivityList();
    setupEventListeners();
});

// Update statistics with animation
function updateStatistics() {
    const stats = {
        total: quotes.length,
        pending: quotes.filter(q => q.status === 'pending').length,
        approved: quotes.filter(q => q.status === 'approved').length,
        rejected: quotes.filter(q => q.status === 'rejected').length
    };
    
    // Animate statistics update
    ['total', 'pending', 'approved', 'rejected'].forEach(stat => {
        const element = $(`#${stat}Quotes`);
        const currentValue = parseInt(element.text());
        const newValue = stats[stat];
        
        $({value: currentValue}).animate({value: newValue}, {
            duration: 1000,
            easing: 'swing',
            step: function() {
                element.text(Math.floor(this.value));
            },
            complete: function() {
                element.text(newValue);
            }
        });
    });
}

// Update activity list
function updateActivityList() {
    const activityList = $('#activityList');
    activityList.empty();

    activities.slice(0, 5).forEach(activity => {
        const activityItem = $(`
            <div class="activity-item fade-in">
                <div class="activity-icon">${getActivityIcon(activity.type)}</div>
                <div class="activity-details">
                    <p>${activity.message}</p>
                    <small>${formatTimestamp(activity.timestamp)}</small>
                </div>
            </div>
        `);
        activityList.append(activityItem);
    });
}

// Helper function to get activity icons
function getActivityIcon(type) {
    const icons = {
        new_quote: '📝',
        status_change: '🔄',
        approved: '✅',
        rejected: '❌'
    };
    return icons[type] || '📋';
}

// Format timestamp
function formatTimestamp(timestamp) {
    return new Date(timestamp).toLocaleString();
}

// Setup event listeners
function setupEventListeners() {
    // Time range filter
    $('#timeRange').on('change', function() {
        const selectedRange = $(this).val();
        filterQuotesByTimeRange(selectedRange);
    });

    // Quick action buttons
    $('#newQuoteBtn').on('click', function() {
        showNotification('Opening new quote form...');
        // Add your new quote form logic here
    });

    $('#pendingReviewBtn').on('click', function() {
        showNotification('Loading pending reviews...');
        // Add your pending review logic here
    });

    $('#generateReportBtn').on('click', function() {
        showNotification('Generating report...');
        // Add your report generation logic here
    });

    // Sign out button
    $('.sign-out-btn').on('click', function() {
        if(confirm('Are you sure you want to sign out?')) {
            showNotification('Signing out...');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1000);
        }
    });
}

// Filter quotes by time range
function filterQuotesByTimeRange(range) {
    const now = new Date();
    let filteredQuotes = [...quotes];

    switch(range) {
        case 'today':
            filteredQuotes = quotes.filter(quote => 
                new Date(quote.date).toDateString() === now.toDateString()
            );
            break;
        case 'week':
            const weekAgo = new Date(now.setDate(now.getDate() - 7));
            filteredQuotes = quotes.filter(quote => 
                new Date(quote.date) >= weekAgo
            );
            break;
        case 'month':
            const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
            filteredQuotes = quotes.filter(quote => 
                new Date(quote.date) >= monthAgo
            );
            break;
        // 'all' case will use all quotes
    }

    updateStatisticsWithFiltered(filteredQuotes);
}

// Update statistics based on filtered quotes
function updateStatisticsWithFiltered(filteredQuotes) {
    const stats = {
        total: filteredQuotes.length,
        pending: filteredQuotes.filter(q => q.status === 'pending').length,
        approved: filteredQuotes.filter(q => q.status === 'approved').length,
        rejected: filteredQuotes.filter(q => q.status === 'rejected').length
    };

    // Update statistics with animation
    Object.keys(stats).forEach(stat => {
        const element = $(`#${stat}Quotes`);
        const currentValue = parseInt(element.text());
        const newValue = stats[stat];
        
        $({value: currentValue}).animate({value: newValue}, {
            duration: 1000,
            easing: 'swing',
            step: function() {
                element.text(Math.floor(this.value));
            },
            complete: function() {
                element.text(newValue);
            }
        });
    });
}

// Show notification
function showNotification(message) {
    const notification = $('#notification');
    notification.text(message).fadeIn();
    setTimeout(() => notification.fadeOut(), 3000);
}

// Add new activity
function addActivity(type, message) {
    const newActivity = {
        type: type,
        message: message,
        timestamp: new Date().toISOString().replace('T', ' ').split('.')[0]
    };
    
    activities.unshift(newActivity);
    updateActivityList();
}
