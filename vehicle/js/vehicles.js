$(document).ready(function () {

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

   // Filter functionality
$("select").on("change", function () {
    var selectedBrand = $("#brand").val();
    var selectedType = $("#type").val();
    var selectedPrice = $("#price").val();
    var selectedYear = $("#year").val();
    
    $(".vehicle-card").each(function () {
        var vehicleName = $(this).find(".vehicle-content h3").text();
        var cardPrice = parseInt($(this).find(".vehicle-price").text().slice(1));
        var drivetrainType = $(this).find(".spec-item").eq(2).text().trim(); // Assuming drivetrain type is the third spec item

        // Enhanced brand filtering
        if (selectedBrand !== "" && selectedBrand !== "All Brands") {
            var knownBrands = {
                "audi": /audi/i,
                "bmw": /bmw/i,
                "mercedes": /mercedes(-benz)?/i,
                "porsche": /porsche/i
            };
            var brandRegex = knownBrands[selectedBrand];
            if (!brandRegex || !vehicleName.match(brandRegex)) {
                $(this).hide();
                return;
            }
        }

        // Enhanced drivetrain type filtering
        if (selectedType !== "" && selectedType !== "All Types") {
            if (!drivetrainType.includes(selectedType)) {
                $(this).hide();
                return;
            }
        }

        // Enhanced year filtering
        var yearRegex = /(\d{4})/;
        var cardYear = parseInt(vehicleName.match(yearRegex)[1]);
        if (selectedYear !== "" && selectedYear !== "All Years" && selectedYear !== cardYear.toString()) {
            $(this).hide();
            return;
        }

        // Enhanced price filtering
        if (selectedPrice !== "" && (selectedPrice === "200000" && cardPrice < 200000 || cardPrice > parseInt(selectedPrice))) {
            $(this).hide();
            return;
        }

        // Show the vehicle card if it passes all filters
        $(this).show();
    });
});

   // Add to Wishlist functionality
   $(".add-to-wishlist").click(function () {
    var vehicleCard = $(this).closest(".vehicle-card");
    var vehicleName = vehicleCard.find(".vehicle-content h3").text();
    var vehiclePrice = vehicleCard.find(".vehicle-price").text();
    var vehicleImage = vehicleCard.find(".vehicle-image img").attr("src");

    // Check if the item is already in the wishlist
    if ($(".wishlist-item").find("h3").text() === vehicleName) {
        alert("This item is already in your wishlist.");
        return;
    }

    var wishlistItem = $("<div>", {
        class: "wishlist-item"
    }).append(
        $("<img>", {
            src: vehicleImage,
            alt: vehicleName
        }),
        $("<div>").append(
            $("<h3>").text(vehicleName),
            $("<p>").text(vehiclePrice)
        )
    );

    $(".wishlist-items").append(wishlistItem);

    // Provide visual feedback (fade in the added item)
    wishlistItem.hide().fadeIn(300);

    alert(vehicleName + " added to wishlist");
});
});



    // Pagination functionality
    $(".page-btn").on("click", function () {
        $(".page-btn.active").removeClass("active");
        $(this).addClass("active");
        // Here you would typically make an API call to get the next page of results
    });
