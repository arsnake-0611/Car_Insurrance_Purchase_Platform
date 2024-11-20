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

    // Load saved form data if exists
    loadSavedFormData();

    // Save form data when inputs change
    $('.quote-form input').on('change input', function() {
        saveFormData();
    });

    $(".payment-method").on("click", function () {
        // Remove active state from all payment methods
        $(".payment-method").removeClass("active");
        $(".payment-method").css({
            "background-color": "white",
            "color": "black",
            "border": "2px solid #ddd"
        });
        
        // Add active state to clicked payment method
        $(this).addClass("active").trigger('change');  // Add trigger change
        $(this).css({
            "background-color": "var(--secondary-color)",
            "color": "white",
            "border": "1px solid var(--primary-color)"
        });
        
        saveFormData();
    });
});

// Function to save form data
function saveFormData() {
    const formData = {
        paymentMethod: $('.payment-method.active').index('.payment-method'),  // Save the index of selected payment
        cardNumber: $('#cardNumber').val(),
        expiryDate: $('#expiryDate').val(),
        cvv: $('input[placeholder="***"]').val(),
        nameOnCard: $('input[placeholder="Enter name as shown on card"]').val()
    };
    localStorage.setItem('paymentFormData', JSON.stringify(formData));
}

// Function to load saved form data
function loadSavedFormData() {
    const savedData = localStorage.getItem('paymentFormData');
    if (savedData) {
        const formData = JSON.parse(savedData);
        
        // Restore payment method selection
        if (formData.paymentMethod >= 0) {
            const selectedPayment = $('.payment-method').eq(formData.paymentMethod);
            // Simulate a click on the payment method
            selectedPayment.trigger('click');
        }
        
        // Restore other form fields
        $('#cardNumber').val(formData.cardNumber || '');
        $('#expiryDate').val(formData.expiryDate || '');
        $('input[placeholder="***"]').val(formData.cvv || '');
        $('input[placeholder="Enter name as shown on card"]').val(formData.nameOnCard || '');
    }
}

function goForward(event) {
    event.preventDefault();
    var isFormValid = true;
    
    // Check if payment method is selected
    if ($('.payment-method.active').length === 0) {
        alert('Please select a payment method');
        return false;
    }
    
    // Check specific required fields
    var cardNumber = $('#cardNumber').val();
    var expiryDate = $('#expiryDate').val();
    var cvv = $('input[placeholder="***"]').val();
    var nameOnCard = $('input[placeholder="Enter name as shown on card"]').val();
    
    if (!cardNumber || !expiryDate || !cvv || !nameOnCard) {
        alert('Please fill in all required fields');
        return false;
    }
    
    // If we get here, form is valid
    localStorage.removeItem('paymentFormData');
    window.location.href = 'complete.html';
}

function goBack(event) {
    event.preventDefault();
    
    // Save form data before going back
    saveFormData();
    
    if (window.history.length > 1) {
        window.history.back();
    } else {
        window.location.href = 'quote.html';
    }
}

// Card number formatting
document.getElementById('cardNumber').addEventListener('input', function(e) {
    // Remove all non-digits
    let value = this.value.replace(/\D/g, '');
    
    // Add hyphen after every 4 digits
    value = value.replace(/(\d{4})(?=\d)/g, '$1-');
    
    // Update the input value
    this.value = value;
    
    // Move cursor to end
    this.selectionStart = this.selectionEnd = this.value.length;
});

// Prevent non-numeric inputs
document.getElementById('cardNumber').addEventListener('keypress', function(e) {
    if (!/^\d$/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
        e.preventDefault();
    }
});

// Expiry date formatting
document.getElementById('expiryDate').addEventListener('input', function(e) {
    // Remove all non-digits
    let value = this.value.replace(/\D/g, '');
    
    // Add forward slash after month (first 2 digits)
    if (value.length >= 2) {
        value = value.slice(0,2) + '/' + value.slice(2);
    }
    
    // Limit to 5 characters (MM/YY)
    this.value = value.slice(0,5);
});

// Prevent non-numeric inputs for expiry date
document.getElementById('expiryDate').addEventListener('keypress', function(e) {
    if (!/^\d$/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
        e.preventDefault();
    }
});