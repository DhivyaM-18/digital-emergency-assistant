/* =========================================================
   DIGITAL EMERGENCY ASSISTANT
   SAFETY GUIDE
   guide.js
========================================================= */


/* =========================================================
   STORAGE
========================================================= */

const CHECKLIST_STORAGE_KEY =
    "digitalEmergencyPreparednessChecklist";


/* =========================================================
   PAGE LOAD
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    loadChecklist();

    setupChecklist();

});


/* =========================================================
   SETUP CHECKBOXES
========================================================= */

function setupChecklist() {

    const checkboxes =
        document.querySelectorAll(".preparedness-check");


    checkboxes.forEach(function (checkbox) {

        checkbox.addEventListener(
            "change",
            function () {

                saveChecklist();

                updateChecklistProgress();

            }
        );

    });


    updateChecklistProgress();

}


/* =========================================================
   SAVE CHECKLIST
========================================================= */

function saveChecklist() {

    const checkboxes =
        document.querySelectorAll(".preparedness-check");


    const checklistData = {};


    checkboxes.forEach(function (checkbox) {

        const item =
            checkbox.dataset.item;


        checklistData[item] =
            checkbox.checked;

    });


    localStorage.setItem(

        CHECKLIST_STORAGE_KEY,

        JSON.stringify(checklistData)

    );

}


/* =========================================================
   LOAD CHECKLIST
========================================================= */

function loadChecklist() {

    const savedData =
        localStorage.getItem(
            CHECKLIST_STORAGE_KEY
        );


    if (!savedData) {
        updateChecklistProgress();
        return;
    }


    try {

        const checklistData =
            JSON.parse(savedData);


        const checkboxes =
            document.querySelectorAll(
                ".preparedness-check"
            );


        checkboxes.forEach(function (checkbox) {

            const item =
                checkbox.dataset.item;


            checkbox.checked =
                checklistData[item] === true;

        });


        updateChecklistProgress();


    } catch (error) {

        console.error(
            "Unable to load preparedness checklist:",
            error
        );

    }

}


/* =========================================================
   UPDATE PROGRESS
========================================================= */

function updateChecklistProgress() {

    const checkboxes =
        document.querySelectorAll(
            ".preparedness-check"
        );


    const progressText =
        document.getElementById(
            "checklistProgress"
        );


    const progressFill =
        document.getElementById(
            "progressFill"
        );


    if (!checkboxes.length) {
        return;
    }


    let completed = 0;


    checkboxes.forEach(function (checkbox) {

        if (checkbox.checked) {

            completed++;

        }

    });


    const total =
        checkboxes.length;


    const percentage =
        Math.round(
            (completed / total) * 100
        );


    /* Update percentage text */

    if (progressText) {

        progressText.textContent =
            percentage + "%";

    }


    /* Update progress bar */

    if (progressFill) {

        progressFill.style.width =
            percentage + "%";

    }

}


/* =========================================================
   RESET CHECKLIST
========================================================= */

function resetChecklist() {

    const confirmed =
        confirm(
            "Are you sure you want to reset the preparedness checklist?"
        );


    if (!confirmed) {
        return;
    }


    const checkboxes =
        document.querySelectorAll(
            ".preparedness-check"
        );


    checkboxes.forEach(function (checkbox) {

        checkbox.checked = false;

    });


    localStorage.removeItem(
        CHECKLIST_STORAGE_KEY
    );


    updateChecklistProgress();

}