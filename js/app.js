function createWeatherElement(data, dayOfWeek) {
    const mainDiv = document.createElement('div');
    mainDiv.classList.add("module", "module__weather");
    const closeButton = document.createElement('button');
    closeButton.classList.add("btn", "btn--icon", "btn--close");
    closeButton.id = `close-weather ${data.location.name}`;
    const closeButtonView = document.createElement("i");
    closeButtonView.classList.add("material-icons");
    closeButtonView.innerText = "close";
    closeButton.appendChild(closeButtonView);
    mainDiv.appendChild(closeButton);
    const weatherDiv = document.createElement("div");
    weatherDiv.classList.add("weather");
    const weatherIconDiv = document.createElement("div");
    weatherIconDiv.classList.add("weather__icon");
    const weatherIcon = document.createElement("img");
    switch (data.current.condition.text) {
        case "Partly cloudy":
        case "Cloudy":
            weatherIcon.src = "assets/icons/cloudy.svg";
            break;
        case "Sunny":
        case "Clear":
            weatherIcon.src = "assets/icons/clear-day.svg";
            break;
        case "Patchy rain possible":
        case "Light rain":
        case "Moderate rain":
        case "Heavy rain":
        case "Light rain shower":
        case "Moderate or heavy rain shower":
        case "Torrential rain shower":
        case "Patchy light rain with thunder":
        case "Moderate or heavy rain with thunder":
            weatherIcon.src = "assets/icons/rain.svg";
            break;
        case "Patchy snow possible":
        case "Light snow":
        case "Patchy moderate snow":
        case "Moderate snow":
        case "Patchy heavy snow":
        case "Heavy snow":
            weatherIcon.src = "assets/icons/snow.svg";
            break;
    }
    weatherIconDiv.appendChild(weatherIcon);
    weatherDiv.appendChild(weatherIconDiv);
    const weatherInfoDiv = document.createElement("div");
    weatherInfoDiv.classList.add("weather__info");
    const cityDiv = document.createElement("div");
    cityDiv.classList.add("city");
    const cityNameSpan = document.createElement("span");
    cityNameSpan.classList.add("city__name");
    cityNameSpan.innerText = `${data.location.name} `;
    cityDiv.appendChild(cityNameSpan);
    const editButton = document.createElement("span");
    editButton.classList.add("btn", "btn--icon");
    const editIcon = document.createElement("i");
    editIcon.classList.add("material-icons");
    editIcon.innerText = "edit";
    editButton.appendChild(editIcon);
    cityDiv.appendChild(editButton);
    weatherInfoDiv.appendChild(cityDiv);
    const temperatureDiv = document.createElement("div");
    temperatureDiv.classList.add("temperature");
    const temperatureValueSpan = document.createElement("span");
    temperatureValueSpan.classList.add("temperature__value");
    temperatureValueSpan.innerText = `${data.current.temp_c}\u00B0C`;
    temperatureDiv.appendChild(temperatureValueSpan);
    weatherInfoDiv.appendChild(temperatureDiv);
    weatherDiv.appendChild(weatherInfoDiv);
    const ulWeatherDetails = document.createElement("ul");
    ulWeatherDetails.classList.add("weather__details");
    const pressure = document.createElement("li");
    const pressureImage = document.createElement("img");
    pressureImage.src = "assets/icons/pressure.svg";
    pressure.appendChild(pressureImage);
    const pressureValue = document.createElement("span");
    pressureValue.classList.add("pressure__value");
    pressureValue.innerText = `${data.current.pressure_mb} hPa`;
    pressure.appendChild(pressureValue);
    ulWeatherDetails.appendChild(pressure);
    const humidity = document.createElement("li");
    const humidityImage = document.createElement("img");
    humidityImage.src = "assets/icons/humidity.svg";
    humidity.appendChild(humidityImage);
    const humidityValue = document.createElement("span");
    humidityValue.classList.add("humidity__value");
    humidityValue.innerText = `${data.current.humidity} %`;
    humidity.appendChild(humidityValue);
    ulWeatherDetails.appendChild(humidity);
    const windSpeed = document.createElement("li");
    const windSpeedImage = document.createElement("img");
    windSpeedImage.src = "assets/icons/wind-speed.svg";
    windSpeed.appendChild(windSpeedImage);
    const windSpeedValue = document.createElement("span");
    windSpeedValue.classList.add("wind-speed__value");
    windSpeedValue.innerText = `${(data.current.wind_kph / 3.6).toFixed(2)} m/s`;
    windSpeed.appendChild(windSpeedValue);
    ulWeatherDetails.appendChild(windSpeed);
    weatherDiv.appendChild(ulWeatherDetails);
    const ulWeatherForecast = document.createElement("ul");
    ulWeatherForecast.classList.add("weather__forecast");
    data.forecast.forecastday.forEach((day) => {
        const li = document.createElement("li");
        const daySpan = document.createElement("span");
        daySpan.classList.add("day");
        const date = new Date(day.date);
        daySpan.innerText = dayOfWeek[date.getDay()];
        li.appendChild(daySpan);
        const img = document.createElement("img");
        switch (day.day.condition.text) {
            case "Patchy rain nearby":
                img.src = "assets/icons/rain.svg";
                break;
            case "Partly Cloudy ":
            case "Overcast ":
                img.src = "assets/icons/fog.svg";
                break;
            case "Sunny":
                img.src = "assets/icons/clear-day.svg";
                break;
        }
        li.appendChild(img);
        const temperatureSpan = document.createElement("span");
        temperatureSpan.classList.add("temperature");
        temperatureSpan.innerText = `${day.day.maxtemp_c}\u00B0C`;
        li.appendChild(temperatureSpan);
        ulWeatherForecast.appendChild(li);
    });
    weatherDiv.appendChild(ulWeatherForecast);
    mainDiv.appendChild(weatherDiv);
    return mainDiv;
}

document.addEventListener("DOMContentLoaded", function () {
    const apiKey = "b8956ac8135d4a4183f131925242402";
    const dayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const container = document.getElementById("app");
    const formButton = document.getElementById("add-city");
    const form = document.querySelector(".module__form");
    formButton.addEventListener('click', async function (e) {
        e.preventDefault();
        form.removeAttribute('hidden');
        const formInput = document.querySelector(".find-city");
        formInput.addEventListener('submit', async function (e) {
            e.preventDefault();
            const inputData = document.getElementById("search");
            const value = inputData.value;
            if (await getWeather(value)) {
                const mainDiv = createWeatherElement(await getWeather(value), dayOfWeek);
                container.appendChild(mainDiv);
                const closeButton = document.getElementById(`close-weather ${value}`);
                closeButton.addEventListener('click', e => {
                    e.preventDefault();
                    const deleteRecord = document.querySelector(`.module__weather`);
                    deleteRecord.remove();
                });
            }
        })

    })

    async function getWeather(city) {
        const fetchingApi = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=5`;
        try {
            const response = await fetch(fetchingApi);
            if (!response.ok) {
                throw new Error(`Network Error`);
            }
            return await response.json();
        } catch (error) {
            alert("Enter proper name of City");
        }
    }

    async function runHome() {
        const value = "auto:ip";
        const data = await getWeather(value);
        if (data) {
            console.log(data);
            const mainDiv = createWeatherElement(data, dayOfWeek);
            container.appendChild(mainDiv);
            const closeButton = document.getElementById(`close-weather ${value}`);
            closeButton.addEventListener('click', e => {
                e.preventDefault();
                const deleteRecord = document.querySelector(`.module__weather`);
                deleteRecord.remove();
            });
        } else {
            alert("Wrong Data");
        }
    }

    try {
        runHome();
    } catch (_) {
        alert("Wrong Data");
    }
});
