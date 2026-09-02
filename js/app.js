/* =========================================================
   DIGITAL EMERGENCY ASSISTANT
   COMMON JAVASCRIPT
   app.js
========================================================= */


/* =========================================================
   1. CURRENT YEAR
   Automatically updates the footer year
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const yearElements = document.querySelectorAll(".current-year");

    yearElements.forEach(function (element) {
        element.textContent = new Date().getFullYear();
    });

});


/* =========================================================
   2. MOBILE NAVIGATION
========================================================= */
 
function toggleMenu() {

    const navLinks = document.querySelector(".nav-links");

    if (!navLinks) {
        return;
    }

    navLinks.classList.toggle("show-menu");
}


/* =========================================================
   3. CLOSE MOBILE MENU
   Closes the menu after clicking a navigation link
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const navLinks = document.querySelectorAll(".nav-links a");

    navLinks.forEach(function (link) {

        link.addEventListener("click", function () {

            const menu = document.querySelector(".nav-links");

            if (menu) {
                menu.classList.remove("show-menu");
            }

        });

    });

});


/* =========================================================
   4. BACK TO TOP
========================================================= */

function scrollToTop() {

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* =========================================================
   5. SHOW / HIDE ELEMENT
   Reusable function for future pages
========================================================= */

function toggleElement(elementId) {

    const element = document.getElementById(elementId);

    if (!element) {
        return;
    }

    element.classList.toggle("show");
}


/* =========================================================
   6. SIMPLE NOTIFICATION
========================================================= */

function showNotification(message) {

    alert(message);

}