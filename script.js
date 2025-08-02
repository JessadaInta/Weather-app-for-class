const apiKey = '9079d7d1728a556d15be9044f5cb695a';

const searchForm = document.querySelector('#search-form');
const cityInput = document.querySelector('#city-input');
const weatherInfoContainer = document.querySelector('#weather-info-container');
const forecastContainer = document.querySelector('#forecast-container');

searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const cityName = cityInput.value.trim();

    if (cityName) {
        localStorage.setItem('lastCity', cityName);
        getWeather(cityName);
        getForecast(cityName);
    } else {
        alert('กรุณาป้อนชื่อเมือง');
    }
});

window.addEventListener('DOMContentLoaded', () => {
    const lastCity = localStorage.getItem('lastCity');
    if (lastCity) {
        cityInput.value = lastCity;
        getWeather(lastCity);
        getForecast(lastCity);
    }
});

async function getWeather(city) {
    weatherInfoContainer.innerHTML = `<p>กำลังโหลดข้อมูลอากาศ...</p>`;

    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=th`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('ไม่พบข้อมูลเมืองนี้');
        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        weatherInfoContainer.innerHTML = `<p class="error">${error.message}</p>`;
    }
}

function displayWeather(data) {
    const { name, main, weather } = data;
    const { temp, humidity } = main;
    const { description, icon } = weather[0];

    const weatherHtml = `
        <h2 class="text-2xl font-bold">${name}</h2>
        <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}">
        <p class="temp">${temp.toFixed(1)}°C</p>
        <p>${description}</p>
        <p>ความชื้น: ${humidity}%</p>
    `;
    weatherInfoContainer.innerHTML = weatherHtml;
}

async function getForecast(city) {
    forecastContainer.innerHTML = `<p>กำลังโหลดพยากรณ์อากาศ...</p>`;

    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=th`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('ไม่พบข้อมูลพยากรณ์');
        const data = await response.json();
        displayForecast(data);
    } catch (error) {
        forecastContainer.innerHTML = `<p class="error">${error.message}</p>`;
    }
}

function displayForecast(data) {
    const forecastList = data.list.filter(item => item.dt_txt.includes("12:00:00")).slice(0, 5);

    let forecastHtml = `<h3 class="text-lg font-semibold mt-4">พยากรณ์อากาศล่วงหน้า 5 วัน</h3>`;
    forecastHtml += `<div class="forecast-grid">`;

    forecastList.forEach(day => {
        const date = new Date(day.dt_txt).toLocaleDateString("th-TH", {
            weekday: "short", day: "numeric", month: "short"
        });
        const temp = day.main.temp.toFixed(1);
        const icon = day.weather[0].icon;
        const description = day.weather[0].description;

        forecastHtml += `
            <div class="forecast-day">
                <h4>${date}</h4>
                <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}">
                <p>${temp}°C</p>
                <p>${description}</p>
            </div>
        `;
    });

    forecastHtml += `</div>`;
    forecastContainer.innerHTML = forecastHtml;
}

