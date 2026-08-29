/* =========================================================
   DIGITAL EMERGENCY ASSISTANT
   SAFETY GUIDE JAVASCRIPT
========================================================= */


/* =========================================================
   1. SHOW / HIDE GUIDE DETAILS
========================================================= */

function toggleGuide(button) {

    const card =
        button.closest(".guide-card");

    if (!card) {
        return;
    }


    const details =
        card.querySelector(".guide-details");

    if (!details) {
        return;
    }


    details.classList.toggle("show");


    if (details.classList.contains("show")) {

        button.textContent = "Hide";

    } else {

        button.textContent = "Read More";

    }

}


/* =========================================================
   2. CHECKLIST
========================================================= */

const safetyChecks =
    document.querySelectorAll(".safety-check");

const progressFill =
    document.getElementById("progressFill");

const progressPercent =
    document.getElementById("progressPercent");


function updateProgress() {

    if (safetyChecks.length === 0) {
        return;
    }


    let completed = 0;


    safetyChecks.forEach(function (checkbox) {

        if (checkbox.checked) {

            completed++;

        }

    });


    const percentage =
        Math.round(
            (completed / safetyChecks.length) * 100
        );


    progressFill.style.width =
        percentage + "%";


    progressPercent.textContent =
        percentage + "%";

}


/* =========================================================
   3. CHECKBOX EVENT
========================================================= */

safetyChecks.forEach(function (checkbox) {

    checkbox.addEventListener(
        "change",
        updateProgress
    );

});


/* =========================================================
   4. INITIAL PROGRESS
========================================================= */

updateProgress();