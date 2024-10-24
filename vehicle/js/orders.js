// Tab switching functionality
   document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", function () {
        document
            .querySelectorAll(".tab")
            .forEach((t) => t.classList.remove("active"));
        this.classList.add("active");
    });
});