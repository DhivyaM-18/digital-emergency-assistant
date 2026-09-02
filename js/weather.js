/* =========================================================
   DIGITAL EMERGENCY ASSISTANT
   REAL-TIME WEATHER
   weather.js
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const weatherLocation =
        document.getElementById("weather-location");

    const weatherTemperature =
        document.getElementById("weather-temperature");

    const weatherCondition =
        document.getElementById("weather-condition");

    const weatherHumidity =
        document.getElementById("weather-humidity");

    const weatherWind =
        document.getElementById("weather-wind");

    const weatherFeels =
        document.getElementById("weather-feels");

    const weatherUpdated =
        document.getElementById("weather-updated");

    const weatherButton =
        document.getElementById("get-weather");

    const safetyMessage =
        document.getElementById("weather-safety-message");


    /* =====================================================
       CHECK WEATHER SECTION
    ===================================================== */

    if (!weatherLocation || !weatherTemperature) {
        return;
    }


    /* =====================================================
       WEATHER DESCRIPTION
    ===================================================== */

    function getWeatherDescription(code) {

        const weatherCodes = {

            0: "Clear sky",

            1: "Mainly clear",
            2: "Partly cloudy",
            3: "Overcast",

            45: "Fog",
            48: "Fog",

            51: "Light drizzle",
            53: "Moderate drizzle",
            55: "Heavy drizzle",

            56: "Light freezing drizzle",
            57: "Heavy freezing drizzle",

            61: "Light rain",
            63: "Moderate rain",
            65: "Heavy rain",

            66: "Light freezing rain",
            67: "Heavy freezing rain",

            71: "Light snow",
            73: "Moderate snow",
            75: "Heavy snow",

            77: "Snow grains",

            80: "Light rain showers",
            81: "Moderate rain showers",
            82: "Heavy rain showers",

            85: "Light snow showers",
            86: "Heavy snow showers",

            95: "Thunderstorm",

            96: "Thunderstorm with hail",
            99: "Thunderstorm with heavy hail"

        };

        return weatherCodes[code] ||
            "Weather information unavailable";
    }


    /* =====================================================
       WEATHER SAFETY MESSAGE
    ===================================================== */

    function updateSafetyMessage(code) {

        if (!safetyMessage) {
            return;
        }


        if (code >= 95) {

            safetyMessage.textContent =
                "Thunderstorm detected. Stay indoors and avoid open areas, tall trees and exposed electrical equipment.";

        }

        else if (code >= 80) {

            safetyMessage.textContent =
                "Heavy rain may occur. Avoid flooded roads and low-lying areas and travel carefully.";

        }

        else if (code >= 61) {

            safetyMessage.textContent =
                "Rain is currently reported. Roads may be slippery, so travel carefully.";

        }

        else if (code >= 51) {

            safetyMessage.textContent =
                "Drizzle is reported. Be careful on wet and slippery surfaces.";

        }

        else if (code >= 45) {

            safetyMessage.textContent =
                "Fog may reduce visibility. Drive carefully and use appropriate lights.";

        }

        else {

            safetyMessage.textContent =
                "No major weather-related warning detected. Continue following local safety guidance.";

        }

    }


    /* =====================================================
       GET USER LOCATION
    ===================================================== */

    function getWeather() {

        weatherLocation.textContent =
            "Detecting your location...";

        weatherTemperature.textContent =
            "--°C";

        weatherCondition.textContent =
            "Loading weather...";

        weatherHumidity.textContent =
            "--";

        weatherWind.textContent =
            "--";

        weatherFeels.textContent =
            "--°C";

        weatherUpdated.textContent =
            "Please wait...";


        if (!navigator.geolocation) {

            weatherLocation.textContent =
                "Geolocation is not supported by this browser.";

            weatherCondition.textContent =
                "Unable to detect location.";

            weatherUpdated.textContent =
                "Please use a supported browser.";

            return;
        }


        navigator.geolocation.getCurrentPosition(

            function (position) {

                const latitude =
                    position.coords.latitude;

                const longitude =
                    position.coords.longitude;


                getWeatherData(
                    latitude,
                    longitude
                );

            },


            function (error) {

                console.error(
                    "Location error:",
                    error
                );


                weatherLocation.textContent =
                    "Location permission required.";

                weatherCondition.textContent =
                    "Please allow location access.";

                weatherUpdated.textContent =
                    "Location access is needed for weather information.";

            },


            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000
            }

        );

    }


    /* =====================================================
       GET WEATHER FROM OPEN-METEO
    ===================================================== */

    async function getWeatherData(
        latitude,
        longitude
    ) {

        const apiUrl =
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
            `&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m` +
            `&timezone=auto`;


        try {

            const response =
                await fetch(apiUrl);


            if (!response.ok) {

                throw new Error(
                    "Weather API request failed."
                );

            }


            const data =
                await response.json();


            displayWeather(
                data,
                latitude,
                longitude
            );

        }


        catch (error) {

            console.error(
                "Weather API error:",
                error
            );


            weatherLocation.textContent =
                "Weather service unavailable.";

            weatherTemperature.textContent =
                "--°C";

            weatherCondition.textContent =
                "Unable to load weather.";

            weatherUpdated.textContent =
                "Please try again later.";

        }

    }


    /* =====================================================
       DISPLAY WEATHER
    ===================================================== */

    function displayWeather(
        data,
        latitude,
        longitude
    ) {

        const current =
            data.current;


        if (!current) {

            throw new Error(
                "Current weather data unavailable."
            );

        }


        const temperature =
            current.temperature_2m;

        const humidity =
            current.relative_humidity_2m;

        const feelsLike =
            current.apparent_temperature;

        const windSpeed =
            current.wind_speed_10m;

        const weatherCode =
            current.weather_code;


        /* Temperature */

        weatherTemperature.textContent =
            `${Math.round(temperature)}°C`;


        /* Condition */

        weatherCondition.textContent =
            getWeatherDescription(
                weatherCode
            );


        /* Humidity */

        weatherHumidity.textContent =
            `${humidity}%`;


        /* Wind */

        weatherWind.textContent =
            `${Math.round(windSpeed)} km/h`;


        /* Feels Like */

        weatherFeels.textContent =
            `${Math.round(feelsLike)}°C`;


        /* Location */

        weatherLocation.textContent =
            `Location detected: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;


        /* Safety */

        updateSafetyMessage(
            weatherCode
        );


        /* Updated Time */

        const currentTime =
            new Date();


        weatherUpdated.textContent =
            `Updated: ${currentTime.toLocaleTimeString(
                [],
                {
                    hour: "2-digit",
                    minute: "2-digit"
                }
            )}`;

    }


    /* =====================================================
       REFRESH BUTTON
    ===================================================== */

    if (weatherButton) {

        weatherButton.addEventListener(
            "click",
            function () {

                getWeather();

            }
        );

    }


    /* =====================================================
       LOAD WEATHER WHEN PAGE OPENS
    ===================================================== */

    getWeather();

});