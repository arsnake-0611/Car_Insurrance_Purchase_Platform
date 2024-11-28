$(document).ready(function() {
    // Sample data for demonstration
    let quotations = [
        {
            reference: "QT202403001",
            vehicle: "Toyota Camry",
            approvalDate: "2024-03-15",
            coverage: "Comprehensive Coverage",
            status: "approved",
            customerName: "John Doe",
            email: "john@example.com",
            phoneNumber: "12345678",
            vehicleDetails: {
                make: "Toyota",
                model: "Camry",
                year: "2023",
                bodyType: "Sedan",
                seatingCapacity: "5",
                cylinderCapacity: "2500"
            }
        },
        {
            reference: "QT202403002",
            vehicle: "BMW 3 Series",
            approvalDate: "2024-03-14",
            coverage: "Third-Party Coverage",
            status: "pending",
            customerName: "Jane Smith",
            email: "jane@example.com",
            phoneNumber: "87654321",
            vehicleDetails: {
                make: "BMW",
                model: "3 Series",
                year: "2024",
                bodyType: "Sedan",
                seatingCapacity: "5",
                cylinderCapacity: "2000"
            }
        }
    ];

    // Sidebar Toggle
    $('#sidebarToggle').click(function() {
        $('.sidebar').toggleClass('collapsed');
        $('.main-content').toggleClass('expanded');
        
        // Animate hamburger menu
        $(this).toggleClass('active');
    });

    // Hover effect for sidebar items
    $('.menu-item').hover(
        function() {
            $(this).find('.menu-text').stop().animate({opacity: 0.7}, 200);
        },
        function() {
            $(this).find('.menu-text').stop().animate({opacity: 1}, 200);
        }
    );

    // Show notification function
    function showNotification(message, type = 'success') {
        const notification = $('#notification');
        notification.text(message)
            .removeClass()
            .addClass(`notification ${type}`)
            .fadeIn();
        
        setTimeout(() => notification.fadeOut(), 3000);
    }

    // Update quotes table
    function updateQuotesTable(filteredQuotes = quotations) {
        const tbody = $('#quoteList');
        tbody.empty();

        filteredQuotes.forEach(quote => {
            const row = `
                <tr>
                    <td>${quote.reference}</td>
                    <td>${quote.vehicle}</td>
                    <td>${quote.approvalDate}</td>
                    <td>${quote.coverage}</td>
                    <td><span class="status-badge status-${quote.status.toLowerCase()}">${quote.status}</span></td>
                    <td>
                        <button class="btn-view" onclick="viewDetails('${quote.reference}')">View Details</button>
                        <button class="btn-chat" onclick="openChat('${quote.reference}')">Chat</button>
                    </td>
                </tr>
            `;
            tbody.append(row);
        });
    }

    // Filter functions
    function applyFilters() {
        let filtered = [...quotations];

        // Date filter
        const dateFilter = $('#dateFilter').val();
        if (dateFilter) {
            const now = new Date();
            const filterDate = new Date();
            
            switch(dateFilter) {
                case '24h':
                    filterDate.setHours(filterDate.getHours() - 24);
                    break;
                case '7d':
                    filterDate.setDate(filterDate.getDate() - 7);
                    break;
                case '1m':
                    filterDate.setMonth(filterDate.getMonth() - 1);
                    break;
            }
            
            filtered = filtered.filter(quote => 
                new Date(quote.approvalDate) >= filterDate
            );
        }

        // Status filter
        const statusFilter = $('#statusFilter').val();
        if (statusFilter) {
            filtered = filtered.filter(quote => 
                quote.status.toLowerCase() === statusFilter
            );
        }

        // Coverage filter
        const coverageFilter = $('#coverageFilter').val();
        if (coverageFilter) {
            filtered = filtered.filter(quote => 
                quote.coverage.toLowerCase().includes(coverageFilter.toLowerCase())
            );
        }

        updateQuotesTable(filtered);
    }

    // Search function
    $('.search-bar input').on('input', function() {
        const searchTerm = $(this).val().toLowerCase();
        const filtered = quotations.filter(quote =>
            quote.reference.toLowerCase().includes(searchTerm) ||
            quote.vehicle.toLowerCase().includes(searchTerm) ||
            quote.customerName.toLowerCase().includes(searchTerm)
        );
        updateQuotesTable(filtered);
    });

    // Filter change events
    $('#dateFilter, #statusFilter, #coverageFilter').change(applyFilters);

    // View Details Modal
    window.viewDetails = function(reference) {
        const quote = quotations.find(q => q.reference === reference);
        if (!quote) return;

        const modalContent = `
            <div class="modal-content">
                <h2>Quotation Details</h2>
                <div class="details-grid">
                    <div class="detail-group">
                        <h3>Customer Information</h3>
                        <p><strong>Name:</strong> ${quote.customerName}</p>
                        <p><strong>Email:</strong> ${quote.email}</p>
                        <p><strong>Phone:</strong> ${quote.phoneNumber}</p>
                    </div>
                    <div class="detail-group">
                        <h3>Vehicle Information</h3>
                        <p><strong>Make:</strong> ${quote.vehicleDetails.make}</p>
                        <p><strong>Model:</strong> ${quote.vehicleDetails.model}</p>
                        <p><strong>Year:</strong> ${quote.vehicleDetails.year}</p>
                        <p><strong>Body Type:</strong> ${quote.vehicleDetails.bodyType}</p>
                        <p><strong>Seating Capacity:</strong> ${quote.vehicleDetails.seatingCapacity}</p>
                        <p><strong>Cylinder Capacity:</strong> ${quote.vehicleDetails.cylinderCapacity} CC</p>
                    </div>
                </div>
                <div class="modal-actions">
                    <button onclick="closeModal('viewDetailsModal')" class="btn-secondary">Close</button>
                    <button onclick="updateQuotation('${reference}')" class="btn-primary">Update</button>
                </div>
            </div>
        `;

        $('#viewDetailsModal').html(modalContent).addClass('show');
    };

    // Chat Modal
    window.openChat = function(reference) {
        const modalContent = `
            <div class="modal-content chat-modal">
                <h2>Chat - ${reference}</h2>
                <div class="chat-container">
                    <div class="chat-messages">
                        <!-- Chat messages will be populated here -->
                    </div>
                    <div class="chat-input">
                        <input type="text" placeholder="Type your message...">
                        <button class="btn-send">Send</button>
                    </div>
                </div>
                <button onclick="closeModal('chatModal')" class="btn-close">Close</button>
            </div>
        `;

        $('#chatModal').html(modalContent).addClass('show');
    };

    // Close modal function
    window.closeModal = function(modalId) {
        $(`#${modalId}`).removeClass('show');
    };

    // Initial table population
    updateQuotesTable();

    // Close modals when clicking outside
    $(window).click(function(event) {
        if ($(event.target).hasClass('modal')) {
            $('.modal').removeClass('show');
        }
    });

    // Prevent modal close when clicking inside modal content
    $('.modal-content').click(function(event) {
        event.stopPropagation();
    });
});