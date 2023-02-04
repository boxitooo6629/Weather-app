
const weatherAPIURL = "http://api.openweathermap.org";
const weatherAPIkey = "0dc1473268e475d2b577364af6851574";


let searchInput = $("search-input");
let searchForm = $("search-form");
let searchHistoryContainer = $("#history")


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


function submitSearchFrom(event){
    
    
    event.preventDefault();


    let search = searchInput.val().trim()
   
    fetchCoordinates(search);
    searchInput.val("");
}

 initializeHistory()
searchForm.on("submit", submitSearchFrom);









