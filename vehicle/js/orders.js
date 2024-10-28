$(document).ready(function () {
    // Order status filter functionality
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

    // Status filter button animation
    $(".tab").on("click", function () {
        $(".tab").removeClass("filter-status-active");
        $(this).addClass("filter-status-active");
    });

    // Track order button functionality
    $(".track-order").on("click", function () {
        var orderCard = $(this).closest(".order-card");
        var trackingDetails = orderCard.find(".tracking-details");
        trackingDetails.slideToggle();
        $(this).toggleClass("active-track-order");
        if ($(this).hasClass("active-track-order")) {
            $(this).css({ "background-color": "var(--secondary-color)", "color": "white" });
        } else {
            $(this).css({ "background-color": "white", "color": "var(--secondary-color)" });
        }
    });

    // View details button functionality
    $(".view-details").on("click", function () {
        var orderCard = $(this).closest(".order-card");
        var detailsContent = orderCard.find(".order-details");
        detailsContent.slideToggle();
        $(this).toggleClass("active-view-details");
        if ($(this).hasClass("active-view-details")) {
            $(this).css({ "background-color": "var(--secondary-color)", "color": "white" });
        } else {
            $(this).css({ "background-color": "white", "color": "var(--secondary-color)" });
        }
    });
});