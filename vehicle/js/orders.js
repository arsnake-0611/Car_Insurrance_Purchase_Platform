$(document).ready(function () {
    // Handle tab click
    $('.order-tabs button').on('click', function () {
        $('.order-tabs button').removeClass('active');
        $(this).addClass('active');
        var filter = $(this).text().toLowerCase();
        if (filter === 'all orders') {
            $('.order-card').show();
        } else {
            $('.order-card').hide();
            $('.order-card').each(function () {
                var statusBadge = $(this).find('.status-badge').text().toLowerCase();
                if (statusBadge === filter) {
                    $(this).show();
                }
            });
        }
    });

    // Handle track order button click
    $('.track-order').on('click', function () {
        var orderCard = $(this).closest('.order-card');
        var trackingDetails = orderCard.find('.tracking-details');
        trackingDetails.fadeToggle();
    });

    // Handle view details button click
    $('.view-details').on('click', function () {
        var orderCard = $(this).closest('.order-card');
        var detailsContent = orderCard.find('.details-content');
        detailsContent.fadeToggle();
    });

});

