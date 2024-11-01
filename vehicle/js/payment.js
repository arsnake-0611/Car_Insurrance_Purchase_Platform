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

function goForward(event) {
    event.preventDefault();
    var isFormValid = true;
    $('.quote-form input[required]').each(function () {
        if ($(this).val() === '') {
            isFormValid = false;
            return false;
        }
    });
    if (isFormValid) {
        $(".btn-complete").click(function () {
            window.location.href = $('.actions-button a[href="complete.html"]').attr('href');
        });
    }
}

function goBack(event) {
    if (window.history.length>=1)
        window.history.back();
    else {
        window.location.href = 'quote.html';
    }
}