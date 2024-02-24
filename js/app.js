const apiKey = "b8956ac8135d4a4183f131925242402";
const closeButton = document.getElementById("close-weather")
const weatherPrintModule = document.querySelector(".module__weather");
const nameOfTheCity = document.querySelector(".city__name");
const tempValue = document.querySelector(".temperature");
const pressure = document.querySelector(".pressure__value")
closeButton.addEventListener('click', function (e) {
    e.preventDefault();
    weatherPrintModule.remove();
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
        prompt(`Error ${error}`);
    }
}

async function runHome() {
    const data = await getWeather("auto:ip");
    if (data) {
        nameOfTheCity.innerText = data.location.name;
        tempValue.innerText = `${data.current.temp_c}\u00B0C`;
        pressure.innerText = `${data.current.pressure_mb} hPa`
        console.log(data);
    } else {
        console.log("Error with data");
    }

}

try {
    runHome();
} catch (_) {
    throw new Error(`Error`);
}
