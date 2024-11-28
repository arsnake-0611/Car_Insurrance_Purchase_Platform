// Car models data
const carModels = {
    Audi: ['A3', 'A4', 'A6', 'Q3', 'Q5', 'Q7'],
    BMW: ['1 Series', '3 Series', '5 Series', 'X1', 'X3', 'X5'],
    Ford: ['Focus', 'Fiesta', 'Mustang', 'Escape', 'Explorer'],
    Porsche: ['911', 'Cayenne', 'Macan', 'Panamera'],
    Toyota: ['Corolla', 'Camry', 'RAV4', 'Highlander', 'Land Cruiser']
};

$(document).ready(function() {
    let quotes = [];

    // Show notification function
    function showNotification(message) {
        const notification = $('#notification');
        notification.text(message).fadeIn();
        setTimeout(() => notification.fadeOut(), 3000);
    }

    // Generate reference number
    function generateReference() {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        return `QT${year}${month}${random}`;
    }

    // Update vehicle models when make is selected
    $('#vehicleMake').on('change', function() {
        const selectedMake = $(this).val();
        const modelSelect = $('#vehicleModel');
        modelSelect.empty().append('<option value="">Select Model</option>');
        
        if (selectedMake && carModels[selectedMake]) {
            carModels[selectedMake].forEach(model => {
                modelSelect.append(`<option value="${model}">${model}</option>`);
            });
        }
    });

    // Phone number validation
    $('#phoneNumber').on('input', function() {
        let value = this.value.replace(/\D/g, '');
        if (value.length > 8) {
            value = value.substr(0, 8);
        }
        this.value = value;
    });

    // Modal functions
    window.showModal = function(modalId) {
        $(`#${modalId}`).addClass('show');
    }

    window.closeModal = function(modalId) {
        $(`#${modalId}`).removeClass('show');
        $('#newQuoteModal form')[0].reset();
    }

    // Update quotes list display
    function updateQuotesList() {
        const quoteList = $('#quoteList');
        quoteList.empty();

        const tableHTML = `
            <table class="records-table">
                <thead>
                    <tr>
                        <th>Reference No.</th>
                        <th>Vehicle</th>
                        <th>Customer</th>
                        <th>Coverage Plan</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${quotes.map(quote => `
                        <tr>
                            <td>${quote.reference}</td>
                            <td>${quote.vehicle}</td>
                            <td>${quote.customerName}</td>
                            <td>${quote.coverage}</td>
                            <td>${quote.date}</td>
                            <td><span class="status-badge status-approved">Approved by Chris Wong</span></td>
                            <td>
                                <button class="btn btn-sm btn-primary view-details" data-ref="${quote.reference}">View</button>
                                <button class="btn btn-sm btn-success chat-btn" data-ref="${quote.reference}">Chat</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        quoteList.html(tableHTML);
    }

    // Update statistics
    function updateStatistics() {
        $('#totalQuotes').text(quotes.length);
        $('#approvedQuotes').text(quotes.length);
    }

    // Form submission handler - Fixed selector to match the correct form ID
    $('#newQuoteModal form').on('submit', function(e) {
        e.preventDefault();
        
        const formData = {};
        $(this).serializeArray().forEach(item => {
            formData[item.name] = item.value;
        });

        const newRecord = {
            reference: generateReference(),
            vehicle: `${formData.vehicleMake} ${formData.vehicleModel}`,
            customerName: formData.fullName,
            coverage: formData.coveragePlan,
            date: new Date().toLocaleDateString(),
            status: 'Approved',
            approvedBy: 'Chris Wong',
            approvalDate: new Date().toLocaleDateString(),
            details: formData
        };

        quotes.unshift(newRecord);
        updateQuotesList();
        updateStatistics();
        
        showNotification('New quotation approved and added successfully');
        closeModal('newQuoteModal');
    });

    // Initialize with sample data
    quotes = [{
        reference: 'QT202403001',
        vehicle: 'Toyota Camry',
        customerName: 'John Doe',
        coverage: 'Comprehensive Coverage',
        date: new Date().toLocaleDateString(),
        status: 'Approved',
        approvedBy: 'Chris Wong',
        details: {
            vehicleMake: 'Toyota',
            vehicleModel: 'Camry',
            fullName: 'John Doe',
            email: 'john@example.com',
            phoneNumber: '12345678'
        }
    }];

    // Initial render
    updateQuotesList();
    updateStatistics();

    // Add click handler for "New Quotation" button
    $('.btn-primary[onclick="showModal(\'newQuoteModal\')"]').click(function() {
        showModal('newQuoteModal');
    });
});