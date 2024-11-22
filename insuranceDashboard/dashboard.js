$(document).ready(function() {
    let quotes = [
        {
            id: 1,
            referenceNumber: 'QT2023001',
            vehicleMake: "Toyota",
            vehicleModel: "Camry",
            vehicleYear: 2020,
            bodyType: "Sedan",
            seatingCapacity: 5,
            cylinderCapacity: 2000,
            vehicleValue: 200000,
            fullName: "John Doe",
            email: "john@example.com",
            phoneNumber: "1234567890",
            drivingExperience: 5,
            coveragePlan: "comprehensive",
            paymentMethod: "creditCard",
            status: "pending",
            date: "2023-07-20"
        }
    ];

    function displayQuotes(quotesToShow = quotes) {
        const quoteList = $('#quoteList');
        quoteList.empty();

        quotesToShow.forEach(quote => {
            const quoteCard = $(`
                <div class="dashboard-card">
                    <span class="reference-number">Ref: ${quote.referenceNumber}</span>
                    <div class="card-actions">
                        <button class="btn btn-success btn-sm approve-quote" data-id="${quote.id}">Approve</button>
                        <button class="btn btn-danger btn-sm reject-quote" data-id="${quote.id}">Reject</button>
                    </div>
                    <p>Vehicle: ${quote.vehicleMake} ${quote.vehicleModel}</p>
                    <p>Date: ${quote.date}</p>
                    <span class="status-badge status-${quote.status}">${quote.status.toUpperCase()}</span>
                    <button class="btn btn-secondary btn-sm view-details mt-3" data-id="${quote.id}">View Details</button>
                    
                    <div class="details-section" id="details-${quote.id}" style="display:none">
                        <h6>Vehicle Information</h6>
                        <div class="editable-field">
                            <label>Manufacturing Year:</label>
                            <input type="number" class="edit-field" value="${quote.vehicleYear}" data-field="vehicleYear">
                        </div>
                        <div class="editable-field">
                            <label>Body Type:</label>
                            <input type="text" class="edit-field" value="${quote.bodyType}" data-field="bodyType">
                        </div>
                        <div class="editable-field">
                            <label>Seating Capacity:</label>
                            <input type="number" class="edit-field" value="${quote.seatingCapacity}" data-field="seatingCapacity">
                        </div>
                        <div class="editable-field">
                            <label>Cylinder Capacity:</label>
                            <input type="number" class="edit-field" value="${quote.cylinderCapacity}" data-field="cylinderCapacity">
                        </div>
                        <div class="editable-field">
                            <label>Vehicle Value (HK$):</label>
                            <input type="number" class="edit-field" value="${quote.vehicleValue}" data-field="vehicleValue">
                        </div>
                        
                        <h6>Personal Information</h6>
                        <div class="editable-field">
                            <label>Phone:</label>
                            <input type="tel" class="edit-field" value="${quote.phoneNumber}" data-field="phoneNumber">
                        </div>
                        <div class="editable-field">
                            <label>Email:</label>
                            <input type="email" class="edit-field" value="${quote.email}" data-field="email">
                        </div>
                        <div class="editable-field">
                            <label>Driving Experience:</label>
                            <input type="number" class="edit-field" value="${quote.drivingExperience}" data-field="drivingExperience">
                        </div>
                        
                        <h6>Payment Information</h6>
                        <div class="editable-field">
                            <label>Payment Method:</label>
                            <select class="edit-field" data-field="paymentMethod">
                                <option value="bankTransfer" ${quote.paymentMethod === 'bankTransfer' ? 'selected' : ''}>Bank Transfer</option>
                                <option value="creditCard" ${quote.paymentMethod === 'creditCard' ? 'selected' : ''}>Credit Card</option>
                            </select>
                        </div>
                        
                        <div class="edit-buttons">
                            <button class="btn btn-primary btn-sm save-changes" data-id="${quote.id}">Save Changes</button>
                            <button class="btn btn-secondary btn-sm cancel-changes" data-id="${quote.id}">Cancel</button>
                        </div>
                    </div>
                </div>
            `).hide().fadeIn(500);
            quoteList.append(quoteCard);
        });

        updateStatistics();
    }

    $('#searchQuote').on('input', function() {
        const searchTerm = $(this).val().toLowerCase();
        const filteredQuotes = quotes.filter(quote => 
            quote.fullName.toLowerCase().includes(searchTerm) ||
            quote.vehicleMake.toLowerCase().includes(searchTerm) ||
            quote.vehicleModel.toLowerCase().includes(searchTerm) ||
            quote.email.toLowerCase().includes(searchTerm)
        );
        displayQuotes(filteredQuotes);
    });

    $('#dateFrom, #dateTo, #statusFilter').on('change', function() {
        const dateFrom = $('#dateFrom').val();
        const dateTo = $('#dateTo').val();
        const status = $('#statusFilter').val();
        const searchTerm = $('#searchQuote').val().toLowerCase();
        
        const filteredQuotes = quotes.filter(quote => {
            const matchesSearch = quote.fullName.toLowerCase().includes(searchTerm) ||
                quote.vehicleMake.toLowerCase().includes(searchTerm) ||
                quote.vehicleModel.toLowerCase().includes(searchTerm) ||
                quote.email.toLowerCase().includes(searchTerm);
                
            const matchesStatus = !status || quote.status === status;
            const matchesDate = (!dateFrom || quote.date >= dateFrom) && 
                               (!dateTo || quote.date <= dateTo);
            
            return matchesSearch && matchesStatus && matchesDate;
        });
        
        displayQuotes(filteredQuotes);
    });

    $('#quotationForm').on('submit', function(e) {
        e.preventDefault();
        const newQuote = {
            id: quotes.length + 1,
            referenceNumber: `QT${new Date().getFullYear()}${(quotes.length + 1).toString().padStart(3, '0')}`,
            vehicleMake: $('#vehicleMake').val(),
            vehicleModel: $('#vehicleModel').val(),
            vehicleYear: parseInt($('#vehicleYear').val()),
            bodyType: $('#bodyType').val(),
            seatingCapacity: parseInt($('#seatingCapacity').val()),
            cylinderCapacity: parseInt($('#cylinderCapacity').val()),
            vehicleValue: parseInt($('#vehicleValue').val()),
            fullName: $('#fullName').val(),
            email: $('#email').val(),
            phoneNumber: $('#phoneNumber').val(),
            drivingExperience: parseInt($('#drivingExperience').val()),
            coveragePlan: $('#coveragePlan').val(),
            paymentMethod: $('#paymentMethod').val(),
            status: 'pending',
            date: new Date().toISOString().split('T')[0]
        };

        quotes.unshift(newQuote);
        displayQuotes();
        showNotification('New quotation added successfully!');
        $('#newQuoteModal').modal('hide');
        this.reset();
    });

    $(document).on('click', '.approve-quote', function() {
        const id = $(this).data('id');
        const quote = quotes.find(q => q.id === id);
        quote.status = 'approved';
        displayQuotes();
        showNotification('Quote approved successfully!');
    });

    $(document).on('click', '.reject-quote', function() {
        const id = $(this).data('id');
        const quote = quotes.find(q => q.id === id);
        quote.status = 'rejected';
        displayQuotes();
        showNotification('Quote rejected successfully!');
    });

    $(document).on('click', '.save-changes', function() {
        const id = $(this).data('id');
        const quoteCard = $(this).closest('.dashboard-card');
        const quote = quotes.find(q => q.id === id);
        
        // Update quote object with new values
        quoteCard.find('.edit-field').each(function() {
            const field = $(this).data('field');
            const value = $(this).val();
            quote[field] = value;
        });
        
        displayQuotes();
        showNotification('Quote details updated successfully!');
    });

    $(document).on('click', '.cancel-changes', function() {
        displayQuotes();
    });

    $(document).on('click', '.view-details', function() {
        const id = $(this).data('id');
        $(`#details-${id}`).slideToggle(300);
    });

    function updateStatistics() {
        $('#totalQuotes').text(quotes.length);
        $('#pendingQuotes').text(quotes.filter(q => q.status === 'pending').length);
        $('#approvedQuotes').text(quotes.filter(q => q.status === 'approved').length);
        $('#rejectedQuotes').text(quotes.filter(q => q.status === 'rejected').length);
    }

    function showNotification(message) {
        const notification = $('#notification');
        notification.text(message).fadeIn();
        setTimeout(() => notification.fadeOut(), 3000);
    }

    $('.sign-out-btn').on('click', function() {
        if(confirm('Are you sure you want to sign out?')) {
            window.location.href = "https://example.com/login"; // Replace with actual login page URL
        }
    });

    displayQuotes();
});