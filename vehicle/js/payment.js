$(document).ready(function () {
    // Mobile menu functionality
    $(".menu-icon-close").hide();
    $(".menu-icon-open").click(function () {
        $(".mobile-menu").show();
        $(".menu-icon-open").hide();
        $(".menu-icon-close").show();
    });

    $(".menu-icon-close").click(function () {
        $(".mobile-menu").hide();
        $(".menu-icon-close").hide();
        $(".menu-icon-open").show();
    });

    // Load saved form data and set up event listeners
    loadSavedFormData();
    $('.quote-form input').on('change input', saveFormData);

    // Payment method selection
    $('input[name="paymentMethod"]').on('change', function() {
        // Reset all payment methods to default style
        $('.payment-method').removeClass('active').css({
            "background-color": "white",
            "color": "black",
            "border": "2px solid #ddd"
        });

        // Highlight selected payment method
        $(this).closest('.payment-method').addClass('active').css({
            "background-color": "var(--secondary-color)",
            "color": "white",
            "border": "1px solid var(--primary-color)"
        });

        // Hide both forms first
        $('#creditCardForm, #bankTransferForm').hide();

        // Show the selected form
        const isBankTransfer = $(this).val() === 'bankTransfer';
        if (isBankTransfer) {
            $('#bankTransferForm').fadeIn(300);
        } else {
            $('#creditCardForm').fadeIn(300);
        }
        
        saveFormData();
    });

    // Set up card input formatting
    setupCardFormatting();
});

function saveFormData() {
    const formData = {
        paymentMethod: $('input[name="paymentMethod"]:checked').val(),
        // Credit card details
        cardNumber: $('#cardNumber').val(),
        expiryDate: $('#expiryDate').val(),
        cvv: $('input[placeholder="***"]').val(),
        nameOnCard: $('input[placeholder="Enter name as shown on card"]').val(),
        // Bank transfer details
        bankAccountNumber: $('#bankAccountNumber').val(),
        accountHolderName: $('#accountHolderName').val(),
        // Save the selected payment method's style state
        selectedMethod: $('.payment-method.active').index()
    };
    localStorage.setItem('paymentFormData', JSON.stringify(formData));
}

function loadSavedFormData() {
    const savedData = localStorage.getItem('paymentFormData');
    if (savedData) {
        const formData = JSON.parse(savedData);
        
        // Set payment method and trigger the change event
        if (formData.paymentMethod) {
            const radioButton = $(`input[name="paymentMethod"][value="${formData.paymentMethod}"]`);
            radioButton.prop('checked', true);
            
            // Apply the saved style
            $('.payment-method').css({
                "background-color": "white",
                "color": "black",
                "border": "2px solid #ddd"
            });

            radioButton.closest('.payment-method').css({
                "background-color": "var(--secondary-color)",
                "color": "white",
                "border": "1px solid var(--primary-color)"
            });

            // Show the correct form
            $('#creditCardForm, #bankTransferForm').hide();
            if (formData.paymentMethod === 'bankTransfer') {
                $('#bankTransferForm').show();
            } else {
                $('#creditCardForm').show();
            }
        }
        
        // Load credit card details
        $('#cardNumber').val(formData.cardNumber || '');
        $('#expiryDate').val(formData.expiryDate || '');
        $('input[placeholder="***"]').val(formData.cvv || '');
        $('input[placeholder="Enter name as shown on card"]').val(formData.nameOnCard || '');
        
        // Load bank transfer details
        $('#bankAccountNumber').val(formData.bankAccountNumber || '');
        $('#accountHolderName').val(formData.accountHolderName || '');
    }
}

function goForward(event) {
    event.preventDefault();
    
    const selectedPaymentMethod = $('input[name="paymentMethod"]:checked').val();
    
    if (!selectedPaymentMethod) {
        alert('Please select a payment method');
        return false;
    }
    
    if (selectedPaymentMethod === 'bankTransfer') {
        const bankAccountNumber = $('#bankAccountNumber').val().trim();
        const accountHolderName = $('#accountHolderName').val().trim();
        
        if (!bankAccountNumber || !accountHolderName) {
            alert('Please fill in all bank transfer details');
            return false;
        }
    } else {
        const cardNumber = $('#cardNumber').val();
        const expiryDate = $('#expiryDate').val();
        const cvv = $('input[placeholder="***"]').val();
        const nameOnCard = $('input[placeholder="Enter name as shown on card"]').val();
        
        if (!cardNumber || !expiryDate || !cvv || !nameOnCard) {
            alert('Please fill in all credit card details');
            return false;
        }
    }
    
    // Save the final form data to a different key in localStorage
    const finalFormData = {
        paymentMethod: selectedPaymentMethod,
        // Credit card details
        cardNumber: $('#cardNumber').val(),
        expiryDate: $('#expiryDate').val(),
        cvv: $('input[placeholder="***"]').val(),
        nameOnCard: $('input[placeholder="Enter name as shown on card"]').val(),
        // Bank transfer details
        bankAccountNumber: $('#bankAccountNumber').val(),
        accountHolderName: $('#accountHolderName').val(),
        // Save timestamp
        submittedAt: new Date().toISOString()
    };
    
    // Save to a different key for completed payments
    localStorage.setItem('completedPaymentData', JSON.stringify(finalFormData));
    
    // Remove the temporary form data
    localStorage.removeItem('paymentFormData');
    
    // Redirect to complete page
    window.location.href = 'complete.html';
}

function goBack(event) {
    event.preventDefault();
    saveFormData(); // Save current state before going back
    window.history.length > 1 ? window.history.back() : window.location.href = 'quote.html';
}

function setupCardFormatting() {
    // Card number formatting
    $('#cardNumber').on('input', function() {
        let value = this.value.replace(/\D/g, '');
        value = value.replace(/(\d{4})(?=\d)/g, '$1-');
        this.value = value;
        this.selectionStart = this.selectionEnd = this.value.length;
    }).on('keypress', function(e) {
        if (!/^\d$/.test(e.key) && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
            e.preventDefault();
        }
    });

    // Expiry date formatting and validation
    $('#expiryDate').on('input', function() {
        let value = this.value.replace(/\D/g, '');
        
        // Format as MM/YY
        if (value.length >= 2) {
            value = value.slice(0,2) + '/' + value.slice(2);
        }
        
        // Limit to MM/YY format
        this.value = value.slice(0,5);
        
        // Validate month and year
        if (value.length >= 2) {
            let month = parseInt(value.slice(0,2));
            if (month > 12) {
                this.value = '12' + this.value.slice(2);
            }
            if (month < 1) {
                this.value = '01' + this.value.slice(2);
            }
        }
        
        // Validate against current date
        if (value.length === 4) {
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear() % 100; // Get last 2 digits
            const currentMonth = currentDate.getMonth() + 1; // Get current month (1-12)
            
            let inputMonth = parseInt(value.slice(0,2));
            let inputYear = parseInt(value.slice(2));
            
            if (inputYear < currentYear || (inputYear === currentYear && inputMonth < currentMonth)) {
                // Reset to current month/year if expired
                const formattedMonth = currentMonth.toString().padStart(2, '0');
                const formattedYear = currentYear.toString();
                this.value = `${formattedMonth}/${formattedYear}`;
            }
        }
    }).on('keypress', function(e) {
        if (!/^\d$/.test(e.key) && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
            e.preventDefault();
        }
    }).on('blur', function() {
        // Validate format on blur
        const value = this.value;
        if (value.length > 0 && value.length < 5) {
            const currentDate = new Date();
            const currentYear = (currentDate.getFullYear() % 100).toString();
            const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0');
            this.value = `${currentMonth}/${currentYear}`;
        }
    });

    // Bank account number formatting
    $('#bankAccountNumber').on('input', function() {
        let value = this.value.replace(/\D/g, '');
        this.value = value;
    }).on('keypress', function(e) {
        if (!/^\d$/.test(e.key) && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
            e.preventDefault();
        }
    });
}