var quotes = [];
const carModels = {
  Audi: ['A3', 'A4', 'A6', 'Q3', 'Q5', 'Q7'],
  BMW: ['1 Series', '3 Series', '5 Series', 'X1', 'X3', 'X5'],
  Ford: ['Focus', 'Fiesta', 'Mustang', 'Escape', 'Explorer'],
  Porsche: ['911', 'Cayenne', 'Macan', 'Panamera'],
  Toyota: ['Corolla', 'Camry', 'RAV4', 'Highlander', 'Land Cruiser']
};

// Show notification function
function showNotification(message) {
    const notification = $('#notification');
    notification.text(message).fadeIn();
    setTimeout(() => notification.fadeOut(), 3000);
}

// Update vehicle make change handler
$('#vehicleMake').on('change', function() {
  const selectedMake = $(this).val();
  const modelSelect = $('#vehicleModel');
  modelSelect.empty().append('<option value="">Select Model</option>');
  
  if (selectedMake) {
    carModels[selectedMake].forEach(model => {
      modelSelect.append(`<option value="${model}">${model}</option>`);
    });
  }
});

// Update phone number validation
$('#phoneNumber').on('input', function() {
    // Remove non-digits
    let value = this.value.replace(/\D/g, '');
    
    // Limit to 8 digits
    if (value.length > 8) {
        value = value.substr(0, 8);
    }
    
    // Update input value
    this.value = value;
});

// Add phone validation to quotation form
$('#quotationForm').find('input[name="phoneNumber"]').attr({
    'pattern': '[0-9]{8}',
    'maxlength': '8',
    'title': 'Please enter exactly 8 digits',
    'oninvalid': 'this.setCustomValidity("Phone number must be exactly 8 digits")',
    'oninput': 'this.setCustomValidity("")'
});

function showModal(modalId) {
    document.getElementById(modalId).classList.add('show');
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('show');
    // Reset form when closing
    document.getElementById('quotationForm').reset();
    // Reset sections visibility
    document.getElementById('vehicleSection').classList.add('visible');
    document.getElementById('vehicleSection').classList.remove('hidden');
    document.getElementById('personalSection').classList.remove('visible');
    document.getElementById('personalSection').classList.add('hidden');
}

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('show');
    }
}
$(document).ready(function() {
    // Move the showNotification function inside document.ready
    function showNotification(message) {
        const notification = $('#notification');
        notification.text(message).fadeIn();
        setTimeout(() => notification.fadeOut(), 3000);
    }

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
            phoneNumber: "12345678", // Updated for validity
            drivingExperience: 5,
            coveragePlan: "comprehensive",
            paymentMethod: "creditCard",
            status: "pending",
            date: new Date().toISOString().split('T')[0] // Today
        },
        {
            id: 2,
            referenceNumber: 'QT2023002',
            vehicleMake: "Honda",
            vehicleModel: "Civic",
            vehicleYear: 2019,
            bodyType: "Sedan",
            seatingCapacity: 5,
            cylinderCapacity: 1800,
            vehicleValue: 150000,
            fullName: "Jane Smith",
            email: "jane@example.com",
            phoneNumber: "09876543", // Updated for validity
            drivingExperience: 3,
            coveragePlan: "thirdParty",
            paymentMethod: "bankTransfer",
            status: "approved",
            statusDate: new Date().toISOString(), // Added status change date
            date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 3 days ago
        },
        {
            id: 3,
            referenceNumber: 'QT2023003',
            vehicleMake: "Ford",
            vehicleModel: "Focus",
            vehicleYear: 2018,
            bodyType: "Hatchback",
            seatingCapacity: 5,
            cylinderCapacity: 1600,
            vehicleValue: 90000,
            fullName: "Alice Johnson",
            email: "alice@example.com",
            phoneNumber: "11223344", // Updated for validity
            drivingExperience: 4,
            coveragePlan: "comprehensive",
            paymentMethod: "creditCard",
            status: "rejected",
            statusDate: new Date().toISOString(), // Added status change date
            date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 10 days ago
        },
        {
            id: 4,
            referenceNumber: 'QT2023004',
            vehicleMake: "BMW",
            vehicleModel: "X5",
            vehicleYear: 2021,
            bodyType: "SUV",
            seatingCapacity: 5,
            cylinderCapacity: 3000,
            vehicleValue: 600000,
            fullName: "Bob Brown",
            email: "bob@example.com",
            phoneNumber: "22334455", // Updated for validity
            drivingExperience: 6,
            coveragePlan: "comprehensive",
            paymentMethod: "bankTransfer",
            status: "pending",
            date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 25 days ago
        }
    ];

    function displayQuotes(quotesToShow = quotes) {
        const quoteList = $('#quoteList');
        quoteList.empty();

        quotesToShow.forEach((quote, index) => {
            const quoteCard = $(`
                <div class="quotation-card" style="opacity: 0; transform: translateY(20px);">
                    <span class="quotation-reference">Ref: ${quote.referenceNumber}</span>
                    
                    <div class="row">
                        <div class="col-md-8">
                            <p>Vehicle: ${quote.vehicleMake} ${quote.vehicleModel}</p>
                            <p>Date: ${quote.date}</p>
                            <p>Coverage: ${quote.coveragePlan === 'comprehensive' ? 'Comprehensive Coverage' : 'Third-Party Coverage'}</p>
                            <span class="quotation-status quotation-status--${quote.status}">${quote.status.toUpperCase()}</span>
                        </div>
                    </div>

                    <div class="action-buttons">
                        <button class="btn btn-secondary btn-sm view-details" data-id="${quote.id}">View Details</button>
                        <button class="btn support-button btn-sm">
                            <span class="support-icon">💬</span>Support Chat
                        </button>
                    </div>
                    
                    <div class="details-section" id="details-${quote.id}">
                        <table class="table">
                            <tr>
                                <th colspan="2">Insurance Information</th>
                            </tr>
                            <tr>
                                <td>Coverage Type:</td>
                                <td>${quote.coveragePlan === 'comprehensive' ? 'Comprehensive Coverage' : 'Third-Party Coverage'}</td>
                            </tr>
                            <tr>
                                <th colspan="2">Vehicle Information</th>
                            </tr>
                            <tr>
                                <td>Manufacturing Year:</td>
                                <td>${quote.vehicleYear}</td>
                            </tr>
                            <tr>
                                <td>Body Type:</td>
                                <td>${quote.bodyType}</td>
                            </tr>
                            <tr>
                                <td>Seating Capacity:</td>
                                <td>${quote.seatingCapacity}</td>
                            </tr>
                            <tr>
                                <td>Cylinder Capacity:</td>
                                <td>${quote.cylinderCapacity}</td>
                            </tr>
                            <tr>
                                <td>Vehicle Value (HK$):</td>
                                <td>${quote.vehicleValue}</td>
                            </tr>
                            <tr>
                                <th colspan="2">Personal Information</th>
                            </tr>
                            <tr>
                                <td>Full Name:</td>
                                <td>${quote.fullName}</td>
                            </tr>
                            <tr>
                                <td>Phone:</td>
                                <td>${quote.phoneNumber}</td>
                            </tr>
                            <tr>
                                <td>Email:</td>
                                <td>${quote.email}</td>
                            </tr>
                            <tr>
                                <td>Driving Experience:</td>
                                <td>${quote.drivingExperience} years</td>
                            </tr>
                            <tr>
                                <td>Payment Method:</td>
                                <td>${quote.paymentMethod}</td>
                            </tr>
                        </table>
                        ${quote.status === 'pending' ? `
                            <div class="approval-actions" style="text-align: right; margin-top: 20px; display: flex; gap: 10px; justify-content: flex-end;">
                                <button class="btn btn-danger btn-sm reject-quote" data-id="${quote.id}">Reject</button>
                                <button class="btn btn-success btn-sm approve-quote" data-id="${quote.id}">Approve</button>
                                <button class="btn btn-primary edit-quote" data-id="${quote.id}">Edit</button>
                            </div>
                        ` : ''}
                    </div>
                </div>
            `);
            
            quoteList.append(quoteCard);
            
            // Animate each card with a slight delay
            setTimeout(() => {
                quoteCard.css({
                    'transition': 'all 0.5s ease',
                    'opacity': '1',
                    'transform': 'translateY(0)'
                });
            }, index * 100);
        });

        updateStatistics();
    }

    $(document).on('click', '.view-details', function() {
        const id = $(this).data('id');
        $(`#details-${id}`).slideToggle();
    });

    $('#searchQuote').on('input', function() {
        const searchTerm = $(this).val().toLowerCase();
        filterQuotes();
    });

    function filterQuotes() {
        const searchTerm = $('#searchQuote').val().toLowerCase();
        const dateRange = $('#dateRangeFilter').val();
        const status = $('#statusFilter').val();
        const coverageType = $('#coverageTypeFilter').val(); // New filter

        const filteredQuotes = quotes.filter(quote => {
            // Search criteria
            const searchMatches = 
                quote.fullName.toLowerCase().includes(searchTerm) ||
                quote.vehicleMake.toLowerCase().includes(searchTerm) ||
                quote.vehicleModel.toLowerCase().includes(searchTerm) ||
                quote.email.toLowerCase().includes(searchTerm) ||
                quote.referenceNumber.toLowerCase().includes(searchTerm);

            // Date range criteria
            const quoteDate = new Date(quote.date);
            const now = new Date();
            let dateMatches = true;

            if (dateRange) {
                switch(dateRange) {
                    case 'day':
                        dateMatches = (now - quoteDate) <= (24 * 60 * 60 * 1000);
                        break;
                    case 'week':
                        dateMatches = (now - quoteDate) <= (7 * 24 * 60 * 60 * 1000);
                        break;
                    case 'month':
                        dateMatches = (now - quoteDate) <= (30 * 24 * 60 * 60 * 1000);
                        break;
                }
            }

            // Status and coverage type criteria
            const statusMatches = !status || quote.status === status;
            const coverageMatches = !coverageType || quote.coveragePlan === coverageType;

            return searchMatches && dateMatches && statusMatches && coverageMatches;
        });

        displayQuotes(filteredQuotes);
    }

    $('#dateRangeFilter, #statusFilter, #coverageTypeFilter').on('change', function() {
        filterQuotes();
    });

    // Update form submission handler
    $(document).ready(function() {
        // Add event delegation for the submit button
        $(document).on('click', '#submitQuotation', function(e) {
            e.preventDefault();
            const form = $('#quotationForm')[0];
            
            if (!form.checkValidity()) {
                showNotification('Please fill all required fields');
                return;
            }
            
            // Create new quote object with approved status
            const newQuote = {
                id: quotes.length + 1,
                referenceNumber: `QT${new Date().getFullYear()}${(quotes.length + 1).toString().padStart(3, '0')}`,
                vehicleMake: $('#vehicleMake').val(),
                vehicleModel: $('#vehicleModel').val(),
                vehicleYear: parseInt($('#vehicleYear').val()),
                bodyType: $('#bodyType').val() || 'Sedan',
                seatingCapacity: parseInt($('#seatingCapacity').val()) || 5,
                cylinderCapacity: parseInt($('#cylinderCapacity').val()) || 2000,
                vehicleValue: parseInt($('#vehicleValue').val()) || 200000,
                fullName: $('#fullName').val(),
                email: $('#email').val(),
                phoneNumber: $('#phoneNumber').val(),
                drivingExperience: parseInt($('#drivingExperience').val()),
                coveragePlan: $('#coveragePlan').val(),
                paymentMethod: $('#paymentMethod').val(),
                status: 'approved',
                approvedBy: 'Chris Wong',
                approvalDate: new Date().toISOString(),
                date: new Date().toISOString().split('T')[0]
            };
            
            // Add quote to the beginning of the array
            quotes.unshift(newQuote);
            
            // Update display with animation
            const quoteList = $('#quoteList');
            const newQuoteElement = $(`
                <div class="quotation-card" style="opacity: 0; transform: translateY(-20px);">
                    <span class="quotation-reference">Ref: ${newQuote.referenceNumber}</span>
                    
                    <div class="row">
                        <div class="col-md-8">
                            <p>Vehicle: ${newQuote.vehicleMake} ${newQuote.vehicleModel}</p>
                            <p>Date: ${newQuote.date}</p>
                            <p>Coverage: ${newQuote.coveragePlan === 'comprehensive' ? 'Comprehensive Coverage' : 'Third-Party Coverage'}</p>
                            <p>Approved by: ${newQuote.approvedBy}</p>
                            <span class="quotation-status quotation-status--approved">APPROVED</span>
                        </div>
                    </div>

                    <div class="action-buttons">
                        <button class="btn support-button btn-sm">
                            <span class="support-icon">💬</span>Support Chat
                        </button>
                    </div>
                </div>
            `);
            
            // Add new quote to the top of the list
            quoteList.prepend(newQuoteElement);
            
            // Animate the new quote card
            setTimeout(() => {
                newQuoteElement.css({
                    'transition': 'all 0.5s ease',
                    'opacity': '1',
                    'transform': 'translateY(0)'
                });
            }, 100);
            
            // Show confirmation
            showNotification('Quote approved successfully by Chris Wong!');
            
            // Reset form and close modal
            this.reset();
            closeModal('newQuoteModal');
            
            // Reset vehicle model select when make is cleared
            $('#vehicleMake').on('change', function() {
                const modelSelect = $('#vehicleModel');
                modelSelect.empty().append('<option value="">Select Model</option>');
                
                const selectedMake = $(this).val();
                if (selectedMake && carModels[selectedMake]) {
                    carModels[selectedMake].forEach(model => {
                        modelSelect.append(`<option value="${model}">${model}</option>`);
                    });
                }
            });
        });
    });

    // Handle edit button click
    $(document).on('click', '.edit-quote', function(e) {
        e.preventDefault();
        const id = $(this).data('id');
        const detailsSection = $(`#details-${id}`);
        const quote = quotes.find(q => q.id === id);
        
        // Auto-fill payment method and body type
        const paymentMethodField = detailsSection.find('select[class="edit-field"]').filter(function() {
            return $(this).closest('tr').find('td:first').text().trim().toLowerCase() === 'payment method:';
        });
        if (paymentMethodField.length) {
            paymentMethodField.val(quote.paymentMethod);
        }

        const bodyTypeField = detailsSection.find('select[class="edit-field"]').filter(function() {
            return $(this).closest('tr').find('td:first').text().trim().toLowerCase() === 'body type:';
        });
        if (bodyTypeField.length) {
            bodyTypeField.val(quote.bodyType);
        }

        // Replace table data cells with appropriate input types
        const table = detailsSection.find('table');
        table.find('tr').each(function() {
            const row = $(this);
            // Skip header rows
            if (row.find('th').length > 0) {
                return;
            }
            
            const label = row.find('td:first-child').text().trim().toLowerCase();
            const dataCell = row.find('td:nth-child(2)');
            const currentValue = dataCell.text().trim();
            
            let input;
            
            switch(label) {
                case 'body type:':
                    input = $('<select>')
                        .attr('class', 'edit-field')
                        .append('<option value="Saloon">Saloon</option>')
                        .append('<option value="Hatchback">Hatchback</option>')
                        .append('<option value="SUV">SUV</option>')
                        .append('<option value="Coupe">Coupe</option>')
                        .append('<option value="Convertible">Convertible</option>');
                    input.val(quote.bodyType); // Use quote.bodyType directly
                    break;
                    
                case 'payment method:':
                    input = $('<select>')
                        .attr('class', 'edit-field')
                        .append('<option value="bankTransfer">Bank Transfer</option>')
                        .append('<option value="creditCard">Credit Card</option>');
                    input.val(quote.paymentMethod.toLowerCase()); // Convert to lowercase for matching
                    break;
                    
                case 'manufacturing year:':
                    input = $('<input>')
                        .attr('type', 'number')
                        .attr('class', 'edit-field')
                        .attr('min', '2000')
                        .attr('max', '2024')
                        .attr('value', currentValue);
                    break;
                    
                case 'seating capacity:':
                    input = $('<input>')
                        .attr('type', 'number')
                        .attr('class', 'edit-field')
                        .attr('min', '2')
                        .attr('max', '9')
                        .attr('value', currentValue.replace(' years', ''));
                    break;
                    
                case 'cylinder capacity:':
                    input = $('<input>')
                        .attr('type', 'number')
                        .attr('class', 'edit-field')
                        .attr('min', '500')
                        .attr('max', '8000')
                        .attr('step', '100')
                        .attr('value', currentValue);
                    break;
                    
                case 'vehicle value (hk$):':
                    input = $('<input>')
                        .attr('type', 'number')
                        .attr('class', 'edit-field')
                        .attr('min', '50000')
                        .attr('step', '1000')
                        .attr('value', currentValue);
                    break;
                    
                case 'full name:':
                    input = $('<input>')
                        .attr('type', 'text')
                        .attr('class', 'edit-field')
                        .attr('value', currentValue);
                    break;
                    
                case 'phone:':
                    input = $('<input>')
                        .attr('type', 'text')
                        .attr('class', 'edit-field')
                        .attr('value', currentValue);
                    break;
                    
                case 'email:':
                    input = $('<input>')
                        .attr('type', 'email')
                        .attr('class', 'edit-field')
                        .attr('value', currentValue);
                    break;
                    
                case 'driving experience:':
                    input = $('<input>')
                        .attr('type', 'number')
                        .attr('class', 'edit-field')
                        .attr('min', '1')
                        .attr('max', '70')
                        .attr('value', currentValue.replace(' years', ''));
                    break;
                    
                default:
                    input = $('<input>')
                        .attr('type', 'text')
                        .attr('class', 'edit-field')
                        .attr('value', currentValue);
            }
            
            // Add a modified indicator
            const modifiedIndicator = $('<span>')
                .addClass('modified-indicator')
                .css({
                    'color': '#ff6b6b',
                    'font-size': '0.8em',
                    'margin-left': '8px',
                    'display': 'none'
                })
                .text('(modified)');
            
            const container = $('<div>')
                .css({
                    'display': 'flex',
                    'align-items': 'center',
                    'width': '100%'
                })
                .append(input)
                .append(modifiedIndicator);
                
            dataCell.html(container);
            
            // Add change event to show modified indicator
            input.on('input change', function() {
                modifiedIndicator.show();
            });
        });
        
        // Replace approval buttons with save/cancel buttons
        const actionButtons = detailsSection.find('.approval-actions');
        actionButtons.html(`
            <button class="btn btn-secondary btn-sm cancel-edit" data-id="${id}">Cancel</button>
            <button class="btn btn-primary btn-sm save-edit" data-id="${id}">Save Changes</button>
        `);
    });

    $(document).on('click', '.cancel-edit', function() {
        const id = $(this).data('id');
        displayQuotes(); // Reset to original display
    });

    $(document).on('click', '.save-edit', function() {
        const id = $(this).data('id');
        const detailsSection = $(`#details-${id}`);
        const quoteIndex = quotes.findIndex(q => q.id === id);
        const originalQuote = { ...quotes[quoteIndex] };
        let changes = [];

        if (quoteIndex === -1) {
            showNotification('Error: Quote not found');
            return;
        }

        let updatedQuote = { ...quotes[quoteIndex] };

        try {
            // Gather all edited values
            detailsSection.find('.edit-field').each(function() {
                const field = $(this);
                const row = field.closest('tr');
                const fieldName = row.find('td:first').text().trim().toLowerCase().replace(':', '');
                const newValue = field.val();
                let oldValue;

                switch(fieldName) {
                    case 'coverage type':
                        oldValue = originalQuote.coveragePlan;
                        if (oldValue !== newValue) {
                            changes.push({ field: 'Coverage Type', from: oldValue, to: newValue });
                        }
                        updatedQuote.coveragePlan = newValue;
                        break;
                    case 'manufacturing year': 
                        oldValue = originalQuote.vehicleYear.toString();
                        if (oldValue !== newValue) {
                            changes.push({ field: 'Manufacturing Year', from: oldValue, to: newValue });
                        }
                        updatedQuote.vehicleYear = parseInt(newValue);
                        break;
                    case 'body type':
                        oldValue = originalQuote.bodyType;
                        if (oldValue !== newValue) {
                            changes.push({ field: 'Body Type', from: oldValue, to: newValue });
                        }
                        updatedQuote.bodyType = newValue;
                        break;
                    case 'seating capacity':
                        oldValue = originalQuote.seatingCapacity.toString();
                        if (oldValue !== newValue) {
                            changes.push({ field: 'Seating Capacity', from: oldValue, to: newValue });
                        }
                        updatedQuote.seatingCapacity = parseInt(newValue);
                        break;
                    case 'cylinder capacity':
                        oldValue = originalQuote.cylinderCapacity.toString();
                        if (oldValue !== newValue) {
                            changes.push({ field: 'Cylinder Capacity', from: oldValue, to: newValue });
                        }
                        updatedQuote.cylinderCapacity = parseInt(newValue);
                        break;
                    case 'vehicle value (hk$)':
                        oldValue = originalQuote.vehicleValue.toString();
                        if (oldValue !== newValue) {
                            changes.push({ field: 'Vehicle Value', from: oldValue, to: newValue });
                        }
                        updatedQuote.vehicleValue = parseInt(newValue);
                        break;
                    case 'full name':
                        oldValue = originalQuote.fullName;
                        if (oldValue !== newValue) {
                            changes.push({ field: 'Full Name', from: oldValue, to: newValue });
                        }
                        updatedQuote.fullName = newValue;
                        break;
                    case 'phone':
                        oldValue = originalQuote.phoneNumber;
                        if (oldValue !== newValue) {
                            changes.push({ field: 'Phone', from: oldValue, to: newValue });
                        }
                        updatedQuote.phoneNumber = newValue;
                        break;
                    case 'email':
                        oldValue = originalQuote.email;
                        if (oldValue !== newValue) {
                            changes.push({ field: 'Email', from: oldValue, to: newValue });
                        }
                        updatedQuote.email = newValue;
                        break;
                    case 'driving experience':
                        oldValue = originalQuote.drivingExperience.toString();
                        if (oldValue !== newValue) {
                            changes.push({ field: 'Driving Experience', from: oldValue, to: newValue });
                        }
                        updatedQuote.drivingExperience = parseInt(newValue);
                        break;
                    case 'payment method':
                        oldValue = originalQuote.paymentMethod;
                        if (oldValue !== newValue) {
                            changes.push({ field: 'Payment Method', from: oldValue, to: newValue });
                        }
                        updatedQuote.paymentMethod = newValue;
                        break;
                }
            });

            // Update quote and show changes
            quotes[quoteIndex] = updatedQuote;
            displayQuotes();
            
            if (changes.length > 0) {
                showChangesInChat(changes, updatedQuote);
            }
            
            showNotification('Changes saved successfully!');

        } catch (error) {
            console.error('Error saving changes:', error);
            showNotification('Error saving changes. Please try again.');
        }
    });

    // Update showChangesInChat function to be more conversational
    function showChangesInChat(changes, quote) {
        const timestamp = new Date().toLocaleString();
        const changeMessage = changes.map(change => 
            `• ${change.field}: "${change.from}" → "${change.to}"`
        ).join('\n');

        // Add staff update message
        $('.chat-messages').append(`
            <div class="message-container">
                <div class="message staff-message">
                    <div class="message-info">Support Staff (${timestamp})</div>
                    Hello ${quote.fullName}, I wanted to inform you that we've updated your insurance quote (${quote.referenceNumber}). Here are the changes that have been made:
                    <br><br>
                    ${changeMessage.split('\n').join('<br>')}
                </div>
            </div>
        `);

        // // Simulate customer acknowledgment
        // setTimeout(() => {
        //     $('.chat-messages').append(`
        //         <div class="message-container">
        //             <div class="message customer-message">
        //                 <div class="message-info">Customer (${timestamp})</div>
        //                 Thank you for notifying me about the changes to my quote. I have received the update details.
        //             </div>
        //         </div>
        //     `);
            
        //     $('.chat-messages').scrollTop($('.chat-messages')[0].scrollHeight);
        // }, 1000);
    }

    $(document).on('click', '.approve-quote', function() {
        const id = $(this).data('id');
        const quote = quotes.find(q => q.id === id);
        quote.status = 'approved';
        quote.statusDate = new Date().toISOString(); // Add status change date
        displayQuotes();
        showNotification('Quote approved successfully!');
    });

    $(document).on('click', '.reject-quote', function() {
        const id = $(this).data('id');
        const quote = quotes.find(q => q.id === id);
        quote.status = 'rejected';
        quote.statusDate = new Date().toISOString(); // Add status change date
        displayQuotes();
        showNotification('Quote rejected successfully!');
    });

    $(document).on('click', '.edit-quote', function() {
        window.location.hash = '#quotations';
    });

    $(window).on('hashchange', function() {
        if(window.location.hash === '#quotations') {
            $('.main-content').show();
        } else if(window.location.hash === '#dashboard') {
            $('.main-content').hide();
        }
    });

    // Update statistics display with animation
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

    $('.sign-out-btn').on('click', function() {
        if(confirm('Are you sure you want to sign out?')) {
            window.location.href = "signin.html"
        }
    });

    // Hamburger menu and sidebar functionality
    const $hamburger = $('.hamburger-menu');
    const $sidebar = $('.sidebar');
    const $content = $('.content-wrapper');
    const $header = $('header');

    // Toggle sidebar
    $hamburger.click(function(e) {
        e.stopPropagation();
        $hamburger.toggleClass('active');
        $sidebar.toggleClass('active');
        
        if ($sidebar.hasClass('active')) {
            $content.css('margin-left', '220px');
            $header.css('left', '220px');
        } else {
            $content.css('margin-left', '0');
            $header.css('left', '0');
        }
    });

    // Close sidebar when clicking outside
    $(document).click(function(e) {
        if (!$sidebar.is(e.target) && 
            !$hamburger.is(e.target) && 
            $sidebar.has(e.target).length === 0 && 
            $hamburger.has(e.target).length === 0 && 
            $sidebar.hasClass('active')) {
            
            $sidebar.removeClass('active');
            $hamburger.removeClass('active');
            $content.css('margin-left', '0');
            $header.css('left', '0');
        }
    });

    // Handle window resize
    let resizeTimer;
    $(window).resize(function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            if ($(window).width() <= 768) {
                $sidebar.removeClass('active');
                $hamburger.removeClass('active');
                $content.css('margin-left', '0');
                $header.css('left', '0');
            }
        }, 250);
    });

    // Sidebar menu item click handling
    $('.sidebar-menu a').click(function(e) {
        e.preventDefault();
        
        // Remove active class from all menu items
        $('.sidebar-menu a').removeClass('active');
        
        // Add active class to clicked item
        $(this).addClass('active');
        
        // On mobile, close sidebar after selection
        if ($(window).width() <= 768) {
            $sidebar.removeClass('active');
            $hamburger.removeClass('active');
            $content.css('margin-left', '0');
            $header.css('left', '0');
        }
        
        // Show notification
        showNotification('Loading ' + $(this).text() + '...');
    });

    // Sign out button handling
    $('.sign-out-btn').click(function() {
        showNotification('Signing out...');
        // Add your sign out logic here
    });

    // Chat support functionality
    $(document).on('click', '.support-button', function() {
        $('.chatbox').css('transform', 'translateY(0)');
    });

    $('.close-chat').click(function() {
        $('.chatbox').css('transform', 'translateY(120%)');
    });

    $('.chat-input button').click(sendMessage);
    $('.chat-input input').keypress(function(e) {
        if (e.which == 13) {
            sendMessage();
        }
    });

    function sendMessage() {
        const input = $('.chat-input input');
        const message = input.val().trim();
        
        if (message !== '') {
            const timestamp = new Date().toLocaleTimeString();
            
            // Add customer message
            $('.chat-messages').append(`
                <div class="message-container">
                    <div class="message customer-message">
                        <div class="message-info">You (${timestamp})</div>
                        ${message}
                    </div>
                </div>
            `);
            
            // Clear input
            input.val('');
            
            // Scroll to bottom
            $('.chat-messages').scrollTop($('.chat-messages')[0].scrollHeight);
            
            // Simulate staff response
            setTimeout(() => {
                $('.chat-messages').append(`
                    <div class="message-container">
                        <div class="message staff-message">
                            <div class="message-info">Support Staff (${timestamp})</div>
                            Thank you for your message. How can I assist you today?
                        </div>
                    </div>
                `);
                $('.chat-messages').scrollTop($('.chat-messages')[0].scrollHeight);
            }, 1000);
        }
    }

    displayQuotes();

    // Check if there's a quote to highlight
    const highlightQuoteId = localStorage.getItem('highlightQuoteId');
    
    if (highlightQuoteId) {
        // Find the quote element and add highlight effect
        const quoteElement = $(`[data-quote-id="${highlightQuoteId}"]`);
        
        if (quoteElement.length) {
            // Scroll to the element
            $('html, body').animate({
                scrollTop: quoteElement.offset().top - 100
            }, 500);

            // Add highlight effect
            quoteElement.addClass('highlight-quote');
            
            // Pulse animation
            setTimeout(() => {
                quoteElement.addClass('pulse-animation');
            }, 500);

            // Remove highlight after user interaction
            $(document).one('click', function() {
                quoteElement.removeClass('highlight-quote pulse-animation');
                localStorage.removeItem('highlightQuoteId');
            });
        }
    }
});

// Add this JavaScript function to handle section navigation
function showVehicleSection() {
    $('#personalSection').removeClass('visible').addClass('hidden');
    setTimeout(() => {
        $('#vehicleSection').removeClass('hidden').addClass('visible');
    }, 300);
}

// Update Next button event listener
$('#nextButton').on('click', function() {
    // Validate personal section
    const personalSection = $('#personalSection');
    const inputs = personalSection.find('input, select');
    let isValid = true;
    
    inputs.each(function() {
        if (!this.checkValidity()) {
            isValid = false;
            $(this).addClass('invalid');
            return false;
        }
    });
    
    if (!isValid) {
        showNotification('Please fill all required fields');
        return;
    }
    
    // Show vehicle section
    personalSection.removeClass('visible').addClass('hidden');
    $('#vehicleSection').removeClass('hidden').addClass('visible');
});

// Update form submission
$('#quotationForm').on('submit', function(e) {
    e.preventDefault();
    
    if (!this.checkValidity()) {
        showNotification('Please fill all required fields');
        return;
    }
    
    // Create new quote object with approved status
    const newQuote = {
        id: quotes.length + 1,
        referenceNumber: `QT${new Date().getFullYear()}${(quotes.length + 1).toString().padStart(3, '0')}`,
        vehicleMake: $('#vehicleMake').val(),
        vehicleModel: $('#vehicleModel').val(),
        vehicleYear: parseInt($('#vehicleYear').val()),
        bodyType: $('#bodyType').val() || 'Sedan',
        seatingCapacity: parseInt($('#seatingCapacity').val()) || 5,
        cylinderCapacity: parseInt($('#cylinderCapacity').val()) || 2000,
        vehicleValue: parseInt($('#vehicleValue').val()) || 200000,
        fullName: $('#fullName').val(),
        email: $('#email').val(),
        phoneNumber: $('#phoneNumber').val(),
        drivingExperience: parseInt($('#drivingExperience').val()),
        coveragePlan: $('#coveragePlan').val(),
        paymentMethod: $('#paymentMethod').val(),
        status: 'approved',
        approvedBy: 'Chris Wong',
        approvalDate: new Date().toISOString(),
        date: new Date().toISOString().split('T')[0]
    };
    
    // Add quote to the beginning of the array
    quotes.unshift(newQuote);
    
    // Update display with animation
    const quoteList = $('#quoteList');
    const newQuoteElement = $(`
        <div class="quotation-card" style="opacity: 0; transform: translateY(-20px);">
            <span class="quotation-reference">Ref: ${newQuote.referenceNumber}</span>
            
            <div class="row">
                <div class="col-md-8">
                    <p>Vehicle: ${newQuote.vehicleMake} ${newQuote.vehicleModel}</p>
                    <p>Date: ${newQuote.date}</p>
                    <p>Coverage: ${newQuote.coveragePlan === 'comprehensive' ? 'Comprehensive Coverage' : 'Third-Party Coverage'}</p>
                    <p>Approved by: ${newQuote.approvedBy}</p>
                    <span class="quotation-status quotation-status--approved">APPROVED</span>
                </div>
            </div>

            <div class="action-buttons">
                <button class="btn support-button btn-sm">
                    <span class="support-icon">💬</span>Support Chat
                </button>
            </div>
        </div>
    `);
    
    // Add new quote to the top of the list
    quoteList.prepend(newQuoteElement);
    
    // Animate the new quote card
    setTimeout(() => {
        newQuoteElement.css({
            'transition': 'all 0.5s ease',
            'opacity': '1',
            'transform': 'translateY(0)'
        });
    }, 100);
    
    // Show confirmation
    showNotification('Quote approved successfully by Chris Wong!');
    
    // Reset form and close modal
    this.reset();
    closeModal('newQuoteModal');
    
    // Reset vehicle model select when make is cleared
    $('#vehicleMake').on('change', function() {
        const modelSelect = $('#vehicleModel');
        modelSelect.empty().append('<option value="">Select Model</option>');
        
        const selectedMake = $(this).val();
        if (selectedMake && carModels[selectedMake]) {
            carModels[selectedMake].forEach(model => {
                modelSelect.append(`<option value="${model}">${model}</option>`);
            });
        }
    });
});

// Function to show notification
function showNotification(message) {
    const notification = $('#notification');
    notification.text(message)
        .fadeIn()
        .css({
            'transform': 'translateY(0)',
            'opacity': '1'
        });
    
    setTimeout(() => {
        notification.css({
            'transform': 'translateY(-20px)',
            'opacity': '0'
        }).fadeOut();
    }, 3000);
}

// Function to close modal
function closeModal(modalId) {
    const modal = $(`#${modalId}`);
    modal.css('opacity', '0');
    setTimeout(() => {
        modal.removeClass('show');
        $('#quotationForm')[0].reset();
    }, 300);
}

// Function to show modal
function showModal(modalId) {
    const modal = $(`#${modalId}`);
    modal.addClass('show');
    setTimeout(() => {
        modal.css('opacity', '1');
    }, 50);
}