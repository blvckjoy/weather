// API key for weather data
const api_key = '6JYBGTDA52B8ZTHA55TE7MABF';

// Function to get weather data for a specified city
async function getWeather() {
    try {
        const city = getInputValue();
        if (!validateInput(city)) {
            // Hide weather content if input is invalid
            hideWeatherContent();
            return;
        }

        const data = await fetchWeatherData(city);
        if (data && data.days) {
            getForecasts(data);
            // Update the UI with weather data
            updateWeatherData(data);
            showWeatherContent();
        } else {
            console.error('No weather data found for the specified city.');
            hideWeatherContent();
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
        hideWeatherContent();
    }
}

async function fetchWeatherData(city) {
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?key=${api_key}`;
    return await fetchData(url);
}

// Function to hide the weather content in the UI
function hideWeatherContent() {
    document.querySelector('.weather-content').classList.add('hidden');
}

// Function to show the weather content in the UI
function showWeatherContent() {
    document.querySelector('.weather-content').classList.remove('hidden');
}

// Function to fetch data from a given URL
async function fetchData(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
}

// Function to get the input value from the user
function getInputValue() {
    const city = document.querySelector('#location-input').value.trim();
    // Format the input value to lowercase
    return city.toLowerCase();
}

// Function to validate the input city name
function validateInput(city) {
    if (!city) {
        console.log('Please enter a city');
        return false;
    }
    return true;
}

// Function to get the current date formatted for display
function getCurrentDate() {
    const currentDate = new Date();
    const options = {
        weekday: 'short',
        month: 'long',
        day: '2-digit',
    };
    return currentDate.toLocaleDateString('en-GB', options);
}

const forecastContainer = document.querySelector('.forecast-items');
// Function to get forecasts for the upcoming days
function getForecasts(data) {
    // Format and split it to get only the date part
    const todayDate = new Date().toISOString().split('T')[0];
    // Counter for the number of forecast items
    let count = 0;

    forecastContainer.innerHTML = '';
    data.days.forEach((day) => {
        // Convert day.datetime to a Date object for comparison
        const dayDate = new Date(day.datetime);
        // Check if count is less than 5
        if (dayDate > new Date(todayDate) && count < 5) {
            updateForecastItems(day);
            count++;
        }
    });
}

// Function to update the forecast items in the UI
function updateForecastItems(forecast) {
    const { datetime: date, icon, temp } = forecast;

    // Create a date object
    const dateTaken = new Date(date);
    const dateOption = {
        day: '2-digit',
        month: 'short',
    };

    const dateOutput = dateTaken.toLocaleDateString('en-GB', dateOption);

    const forecastItem = `
      <div class="forecast-item">
         <p class="forecast-date">${dateOutput}</p>
         <img
            class="forecast-icon"
            src="assets/${icon}.png"
            alt="rain icon"
         />
         <p class="forecast-degrees">${temp}ºC</p>
      </div>
   `;
    forecastContainer.insertAdjacentHTML('beforeend', forecastItem);
}

// Function to update the weather data in the UI
function updateWeatherData(data) {
    const city = document.querySelector('.weather-city');
    const currentDate = document.querySelector('.weather-date');
    const condition = document.querySelector('.weather-condition');
    const degrees = document.querySelector('.weather-degrees');
    const weatherIcon = document.querySelector('img');

    city.textContent = data.resolvedAddress || 'Unknown Location';
    currentDate.textContent = getCurrentDate();
    condition.textContent =
        data.currentConditions.conditions || 'No conditions available';
    degrees.textContent = `${data.currentConditions.temp}ºC`;
    weatherIcon.src = `assets/${data.currentConditions.icon}.png`;
}

const fetchBtn = document.querySelector('#search-btn');
fetchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    getWeather();
    document.querySelector('#location-input').value = '';
});
