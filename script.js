
const weatherAPIURL = "http://api.openweathermap.org";
const weatherAPIkey = "0dc1473268e475d2b577364af6851574";


let searchInput = $("search-input");
let searchForm = $("search-form");
let searchHistoryContainer = $("#history");
let todayContainer = $("#today");
let forecastContainer = $("#forecast");


function renderSearchHistory(){
    searchHistoryContainer.html("")
    for(let i = 0; i < searchHistory.lenght; i++){
    let btn = $("<button>");
    btn.attr("type", "button")
    btn.addClass("history-btn btn-history")

    btn.attr("data-search", searchHistory[i])
    btn.text(searchHistory[i])
    searchHistoryContainer.append(btn)
    }
}

function appendSearchHistory(search){
    if(searchHistory.indexOf(search) !== -1) {
    return;
    }
    searchHistory.push(search);

    localStorage.setItem("search-history", JSON.stringify(searchHistory));
    renderSearchHistory()
}

function renderCurrentWeather (city, weatherData){

    let date = moment().format("D/M/YYYY")
    let tempC = weatherData["main"] ["temp"];
    let windKph = weatherData["wind"] ["speed"];
    let humidity = weatherData["main"] ["humidity"]

    let iconUrl = `http://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`;
    let iconDescription = weatherData.weather[0].description || weatherDatap[0].main
    let card = $("<div>")
    let cardBody = $("<div>")
    let weatherIcon = $("<img>")
    let heading = $("<h2>")
    let tempEl = $("<p>")
    let windEl = $("<p>")
    let humidityEl = $("<p>")

    card.attr("class", "card");

    cardBody.attr("class","card body")

    card.append(cardBody);

    heading.attr("class", "h3 card-title")

    tempEl.attr("class", "card-text")

    windEl.attr("class", "card-text")

    humidityEl.attr("class", "card-text")

    heading.text(`${city} (${date})`)

    weatherIcon.attr("src", iconUrl);

    weatherIcon.attr("alt", iconDescription);

    heading.append(weatherIcon)

    tempEl.text(`temp ${tempC} C`);

    windEl.text(`wind $(windKph) kph`);

    humidityEl.text('Humidity ${humidity} %')

    cardBody.append(heading, tempEl, windEl, humidityEl);

    todayContainer.html("");

    todayContainer.append(card);


}

function renderForecast(weatherData){
    let headingCol = $("<div>");
    let heading = $("<h4>");

    headingCol.attr("class", "col-12");
    headingCol.text("5 day forecast");
    headingCol.append(heading);

    forecasttContainer.html("")
    forecastContainer.append(headingCol)

    let futureForecast = weatherData.filter(function(forecast){
        return forecast.dt_txt.includes("12")
    })
       
    for(let i = 0; i < futureForecast.lenght; i++){
    let iconURL = `https://openweathermap.org/img/w/${futureForecast[i].weather[0].icon}.png`
    let iconDescription = futureForecast[i].weather[0].description;
    let tempC = futureForecast[i].main.temp;
    let humidity = futureForecast[i].main.humidity;
    let windKph = futureForecast[i].wind.speed;

    let col = $("<div>")
    let card = $("<div>")
    let cardBody = $("<div>")
    let cardTitle = $("<h5>")
    let weatherIcon = $("<img>")
    let tempEl = $("<p>")
    let windEl = $("<p>")
    let humidityEl = $("<p>")
    
    col.append(card)
    card.append(cardBody)
    cardBody.append(cardTitle, weatherIcon, tempEl, windEl, humidityEl)
    col.attr("class","col-md")
    card.attr("class", "card bg-primary h-100 text-red");
    cardTitle.attr("class", "card-title")
    tempEl.attr("class", "card-text")
    windEl.attr("class", "card-text")
    humidityEl.attr("class", "card-text")

    cardTitle.text(moment(futureForecast[i].dt_txt).format(D/M/YYYY))
    weatherIcon.attr("src", iconURL);
    weatherIcon.attr("alt", iconDescription);
    tempEl.text(`temp ${tempC} C`)
    windEl.text(`wind: ${windKph} KPH`)
    humidityEl.text(`Humidity ${humidity} %`)

    forecastContainer.append(col)
    }
    

function fetchWeather(location){
    let latitude = location.lat;
    let longitude = location.lon;

    let city = location.name

    let queryWeatherURL = `${weatherAPIURL}/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${weatherAPIkey}`;
}

function fetchCoordinates() {
    let queryURL = `${weatherAPIURL}/geo/1.0/direct?q=${search}&limit=5&appid=${weatherAPIkey}`

    fetch(queryURL,{method: "GET"}).then(function(data){
        return data.json()
    }).then(function(response){
        if(!response[0]){
            alert("Location not found")
        } else {
            
            appendSearchHistory(search)
            fetchWeather(response[0])
            
        
        }
    
    })
}

function initializeHistory(){
    let storedHistory = localStorage.getItem("search-history");

    if(storedHistory) {
        searchHistory = JSON.parse(storedHistory)
    }
    renderSearchHistory()
}


function submitSearchForm(event){
    
    
    event.preventDefault();


    let search = searchInput.val().trim()
   
    fetchCoordinates(search);
    searchInput.val("");
}

function SearchHistoryclick(event) {
   if (!$(event.target).hasClass("btn-history")) {
    return
   }
   let search = $(event.target).attr("data-search")
   
   fetchCoordinates(search);
   searchInput.val("")
}


 initializeHistory()
searchForm.on("submit", submitSearchForm);
searchHistoryContainer.on("click",SearchHistoryclick)









