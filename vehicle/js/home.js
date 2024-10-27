$(document).ready(function () {
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

// Add smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute("href")).scrollIntoView({
            behavior: "smooth",
        });
    });
});

// Add scroll animation for elements
window.addEventListener("scroll", function () {
    const elements = document.querySelectorAll(
        ".featured-card, .service-card"
    );
    elements.forEach((element) => {
        const position = element.getBoundingClientRect();
        if (position.top < window.innerHeight * 0.75) {
            element.style.opacity = "1";
            element.style.transform = "translateY(0)";
        }
    });
});
