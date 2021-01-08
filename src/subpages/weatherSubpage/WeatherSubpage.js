import provider from "../../services/Provider"
import "./WeatherSubpage.css"

export default class WeatherSubpage {
  constructor() {
    this._weatherApi = provider.get("weatherApiService")
    this._weatherContentDiv = document.querySelector("#weather-content")
  }

  getIconUrl(iconCode) {
    return `http://openweathermap.org/img/w/${iconCode}.png`
  }

  async updatePage(city = "Berlin") {
    const weatherRes = await this._weatherApi.getCurrentWeather(city)
    const alert = await this._weatherApi.getAlert(
      weatherRes.coord.lat,
      weatherRes.coord.lon
    )
    const alertDescription =
      typeof alert.alerts === "undefined" ? 0 : alert.alerts[0].description
    const iconCode = weatherRes.weather[0].icon
    const iconUrl = this.getIconUrl(iconCode)

    this._weatherContentDiv.innerHTML = `
      <div class="weather-now-container">
      <div class="city">${weatherRes.name}, ${weatherRes.sys.country}</div>
        <div class="main-weather-info">
          <img src="${iconUrl}" alt="Weather icon"> <div>${
      weatherRes.main.temp
    } &#176C </div>
        </div>
        <p class="weather-alert">${alertDescription}</p>
        <div class="weather-feels">
          Fells like ${weatherRes.main.feels_like} &#176C, 
          ${weatherRes.weather[0].description}
        </div>
        <div class="detailed-info">
          <div>Cloudiness: ${weatherRes.clouds.all}%</div>
          <div>${weatherRes.main.pressure}hPa</div>
          <div>${weatherRes.main.humidity}%</div>
          <div>Visibility: ${weatherRes.visibility / 1000} km</div>
        </div>
        <div class="weather-forecast"></div>
        <div class="detailed-weather-info"></div>
      </div>      
`
    const weatherAlertP = document.getElementsByClassName("weather-alert")[0]
    alertDescription
      ? (weatherAlertP.style.display = "block")
      : (weatherAlertP.style.display = "none")
  }

  async render() {
    const newStyle = document.createElement("link")

    newStyle.rel = "stylesheet"

    newStyle.href = "src/subpages/weatherSubpage/WeatherSubpage.css"

    document.getElementsByTagName("head")[0].appendChild(newStyle)

    this.updatePage()

    const button = document.getElementById("submit-city")
    const inputCity = document.getElementById("cityName")

    button.addEventListener("click", (event) => {
      event.preventDefault()
      this.updatePage(inputCity.value)
    })
  }
}
