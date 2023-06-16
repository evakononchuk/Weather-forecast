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
let city = 'Kyiv';

function showCurrentParameters(response) {
  celsiusTemperature = response.data.main.temp;
  let selectDayTime = document.querySelector('#day-time');
  selectDayTime.innerHTML = formatDate(response.data.dt * 1000);
  let city = document.querySelector('#city');
  city.innerHTML = response.data.name;
  let percipitation = document.querySelector('#percipitation');
  percipitation.innerHTML = `Percipitation: ${
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
  celsius.classList.add('active');
  fahrenheit.classList.remove('active');
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

function showFahrenheit(event) {
  event.preventDefault();
  let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
  celsius.classList.remove('active');
  fahrenheit.classList.add('active');
  let currentTemperature = document.querySelector('#degree');
  currentTemperature.innerHTML = Math.round(fahrenheitTemperature);
}

function showCelsius(event) {
  event.preventDefault();
  let currentTemperature = document.querySelector('#degree');
  celsius.classList.add('active');
  fahrenheit.classList.remove('active');
  currentTemperature.innerHTML = Math.round(celsiusTemperature);
}

let celsiusTemperature = null;

let fahrenheit = document.querySelector('#fahrenheit-link');
fahrenheit.addEventListener('click', showFahrenheit);

let celsius = document.querySelector('#celsius-link');
celsius.addEventListener('click', showCelsius);
