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

    $(".btn-back").off("click");

    $(".btn-back").click(function () {
        window.location.href = $(this).parent().attr("href");
    });

    // $(".btn-complete").click(function () {
    //     if (validateForms()) {
    //         window.location.href = $(this).parent().attr("href");
    //     }
    // });

    $(".btn-complete").click(function () {
        window.location.href = $(this).parent().attr("href");
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

    function validateForms(event) {
        event.preventDefault();
        let isValid = true;
        // Validate card number
        const cardNumberInput = $(".card-input:first");
        const cardNumberRegex = /^\d{4}\s\d{4}\s\d{4}\s\d{4}$/;
        if (!cardNumberRegex.test(cardNumberInput.val())) {
            cardNumberInput.addClass("error");
            isValid = false;
        } else {
            cardNumberInput.removeClass("error");
        }
        // Validate expiry date
        const expiryDateInput = $(".card-input:nth-child(2)");
        const expiryDateRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
        if (!expiryDateRegex.test(expiryDateInput.val())) {
            expiryDateInput.addClass("error");
            isValid = false;
        } else {
            expiryDateInput.removeClass("error");
        }
        // Validate CVV
        const cvvInput = $(".card-input:nth-child(3)");
        const cvvRegex = /^\d{3}$/;
        if (!cvvRegex.test(cvvInput.val())) {
            cvvInput.addClass("error");
            isValid = false;
        } else {
            cvvInput.removeClass("error");
        }
        // Validate name on card
        const nameOnCardInput = $(".card-input:last");
        if (!nameOnCardInput.val().trim()) {
            nameOnCardInput.addClass("error");
            isValid = false;
        } else {
            nameOnCardInput.removeClass("error");
        }
        return isValid;
    }
});