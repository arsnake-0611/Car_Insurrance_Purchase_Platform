$(document).ready(function () {
    // Handle tab click
    $(".order-tabs button").on("click", function () {
        $(".order-tabs button").removeClass("active");
        $(this).addClass("active");
        var filter = $(this).text().toLowerCase();
        if (filter === "all orders") {
            $(".order-card").show();
        } else {
            $(".order-card").hide();
            $(".order-card").each(function () {
                var statusBadge = $(this).find(".status-badge").text().toLowerCase();
                if (statusBadge === filter) {
                    $(this).show();
                }
            });
        }
    });

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

    // Handle track order button click
    $(".track-order").on("click", function () {
        var orderCard = $(this).closest(".order-card");
        var trackingDetails = orderCard.find(".tracking-details");
        trackingDetails.slideToggle();
    });

    // Handle view details button click
    $(".view-details").on("click", function () {
        var orderCard = $(this).closest(".order-card");
        var detailsContent = orderCard.find(".order-details");
        detailsContent.slideToggle();
    });
});