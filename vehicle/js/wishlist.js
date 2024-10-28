$(document).ready(function () {
    $('.btn-remove').on('click', function () {
        if (confirm("Are you sure you want to remove this item from your wishlist?")) {   
        const wishlistItem = $(this).closest('.wishlist-item');
        wishlistItem.css('opacity', '0');
        setTimeout(() => {
            wishlistItem.remove();
            const remainingItems = $('.wishlist-item');
            if (remainingItems.length === 0) {
                const emptyState = $('<div>')
                    .addClass('empty-wishlist')
                    .html(`
                        <img src="./photo/empty.png" style="width:200px;height:200px;" alt="Empty Image">
                        <h2>Your wishlist is empty</h2>
                        <p style="margin-bottom:15px;">Start adding vehicles to your wishlist to keep track of your favorites</p>
                        <a href="vehicles.html"><button class="btn btn-primary">Browse Vehicles</button></a>
                    `);
                $('.wishlist-container').append(emptyState);
            }
        }, 300);
        }
        else {
            return false;
        }
    });

    $('.menu-icon-close').hide();
    $('.menu-icon-open').click(function () {
        $('.mobile-menu').show();
        $('.menu-icon-open').hide();
        $('.menu-icon-close').show();
    });
    $('.menu-icon-close').click(function () {
        $('.mobile-menu').hide();
        $('.menu-icon-close').hide();
        $('.menu-icon-open').show();
    });
});