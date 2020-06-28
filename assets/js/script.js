var apiKey = 'b32eeab351de3490d17b1b3bff11721e';



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


function getCurrentWeather(location){
    fetch(
        'http://api.openweathermap.org/data/2.5/weather?q=' +
        location + '&units=imperial&appid=' + apiKey
    )
        .then(function(response){
            if(response.ok){
                return response.json();
            }else{
                alert("Could not find city");
            }

        })
        .then(function(response){
            // display current weather
            $("#cityName")
                .addClass("bg-primary text-light")
                .text(response.name + " (" + new Date().toLocaleDateString() + ") ");
            $("#temperature").text("Temperature: " + response.main.temp + "°F");
            $("#humidity").text("Humidity: " + response.main.humidity + "%");
            $("#windSpeed").text("Wind speed: " + response.wind.speed + " MPH");

            var iconCode = response.weather[0].icon;
            var icon = $("<img>").attr("src", "http://openweathermap.org/img/w/" + iconCode + ".png");
            $("#cityName").append(icon);

            // display UV index
            getUV(response.coord.lat, response.coord.lon);
            getForecast(location);
            

        })
        .catch(function(error){
            alert("Unable to connect to OpenWeatherMap");
        })
}

function getUV(lat, lon){
    fetch(
        'http://api.openweathermap.org/data/2.5/uvi?appid=' +
        apiKey + '&lat=' + lat +'&lon=' + lon
    )
        .then(function(data){
            return data.json;
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