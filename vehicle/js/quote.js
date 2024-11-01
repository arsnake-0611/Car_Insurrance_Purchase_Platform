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
        $(".btn-next").click(function () {
            window.history.forward();
        });
    }
}

function goBack() {
    window.location.href = $('.actions-button a[href="wishlist.html"]').attr('href');
}