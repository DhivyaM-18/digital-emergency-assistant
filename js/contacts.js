/* =========================================================
   DIGITAL EMERGENCY ASSISTANT
   CONTACTS / MEDICAL CARD
   contacts.js
========================================================= */


/* =========================================================
   STORAGE KEYS
========================================================= */

const MEDICAL_CARD_KEY = "digitalEmergencyMedicalCard";
const EMERGENCY_CONTACTS_KEY = "digitalEmergencyContacts";


/* =========================================================
   PAGE LOAD
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    loadMedicalCard();

    loadEmergencyContacts();

    setupMedicalForm();

    setupContactForm();

});


/* =========================================================
   MEDICAL CARD
========================================================= */


/* Setup Medical Card Form */

function setupMedicalForm() {

    const form = document.getElementById("medicalForm");

    if (!form) {
        return;
    }

    form.addEventListener("submit", function (event) {

        event.preventDefault();

        saveMedicalCard();

    });

}


/* Save Medical Card */

function saveMedicalCard() {

    const name = document
        .getElementById("personName")
        .value
        .trim();

    const bloodGroup = document
        .getElementById("bloodGroup")
        .value;

    const allergies = document
        .getElementById("allergies")
        .value
        .trim();

    const medications = document
        .getElementById("medications")
        .value
        .trim();


    const medicalData = {

        name: name,

        bloodGroup: bloodGroup,

        allergies: allergies,

        medications: medications

    };


    localStorage.setItem(
        MEDICAL_CARD_KEY,
        JSON.stringify(medicalData)
    );


    displayMedicalCard(medicalData);


    const status = document.getElementById("save-status");

    if (status) {

        status.textContent =
            "Medical information saved successfully.";

    }

}


/* Load Medical Card */

function loadMedicalCard() {

    const savedData =
        localStorage.getItem(MEDICAL_CARD_KEY);

    if (!savedData) {
        return;
    }


    try {

        const medicalData =
            JSON.parse(savedData);


        /* Put saved information back into form */

        const nameInput =
            document.getElementById("personName");

        const bloodInput =
            document.getElementById("bloodGroup");

        const allergiesInput =
            document.getElementById("allergies");

        const medicationsInput =
            document.getElementById("medications");


        if (nameInput) {
            nameInput.value = medicalData.name || "";
        }

        if (bloodInput) {
            bloodInput.value =
                medicalData.bloodGroup || "";
        }

        if (allergiesInput) {
            allergiesInput.value =
                medicalData.allergies || "";
        }

        if (medicationsInput) {
            medicationsInput.value =
                medicalData.medications || "";
        }


        displayMedicalCard(medicalData);


    } catch (error) {

        console.error(
            "Unable to load medical card:",
            error
        );

    }

}


/* Display Medical Card */

function displayMedicalCard(data) {

    const displayName =
        document.getElementById("displayName");

    const displayBlood =
        document.getElementById("displayBlood");

    const displayAllergies =
        document.getElementById("displayAllergies");

    const displayMedications =
        document.getElementById("displayMedications");


    if (displayName) {

        displayName.textContent =
            data.name || "Not provided";

    }


    if (displayBlood) {

        displayBlood.textContent =
            data.bloodGroup || "Not provided";

    }


    if (displayAllergies) {

        displayAllergies.textContent =
            data.allergies || "Not provided";

    }


    if (displayMedications) {

        displayMedications.textContent =
            data.medications || "Not provided";

    }

}


/* Clear Medical Card */

function clearMedicalCard() {

    const confirmed =
        confirm(
            "Are you sure you want to clear your medical information?"
        );


    if (!confirmed) {
        return;
    }


    localStorage.removeItem(MEDICAL_CARD_KEY);


    const form =
        document.getElementById("medicalForm");


    if (form) {
        form.reset();
    }


    const data = {

        name: "",

        bloodGroup: "",

        allergies: "",

        medications: ""

    };


    displayMedicalCard(data);


    const status =
        document.getElementById("save-status");


    if (status) {

        status.textContent =
            "Medical information cleared.";

    }

}


/* =========================================================
   EMERGENCY CONTACTS
========================================================= */


/* Setup Contact Form */

function setupContactForm() {

    const form =
        document.getElementById("contactForm");


    if (!form) {
        return;
    }


    form.addEventListener("submit", function (event) {

        event.preventDefault();

        addEmergencyContact();

    });

}


/* Show Contact Form */

function showContactForm() {

    const container =
        document.getElementById(
            "contact-form-container"
        );


    if (!container) {
        return;
    }


    container.classList.add("show");


    const nameInput =
        document.getElementById("contactName");


    if (nameInput) {

        nameInput.focus();

    }

}


/* Hide Contact Form */

function hideContactForm() {

    const container =
        document.getElementById(
            "contact-form-container"
        );


    if (container) {

        container.classList.remove("show");

    }


    const form =
        document.getElementById("contactForm");


    if (form) {

        form.reset();

    }

}


/* Add Emergency Contact */

function addEmergencyContact() {

    const nameInput =
        document.getElementById("contactName");

    const relationshipInput =
        document.getElementById(
            "contactRelationship"
        );

    const phoneInput =
        document.getElementById("contactPhone");


    if (
        !nameInput ||
        !relationshipInput ||
        !phoneInput
    ) {
        return;
    }


    const name =
        nameInput.value.trim();

    const relationship =
        relationshipInput.value;

    const phone =
        phoneInput.value.trim();


    /* Basic validation */

    if (!name || !relationship || !phone) {

        alert(
            "Please fill in all emergency contact details."
        );

        return;

    }


    /* Get existing contacts */

    let contacts =
        getEmergencyContacts();


    /* Create new contact */

    const newContact = {

        id: Date.now(),

        name: name,

        relationship: relationship,

        phone: phone

    };


    contacts.push(newContact);


    /* Save contacts */

    localStorage.setItem(

        EMERGENCY_CONTACTS_KEY,

        JSON.stringify(contacts)

    );


    /* Update display */

    displayEmergencyContacts(contacts);


    /* Close form */

    hideContactForm();

}


/* Get Emergency Contacts */

function getEmergencyContacts() {

    const savedContacts =
        localStorage.getItem(
            EMERGENCY_CONTACTS_KEY
        );


    if (!savedContacts) {

        return [];

    }


    try {

        return JSON.parse(savedContacts);

    } catch (error) {

        console.error(
            "Unable to load emergency contacts:",
            error
        );

        return [];

    }

}


/* Load Emergency Contacts */

function loadEmergencyContacts() {

    const contacts =
        getEmergencyContacts();


    displayEmergencyContacts(contacts);

}


/* Display Emergency Contacts */

function displayEmergencyContacts(contacts) {

    const container =
        document.getElementById(
            "contacts-list"
        );


    if (!container) {
        return;
    }


    /* No contacts */

    if (contacts.length === 0) {

        container.innerHTML = `

            <div class="no-contacts">

                <h3>
                    No Emergency Contacts Added
                </h3>

                <p>
                    Add a trusted family member or friend
                    so they can be contacted during an emergency.
                </p>

            </div>

        `;

        return;

    }


    /* Clear existing content */

    container.innerHTML = "";


    /* Create contact cards */

    contacts.forEach(function (contact) {


        const contactItem =
            document.createElement("div");


        contactItem.className =
            "contact-item";


        contactItem.innerHTML = `

            <div class="contact-info">

                <h3>
                    ${escapeHTML(contact.name)}
                </h3>

                <p>
                    ${escapeHTML(contact.relationship)}
                </p>

                <p class="contact-phone">
                    ${escapeHTML(contact.phone)}
                </p>

            </div>


            <div class="contact-actions">

                <a
                    href="tel:${encodeURIComponent(contact.phone)}"
                    class="call-button">

                    Call

                </a>


                <button
                    type="button"
                    class="delete-contact-button"
                    onclick="deleteEmergencyContact(${contact.id})">

                    Delete

                </button>

            </div>

        `;


        container.appendChild(contactItem);

    });

}


/* =========================================================
   DELETE CONTACT
========================================================= */

function deleteEmergencyContact(contactId) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this emergency contact?"
        );


    if (!confirmed) {
        return;
    }


    let contacts =
        getEmergencyContacts();


    contacts =
        contacts.filter(function (contact) {

            return contact.id !== contactId;

        });


    localStorage.setItem(

        EMERGENCY_CONTACTS_KEY,

        JSON.stringify(contacts)

    );


    displayEmergencyContacts(contacts);

}


/* =========================================================
   SECURITY HELPER
========================================================= */

/*
   Prevent user-entered contact information
   from being interpreted as HTML.
*/

function escapeHTML(value) {

    return String(value)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}