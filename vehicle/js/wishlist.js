$(document).ready(function () {
    // Load wishlist items
    function loadWishlist() {
        const wishlist = JSON.parse(localStorage.getItem('vehicleWishlist')) || [];
        const wishlistContainer = $('.wishlist-container');
        wishlistContainer.empty();

        if (wishlist.length === 0) {
            wishlistContainer.html(`
                <div class="empty-wishlist">
                    <img src="./photo/empty.png" style="width:200px;height:200px;" alt="Empty Image">
                    <h2>Your wishlist is empty</h2>
                    <p style="margin-bottom:15px;">Start adding vehicles to your wishlist to keep track of your favorites</p>
                    <a href="vehicles.html"><button class="btn btn-primary">Browse Vehicles</button></a>
                </div>
            `);
            return;
        }

        wishlist.forEach(vehicle => {
            const wishlistItem = $(`
                <div class="wishlist-item">
                    <img src="${vehicle.image}" alt="${vehicle.name}" class="vehicle-image">
                    <div class="vehicle-info">
                        <div class="vehicle-title">${vehicle.name}</div>
                        <div class="vehicle-specs">
                            <div class="spec-item"><img src="./photo/road-solid.png"> ${vehicle.specs.mileage}</div>
                            <div class="spec-item"><img src="./photo/bolt-solid.png"> ${vehicle.specs.horsepower}</div>
                            <div class="spec-item"><img src="./photo/gear-solid.png"> ${vehicle.specs.drivetrain}</div>
                            <div class="spec-item"><img src="./photo/palette-solid.png"> ${vehicle.specs.color}</div>
                        </div>
                    </div>
                    <div class="actions">
                        <button class="btn btn-primary request-quote" 
                            data-name="${vehicle.name}" 
                            data-drivetrain="${vehicle.specs.drivetrain}" 
                            data-color="${vehicle.specs.color}">Request Quote</button>
                        <a href="${vehicle.detailsUrl}" class="btn btn-outline">View Details</a>
                        <button class="btn btn-remove">Remove from Wishlist</button>
                    </div>
                </div>
            `);
            wishlistContainer.append(wishlistItem);
        });
    }

    // Add click handler for Request Quote button
    $(document).on('click', '.request-quote', function() {
        const vehicleData = {
            name: $(this).data('name'),
            drivetrain: $(this).data('drivetrain'),
            color: $(this).data('color')
        };
        localStorage.setItem('quoteVehicle', JSON.stringify(vehicleData));
        window.location.href = 'quote.html';
    });

    // Remove from wishlist
    $(document).on('click', '.btn-remove', function () {
        if (confirm("Are you sure you want to remove this item from your wishlist?")) {
            const wishlistItem = $(this).closest('.wishlist-item');
            const vehicleName = wishlistItem.find('.vehicle-title').text();
            
            // Remove from localStorage
            let wishlist = JSON.parse(localStorage.getItem('vehicleWishlist')) || [];
            wishlist = wishlist.filter(item => item.name !== vehicleName);
            localStorage.setItem('vehicleWishlist', JSON.stringify(wishlist));
            
            // Remove from DOM with animation
            wishlistItem.css('opacity', '0');
            setTimeout(() => {
                loadWishlist(); // Reload the entire wishlist
            }, 300);
        }
    });

    // Initial load
    loadWishlist();

    // Mobile menu functionality
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