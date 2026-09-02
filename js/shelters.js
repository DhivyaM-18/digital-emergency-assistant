/* =========================================================
   DIGITAL EMERGENCY ASSISTANT
   NEARBY EMERGENCY SERVICES
   5 KM LOCATION SEARCH
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
       ===================================================== */

    const locationButton =
        document.getElementById("find-services");

    const locationStatus =
        document.getElementById("location-status");

    const resultsContainer =
        document.getElementById("results-container");

    const resultsMessage =
        document.getElementById("results-message");


    /* =====================================================
       USER LOCATION
       ===================================================== */

    let userLatitude = null;
    let userLongitude = null;


    /* =====================================================
       MAP
       ===================================================== */

    let map = null;
    let userMarker = null;
    let serviceMarkers = [];


    /* =====================================================
       SEARCH RADIUS
       5 KM
       ===================================================== */

    const SEARCH_RADIUS = 5000;


    /* =====================================================
       SERVICES
       ===================================================== */

    const services = {

        hospital: {
            name: "Hospitals",
            icon: "fa-hospital",
            className: "hospital"
        },

        police: {
            name: "Police Stations",
            icon: "fa-shield-halved",
            className: "police"
        },

        fire: {
            name: "Fire Stations",
            icon: "fa-fire-extinguisher",
            className: "fire"
        },

        shelter: {
            name: "Emergency Shelters",
            icon: "fa-house",
            className: "shelter"
        }

    };


    /* =====================================================
       INITIALIZE MAP
       ===================================================== */

    function initializeMap(latitude, longitude) {

        if (!map) {

            map = L.map("emergency-map").setView(
                [latitude, longitude],
                14
            );


            L.tileLayer(
                "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                {
                    maxZoom: 19,

                    attribution:
                        "&copy; OpenStreetMap contributors"
                }
            ).addTo(map);

        }

        else {

            map.setView(
                [latitude, longitude],
                14
            );

        }


        /* =================================================
           REMOVE OLD USER MARKER
           ================================================= */

        if (userMarker) {

            map.removeLayer(userMarker);

        }


        /* =================================================
           ADD USER MARKER
           ================================================= */

        userMarker = L.marker([
            latitude,
            longitude
        ]).addTo(map);


        userMarker.bindPopup(
            "<strong>Your Location</strong><br>" +
            "You are here."
        );


        userMarker.openPopup();

    }


    /* =====================================================
       GET USER LOCATION
       ===================================================== */

    function getUserLocation() {

        if (!navigator.geolocation) {

            locationStatus.textContent =
                "Geolocation is not supported by your browser.";

            return;

        }


        locationStatus.textContent =
            "Detecting your location...";


        locationButton.disabled = true;


        navigator.geolocation.getCurrentPosition(

            position => {

                userLatitude =
                    position.coords.latitude;

                userLongitude =
                    position.coords.longitude;


                console.log(
                    "User location:",
                    userLatitude,
                    userLongitude
                );


                initializeMap(
                    userLatitude,
                    userLongitude
                );


                locationStatus.textContent =
                    `Location detected: ${userLatitude.toFixed(4)}, ${userLongitude.toFixed(4)}`;


                resultsMessage.textContent =
                    "Location detected. Select a service to search within 5 km.";


                resultsContainer.innerHTML = `

                    <div class="result-card">

                        <div class="result-info">

                            <h3>
                                <i class="fa-solid fa-location-dot"></i>
                                Location Ready
                            </h3>

                            <p>
                                Select Hospital, Police Station,
                                Fire Station or Emergency Shelter
                                to find nearby services.
                            </p>

                        </div>

                    </div>

                `;


                locationButton.disabled = false;

            },


            error => {

                console.error(
                    "Location error:",
                    error
                );


                locationButton.disabled = false;


                if (error.code === 1) {

                    locationStatus.textContent =
                        "Location permission denied. Please allow location access.";

                }

                else if (error.code === 2) {

                    locationStatus.textContent =
                        "Your location could not be determined.";

                }

                else if (error.code === 3) {

                    locationStatus.textContent =
                        "Location request timed out. Please try again.";

                }

                else {

                    locationStatus.textContent =
                        "Unable to detect your location.";

                }

            },


            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000
            }

        );

    }


    /* =====================================================
       CREATE QUERY FOR SELECTED SERVICE
       ===================================================== */

    function createQuery(service) {

        let serviceQuery = "";


        /* =================================================
           HOSPITAL QUERY
           ================================================= */

        if (service === "hospital") {

            serviceQuery = `

                nwr[
                    "amenity"="hospital"
                ](
                    around:${SEARCH_RADIUS},
                    ${userLatitude},
                    ${userLongitude}
                );

                nwr[
                    "healthcare"="hospital"
                ](
                    around:${SEARCH_RADIUS},
                    ${userLatitude},
                    ${userLongitude}
                );

            `;

        }


        /* =================================================
           POLICE QUERY
           ================================================= */

        else if (service === "police") {

            serviceQuery = `

                nwr[
                    "amenity"="police"
                ](
                    around:${SEARCH_RADIUS},
                    ${userLatitude},
                    ${userLongitude}
                );

                nwr[
                    "police"="station"
                ](
                    around:${SEARCH_RADIUS},
                    ${userLatitude},
                    ${userLongitude}
                );

            `;

        }


        /* =================================================
           FIRE STATION QUERY
           ================================================= */

        else if (service === "fire") {

            serviceQuery = `

                nwr[
                    "amenity"="fire_station"
                ](
                    around:${SEARCH_RADIUS},
                    ${userLatitude},
                    ${userLongitude}
                );

            `;

        }


        /* =================================================
           SHELTER QUERY
           ================================================= */

        else if (service === "shelter") {

            serviceQuery = `

                nwr[
                    "amenity"="shelter"
                ](
                    around:${SEARCH_RADIUS},
                    ${userLatitude},
                    ${userLongitude}
                );

                nwr[
                    "emergency"="shelter"
                ](
                    around:${SEARCH_RADIUS},
                    ${userLatitude},
                    ${userLongitude}
                );

                nwr[
                    "social_facility"="shelter"
                ](
                    around:${SEARCH_RADIUS},
                    ${userLatitude},
                    ${userLongitude}
                );

            `;

        }


        return `

            [out:json][timeout:20];

            (

                ${serviceQuery}

            );

            out center tags;

        `;

    }


    /* =====================================================
       GET COORDINATES
       ===================================================== */

    function getCoordinates(element) {

        /* Node */

        if (
            element.lat !== undefined &&
            element.lon !== undefined
        ) {

            return {

                lat: element.lat,
                lon: element.lon

            };

        }


        /* Way / Relation */

        if (element.center) {

            return {

                lat: element.center.lat,
                lon: element.center.lon

            };

        }


        return null;

    }


    /* =====================================================
       CALCULATE DISTANCE
       ===================================================== */

    function calculateDistance(
        lat1,
        lon1,
        lat2,
        lon2
    ) {

        const earthRadius = 6371;


        const dLat =
            (lat2 - lat1) *
            Math.PI /
            180;


        const dLon =
            (lon2 - lon1) *
            Math.PI /
            180;


        const a =

            Math.sin(dLat / 2) *
            Math.sin(dLat / 2)

            +

            Math.cos(
                lat1 * Math.PI / 180
            )

            *

            Math.cos(
                lat2 * Math.PI / 180
            )

            *

            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);


        const c =
            2 *
            Math.atan2(
                Math.sqrt(a),
                Math.sqrt(1 - a)
            );


        return earthRadius * c;

    }


    /* =====================================================
       GET ADDRESS
       ===================================================== */

    function getAddress(tags) {

        const parts = [];


        if (tags["addr:housenumber"]) {

            parts.push(
                tags["addr:housenumber"]
            );

        }


        if (tags["addr:street"]) {

            parts.push(
                tags["addr:street"]
            );

        }


        if (tags["addr:city"]) {

            parts.push(
                tags["addr:city"]
            );

        }


        if (parts.length > 0) {

            return parts.join(", ");

        }


        if (tags["addr:full"]) {

            return tags["addr:full"];

        }


        if (tags["description"]) {

            return tags["description"];

        }


        return "Address not available";

    }


    /* =====================================================
       CLEAR SERVICE MARKERS
       ===================================================== */

    function clearServiceMarkers() {

        serviceMarkers.forEach(
            marker => {

                if (map) {

                    map.removeLayer(marker);

                }

            }
        );


        serviceMarkers = [];

    }


    /* =====================================================
       FETCH FROM OVERPASS
       ===================================================== */

    async function fetchFromOverpass(query) {

        /*
         * We use GET instead of POST.
         *
         * This avoids unnecessary browser preflight/CORS
         * problems caused by application/x-www-form-urlencoded.
         */

        const servers = [

            "https://overpass-api.de/api/interpreter",

            "https://overpass.kumi.systems/api/interpreter",

            "https://z.overpass-api.de/api/interpreter"

        ];


        let lastError = null;


        for (const server of servers) {

            try {

                console.log(
                    "Trying Overpass server:",
                    server
                );


                const controller =
                    new AbortController();


                const timeoutId =
                    setTimeout(
                        () => controller.abort(),
                        20000
                    );


                const url =
                    server +
                    "?data=" +
                    encodeURIComponent(query);


                const response =
                    await fetch(
                        url,
                        {
                            method: "GET",

                            signal:
                                controller.signal
                        }
                    );


                clearTimeout(timeoutId);


                if (!response.ok) {

                    throw new Error(
                        `Server returned HTTP ${response.status}`
                    );

                }


                const data =
                    await response.json();


                console.log(
                    "Overpass server succeeded:",
                    server
                );


                return data;

            }


            catch (error) {

                console.warn(
                    "Overpass server failed:",
                    server,
                    error
                );


                lastError = error;

            }

        }


        throw lastError ||
            new Error(
                "All Overpass servers failed."
            );

    }


    /* =====================================================
       DETERMINE SERVICE TYPE
       ===================================================== */

    function determineService(
        tags,
        selectedService
    ) {

        if (selectedService === "hospital") {

            if (
                tags.amenity === "hospital" ||
                tags.healthcare === "hospital"
            ) {

                return "hospital";

            }

        }


        if (selectedService === "police") {

            if (
                tags.amenity === "police" ||
                tags.police === "station"
            ) {

                return "police";

            }

        }


        if (selectedService === "fire") {

            if (
                tags.amenity === "fire_station"
            ) {

                return "fire";

            }

        }


        if (selectedService === "shelter") {

            if (
                tags.amenity === "shelter" ||
                tags.emergency === "shelter" ||
                tags.social_facility === "shelter"
            ) {

                return "shelter";

            }

        }


        return null;

    }


    /* =====================================================
       SEARCH SELECTED SERVICE
       ===================================================== */

    async function searchNearbyService(service) {

        /* =================================================
           CHECK LOCATION
           ================================================= */

        if (
            userLatitude === null ||
            userLongitude === null
        ) {

            resultsMessage.textContent =
                "Please click 'Use My Location' first.";

            resultsContainer.innerHTML = `

                <div class="result-card">

                    <div class="result-info">

                        <h3>
                            <i class="fa-solid fa-location-dot"></i>
                            Location Required
                        </h3>

                        <p>
                            Please allow location access
                            before searching for nearby services.
                        </p>

                    </div>

                </div>

            `;

            return;

        }


        /* =================================================
           CHECK SERVICE
           ================================================= */

        if (!services[service]) {

            console.error(
                "Unknown service:",
                service
            );

            return;

        }


        const serviceInfo =
            services[service];


        /* =================================================
           SHOW SEARCHING MESSAGE
           ================================================= */

        resultsMessage.textContent =
            `Searching for ${serviceInfo.name.toLowerCase()} within 5 km...`;


        resultsContainer.innerHTML = `

            <div class="result-card">

                <div class="result-info">

                    <h3>

                        <i class="fa-solid fa-spinner fa-spin"></i>

                        Searching ${serviceInfo.name}

                    </h3>

                    <p>

                        Finding nearby
                        ${serviceInfo.name.toLowerCase()}
                        within 5 km of your location.

                    </p>

                </div>

            </div>

        `;


        /* =================================================
           REMOVE OLD MARKERS
           ================================================= */

        clearServiceMarkers();


        /* =================================================
           CREATE QUERY
           ================================================= */

        const query =
            createQuery(service);


        console.log(
            `Searching only for ${serviceInfo.name}:`
        );


        console.log(query);


        try {

            /* =================================================
               FETCH DATA
               ================================================= */

            const data =
                await fetchFromOverpass(query);


            console.log(
                "Overpass result:",
                data
            );


            /* =================================================
               DISPLAY RESULTS
               ================================================= */

            displayResults(
                data.elements || [],
                service
            );

        }


        catch (error) {

            console.error(
                "Unable to search nearby services:",
                error
            );


            resultsMessage.textContent =
                `Unable to load ${serviceInfo.name.toLowerCase()}.`;


            resultsContainer.innerHTML = `

                <div class="result-card">

                    <div class="result-info">

                        <h3>

                            <i class="fa-solid fa-triangle-exclamation"></i>

                            Unable to Load Results

                        </h3>

                        <p>

                            The map service is temporarily
                            unavailable. Please try again later.

                        </p>


                        <button
                            id="retry-search"
                            class="map-button">

                            <i class="fa-solid fa-rotate-right"></i>

                            Try Again

                        </button>

                    </div>

                </div>

            `;


            const retryButton =
                document.getElementById(
                    "retry-search"
                );


            if (retryButton) {

                retryButton.addEventListener(
                    "click",
                    () => {

                        searchNearbyService(service);

                    }
                );

            }

        }

    }


    /* =====================================================
       DISPLAY RESULTS
       ===================================================== */

    function displayResults(
        elements,
        selectedService
    ) {

        clearServiceMarkers();


        const places = [];


        /* =================================================
           PROCESS OSM ELEMENTS
           ================================================= */

        elements.forEach(
            element => {

                const coordinates =
                    getCoordinates(element);


                if (!coordinates) {

                    return;

                }


                const tags =
                    element.tags || {};


                const service =
                    determineService(
                        tags,
                        selectedService
                    );


                if (!service) {

                    return;

                }


                /* =================================================
                   CALCULATE DISTANCE
                   ================================================= */

                const distance =
                    calculateDistance(

                        userLatitude,
                        userLongitude,

                        coordinates.lat,
                        coordinates.lon

                    );


                /* =================================================
                   STRICT 5 KM CHECK
                   ================================================= */

                if (distance > 5) {

                    return;

                }


                const serviceInfo =
                    services[service];


                const placeName =
                    tags.name ||
                    serviceInfo.name;


                places.push({

                    service,

                    name:
                        placeName,

                    lat:
                        coordinates.lat,

                    lon:
                        coordinates.lon,

                    distance,

                    address:
                        getAddress(tags),

                    tags

                });

            }
        );


        /* =================================================
           SORT BY DISTANCE
           ================================================= */

        places.sort(
            (a, b) =>
                a.distance -
                b.distance
        );


        /* =================================================
           REMOVE DUPLICATES
           ================================================= */

        const uniquePlaces = [];


        const seen = new Set();


        places.forEach(
            place => {

                const key =
                    `${place.service}-${place.lat.toFixed(5)}-${place.lon.toFixed(5)}`;


                if (!seen.has(key)) {

                    seen.add(key);

                    uniquePlaces.push(
                        place
                    );

                }

            }
        );


        const serviceInfo =
            services[selectedService];


        /* =================================================
           NO RESULTS
           ================================================= */

        if (
            uniquePlaces.length === 0
        ) {

            resultsMessage.textContent =
                `No ${serviceInfo.name.toLowerCase()} found within 5 km.`;


            resultsContainer.innerHTML = `

                <div class="result-card">

                    <div class="result-info">

                        <h3>

                            <i class="fa-solid ${serviceInfo.icon}"></i>

                            No Results Found

                        </h3>

                        <p>

                            No mapped
                            ${serviceInfo.name.toLowerCase()}
                            were found within 5 km of your location.

                        </p>

                        <p>

                            This does not necessarily mean
                            that no such service exists nearby.
                            It may not be mapped in OpenStreetMap.

                        </p>

                    </div>

                </div>

            `;

            return;

        }


        /* =================================================
           RESULTS MESSAGE
           ================================================= */

        resultsMessage.textContent =
            `Found ${uniquePlaces.length} ${serviceInfo.name.toLowerCase()} within 5 km.`;


        resultsContainer.innerHTML =
            "";


        /* =================================================
           SERVICE TITLE
           ================================================= */

        const section =
            document.createElement(
                "div"
            );


        section.className =
            "service-results";


        section.innerHTML = `

            <div class="service-results-title">

                <h3>

                    <i
                        class="fa-solid ${serviceInfo.icon}">
                    </i>

                    ${serviceInfo.name}

                </h3>

                <span>

                    ${uniquePlaces.length}
                    found

                </span>

            </div>

        `;


        /* =================================================
           DISPLAY MAXIMUM 10 RESULTS
           ================================================= */

        uniquePlaces
            .slice(0, 10)
            .forEach(
                place => {

                    const card =
                        createResultCard(
                            place
                        );


                    section.appendChild(
                        card
                    );

                }
            );


        resultsContainer.appendChild(
            section
        );


        /* =================================================
           MAP VIEW
           ================================================= */

        if (
            uniquePlaces.length > 0
        ) {

            const group =
                L.featureGroup(
                    serviceMarkers
                );


            if (serviceMarkers.length > 0) {

                map.fitBounds(
                    group.getBounds().pad(0.15)
                );

            }

        }

    }


    /* =====================================================
       CREATE RESULT CARD
       ===================================================== */

    function createResultCard(place) {

        const serviceInfo =
            services[place.service];


        const card =
            document.createElement(
                "div"
            );


        card.className =
            "result-card";


        card.innerHTML = `

            <div class="result-info">

                <h3>

                    <i
                        class="fa-solid ${serviceInfo.icon}">
                    </i>

                    ${escapeHTML(
                        place.name
                    )}

                </h3>


                <p>

                    ${escapeHTML(
                        place.address
                    )}

                </p>


                <div class="result-distance">

                    <i
                        class="fa-solid fa-location-dot">
                    </i>

                    ${place.distance.toFixed(2)}
                    km away

                </div>

            </div>


            <div class="result-actions">

                <button
                    type="button"
                    class="map-button show-on-map">

                    <i
                        class="fa-solid fa-map-location-dot">
                    </i>

                    Show on Map

                </button>


                <a
                    class="map-button"
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lon}">

                    <i
                        class="fa-solid fa-diamond-turn-right">
                    </i>

                    Directions

                </a>

            </div>

        `;


        /* =================================================
           CREATE MAP MARKER
           ================================================= */

        const marker =
            L.marker([

                place.lat,
                place.lon

            ]).addTo(map);


        marker.bindPopup(`

            <div class="map-popup-title">

                ${escapeHTML(
                    place.name
                )}

            </div>

            <div class="map-popup-type">

                ${serviceInfo.name}

            </div>

            <p>

                ${place.distance.toFixed(2)}
                km away

            </p>

        `);


        serviceMarkers.push(
            marker
        );


        /* =================================================
           SHOW ON MAP BUTTON
           ================================================= */

        const showButton =
            card.querySelector(
                ".show-on-map"
            );


        showButton.addEventListener(
            "click",
            () => {

                map.setView(

                    [
                        place.lat,
                        place.lon
                    ],

                    17

                );


                marker.openPopup();

            }
        );


        return card;

    }


    /* =====================================================
       ESCAPE HTML
       ===================================================== */

    function escapeHTML(value) {

        return String(value)

            .replaceAll(
                "&",
                "&amp;"
            )

            .replaceAll(
                "<",
                "&lt;"
            )

            .replaceAll(
                ">",
                "&gt;"
            )

            .replaceAll(
                '"',
                "&quot;"
            )

            .replaceAll(
                "'",
                "&#039;"
            );

    }


    /* =====================================================
       LOCATION BUTTON
       ===================================================== */

    if (locationButton) {

        locationButton.addEventListener(
            "click",
            getUserLocation
        );

    }


    /* =====================================================
       SERVICE BUTTONS
       
       Each button searches ONLY its own service.
       ===================================================== */

    const serviceButtons =
        document.querySelectorAll(
            ".service-button"
        );


    serviceButtons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    const service =
                        button.dataset.service;


                    console.log(
                        "Selected service:",
                        service
                    );


                    searchNearbyService(
                        service
                    );

                }
            );

        }
    );


});