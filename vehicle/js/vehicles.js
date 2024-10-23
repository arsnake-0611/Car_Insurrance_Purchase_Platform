document.getElementById('logoLink').addEventListener('click', function(event) {
    event.preventDefault();
    window.location.href = 'home.html';
});

// Wishlist functionality
        document.querySelectorAll(".wishlist-btn").forEach((btn) => {
            btn.addEventListener("click", function () {
                this.textContent = this.textContent === "❤️" ? "♡" : "❤️";
            });
        });

        // Filter functionality
        const filters = document.querySelectorAll("select");
        filters.forEach((filter) => {
            filter.addEventListener("change", function () {
                // Here you would typically make an API call to filter results
                console.log("Filter changed:", this.id, this.value);
            });
        });

        // Pagination functionality
        document.querySelectorAll(".page-btn").forEach((btn) => {
            btn.addEventListener("click", function () {
                document.querySelector(".page-btn.active").classList.remove("active");
                this.classList.add("active");
                // Here you would typically make an API call to get the next page of results
            });
        });