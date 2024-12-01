// Sample data for demonstration
let quotes = [
    {
        id: 1,
        referenceNumber: 'QT2024001',
        customerName: 'John Doe',
        date: '2024-10-15',
        status: 'pending',
        vehicleDetails: 'Toyota Camry 2020',
        coverageType: 'Comprehensive'
    },
    {
        id: 2,
        referenceNumber: 'QT2024002',
        customerName: 'Jane Smith',
        date: '2024-11-18',
        status: 'approved',
        vehicleDetails: 'Honda Civic 2021',
        coverageType: 'Third Party'
    },
    {
        id: 3,
        referenceNumber: 'QT2024003',
        customerName: 'Mike Johnson',
        date: '2024-11-20',
        status: 'rejected',
        vehicleDetails: 'BMW X5 2019',
        coverageType: 'Comprehensive'
    },
    {
        id: 4,
        referenceNumber: 'QT2024004',
        customerName: 'Sarah Wilson',
        date: '2024-11-30',
        status: 'rejected',
        vehicleDetails: 'Ford Focus 2022',
        coverageType: 'Third Party'
    }
];

// Activity log data
let activities = [
    {
        type: 'new_quote',
        title: 'New Quote Submission',
        message: 'Luxury vehicle insurance quote',
        details: {
            fullName: 'John Doe',
            email: 'john.doe@email.com',
            phoneNumber: '12345678',
            vehicleMake: 'BMW',
            vehicleModel: 'X5',
            vehicleYear: '2023',
            coveragePlan: 'Comprehensive',
            vehicleValue: 'HK$ 750,000'
        },
        status: 'pending',
        reference: 'QT2024001',
        timestamp: '2024-10-15 09:30:00',
        priority: 'high'
    },
    {
        type: 'status_change',
        title: 'Quote Approved',
        message: 'Standard coverage approved',
        details: {
            fullName: 'Jane Smith',
            email: 'jane.smith@email.com',
            phoneNumber: '87654321',
            vehicleMake: 'Toyota',
            vehicleModel: 'Camry',
            vehicleYear: '2022',
            coveragePlan: 'Third-Party',
            vehicleValue: 'HK$ 280,000'
        },
        status: 'approved',
        reference: 'QT2024002',
        timestamp: '2024-11-18 15:45:00',
        priority: 'medium'
    },
    {
        type: 'new_quote',
        title: 'New Quote Submission',
        message: 'Sports car insurance quote',
        details: {
            fullName: 'Mike Johnson',
            email: 'mike.j@email.com',
            phoneNumber: '23456789',
            vehicleMake: 'Porsche',
            vehicleModel: '911',
            vehicleYear: '2023',
            coveragePlan: 'Comprehensive',
            vehicleValue: 'HK$ 1,200,000'
        },
        status: 'pending',
        reference: 'QT2024003',
        timestamp: '2024-11-20 11:20:00',
        priority: 'high'
    },
    {
        type: 'status_change',
        title: 'Quote Rejected',
        message: 'Insufficient documentation',
        details: {
            fullName: 'Sarah Wilson',
            email: 'sarah.w@email.com',
            phoneNumber: '34567890',
            vehicleMake: 'Ford',
            vehicleModel: 'Focus',
            vehicleYear: '2021',
            coveragePlan: 'Third-Party',
            vehicleValue: 'HK$ 180,000'
        },
        status: 'rejected',
        reference: 'QT2024004',
        timestamp: '2024-11-30 14:15:00',
        priority: 'low'
    }
];

// Initialize dashboard
$(document).ready(function() {
    updateStatistics();
    updateActivityList();
    setupEventListeners();
    
    // Add notification check for new quotes
    checkNewQuotations();
    
    // Theme toggle functionality
    const themeToggleBtn = $('#themeToggleBtn');
    const body = $('body');
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.addClass('dark-mode');
        updateThemeToggleButton(true);
    }
    
    // Theme toggle click handler
    themeToggleBtn.on('click', function() {
        const isDarkMode = body.hasClass('dark-mode');
        body.toggleClass('dark-mode');
        localStorage.setItem('theme', isDarkMode ? 'light' : 'dark');
        updateThemeToggleButton(!isDarkMode);
        showNotification(`Switched to ${isDarkMode ? 'light' : 'dark'} mode`);
    });
    
    function updateThemeToggleButton(isDarkMode) {
        const lightIcon = themeToggleBtn.find('.theme-icon.light');
        const darkIcon = themeToggleBtn.find('.theme-icon.dark');
        const themeText = themeToggleBtn.find('.theme-text');
        
        if (isDarkMode) {
            lightIcon.hide();
            darkIcon.show();
            themeText.text('Light Mode');
        } else {
            lightIcon.show();
            darkIcon.hide();
            themeText.text('Dark Mode');
        }
    }
});

// Update statistics with animation
function updateStatistics() {
    const sortValue = $('#activitySort').val();
    const timeRange = $('#timeRange').val();
    let sortedQuotes = [...quotes];
    
    // First apply time range filter
    const now = new Date();
    switch(timeRange) {
        case 'today':
            sortedQuotes = sortedQuotes.filter(quote => 
                new Date(quote.date).toDateString() === now.toDateString()
            );
            break;
        case 'week':
            const weekAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
            sortedQuotes = sortedQuotes.filter(quote => 
                new Date(quote.date) >= weekAgo
            );
            break;
        case 'month':
            const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
            sortedQuotes = sortedQuotes.filter(quote => 
                new Date(quote.date) >= monthAgo
            );
            break;
        // 'all' case will use all quotes
    }

    // Then apply sorting
    switch(sortValue) {
        case 'newest':
            sortedQuotes.sort((a, b) => new Date(b.date) - new Date(a.date));
            break;
        case 'oldest':
            sortedQuotes.sort((a, b) => new Date(a.date) - new Date(b.date));
            break;
        case 'value':
            sortedQuotes.sort((a, b) => {
                const getVehicleValue = (str) => {
                    const match = str.match(/\d+/);
                    return match ? parseInt(match[0]) : 0;
                };
                return getVehicleValue(b.vehicleDetails) - getVehicleValue(a.vehicleDetails);
            });
            break;
        case 'priority':
            sortedQuotes.sort((a, b) => {
                const priorityOrder = {
                    'pending': 3,
                    'approved': 2,
                    'rejected': 1
                };
                return priorityOrder[b.status] - priorityOrder[a.status];
            });
            break;
    }
    
    const stats = {
        total: sortedQuotes.length,
        pending: sortedQuotes.filter(q => q.status === 'pending').length,
        approved: sortedQuotes.filter(q => q.status === 'approved').length,
        rejected: sortedQuotes.filter(q => q.status === 'rejected').length
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

    // Update the quotes array with sorted data
    quotes = sortedQuotes;
    updateActivityList();
}

// Update activity list
function updateActivityList() {
    const activityList = $('#activityList');
    activityList.empty();

    // Get filter and sort values
    const filterValue = $('#activityFilter').val();
    const sortValue = $('#activitySort').val();

    // Filter activities
    let filteredActivities = activities;
    if (filterValue !== 'all') {
        filteredActivities = activities.filter(activity => activity.type === filterValue);
    }

    // Sort activities
    filteredActivities = sortActivities(filteredActivities, sortValue);

    // Create activity items
    filteredActivities.forEach(activity => {
        const activityItem = createActivityItem(activity);
        activityList.append(activityItem);
    });
}

// Create activity item HTML
function createActivityItem(activity) {
    const statusClass = `status-${activity.status.toLowerCase()}`;
    const priorityClass = `priority-${activity.priority || 'normal'}`;
    
    return $(`
        <div class="activity-item fade-in ${priorityClass}">
            <div class="activity-content">
                <div class="activity-header">
                    <div class="activity-title-group">
                        <span class="quote-id">#${activity.reference}</span>
                        <h4 class="activity-title">${activity.details.fullName}</h4>
                        <span class="status-badge ${statusClass}">${activity.status.toUpperCase()}</span>
                    </div>
                    <div class="activity-meta">
                        <span class="timestamp">${formatTimestamp(activity.timestamp)}</span>
                    </div>
                </div>
                <div class="activity-summary">
                    <div class="summary-item">
                        <i class="fas fa-car"></i>
                        <span>${activity.details.vehicleMake} ${activity.details.vehicleModel} (${activity.details.vehicleYear})</span>
                    </div>
                    <div class="summary-item">
                        <i class="fas fa-shield-alt"></i>
                        <span>${activity.details.coveragePlan}</span>
                    </div>
                    <div class="summary-item">
                        <i class="fas fa-dollar-sign"></i>
                        <span>${activity.details.vehicleValue}</span>
                    </div>
                </div>
                <div class="activity-actions">
                    <button class="action-btn view-details" onclick="viewQuoteDetails('${activity.reference}')">
                        <i class="fas fa-eye"></i> View Details
                    </button>
                    <button class="action-btn process-quote" onclick="processQuote('${activity.reference}')">
                        <i class="fas fa-cog"></i> Process Quote
                    </button>
                </div>
            </div>
        </div>
    `);
}

// Helper function to get activity icons
function getActivityIcon(type) {
    const icons = {
        new_quote: '📝',
        status_change: '🔄',
        payment: '💰',
        claim: '🚗',
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

    $('#exportDataBtn').on('click', function() {
        showNotification('Preparing data export...');
        exportQuoteData();
    });

    // Sign out button
    $('.sign-out-btn').on('click', function() {
        if(confirm('Are you sure you want to sign out?')) {
            showNotification('Signing out...');
            window.location.href = '/signin/signin.html';
        }
    });

    // Activity filters
    $('#activityFilter, #activitySort').on('change', function() {
        updateActivityList();
    });

    // Add sort change listener
    $('#activitySort').on('change', function() {
        updateStatistics();
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

// Enhanced sorting function
function sortActivities(activities, sortValue) {
    return activities.sort((a, b) => {
        switch(sortValue) {
            case 'newest':
                return new Date(b.timestamp) - new Date(a.timestamp);
            case 'oldest':
                return new Date(a.timestamp) - new Date(b.timestamp);
            case 'priority':
                const priorityOrder = { high: 3, medium: 2, low: 1 };
                return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
            case 'value':
                const getValue = (str) => {
                    const match = str.match(/[\d,]+/);
                    return match ? parseInt(match[0].replace(/,/g, '')) : 0;
                };
                return getValue(b.details.vehicleValue) - getValue(a.details.vehicleValue);
            default:
                return new Date(b.timestamp) - new Date(a.timestamp);
        }
    });
}

// Function to handle processing quote
function processQuote(quoteId) {
    // Store the quote ID in localStorage for access in recordsList
    localStorage.setItem('processingQuoteId', quoteId);
    // Redirect to recordsList.html
    window.location.href = 'recordsList.html';
}

// Function to view quote details
function viewQuoteDetails(quoteId) {
    const quote = activities.find(a => a.reference === quoteId);
    if (quote) {
        showQuoteDetailsModal(quote);
        
        // Add animation to show each section
        setTimeout(() => {
            $('.details-section').each(function(index) {
                $(this).delay(index * 100).fadeIn(300);
            });
        }, 100);
    }
}

// Add this function to close the modal
function closeModal(modalId) {
    $(`#${modalId}`).fadeOut(300, function() {
        $(this).remove();
    });
}

// Add the showQuoteDetailsModal function
function showQuoteDetailsModal(quote) {
    const modalHtml = `
        <div class="modal" id="quoteDetailsModal">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Quote Details #${quote.reference}</h3>
                        <button type="button" class="close-modal" onclick="closeModal('quoteDetailsModal')">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="details-section">
                            <h4><i class="fas fa-car"></i> Vehicle Information</h4>
                            <table class="details-table">
                                <tr>
                                    <td class="label">Make & Model</td>
                                    <td class="value">${quote.details.vehicleMake} ${quote.details.vehicleModel}</td>
                                    <td class="label">Year</td>
                                    <td class="value">${quote.details.vehicleYear}</td>
                                </tr>
                                <tr>
                                    <td class="label">Coverage Plan</td>
                                    <td class="value">${quote.details.coveragePlan}</td>
                                    <td class="label">Vehicle Value</td>
                                    <td class="value">${quote.details.vehicleValue}</td>
                                </tr>
                            </table>
                        </div>

                        <div class="details-section">
                            <h4><i class="fas fa-user"></i> Customer Information</h4>
                            <table class="details-table">
                                <tr>
                                    <td class="label">Full Name</td>
                                    <td class="value">${quote.details.fullName}</td>
                                    <td class="label">Email</td>
                                    <td class="value">${quote.details.email}</td>
                                </tr>
                                <tr>
                                    <td class="label">Phone Number</td>
                                    <td class="value">${quote.details.phoneNumber}</td>
                                    <td class="label">Status</td>
                                    <td class="value"><span class="status-badge status-${quote.status}">${quote.status.toUpperCase()}</span></td>
                                </tr>
                            </table>
                        </div>

                        <div class="details-section">
                            <h4><i class="fas fa-clock"></i> Timeline</h4>
                            <table class="details-table">
                                <tr>
                                    <td class="label">Submission Date</td>
                                    <td class="value">${formatTimestamp(quote.timestamp)}</td>
                                    <td class="label">Priority</td>
                                    <td class="value">${quote.priority.toUpperCase()}</td>
                                </tr>
                            </table>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" onclick="closeModal('quoteDetailsModal')">Close</button>
                        <button class="btn btn-primary" onclick="processQuote('${quote.reference}')">Process Quote</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Add modal to body and show it
    $('body').append(modalHtml);
    $('#quoteDetailsModal').fadeIn(300);
}

// Add new export function
function exportQuoteData() {
    try {
        // Convert quotes data to CSV format
        let csvContent = "data:text/csv;charset=utf-8,";
        
        // Add headers
        csvContent += "Reference,Customer Name,Date,Status,Vehicle Details,Coverage Type\n";
        
        // Add data rows
        quotes.forEach(quote => {
            const row = [
                quote.referenceNumber,
                quote.customerName,
                quote.date,
                quote.status,
                quote.vehicleDetails,
                quote.coverageType
            ].join(",");
            csvContent += row + "\n";
        });

        // Create download link
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `insurance_quotes_${new Date().toISOString().split('T')[0]}.csv`);
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        showNotification('Export completed successfully!');
    } catch (error) {
        console.error('Export failed:', error);
        showNotification('Export failed. Please try again.');
    }
}

// Add this new function
function checkNewQuotations() {
    // Simulate checking for new quotations
    const pendingQuotes = quotes.filter(q => q.status === 'pending').length;
    
    if (pendingQuotes > 0) {
        const notification = {
            title: 'New Quotations',
            message: `You have ${pendingQuotes} new quotation${pendingQuotes > 1 ? 's' : ''} pending review`,
            type: 'info'
        };
        
        showEnhancedNotification(notification);
    }
}

// Add enhanced notification function
function showEnhancedNotification(notification) {
    // Remove existing notification if present
    $('.enhanced-notification').remove();
    
    const notificationHtml = `
        <div class="enhanced-notification fade-in">
            <div class="notification-content">
                <div class="notification-title">${notification.title}</div>
                <div class="notification-message">${notification.message}</div>
            </div>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    $('body').append(notificationHtml);
    
    // Add event listener for close button
    $('.notification-close').on('click', function() {
        $('.enhanced-notification').fadeOut(300, function() {
            $(this).remove();
        });
    });
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        $('.enhanced-notification').fadeOut(300, function() {
            $(this).remove();
        });
    }, 5000);
}
