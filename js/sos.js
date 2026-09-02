/* =================================
   SOS EMERGENCY FUNCTIONALITY
================================= */

const sosButton = document.getElementById("sos-button");
const sosStatus = document.getElementById("sos-status");

const shareLocationButton = document.getElementById("share-location");
const whatsappButton = document.getElementById("whatsapp-alert");


/* =================================
   SOS BUTTON
================================= */

if (sosButton) {

    sosButton.addEventListener("click", () => {

        const confirmSOS = confirm(
            "Are you sure you want to activate Emergency SOS?"
        );

        if (!confirmSOS) {
            return;
        }

        sosStatus.textContent =
            "🚨 SOS ACTIVATED! Please call 112 for immediate emergency assistance.";

        sosButton.innerHTML =
            '<i class="fa-solid fa-phone-volume"></i> SOS ACTIVATED';

        sosButton.classList.add("sos-active");

        // Try to create an alert sound
        playSOSSound();

        // Get user's location
        getEmergencyLocation();

    });

}


/* =================================
   SOS SOUND
================================= */

function playSOSSound() {

    try {

        const audioContext =
            new (window.AudioContext || window.webkitAudioContext)();

        const oscillator =
            audioContext.createOscillator();

        const gainNode =
            audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 900;

        gainNode.gain.value = 0.3;

        oscillator.start();

        setTimeout(() => {
            oscillator.stop();
        }, 1000);

    } catch (error) {

        console.log("Audio could not be played.");

    }

}


/* =================================
   GET EMERGENCY LOCATION
================================= */

function getEmergencyLocation() {

    if (!navigator.geolocation) {

        sosStatus.textContent =
            "SOS activated, but location services are not supported.";

        return;
    }

    navigator.geolocation.getCurrentPosition(

        (position) => {

            const latitude =
                position.coords.latitude;

            const longitude =
                position.coords.longitude;

            const mapsLink =
                `https://www.google.com/maps?q=${latitude},${longitude}`;

            sosStatus.innerHTML =
                `🚨 SOS ACTIVATED!<br>
                 Location detected.<br>
                 <a href="${mapsLink}" target="_blank">
                 View My Location
                 </a>`;

        },

        () => {

            sosStatus.textContent =
                "SOS activated, but location permission was denied.";

        }

    );

}


/* =================================
   SHARE LOCATION
================================= */

if (shareLocationButton) {

    shareLocationButton.addEventListener("click", () => {

        if (!navigator.geolocation) {

            alert("Location services are not supported by your browser.");

            return;
        }

        shareLocationButton.textContent =
            "Getting Location...";

        navigator.geolocation.getCurrentPosition(

            (position) => {

                const latitude =
                    position.coords.latitude;

                const longitude =
                    position.coords.longitude;

                const mapsLink =
                    `https://www.google.com/maps?q=${latitude},${longitude}`;

                const message =
                    `🚨 Emergency! I need help. My current location is: ${mapsLink}`;

                if (navigator.share) {

                    navigator.share({
                        title: "Emergency Location",
                        text: message
                    });

                } else {

                    navigator.clipboard.writeText(message);

                    alert(
                        "Emergency location message copied to clipboard."
                    );

                }

                shareLocationButton.textContent =
                    "Share Location";

            },

            () => {

                alert(
                    "Unable to get your location. Please allow location permission."
                );

                shareLocationButton.textContent =
                    "Share Location";

            }

        );

    });

}


/* =================================
   WHATSAPP ALERT
================================= */

if (whatsappButton) {

    whatsappButton.addEventListener("click", () => {

        if (!navigator.geolocation) {

            alert(
                "Location services are not supported by your browser."
            );

            return;
        }

        whatsappButton.textContent =
            "Getting Location...";

        navigator.geolocation.getCurrentPosition(

            (position) => {

                const latitude =
                    position.coords.latitude;

                const longitude =
                    position.coords.longitude;

                const mapsLink =
                    `https://www.google.com/maps?q=${latitude},${longitude}`;

                const message =
                    `🚨 EMERGENCY ALERT 🚨%0A%0AI need immediate help.%0AMy current location:%0A${mapsLink}`;

                const whatsappURL =
                    `https://wa.me/?text=${message}`;

                window.open(
                    whatsappURL,
                    "_blank"
                );

                whatsappButton.textContent =
                    "Send Alert";

            },

            () => {

                alert(
                    "Unable to get your location. Please allow location permission."
                );

                whatsappButton.textContent =
                    "Send Alert";

            }

        );

    });

}