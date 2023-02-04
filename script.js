const weatherAPIURL = "http://api.openweathermap.org";
const weatherAPIkey = "0dc1473268e475d2b577364af6851574";

let searchInput = $("#search-input");
let searchForm = $("#search-form");
let searchHistoryContainer = $("#history");
let todayContainer = $("#today");
let forecastContainer = $("#forecast");
let searchHistory = [];

function renderSearchHistory() {
    searchHistoryContainer.html("");
    for (let i = 0; i < searchHistory.length; i++) {
        let btn = $("<button>");
        btn.attr("type", "button");
        btn.addClass("history-btn btn-history");

        btn.attr("data-search", searchHistory[i]);
        btn.text(searchHistory[i]);
        btn.on("click", function(event) {
            event.preventDefault();
            fetchCoordinates(searchHistory[i]);
        });
        searchHistoryContainer.append(btn);
    }
}

function appendToSearchHistory(city) {
    if (searchHistory.indexOf(city) !== -1) {
        return;
    }
    searchHistory.push(city);

    localStorage.setItem("search-history", JSON.stringify(searchHistory));
    renderSearchHistory();
}

function initializeHistory() {
    let storedHistory = localStorage.getItem("search-history");

    if (storedHistory) {
        searchHistory = JSON.parse(storedHistory);
    }
    renderSearchHistory();
}

function fetchCoordinates(search) {
    let queryURL = `${weatherAPIURL}/geo/1.0/direct?q=${search}&limit=5&appid=${weatherAPIkey}`;

    fetch(queryURL, { method: "GET" })
        .then(function(data) {
            return data.json();
        })
        .then(function(response) {
            if (!response[0]) {
                throw new Error("The requested city was not found.");
            }

            fetchWeather(response[0]);
            appendToSearchHistory(response[0].name);
        })
        .catch(function(e) {
            console.error(e);
        });
}

function fetchWeather(geo) {
    let latitude = geo.lat;
    let longitude = geo.lon;
    let queryWeatherURL = `${weatherAPIURL}/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${weatherAPIkey}`;

    fetch(queryWeatherURL, { method: "GET" })
        .then(function(data) {
            return data.json();
        })
        .then(function(response) {
            renderCurrentWeather(response.city.name, response.list[0]);
            renderForecast(response.list);
        })
        .catch(function(e) {
            console.error(e);
        });
}

function renderCurrentWeather(city, weatherData) {
    let date = moment().format("D/M/YYYY");
    let tempC = weatherData["main"]["temp"];
    let windKph = weatherData["wind"]["speed"];
    let humidity = weatherData["main"]["humidity"];

    let iconUrl = `http://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`;
    let iconDescription =
        weatherData.weather[0].description || weatherDatap[0].main;
    let card = $("<div>");
    let cardBody = $("<div>");
    let weatherIcon = $("<img>");
    let heading = $("<h2>");
    let tempEl = $("<p>");
    let windEl = $("<p>");
    let humidityEl = $("<p>");

    card.attr("class", "card");
    cardBody.attr("class", "card body");
    card.append(cardBody);
    heading.attr("class", "h3 card-title");
    tempEl.attr("class", "card-text");
    windEl.attr("class", "card-text");
    humidityEl.attr("class", "card-text");
    heading.text(`${city} (${date})`);
    weatherIcon.attr("src", iconUrl);
    weatherIcon.attr("alt", iconDescription);
    heading.append(weatherIcon);
    tempEl.text(`temp ${tempC} C`);
    windEl.text(`wind ${windKph} kph`);
    humidityEl.text("Humidity " + humidity + "%");
    cardBody.append(heading, tempEl, windEl, humidityEl);
    todayContainer.html("");
    todayContainer.append(card);
}

function renderForecast(weatherData) {
    let headingCol = $("<div>");
    let heading = $("<h4>");

    headingCol.attr("class", "col-12");
    headingCol.text("5 day forecast");
    headingCol.append(heading);

    forecastContainer.html("");
    forecastContainer.append(headingCol);

    weatherData
        .filter(function(forecast) {
            return forecast.dt_txt.includes("12");
        })
        .forEach(function(forecast) {
            let iconURL = `https://openweathermap.org/img/w/${forecast.weather[0].icon}.png`;
            let iconDescription = forecast.weather[0].description;
            let tempC = forecast.main.temp;
            let humidity = forecast.main.humidity;
            let windKph = forecast.wind.speed;

            let col = $("<div>");
            let card = $("<div>");
            let cardBody = $("<div>");
            let cardTitle = $("<h5>");
            let weatherIcon = $("<img>");
            let tempEl = $("<p>");
            let windEl = $("<p>");
            let humidityEl = $("<p>");

            col.append(card);
            card.append(cardBody);
            cardBody.append(cardTitle, weatherIcon, tempEl, windEl, humidityEl);
            col.attr("class", "col-md");
            card.attr("class", "card bg-primary h-100 text-red");
            cardTitle.attr("class", "card-title");
            tempEl.attr("class", "card-text");
            windEl.attr("class", "card-text");
            humidityEl.attr("class", "card-text");

            cardTitle.text(moment(forecast.dt_txt).format("D/M/YYYY"));
            weatherIcon.attr("src", iconURL);
            weatherIcon.attr("alt", iconDescription);
            tempEl.text(`temp ${tempC} C`);
            windEl.text(`wind: ${windKph} KPH`);
            humidityEl.text(`Humidity ${humidity} %`);

            forecastContainer.append(col);
        });
}

initializeHistory();

searchForm.on("submit", function(event) {
    event.preventDefault();
    let search = searchInput.val().trim();
    fetchCoordinates(search);
    searchInput.val("");
});
