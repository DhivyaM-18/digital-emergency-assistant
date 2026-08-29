/* =========================================================
   DIGITAL EMERGENCY ASSISTANT
   FIRST AID JAVASCRIPT
========================================================= */


/* =========================================================
   1. VIEW / HIDE INSTRUCTIONS
========================================================= */

function toggleAid(button) {

    /*
       Find the instruction section inside
       the card that contains the clicked button.
    */

    const card = button.closest(".firstaid-card");

    if (!card) {
        return;
    }


    const details =
        card.querySelector(".aid-details");


    if (!details) {
        return;
    }


    /*
       Toggle the "show" class.
    */

    details.classList.toggle("show");


    /*
       Change button text.
    */

    if (details.classList.contains("show")) {

        button.textContent = "Hide Instructions";

    } else {

        button.textContent = "View Instructions";

    }

}


/* =========================================================
   2. SEARCH FIRST AID
========================================================= */

function searchFirstAid() {

    const searchInput =
        document.getElementById("firstAidSearch");

    const cards =
        document.querySelectorAll(".firstaid-card");

    const noResults =
        document.getElementById("noResults");


    if (!searchInput) {
        return;
    }


    const searchText =
        searchInput.value
        .trim()
        .toLowerCase();


    let visibleCards = 0;


    cards.forEach(function (card) {

        const cardText =
            card.textContent.toLowerCase();


        if (cardText.includes(searchText)) {

            card.classList.remove("hidden");

            visibleCards++;

        } else {

            card.classList.add("hidden");

        }

    });


    /*
       Show "No results" message
       when nothing matches.
    */

    if (visibleCards === 0) {

        noResults.classList.add("show");

    } else {

        noResults.classList.remove("show");

    }

}


/* =========================================================
   3. CATEGORY FILTER
========================================================= */

function filterFirstAid(category, button) {

    const cards =
        document.querySelectorAll(".firstaid-card");

    const categoryButtons =
        document.querySelectorAll(".category-btn");

    const noResults =
        document.getElementById("noResults");


    /*
       Remove active class
       from all category buttons.
    */

    categoryButtons.forEach(function (btn) {

        btn.classList.remove("active-category");

    });


    /*
       Add active class to
       clicked button.
    */

    if (button) {

        button.classList.add("active-category");

    }


    let visibleCards = 0;


    cards.forEach(function (card) {

        const cardCategory =
            card.getAttribute("data-category");


        if (
            category === "all" ||
            cardCategory === category
        ) {

            card.classList.remove("hidden");

            visibleCards++;

        } else {

            card.classList.add("hidden");

        }

    });


    /*
       Show or hide no-results message.
    */

    if (visibleCards === 0) {

        noResults.classList.add("show");

    } else {

        noResults.classList.remove("show");

    }

}


/* =========================================================
   4. RESET SEARCH WHEN CATEGORY IS SELECTED
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const searchInput =
            document.getElementById("firstAidSearch");


        const categoryButtons =
            document.querySelectorAll(".category-btn");


        categoryButtons.forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    /*
                       Clear search when
                       changing category.
                    */

                    if (searchInput) {

                        searchInput.value = "";

                    }

                }
            );

        });

    }
);