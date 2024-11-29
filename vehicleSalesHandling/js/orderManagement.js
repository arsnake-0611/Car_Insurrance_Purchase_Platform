$(document).ready(function() {
    // Enhanced sample order data with tracking and processing info
    const orders = [
        {
            id: "LM2024001",
            customer: "Chris Wong",
            vehicle: "2024 Audi A8 L",
            date: "2024-03-15",
            amount: "$45,000",
            status: "processing",
            tracking: {
                stage: "processing",
                steps: [
                    { name: "Order Placed", completed: true, date: "2024-03-15" },
                    { name: "Payment Confirmed", completed: true, date: "2024-03-15" },
                    { name: "Processing", completed: false, date: null },
                    { name: "Vehicle Preparation", completed: false, date: null },
                    { name: "Ready for Delivery", completed: false, date: null }
                ]
            }
        },
        {
            id: "LM2023089",
            customer: "Jane Smith",
            vehicle: "2023 Porsche 911 Carrera S",
            date: "2024-03-14",
            amount: "$55,000",
            status: "completed",
            tracking: {
                stage: "completed",
                steps: [
                    { name: "Order Placed", completed: true, date: "2024-03-14" },
                    { name: "Payment Confirmed", completed: false, date: null },
                    { name: "Processing", completed: false, date: null },
                    { name: "Vehicle Preparation", completed: false, date: null },
                    { name: "Ready for Delivery", completed: false, date: null }
                ]
            }
        },
        {
            id: "LM20230023",
            customer: "Mike Johnson",
            vehicle: "2024 BMW M4 Competition",
            date: "2024-03-13",
            amount: "$65,000",
            status: "cancelled",
            tracking: {
                stage: "cancelled",
                steps: [
                    { name: "Order Placed", completed: true, date: "2024-03-13" },
                    { name: "Payment Confirmed", completed: false, date: null },
                    { name: "Processing", completed: false, date: null },
                    { name: "Vehicle Preparation", completed: false, date: null },
                    { name: "Ready for Delivery", completed: false, date: null }
                ]
            }
        }
    ];

    // Enhanced render function with tracking info
    function renderOrders() {
        const ordersHTML = orders.map((order, index) => `
            <div class="order-row" style="animation: fadeIn 0.3s ease forwards ${index * 0.1}s">
                <div class="order-id">
                    <span>${order.id}</span>
                </div>
                <div class="customer-name">${order.customer}</div>
                <div class="vehicle-info">${order.vehicle}</div>
                <div class="order-date hide-on-mobile">${formatDate(order.date)}</div>
                <div class="order-amount hide-on-mobile">${order.amount}</div>
                <div class="order-actions">
                    <span class="status-badge status-${order.status}">
                        ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                    <div class="action-buttons-group">
                        <button class="btn-track" data-order-id="${order.id}">
                            <img style="width: 20px; height: 20px;" src="./icon/truck-fast-black.png" alt="Track">
                        </button>
                        <button class="btn-action" data-order-id="${order.id}">
                            <img style="width: 20px; height: 20px;" src="./icon/circle-info-black.png" alt="More">
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        $('.orders-table').html(`
            <div class="table-header">
                <div>Order ID</div>
                <div>Customer</div>
                <div>Vehicle</div>
                <div class="hide-on-mobile">Date</div>
                <div class="hide-on-mobile">Amount</div>
                <div>Status & Actions</div>
            </div>
            ${ordersHTML}
        `);

        // Add event listeners after rendering
        setupEventListeners();
    }

    // Setup event listeners
    function setupEventListeners() {
        // Track button click handler
        $('.btn-track').click(function() {
            const orderId = $(this).data('order-id');
            showTrackingModal(orderId);
        });

        // More actions button click handler
        $('.btn-action').click(function(e) {
            e.stopPropagation(); // Prevent document click from firing immediately
            const orderId = $(this).data('order-id');
            showOrderActions(orderId, e);
        });
    }

    // Show tracking modal
    function showTrackingModal(orderId) {
        const order = orders.find(o => o.id === orderId);
        if (!order) return;

        const modalOverlay = $('<div class="modal-overlay"></div>');
        const trackingHTML = `
            <div class="tracking-modal">
                <div class="modal-header">
                    <h3>Order Tracking - ${orderId}</h3>
                    <button class="btn-close">×</button>
                </div>
                <div class="tracking-timeline">
                    ${order.tracking.steps.map(step => `
                        <div class="tracking-step ${step.completed ? 'completed' : ''}">
                            <div class="step-indicator"></div>
                            <div class="step-content">
                                <h4>${step.name}</h4>
                                ${step.completed ? `<p>${formatDate(step.date)}</p>` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        modalOverlay.html(trackingHTML);
        $('body').append(modalOverlay);

        // Close modal handlers
        modalOverlay.find('.btn-close').click(() => modalOverlay.remove());
        modalOverlay.click(function(e) {
            if (e.target === this) modalOverlay.remove();
        });
    }

    // Show order details
    function showOrderDetails(orderId, event) {
        const order = orders.find(o => o.id === orderId);
        if (!order) return;

        // Remove any existing menus
        $('.order-actions-menu').remove();

        const detailsHTML = `
            <div class="order-actions-menu">
                <button data-action="view">View Full Details</button>
                <button data-action="process">Process Order</button>
                <button data-action="update">Update Status</button>
                <button data-action="invoice">Generate Invoice</button>
            </div>
        `;

        const $menu = $(detailsHTML);
        const buttonPos = $(event.target).closest('.btn-action').offset();
        
        $menu.css({
            top: buttonPos.top + 30,
            left: buttonPos.left - 150
        });

        // Add menu to body
        $('body').append($menu);

        // Setup action handlers
        $menu.find('button').click(function() {
            const action = $(this).data('action');
            handleOrderAction(action, order);
            $menu.remove();
        });

        // Close menu when clicking outside
        $(document).one('click', function() {
            $menu.remove();
        });
    }

    // Handle order actions
    function handleOrderAction(action, order) {
        switch(action) {
            case 'view':
                showFullDetails(order);
                break;
            case 'process':
                showProcessingModal(order);
                break;
            case 'cancel':
                showCancelConfirmation(order);
                break;
            case 'invoice':
                generateInvoice(order);
                break;
        }
    }

    // Show full order details modal
    function showFullDetails(order) {
        const modalOverlay = $('<div class="modal-overlay"></div>');
        const detailsHTML = `
            <div class="details-modal">
                <div class="modal-header">
                    <h3>Order Details - ${order.id}</h3>
                    <button class="btn-close">×</button>
                </div>
                <div class="details-content">
                    <div class="detail-row">
                        <span class="detail-label">Customer:</span>
                        <span class="detail-value">${order.customer}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Vehicle:</span>
                        <span class="detail-value">${order.vehicle}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Date:</span>
                        <span class="detail-value">${formatDate(order.date)}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Amount:</span>
                        <span class="detail-value">${order.amount}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Status:</span>
                        <span class="status-badge status-${order.status}">
                            ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                    </div>
                </div>
            </div>
        `;

        modalOverlay.html(detailsHTML);
        $('body').append(modalOverlay);

        // Close modal handlers
        modalOverlay.find('.btn-close').click(() => modalOverlay.remove());
        modalOverlay.click(function(e) {
            if (e.target === this) modalOverlay.remove();
        });
    }

    // Format date function
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }

    // Enhanced search functionality with debounce
    let searchTimeout;
    $('#searchInput').on('input', function() {
        clearTimeout(searchTimeout);
        const searchTerm = $(this).val().toLowerCase();
        
        searchTimeout = setTimeout(() => {
            $('.order-row').each(function() {
                const text = $(this).text().toLowerCase();
                $(this).toggle(text.includes(searchTerm));
            });
        }, 300);
    });

    // Filter button click handler
    $('.btn-outline').click(function() {
        // Implement filter functionality
        console.log('Filter clicked');
    });

    // Initialize
    renderOrders();

    // Add keypress handler for search
    $('#searchInput').keypress(function(e) {
        if(e.which == 13) {
            e.preventDefault();
            // Implement search submit functionality
        }
    });

    // Order Processing Functions
    function processOrder(orderId) {
        const order = orders.find(o => o.id === orderId);
        if (!order) return;

        // Show processing modal
        const processingHTML = `
            <div class="processing-modal">
                <h3>Process Order - ${orderId}</h3>
                <div class="processing-steps">
                    <div class="step">
                        <label>
                            <input type="checkbox" ${order.tracking.steps[0].completed ? 'checked' : ''}>
                            Verify Order Details
                        </label>
                    </div>
                    <div class="step">
                        <label>
                            <input type="checkbox" ${order.tracking.steps[1].completed ? 'checked' : ''}>
                            Confirm Payment
                        </label>
                    </div>
                    <!-- Add more processing steps -->
                </div>
                <div class="processing-actions">
                    <button onclick="saveProcessing('${orderId}')">Save Progress</button>
                    <button onclick="closeProcessingModal()">Cancel</button>
                </div>
            </div>
        `;

        $('body').append(processingHTML);
    }

    // Show order actions menu
    function showOrderActions(orderId, event) {
        const order = orders.find(o => o.id === orderId);
        if (!order) return;

        // Remove any existing menus
        $('.order-actions-menu, .actions-backdrop').remove();

        const actionsHTML = `
            <div class="actions-backdrop"></div>
            <div class="order-actions-menu">
                <button data-action="view">
                    <img src="./icon/eye-black.png" alt="View">
                    View Full Details
                </button>
                <button data-action="process" ${order.status === 'cancelled' ? 'disabled' : ''}>
                    <img src="./icon/sort-black.png" alt="Process">
                    Process Order
                </button>
                <button data-action="cancel" ${order.status === 'cancelled' ? 'disabled' : ''}>
                    <img src="./icon/ban-black.png" alt="Cancel">
                    Cancel Order
                </button>
                <button data-action="invoice">
                    <img src="./icon/file-pdf-black.png" alt="Invoice">
                    Generate Invoice
                </button>
            </div>
        `;

        $('body').append(actionsHTML);

        // Position menu for desktop
        if (window.innerWidth > 768) {
            const $button = $(event.currentTarget);
            const buttonPos = $button.offset();
            const $menu = $('.order-actions-menu');
            
            // Position menu below the button
            $menu.css({
                top: buttonPos.top + $button.outerHeight() + 5,
                left: buttonPos.left - ($menu.width() - $button.outerWidth())
            });

            // Close menu when clicking outside
            $(document).one('click', function(e) {
                if (!$(e.target).closest('.order-actions-menu').length) {
                    $('.order-actions-menu, .actions-backdrop').remove();
                }
            });
        }

        // Handle backdrop click (mobile)
        $('.actions-backdrop').click(function() {
            $('.order-actions-menu, .actions-backdrop').remove();
        });

        // Setup action handlers
        $('.order-actions-menu button').click(function(e) {
            e.stopPropagation();
            const action = $(this).data('action');
            handleOrderAction(action, order);
            $('.order-actions-menu, .actions-backdrop').remove();
        });
    }

    // Add the showProcessingModal function
    function showProcessingModal(order) {
        const modalOverlay = $('<div class="modal-overlay"></div>');
        const processingHTML = `
            <div class="processing-modal">
                <div class="modal-header">
                    <h3>Process Order - ${order.id}</h3>
                    <button class="btn-close">×</button>
                </div>
                <div class="processing-steps">
                    ${order.tracking.steps.map((step, index) => `
                        <div class="processing-step">
                            <label class="step-label">
                                <input type="checkbox" 
                                    data-step="${index}" 
                                    ${step.completed ? 'checked' : ''} 
                                    ${step.completed && index > 0 && !order.tracking.steps[index-1].completed ? 'disabled' : ''}>
                                <span class="step-name">${step.name}</span>
                                ${step.completed ? 
                                    `<span class="step-date">${formatDate(step.date)}</span>` : 
                                    ''}
                            </label>
                        </div>
                    `).join('')}
                </div>
                <div class="processing-actions">
                    <button class="btn btn-primary save-progress">Save Progress</button>
                    <button class="btn btn-outline cancel-process">Cancel</button>
                </div>
            </div>
        `;

        modalOverlay.html(processingHTML);
        $('body').append(modalOverlay);

        // Handle checkbox changes
        modalOverlay.find('input[type="checkbox"]').change(function() {
            const stepIndex = $(this).data('step');
            const isChecked = $(this).prop('checked');
            
            // Update subsequent checkboxes
            if (!isChecked) {
                modalOverlay.find(`input[type="checkbox"]`).each(function() {
                    if ($(this).data('step') > stepIndex) {
                        $(this).prop('checked', false).prop('disabled', true);
                    }
                });
            } else {
                modalOverlay.find(`input[type="checkbox"]`).each(function() {
                    if ($(this).data('step') === stepIndex + 1) {
                        $(this).prop('disabled', false);
                    }
                });
            }
        });

        // Save progress handler
        modalOverlay.find('.save-progress').click(function() {
            const updatedSteps = order.tracking.steps.map((step, index) => {
                const isChecked = modalOverlay.find(`input[data-step="${index}"]`).prop('checked');
                return {
                    ...step,
                    completed: isChecked,
                    date: isChecked ? (step.date || new Date().toISOString().split('T')[0]) : null
                };
            });

            // Update order status based on steps
            const allCompleted = updatedSteps.every(step => step.completed);
            const anyCompleted = updatedSteps.some(step => step.completed);
            
            if (allCompleted) {
                order.status = 'completed';
            } else if (anyCompleted) {
                order.status = 'processing';
            }

            // Update order
            order.tracking.steps = updatedSteps;
            
            // Re-render orders
            renderOrders();
            modalOverlay.remove();
        });

        // Close modal handlers
        modalOverlay.find('.btn-close, .cancel-process').click(() => modalOverlay.remove());
        modalOverlay.click(function(e) {
            if (e.target === this) modalOverlay.remove();
        });
    }

    // Add showCancelConfirmation function
    function showCancelConfirmation(order) {
        const modalOverlay = $('<div class="modal-overlay"></div>');
        const confirmationHTML = `
            <div class="confirmation-modal">
                <h3>Cancel Order</h3>
                <p>Are you sure you want to cancel order ${order.id}? This action cannot be undone.</p>
                <div class="confirmation-actions">
                    <button class="btn btn-danger confirm-cancel">Yes, Cancel Order</button>
                    <button class="btn btn-outline cancel-action">No, Keep Order</button>
                </div>
            </div>
        `;

        modalOverlay.html(confirmationHTML);
        $('body').append(modalOverlay);

        // Handle cancel confirmation
        modalOverlay.find('.confirm-cancel').click(function() {
            order.status = 'cancelled';
            order.tracking.stage = 'cancelled';
            renderOrders();
            modalOverlay.remove();
        });

        // Handle cancel action
        modalOverlay.find('.cancel-action').click(() => modalOverlay.remove());
        modalOverlay.click(function(e) {
            if (e.target === this) modalOverlay.remove();
        });
    }

    // Add filter functionality
    function setupFilterMenu() {
        $('.btn-outline').click(function(e) {
            // Create and show filter modal
            const modalOverlay = $('<div class="modal-overlay"></div>');
            const filterHTML = `
                <div class="filter-modal">
                    <div class="modal-header">
                        <h3>Filter Orders</h3>
                        <button class="btn-close">×</button>
                    </div>
                    <div class="filter-content">
                        <div class="filter-group">
                            <label>Status</label>
                            <div class="checkbox-group">
                                <label><input type="checkbox" value="processing"> Processing</label>
                                <label><input type="checkbox" value="completed"> Completed</label>
                                <label><input type="checkbox" value="cancelled"> Cancelled</label>
                            </div>
                        </div>
                        <div class="filter-group">
                            <label>Date Range</label>
                            <div class="date-inputs">
                                <input type="date" id="dateFrom" placeholder="From">
                                <input type="date" id="dateTo" placeholder="To">
                            </div>
                        </div>
                        <div class="filter-group">
                            <label>Amount Range</label>
                            <div class="amount-inputs">
                                <input type="number" id="amountFrom" placeholder="Min Amount">
                                <input type="number" id="amountTo" placeholder="Max Amount">
                            </div>
                        </div>
                    </div>
                    <div class="filter-actions">
                        <button class="btn btn-outline" id="resetFilters">Reset</button>
                        <button class="btn btn-primary" id="applyFilters">Apply Filters</button>
                    </div>
                </div>
            `;

            modalOverlay.html(filterHTML);
            $('body').append(modalOverlay);

            // Handle filter application
            $('#applyFilters').click(function() {
                const filters = {
                    status: $('.checkbox-group input:checked').map(function() {
                        return $(this).val();
                    }).get(),
                    dateFrom: $('#dateFrom').val(),
                    dateTo: $('#dateTo').val(),
                    amountFrom: $('#amountFrom').val(),
                    amountTo: $('#amountTo').val()
                };

                // Apply filters to orders
                const filteredOrders = orders.filter(order => {
                    // Status filter
                    if (filters.status.length && !filters.status.includes(order.status)) {
                        return false;
                    }

                    // Date filter
                    const orderDate = new Date(order.date);
                    if (filters.dateFrom && new Date(filters.dateFrom) > orderDate) {
                        return false;
                    }
                    if (filters.dateTo && new Date(filters.dateTo) < orderDate) {
                        return false;
                    }

                    // Amount filter
                    const orderAmount = parseFloat(order.amount.replace(/[$,]/g, ''));
                    if (filters.amountFrom && parseFloat(filters.amountFrom) > orderAmount) {
                        return false;
                    }
                    if (filters.amountTo && parseFloat(filters.amountTo) < orderAmount) {
                        return false;
                    }

                    return true;
                });

                // Update display with filtered orders
                renderFilteredOrders(filteredOrders);
                modalOverlay.remove();
            });

            // Handle filter reset
            $('#resetFilters').click(function() {
                renderOrders(); // Reset to show all orders
                modalOverlay.remove();
            });

            // Close modal handlers
            modalOverlay.find('.btn-close').click(() => modalOverlay.remove());
            modalOverlay.click(function(e) {
                if (e.target === this) modalOverlay.remove();
            });
        });
    }

    // Add this helper function to render filtered orders
    function renderFilteredOrders(filteredOrders) {
        const ordersHTML = filteredOrders.map((order, index) => `
            <div class="order-row" style="animation: fadeIn 0.3s ease forwards ${index * 0.1}s">
                <div class="order-id">
                    <span>${order.id}</span>
                </div>
                <div class="customer-name">${order.customer}</div>
                <div class="vehicle-info">${order.vehicle}</div>
                <div class="order-date hide-on-mobile">${formatDate(order.date)}</div>
                <div class="order-amount hide-on-mobile">${order.amount}</div>
                <div class="order-actions">
                    <span class="status-badge status-${order.status}">
                        ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                    <div class="action-buttons-group">
                        <button class="btn-track" data-order-id="${order.id}">
                            <img style="width: 20px; height: 20px;" src="./icon/truck-fast-black.png" alt="Track">
                        </button>
                        <button class="btn-action" data-order-id="${order.id}">
                            <img style="width: 20px; height: 20px;" src="./icon/circle-info-black.png" alt="More">
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        $('.orders-table').html(`
            <div class="table-header">
                <div>Order ID</div>
                <div>Customer</div>
                <div>Vehicle</div>
                <div class="hide-on-mobile">Date</div>
                <div class="hide-on-mobile">Amount</div>
                <div>Status & Actions</div>
            </div>
            ${ordersHTML}
        `);

        // Reinitialize event listeners for the filtered results
        setupEventListeners();
    }

    // Add this to your initialization
    $(document).ready(function() {
        // ... existing initialization code ...
        setupFilterMenu();
    });

    // Add this function to handle new orders
    function showNewOrderModal() {
        const modalOverlay = $('<div class="modal-overlay"></div>');
        const modalHTML = `
            <div class="new-order-modal">
                <div class="modal-header">
                    <h3>Create New Order</h3>
                    <button class="btn-close">×</button>
                </div>
                <div class="new-order-content">
                    <form id="newOrderForm">
                        <div class="form-group">
                            <label>Customer Name *</label>
                            <input type="text" name="customer" required>
                        </div>
                        <div class="form-group">
                            <label>Vehicle Model *</label>
                            <input type="text" name="vehicle" required>
                        </div>
                        <div class="form-group">
                            <label>Amount (USD) *</label>
                            <input type="number" name="amount" required min="0" step="1000">
                        </div>
                        <div class="form-group">
                            <label>Additional Notes</label>
                            <textarea name="notes" rows="3"></textarea>
                        </div>
                        <div class="form-actions">
                            <button type="button" class="btn btn-outline cancel-order">Cancel</button>
                            <button type="submit" class="btn btn-primary">Create Order</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        modalOverlay.html(modalHTML);
        $('body').append(modalOverlay);

        // Form submission handler
        $('#newOrderForm').submit(function(e) {
            e.preventDefault();
            
            const formData = {
                id: generateOrderId(),
                customer: $(this).find('[name="customer"]').val(),
                vehicle: $(this).find('[name="vehicle"]').val(),
                amount: formatAmount($(this).find('[name="amount"]').val()),
                date: new Date().toISOString().split('T')[0],
                status: 'processing',
                notes: $(this).find('[name="notes"]').val(),
                tracking: {
                    stage: 'processing',
                    steps: [
                        { name: "Order Placed", completed: true, date: new Date().toISOString().split('T')[0] },
                        { name: "Payment Confirmed", completed: false, date: null },
                        { name: "Processing", completed: false, date: null },
                        { name: "Vehicle Preparation", completed: false, date: null },
                        { name: "Ready for Delivery", completed: false, date: null }
                    ]
                }
            };

            // Add new order to the orders array
            orders.push(formData);
            
            // Re-render orders table
            renderOrders();
            
            // Close modal
            modalOverlay.remove();
            
            // Show success notification
            showNotification('New order created successfully', 'success');
        });

        // Prevent modal content clicks from bubbling to overlay
        $('.new-order-modal').on('click', function(e) {
            e.stopPropagation();
        });

        // Close modal handlers
        modalOverlay.find('.btn-close, .cancel-order').on('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            modalOverlay.remove();
        });

        // Close on overlay click
        modalOverlay.on('click', function(e) {
            if ($(e.target).is(modalOverlay)) {
                modalOverlay.remove();
            }
        });
    }

    // Helper functions
    function generateOrderId() {
        const year = new Date().getFullYear();
        const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        return `LM${year}${randomNum}`;
    }

    function formatAmount(amount) {
        return `$${parseInt(amount).toLocaleString()}`;
    }

    function showNotification(message, type = 'success') {
        const notification = $(`
            <div class="notification notification-${type}">
                ${message}
            </div>
        `);
        $('body').append(notification);
        
        setTimeout(() => {
            notification.fadeOut(() => notification.remove());
        }, 3000);
    }

    // Update the click handler for the new order button
    $('.btn-primary').click(function() {
        showNewOrderModal();
    });

    // Update the generateInvoice function
    function generateInvoice(order) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Company Logo and Info
        doc.setFontSize(20);
        doc.text('Legend Motors', 20, 20);
        
        doc.setFontSize(10);
        doc.text('123 Luxury Lane', 20, 30);
        doc.text('Beverly Hills, CA 90210', 20, 35);
        doc.text('Tel: (310) 555-0123', 20, 40);
        doc.text('Email: sales@LegendMotor.com', 20, 45);
        
        // Invoice Details
        doc.setFontSize(12);
        doc.text(`Invoice #: ${order.id}`, 140, 30);
        doc.text(`Date: ${order.date}`, 140, 35);
        
        // Customer Information
        doc.setFontSize(12);
        doc.text('Bill To:', 20, 60);
        doc.setFontSize(10);
        doc.text(order.customer, 20, 65);
        
        // Order Details Table
        const tableData = [
            ['Description', 'Amount'],
            [order.vehicle, order.amount]
        ];
        
        doc.autoTable({
            startY: 80,
            head: [['Description', 'Amount']],
            body: [[order.vehicle, order.amount]],
            theme: 'grid',
            headStyles: { fillColor: [45, 67, 86] }, // Matching your primary color
            styles: { fontSize: 10 }
        });
        
        // Payment Terms and Notes
        const finalY = doc.previousAutoTable.finalY + 20;
        doc.setFontSize(10);
        doc.text('Payment Terms:', 20, finalY);
        doc.text('Due within 30 days of invoice date', 20, finalY + 5);
        
        if (order.notes) {
            doc.text('Notes:', 20, finalY + 15);
            doc.text(order.notes, 20, finalY + 20);
        }
        
        // Footer
        doc.setFontSize(8);
        doc.text('Thank you for your business!', 20, doc.internal.pageSize.height - 20);
        
        // Instead of directly saving, create a preview modal
        const modalOverlay = $('<div class="modal-overlay"></div>');
        const modalHTML = `
            <div class="invoice-preview-modal">
                <div class="modal-header">
                    <h3>Invoice Preview</h3>
                    <button class="btn-close">×</button>
                </div>
                <div class="invoice-preview-content">
                    <iframe class="pdf-preview"></iframe>
                </div>
                <div class="invoice-actions">
                    <button class="btn btn-primary download-invoice">Download Invoice</button>
                    <button class="btn btn-outline cancel-preview">Cancel</button>
                </div>
            </div>
        `;

        modalOverlay.html(modalHTML);
        $('body').append(modalOverlay);

        // Convert PDF to data URL and show in iframe
        const pdfDataUri = doc.output('datauristring');
        modalOverlay.find('.pdf-preview').attr('src', pdfDataUri);

        // Download handler
        modalOverlay.find('.download-invoice').click(() => {
            doc.save(`Invoice-${order.id}.pdf`);
            modalOverlay.remove();
        });

        // Close modal handlers
        modalOverlay.find('.btn-close, .cancel-preview').click(() => modalOverlay.remove());
        modalOverlay.click(function(e) {
            if (e.target === this) modalOverlay.remove();
        });
    }
});
