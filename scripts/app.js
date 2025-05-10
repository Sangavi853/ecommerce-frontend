console.log("E-Commerce Website Loaded");
// Wait until the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function() {
    const hamburgerMenu = document.querySelector(".hamburger-menu");
    const navMenu = document.querySelector(".nav-menu");

    // Toggle the navigation menu on hamburger menu click
    hamburgerMenu.addEventListener("click", function() {
        navMenu.classList.toggle("active");
    });
});
