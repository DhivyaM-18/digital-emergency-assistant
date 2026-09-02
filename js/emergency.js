/* =========================================================
   DIGITAL EMERGENCY ASSISTANT
   EMERGENCY PAGE JAVASCRIPT
   emergency.js
========================================================= */


/* =========================================================
   1. LOAD EMERGENCY CONTACTS
   Reads contacts saved in localStorage
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    loadEmergencyContacts();

});


function loadEmergencyContacts() {

    const contactsList =
        document.getElementById("emergencyContactsList");

    if (!contactsList) {
        return;
    }


    /*
       Contacts are expected to be stored as:
       emergencyContacts

       Example:

       [
           {
               name: "Mother",
               relation: "Mom",
               phone: "9876543210"
           }
       ]
    */

    let contacts = [];

    try {

        contacts =
            JSON.parse(
                localStorage.getItem("emergencyContacts")
            ) || [];

    } catch (error) {

        console.error(
            "Unable to load emergency contacts:",
            error
        );

        contacts = [];

    }


    /* No contacts */

    if (!contacts.length) {

        contactsList.innerHTML = `

            <div class="empty-contacts">

                <p>
                    No emergency contacts have been added yet.
                </p>

                <a href="contacts.html">
                    Add Emergency Contacts
                </a>

            </div>

        `;

        return;
    }


    /* Clear existing content */

    contactsList.innerHTML = "";


    /* Display contacts */

    contacts.forEach(function (contact) {

        const card =
            document.createElement("div");

        card.className =
            "emergency-contact-card";


        card.innerHTML = `

            <div class="emergency-contact-info">

                <h3 class="emergency-contact-name">
                    ${escapeHTML(contact.name)}
                </h3>

                <p class="emergency-contact-relation">
                    ${escapeHTML(contact.relation || "Emergency Contact")}
                </p>

                <p class="emergency-contact-phone">
                    ${escapeHTML(contact.phone)}
                </p>

            </div>


            <div class="emergency-contact-actions">

                <a
                    href="tel:${escapeHTML(contact.phone)}"
                    class="contact-call-button">

                    Call

                </a>

            </div>

        `;


        contactsList.appendChild(card);

    });

}


/* =========================================================
   2. SAFE HTML FUNCTION
   Prevents saved contact information from being
   interpreted as HTML
========================================================= */

function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent =
        value == null ? "" : String(value);

    return div.innerHTML;

}


/* =========================================================
   3. GET CURRENT LOCATION
========================================================= */

function getCurrentLocation() {

    const locationResult =
        document.getElementById("locationResult");


    if (!locationResult) {
        return;
    }


    /* Check browser support */

    if (!navigator.geolocation) {

        locationResult.classList.add("show");

        locationResult.innerHTML = `

            <strong>
                Location unavailable
            </strong>

            <br>

            Your browser does not support location services.

        `;

        return;
    }


    /* Show loading message */

    locationResult.classList.add("show");

    locationResult.innerHTML = `

        <strong>
            Getting your location...
        </strong>

        <br>

        Please allow location access when your browser asks.

    `;


    /* Request location */

    navigator.geolocation.getCurrentPosition(

        function (position) {

            const latitude =
                position.coords.latitude;

            const longitude =
                position.coords.longitude;


            locationResult.innerHTML = `

                <strong>
                    Current Location
                </strong>

                <br><br>

                Latitude:
                ${latitude.toFixed(6)}

                <br>

                Longitude:
                ${longitude.toFixed(6)}

                <br><br>

                <a
                    href="https://www.google.com/maps?q=${latitude},${longitude}"
                    target="_blank"
                    rel="noopener noreferrer">

                    Open Location in Google Maps

                </a>

            `;

        },


        function (error) {

            let message =
                "Unable to get your location.";


            switch (error.code) {

                case error.PERMISSION_DENIED:

                    message =
                        "Location permission was denied. Please allow location access in your browser settings.";

                    break;


                case error.POSITION_UNAVAILABLE:

                    message =
                        "Your current location is unavailable. Please check your device location settings.";

                    break;


                case error.TIMEOUT:

                    message =
                        "The location request timed out. Please try again.";

                    break;

            }


            locationResult.classList.add("show");

            locationResult.innerHTML = `

                <strong>
                    Location Error
                </strong>

                <br><br>

                ${escapeHTML(message)}

            `;

        },


        {
            enableHighAccuracy: true,

            timeout: 10000,

            maximumAge: 0

        }

    );

}


/* =========================================================
   4. REFRESH CONTACTS
   Allows the page to reload contacts after changes
========================================================= */

window.addEventListener(
    "storage",
    function (event) {

        if (event.key === "emergencyContacts") {

            loadEmergencyContacts();

        }

    }
);