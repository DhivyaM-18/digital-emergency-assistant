/* =========================================================
   DIGITAL EMERGENCY ASSISTANT
   CONTACTS JAVASCRIPT
========================================================= */


/* =========================================================
   1. GET ELEMENTS
========================================================= */

const contactForm =
    document.getElementById("contactForm");

const contactsGrid =
    document.getElementById("contactsGrid");

const contactCount =
    document.getElementById("contactCount");

const emptyContacts =
    document.getElementById("emptyContacts");


/* =========================================================
   2. LOAD CONTACTS
========================================================= */

let contacts =
    JSON.parse(
        localStorage.getItem("emergencyContacts")
    ) || [];


/* =========================================================
   3. DISPLAY CONTACTS
========================================================= */

function displayContacts() {

    /*
       Remove old contact cards.
    */

    const oldCards =
        contactsGrid.querySelectorAll(".contact-card");

    oldCards.forEach(function (card) {

        card.remove();

    });


    /*
       Update contact count.
    */

    contactCount.textContent =
        contacts.length;


    /*
       Show empty message if there
       are no contacts.
    */

    if (contacts.length === 0) {

        emptyContacts.style.display = "block";

        return;

    }


    emptyContacts.style.display = "none";


    /*
       Create a card for each contact.
    */

    contacts.forEach(function (contact, index) {

        const card =
            document.createElement("div");

        card.className = "contact-card";


        /*
           First letter for avatar.
        */

        const firstLetter =
            contact.name.charAt(0).toUpperCase();


        card.innerHTML = `

            <div class="contact-top">

                <div class="contact-avatar">
                    ${firstLetter}
                </div>

                <div>

                    <div class="contact-name">
                        ${contact.name}
                    </div>

                    <div class="contact-relation">
                        ${contact.relation}
                    </div>

                </div>

            </div>


            <div class="contact-phone">

                📞 ${contact.phone}

            </div>


            <div class="contact-actions">

                <a
                    href="tel:${contact.phone}"
                    class="call-contact">

                    📞 Call

                </a>


                <button
                    class="delete-contact"
                    onclick="deleteContact(${index})">

                    Delete

                </button>

            </div>

        `;


        contactsGrid.appendChild(card);

    });

}


/* =========================================================
   4. ADD CONTACT
========================================================= */

if (contactForm) {

    contactForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const name =
                document.getElementById(
                    "contactName"
                ).value.trim();


            const relation =
                document.getElementById(
                    "contactRelation"
                ).value;


            const phone =
                document.getElementById(
                    "contactPhone"
                ).value.trim();


            /*
               Basic validation.
            */

            if (
                name === "" ||
                relation === "" ||
                phone === ""
            ) {

                alert(
                    "Please fill in all the fields."
                );

                return;

            }


            /*
               Create contact object.
            */

            const newContact = {

                name: name,

                relation: relation,

                phone: phone

            };


            /*
               Add to array.
            */

            contacts.push(newContact);


            /*
               Save to browser storage.
            */

            localStorage.setItem(
                "emergencyContacts",
                JSON.stringify(contacts)
            );


            /*
               Refresh display.
            */

            displayContacts();


            /*
               Clear form.
            */

            contactForm.reset();


            alert(
                "Emergency contact added successfully!"
            );

        }
    );

}


/* =========================================================
   5. DELETE CONTACT
========================================================= */

function deleteContact(index) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this contact?"
        );


    if (!confirmDelete) {

        return;

    }


    /*
       Remove contact.
    */

    contacts.splice(index, 1);


    /*
       Update localStorage.
    */

    localStorage.setItem(
        "emergencyContacts",
        JSON.stringify(contacts)
    );


    /*
       Refresh cards.
    */

    displayContacts();

}


/* =========================================================
   6. INITIAL DISPLAY
========================================================= */

displayContacts();