var apiKey = 'b32eeab351de3490d17b1b3bff11721e';

// list of cities
var cityList = [];


// get city name when search button is pressed
$("#searchBtn").on("click", function(){
    event.preventDefault();
    var cityName = $("#inputCity").val();
    if(cityName === ''){ // if no city is searched
        alert("Please enter a city");
    }
    $("#inputCity").val(""); // clear input box
    getCurrentWeather(cityName)
})


// get current weather data
function getCurrentWeather(location){
    fetch(
        'http://api.openweathermap.org/data/2.5/weather?q=' +
        location + '&units=imperial&appid=' + apiKey
    )
        .then(function(response){
            if(response.ok){
                response.json()
                .then(function(response){
                    // add city to history list if not in list
                    if(!cityList.includes(response.name)){
                        addToHistory(response.name);
                    }

                    // display current weather
                    $("#cityName")
                        .addClass("fetchedcolor")
                        .text(response.name + " (" + new Date().toLocaleDateString() + ") ");
                    $("#temperature").text("Temperature: " + response.main.temp + "°F");
                    $("#humidity").text("Humidity: " + response.main.humidity + "%");
                    $("#windSpeed").text("Wind speed: " + response.wind.speed + " MPH");
        
                    var iconCode = response.weather[0].icon;
                    var icon = $("<img>").attr("src", "https://openweathermap.org/img/w/" + iconCode + ".png");
                    $("#cityName").append(icon);
        
                    // display UV index
                    getUV(response.coord.lat, response.coord.lon);

                    // display 5 day forecast
                    getForecast(location);
                })
            }else{
                alert("Could not find city");
            }

        })
        .catch(function(error){
            alert("Unable to connect to OpenWeatherMap");
        })
}

function getUV(lat, lon){
    fetch(
        'https://api.openweathermap.org/data/2.5/uvi?appid=' +
        apiKey + '&lat=' + lat +'&lon=' + lon
    )
        .then(function(data){
            return data.json();
        })
        .then(function(data){
            $("#uvindex").text("UV Index: ");
            var uvColor = $("<span>").addClass("btn").text(data.value);

            // change UV color
            if(data.value < 3){
                uvColor.addClass("favorable")
            }else if(data.value < 7){
                uvColor.addClass("moderate")
            }else{
                uvColor.addClass("severe")
            }
            $("#uvindex").append(uvColor);
        })
}

function getForecast(location){
    fetch(
        'https://api.openweathermap.org/data/2.5/forecast?q=' +
        location + '&units=imperial&appid=' + apiKey
    )
        .then(function(response){
            return response.json();
        })
        .then(function(response){
            // override forecast
            $("#forecast-container").text("");

            // look at all forecasts
            for(var i = 0; i < response.list.length; i++){
                // display only forecasts at noon
                if(response.list[i].dt_txt.indexOf("12:00:00") !== -1){
                    var column = $("<div>").addClass("col-md-2 m-2 fetchedcolor py-4");
                    var day = $("<h5>").text(new Date(response.list[i].dt_txt).toLocaleDateString());
                    var iconCode = response.list[i].weather[0].icon
                    var icon = $("<img>").attr("src", "http://openweathermap.org/img/w/" + iconCode + ".png");
                    var temp = $("<p>").text("Temperature: " + Math.floor(response.list[i].main.temp) + "°F");
                    var humidity = $("<p>").text("Humidity: " + response.list[i].main.humidity + "%");

                    column.append(day,icon,temp,humidity);
                    $("#forecast-container").append(column);
                }
            }
        })
}


// create list element
function addToHistory(city){
    // create list element
    var li = $("<li>").addClass("list-group-item list-group-item-action").text(city);
    $("#history-list").append(li);

    saveList(city);
}

// save city to local storage
function saveList(city){
    cityList.push(city);
    localStorage.setItem('cities', JSON.stringify(cityList));
}

// load search history
function loadList(){
    var getCities = localStorage.getItem('cities');
    getCities = JSON.parse(getCities);

    if(!getCities){
        return false;
    }

    for(var i = 0; i < getCities.length; i++){
        addToHistory(getCities[i]);
    }
}

// search city from history list when clicked
function cityClicked(){
    getCurrentWeather(event.target.innerText);
}

loadList();