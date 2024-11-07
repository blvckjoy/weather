const api_key = '6JYBGTDA52B8ZTHA55TE7MABF';

async function getWeather() {
    try {
        const city = getInputValue();
        if (!validateInput(city)) {
            hideWeatherContent();
            return;
        }

        const data = await fetchWeatherData(city);
        if (data) {
            updateWeatherData(data);
            showWeatherContent();
        } else {
            alert('City not found. Please try another city.');
        }
    } catch (error) {
        alert(
            'An error occurred while fetching the weather data. Please try again later.'
        );
    }
}

async function fetchWeatherData(city) {
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?key=${api_key}`;
    return await fetchData(url);
}

function hideWeatherContent() {
    document.querySelector('.weather-content').classList.add('hidden');
}

function showWeatherContent() {
    document.querySelector('.weather-content').classList.remove('hidden');
}

async function fetchData(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
}

function getInputValue() {
    const city = document.querySelector('#location-input').value.trim();
    return city.toLowerCase();
}

function validateInput(city) {
    if (!city) {
        alert('Please enter a city');
        return false;
    }
    return true;
}

function getCurrentDate() {
    const currentDate = new Date();
    const options = {
        weekday: 'short',
        month: 'long',
        day: '2-digit',
    };
    return currentDate.toLocaleDateString('en-GB', options);
}

function updateWeatherData(data) {
    const city = document.querySelector('.weather-city');
    const currentDate = document.querySelector('.weather-date');
    const condition = document.querySelector('.weather-condition');
    const degrees = document.querySelector('.weather-degrees');
    const weatherIcon = document.querySelector('img');

    city.textContent = data.resolvedAddress;
    currentDate.textContent = getCurrentDate();
    condition.textContent = data.currentConditions.conditions;
    degrees.textContent = `${data.currentConditions.temp}ºC`;
    weatherIcon.src = `assets/${data.currentConditions.icon}.png`;
}

const fetchBtn = document.querySelector('#search-btn');
fetchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    getWeather();
    document.querySelector('#location-input').value = '';
});
