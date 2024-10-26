$(document).ready(function () {
    // Wishlist functionality
    $('.wishlist-btn').on('click', function () {
        if ($(this).text() === "❤️") {
            $(this).text("♡");
        } else {
            $(this).text("❤️");
        }
    });

    // Filter functionality
    $('select').on('change', function () {
        // Here you would typically make an API call to filter results
        console.log("Filter changed:", this.id, this.value);
    });

    // Pagination functionality
    $('.page-btn').on('click', function () {
        $('.page-btn.active').removeClass('active');
        $(this).addClass('active');
        // Here you would typically make an API call to get the next page of results
    });
});