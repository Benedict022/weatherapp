// Use your own OpenWeatherMap API Key below
const apiKey = '8c1f14c2d573329b28da4ae4f8c0f9fa';

const weatherContainer = document.getElementById("weather");
const city = document.getElementById("city");
const error = document.getElementById('error');

let units = 'metric'; // default to Celsius
let temperatureSymbol = units === 'metric' ? "°C" : "°F";

// Load default weather on page load
window.onload = () => {
    document.getElementById('cityInput').value = 'Quezon City';
    fetchWeather();
};

function toggleUnits() {
    units = units === 'metric' ? 'imperial' : 'metric';
    temperatureSymbol = units === 'metric' ? "°C" : "°F";
    fetchWeather(); // Refresh weather with new units
}

async function fetchWeather() {
    try {
        weatherContainer.innerHTML = '';
        error.innerHTML = '';
        city.innerHTML = '';

        let cityInputtedByUser = document.getElementById('cityInput').value;

        // If no city is entered, use default city
        if (!cityInputtedByUser) {
            cityInputtedByUser = 'Quezon City';
            document.getElementById('cityInput').value = cityInputtedByUser;
        }

        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityInputtedByUser}&appid=${apiKey}&units=${units}`;
        console.log('Fetching weather from:', apiUrl);

        const response = await fetch(apiUrl);
        const data = await response.json();
        console.log('API Response:', data);

        if (data.cod === '400' || data.cod === '404' || data.cod === 401) {
            error.innerHTML = `Error: ${data.message || 'Not valid city. Please input another city'}`;
            return;
        }

        const weatherDiv = document.createElement("div");
        weatherDiv.innerHTML = `
            <div class="weather_description">
                ${data.main.temp}${temperatureSymbol} - ${data.weather[0].main}
                <br>
                Humidity: ${data.main.humidity}%
                <br>
                Wind: ${data.wind.speed} ${units === 'metric' ? 'km/h' : 'mph'}
            </div>
        `;
        weatherContainer.appendChild(weatherDiv);
        city.innerHTML = `Current Weather for ${data.name}`;

    } catch (err) {
        console.error('Error fetching weather:', err);
        error.innerHTML = `Error: ${err.message || 'Failed to fetch weather data'}`;
    }
}

function convertToLocalTime(dt) {

    // Create a new Date object by multiplying the Unix timestamp by 1000 to convert it to milliseconds
    // Will produce a time in the local timezone of user's computer
    const date = new Date(dt * 1000);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so add 1
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours() % 12 || 12).padStart(2, '0'); // Convert 24-hour to 12-hour format
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const period = date.getHours() >= 12 ? 'PM' : 'AM'; // Determine AM/PM

    // Formatted date string in the format: YYYY-MM-DD hh:mm:ss AM/PM
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds} ${period}`;

}

function createWeatherDescription(weatherData) {
    const { main, dt } = weatherData;

    const description = document.createElement("div");
    const convertedDateAndTime = convertToLocalTime(dt);

    // '2023-11-07 07:00:00 PM'
    description.innerHTML = `
        <div class = "weather_description">${main.temp}${temperatureSymbol} - ${convertedDateAndTime.substring(10)} - ${convertedDateAndTime.substring(5, 10)} </div>
    `;
    return description;
}


