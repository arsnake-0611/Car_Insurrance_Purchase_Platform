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

    $(".payment-method").on("click", function () {
        $(".payment-method").removeClass("active");
        $(this).addClass("active");
        $(".payment-method:not(.active)").css({
            "background-color": "white",
            "color": "black",
            "border": "2px solid #ddd"
        });
        $(this).css({
            "background-color": "var(--secondary-color)",
            "color": "white",
            "border": "1px solid var(--primary-color)"
        });
    });
});

    var storedData = localStorage.getItem('personalFormData');
    if (storedData) {
        var formData = JSON.parse(storedData);
        $('.quote-form input,.quote-form select').each(function () {
            if (formData[$(this).attr('name')] && formData[$(this).attr('name')]!== 'on') {
                $(this).val(formData[$(this).attr('name')]);
            }
        });
    }

    var paymentFormData = {};
    $('.quote-form input,.quote-form select,.quote-form textarea,.quote-form checkbox').each(function () {
        paymentFormData[$(this).attr('name')] = $(this).val();
    });
    localStorage.setItem('paymentFormData', JSON.stringify(paymentFormData));


function goForward(event) {
    event.preventDefault();
    var isFormValid = true;
    $('.quote-form input[required]').each(function () {
        if ($(this).val() === '') {
            isFormValid = false;
            return false;
        }
    });
    if (isFormValid){
        $(".btn-complete").click(function () {
            window.location.href = $('.actions-button a[href="complete.html"]').attr('href');
        });
    }
}

function goBack() {
    window.history.back();
}
