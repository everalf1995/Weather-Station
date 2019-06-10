// Changes the active tab
var currentTab = 0;
var tableSet = 0;

function changeActive(status) {
    var weekly = document.querySelector("#nav_bar_weekly");
    var hourly = document.querySelector("#nav_bar_hourly");

    if (status !== currentTab) {
        if (status === 0) {
            weekly.classList.add('active');
            hourly.classList.remove('active');
            currentTab = 0;
        } else {
            weekly.classList.remove('active');
            hourly.classList.add('active');
            currentTab = 1;
        }
    }
    display();
}

function display() {
    if ( tableSet === 1) {
        if (currentTab === 0) {
            document.querySelector("#main").style.display = "block";
            document.querySelector("#weekly").style.display = "block";
            document.querySelector("#hourly").style.display = "none";
        }

        else {
            document.querySelector("#main").style.display = "block";
            document.querySelector("#weekly").style.display = "none";
            document.querySelector("#hourly").style.display = "block";
        }
    }
}

// Zip Code Search Bar Focused
function zipCodeBarFocused() {
    document.querySelector("#search_icon").src = "images/search_focused.svg";
    document.querySelector("#close_icon").src = "images/close_focused.svg";

}

// Zip Code Search Bar Losses Focus
function zipCodeBarNotFocused() {
    document.querySelector("#search_icon").src = "images/search.svg";
    document.querySelector("#close_icon").src = "images/close.svg";

}

// Checks the zip code
var city = "";
var state = "";
var latitude = "";
var longitude = "";
function checkIfEnter(event, input) {
    if (event.which === 13) {

        // Prevents the page from refreshing
        event.preventDefault();

        // If the input doesn't match the format of a zip code
        if (!input.match(/(^\d{5}$)|(^\d{5}-\d{4}$)/)) {
            var x = document.querySelector("#snackbar");
            x.className = "show";
            setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
        }

        // Else get the coordinates for the given zip code
        else {

            if (tableSet === 1) {
                document.querySelector("#weekly_body").innerHTML = "";
                document.querySelector("#hourly_body").innerHTML = "";

            }

            // Key removed
            var locationRequestUrl = 'https://www.mapquestapi.com/geocoding/v1/address?key=&inFormat=kvp&outFormat=json&postalCode=' + input + '&maxResults=1&thumbMaps=false';
            var locationRequest = new XMLHttpRequest();
            locationRequest.open('GET', locationRequestUrl);
            locationRequest.responseType = 'json';
            locationRequest.send();

            locationRequest.onload = function() {
                var locationResponse = locationRequest.response;
                city = locationResponse.results[0].locations[0].adminArea5;
                state = locationResponse.results[0].locations[0].adminArea3;
                latitude = locationResponse.results[0].locations[0].latLng.lat;
                longitude = locationResponse.results[0].locations[0].latLng.lng;
                setWeatherData();
            };
        }
        document.querySelector("#search_input").value = "";
    }
}

var hourlyWeatherUrl;
var weeklyWeatherUrl;
function setWeatherData() {
    var weatherRequestUrl = 'https://api.weather.gov/points/'+ latitude + ',' + longitude;
    var weatherRequest = new XMLHttpRequest();
    weatherRequest.open('GET', weatherRequestUrl);
    weatherRequest.responseType = 'json';
    weatherRequest.send();

    weatherRequest.onload = function() {
        var weatherResponse = weatherRequest.response;

        if (weatherResponse.properties === undefined) {
            document.querySelector("#main").style.display = "none";
            document.querySelector("#weekly").style.display = "none";
            document.querySelector("#hourly").style.display = "none";
            tableSet = 0;
            var x = document.querySelector("#snackbar");
            x.className = "show";
            setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);

        }

        else {
            hourlyWeatherUrl = weatherResponse.properties.forecastHourly;
            weeklyWeatherUrl = weatherResponse.properties.forecast;
            setHourlyWeatherForecast();
        }
    };
}

var tdDate;
var tdTime;
var tdTemperature;
var tdWeather;
var tdIcon;
var iconH;
var hourlyWeatherResponse;
function setHourlyWeatherForecast() {
    var hourlyWeatherRequest = new XMLHttpRequest();
    hourlyWeatherRequest.open('GET', hourlyWeatherUrl);
    hourlyWeatherRequest.responseType = 'json';
    hourlyWeatherRequest.send();

    hourlyWeatherRequest.onload = function() {
        hourlyWeatherResponse = hourlyWeatherRequest.response;
        setH();
    };
}

function setH() {
    var body = document.querySelector("#hourly_body");

    var i = 0;
    for (i; i < 12; i++) {
        var trH = document.createElement("tr");
        trH.id = "trHourly";

        var date = hourlyWeatherResponse.properties.periods[i].startTime;
        date = (date.split("T"));
        var time = (date[1].split("-"));

        tdDate = document.createElement("td");
        tdDate.innerText = date[0];

        tdTime = document.createElement("td");
        tdTime.innerText = time[0];

        var temperature = hourlyWeatherResponse.properties.periods[i].temperature;
        tdTemperature = document.createElement("td");
        tdTemperature.innerText = temperature + "° F";

        var weather = hourlyWeatherResponse.properties.periods[i].shortForecast;
        tdWeather = document.createElement("td");
        tdWeather.innerText = weather;

        var icon = determineIcon(weather);
        tdIcon = document.createElement("td");
        iconH = document.createElement("img");
        iconH.src = icon;

        if (i === 0) {
            document.querySelector("#time_main").textContent = date[0] + ", " + time[0];
            document.querySelector("#location_main").textContent = city + ", " + state;
            document.querySelector("#temperature_main").textContent = temperature + "° F";
            document.querySelector("#weather_main").textContent = weather;
            document.querySelector("#weather_icon_main").src = icon;

        }

        else {
            trH.appendChild(tdDate);
            trH.appendChild(tdTime);
            trH.appendChild(tdTemperature);
            trH.appendChild(tdWeather);
            tdIcon.appendChild(iconH);
            trH.appendChild(tdIcon);
            body.appendChild(trH);
        }
    }
    setWeeklyWeatherForecast();
}

var tdDayW;
var tdTemperatureW;
var tdWeatherW;
var tdIconW;
var iconW;
var weeklyWeatherResponse;
function setWeeklyWeatherForecast() {
    var weeklyWeatherRequest = new XMLHttpRequest();
    weeklyWeatherRequest.open('GET', weeklyWeatherUrl);
    weeklyWeatherRequest.responseType = 'json';
    weeklyWeatherRequest.send();

    weeklyWeatherRequest.onload = function() {
        weeklyWeatherResponse = weeklyWeatherRequest.response;
        setW();
    };
}

function setW() {
    var body = document.querySelector("#weekly_body");

    var e = 1;

    for (e; e < 7; e++) {
        var trW = document.createElement("tr");
        trW.id = "trWeekly";

        var day = weeklyWeatherResponse.properties.periods[e].name;
        tdDayW = document.createElement("td");
        tdDayW.innerText = day;

        var temperature = weeklyWeatherResponse.properties.periods[e].temperature;
        tdTemperatureW = document.createElement("td");
        tdTemperatureW.innerText = temperature + "° F";

        var weather = weeklyWeatherResponse.properties.periods[e].shortForecast;
        tdWeatherW = document.createElement("td");
        tdWeatherW.innerText = weather;

        var icon = determineIcon(weather);
        tdIconW = document.createElement("td");
        iconW = document.createElement("img");
        iconW.src = icon;

        trW.appendChild(tdDayW);
        trW.appendChild(tdTemperatureW);
        trW.appendChild(tdWeatherW);
        tdIconW.appendChild(iconW);
        trW.appendChild(tdIconW);
        body.appendChild(trW);
    }
    tableSet = 1;
    display();
}

function determineIcon(weather) {
    if (weather.includes("Fog") || weather.includes("Haze") || weather.includes("Smoke") || weather.includes("Dust") || weather.includes("Sand") || weather.includes("Storm")
        || weather.includes("Hurricane") || weather.includes("Tornado") || weather.includes("Funnel") || weather.includes("Tornado") || weather.includes("Overcast")
        || weather.includes("Cloud")) {
        return "images/cloud.svg";
    }

    else if (weather.includes("Thunder") ) {
        return "images/lightning.svg";
    }

    else if (weather.includes("Blizzard") || weather.includes("Cold")|| weather.includes("Wind")|| weather.includes("Breezy")) {
        return "images/wind.svg";
    }

    else if (weather.includes("Snow") || weather.includes("Ice") || weather.includes("Hail") || weather.includes("Freeze") || weather.includes("Sleet")) {
        return "images/snow.svg";
    }

    else if (weather.includes("Shower") || weather.includes("Rain") || weather.includes("Drizzle")) {
        return "images/rain.svg";
    }

    else if (weather.includes("Hot") || weather.includes("Fair") || weather.includes("Clear") || weather.includes("Sun")) {
        return "images/sun.svg";
    }

    else {
        return "images/remainder.svg";
    }
}
