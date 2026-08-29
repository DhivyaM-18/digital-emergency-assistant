/* =========================================================
   DIGITAL EMERGENCY ASSISTANT
   EMERGENCY PAGE JAVASCRIPT
========================================================= */


/* =========================================================
   1. EMERGENCY CALL
========================================================= */

function callEmergency() {

    const confirmCall = confirm(
        "This will open your phone's emergency calling option. Continue?"
    );

    if (confirmCall) {

        window.location.href = "tel:112";

    }

}


/* =========================================================
   2. GET USER LOCATION
========================================================= */

function shareLocation() {

    if (!navigator.geolocation) {

        alert(
            "Location services are not supported by your browser."
        );

        return;
    }


    navigator.geolocation.getCurrentPosition(

        function (position) {

            const latitude =
                position.coords.latitude;

            const longitude =
                position.coords.longitude;


            const locationURL =
                "https://www.google.com/maps?q="
                + latitude
                + ","
                + longitude;


            const openMap = confirm(
                "Your location has been detected.\n\n" +
                "Latitude: " + latitude.toFixed(5) +
                "\nLongitude: " + longitude.toFixed(5) +
                "\n\nOpen location in Google Maps?"
            );


            if (openMap) {

                window.open(
                    locationURL,
                    "_blank"
                );

            }

        },


        function () {

            alert(
                "Unable to get your location. " +
                "Please enable location permission " +
                "and try again."
            );

        }

    );

}