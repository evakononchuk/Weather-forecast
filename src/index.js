function formatDate(timestamp) {
  let date = new Date();
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  let day = days[date.getDay()];
  return `${day} ${hours}:${minutes}`;
}

//---------------------------------------------
let apiKey = '535cacbb3f8a0df0aeb4790235b9541f';
let apiUrl = 'https://api.openweathermap.org/data/2.5/weather?';
let city = 'New York';

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector('#forecast');
  let forecastHTML = `<div class='row'>`;

  forecast.forEach((day, index) => {
    if (index < 6) {
      forecastHTML += `
            <div class="col-2">
              <div>${formatDay(day.dt)}</div>
              <img src="https://openweathermap.org/img/wn/${
                day.weather[0].icon
              }@2x.png" alt="" width="50"/>
              <div class="weather-forecast-temp">
                <span class="weather-forecast-temp-max">${Math.round(
                  day.temp.max
                )}°</span>
                <span class="weather-forecast-temp-min">${Math.round(
                  day.temp.min
                )}°</span>
              </div>
            </div>`;
    }
  });
  forecastHTML += `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let apiKey = '7059cb165caa3316bff682d263a01b1e';
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function showCurrentParameters(response) {
  celsiusTemperature = response.data.main.temp;
  let selectDayTime = document.querySelector('#day-time');
  selectDayTime.innerHTML = formatDate(response.data.coord.dt * 1000);
  let city = document.querySelector('#city');
  city.innerHTML = response.data.name;
  let precipitation = document.querySelector('#precipitation');
  precipitation.innerHTML = `Precipitation: ${
    response.data.rain ? response.data.rain['1h'] : 0
  } %`;
  let humidity = document.querySelector('#humidity');
  humidity.innerHTML = `Humidity: ${response.data.main.humidity} %`;
  let wind = document.querySelector('#wind');
  wind.innerHTML = `Wind: ${response.data.wind.speed} km/h`;
  let temp = document.querySelector('#degree');
  temp.innerHTML = Math.round(response.data.main.temp);
  let description = document.querySelector('#description');
  description.innerHTML = response.data.weather[0].description;
  let icon = document.querySelector('#icon');
  icon.setAttribute(
    'src',
    `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  icon.setAttribute('alt', response.data.weather[0].description);

  getForecast(response.data.coord);
}

axios
  .get(`${apiUrl}q=${city}&appid=${apiKey}&units=metric`)
  .then(showCurrentParameters);

function resetCityInput() {
  let citySearch = document.querySelector('#city-search');
  citySearch.value = '';
}

let backspace = document.querySelector('#backspace');
backspace.addEventListener('click', resetCityInput);

function displayCity(response) {
  let cityInput = document.querySelector('#city');
  cityInput.innerHTML = response.data.name;
  let cityTemp = document.querySelector('#degree');
  cityTemp.innerHTML = response.data.main.temp;
}

function searchCity(event) {
  event.preventDefault();
  let cityName = document.querySelector('#city-search').value;
  let cityUrl = `${apiUrl}q=${cityName}&appid=${apiKey}&units=metric`;
  axios.get(cityUrl).then(showCurrentParameters);
}

let formButton = document.querySelector('form');
formButton.addEventListener('submit', searchCity);

function showPosition(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let weatherUrl = `${apiUrl}lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}&units=metric`;
  axios.get(weatherUrl).then(showCurrentParameters);
}

function getCurrentPosition(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(showPosition);
}
