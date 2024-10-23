document.getElementById('logoLink').addEventListener('click', function(event) {
    event.preventDefault();
    window.location.href = 'home.html';
});

// Tab switching functionality
   document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", function () {
        document
            .querySelectorAll(".tab")
            .forEach((t) => t.classList.remove("active"));
        this.classList.add("active");
    });
});