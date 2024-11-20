$(document).ready(function () {
    // Load selected vehicle details
    try {
        const quoteVehicle = JSON.parse(localStorage.getItem('quoteVehicle'));
        console.log('Loaded vehicle:', quoteVehicle); // Debug log

        if (quoteVehicle && quoteVehicle.name) {
            $('.selected-vehicle h4').text(quoteVehicle.name);
            $('.vehicle-details').html(`
                <div class="vehicle-detail">
                    <strong>Model:</strong> ${quoteVehicle.name}
                </div>
                <div class="vehicle-detail">
                    <strong>Drivetrain Type:</strong> ${quoteVehicle.drivetrain}
                </div>
                <div class="vehicle-detail">
                    <strong>Color:</strong> ${quoteVehicle.color}
                </div>
            `);
        } else {
            console.log('No vehicle data found'); // Debug log
        }
    } catch (error) {
        console.error('Error loading vehicle data:', error); // Error log
    }

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

    $('.btn-back').click(function () {
        window.location.href = 'wishlist.html';
    });
});

function goForward(event) {
    event.preventDefault();
    var isFormValid = true;
    $('.quote-form input[required],.quote-form select[required]').each(function () {
        if ($(this).val() === '') {
            isFormValid = false;
            return false;
        }
    });
    if ($('.quote-form input[type="checkbox"]:required').prop('checked') === false) {
        isFormValid = false;
    }
    if (isFormValid) {
        // if(window.history.length>1) 
        //     window.history.forward();
        // else
            window.location.href = $('.actions-button a[href="payment.html"]').attr('href');
    }
}

