/* =========================================================
   DIGITAL EMERGENCY ASSISTANT
   FIRST AID PAGE JAVASCRIPT
   firstaid.js
========================================================= */


/* =========================================================
   VIEW / HIDE INSTRUCTIONS
========================================================= */

function toggleInstructions(instructionId) {

    const instructions = document.getElementById(instructionId);

    if (!instructions) {
        return;
    }

    /*
       Find the button belonging to this
       instruction section.
    */

    const button = instructions
        .previousElementSibling;


    /*
       Check whether the instructions
       are currently visible.
    */

    const isVisible =
        instructions.classList.contains("show");


    if (isVisible) {

        /* Hide instructions */

        instructions.classList.remove("show");

        button.textContent =
            "View Instructions";

    } else {

        /* Show instructions */

        instructions.classList.add("show");

        button.textContent =
            "Hide Instructions";

    }

}