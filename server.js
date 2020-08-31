'use strict';

const express = require('express');
const server = express();
const cors = require('cors');
const superagent = require('superagent');
require('dotenv').config();

const PORT = process.env.PORT || 2000;
server.use(cors());


//routing
server.get('/', (req, res) => {
    res.status(200).send('please wait');
});

server.get('/weather', weatherHandler);
server.get('/location', locationHandler);
server.use('*', notFoundHandler);
server.use(errorHandler);


function locationHandler (req, res) {
    let city = req.query.city;
    let key = process.env.GEOCODE_API_KEY;
    const url = `https://eu1.locationiq.com/v1/search.php?key=${key}&q=${city}&format=json`;

    superagent.get(url)
    .then( data => {
        let location = new Location(city, data.body); //the get will return All the data but the data we need is in the body
        res.send(location);
    })
}
// https://api.weatherbit.io/v2.0/forecast/daily?city=Raleigh,NC&key=API_KEY
function weatherHandler(req, res){
    let key = process.env.WEATHER_API_KEY; 
    let lon = req.query.longitude;
    let lat = req.query.latitude;
    let url = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=${key}`

    superagent.get(url)
    .then(weather => {
        let foreCast = weather.body.data.map((item)=> new Forecast(item));
        res.send(foreCast);
    })
}

function errorHandler(req,res,error){
    res.status(500).send({
        status: 500,
        responseText: "Sorry, something went wrong",
    });
}

function notFoundHandler(req,res){
    res.status(404).send('Not Found');
}


//constructors
function Location(city, data) {
    this.search_query = city;
    this.formatted_query = data[0].display_name;
    this.latitude = data[0].lat;
    this.longitude = data[0].lon;
}

function Forecast(weatherDay) {
    this.forecast = weatherDay.weather.description;
    this.time = `${this.weekDay(weatherDay)}, ${weatherDay.datetime}`;
};

Forecast.prototype.weekDay = function (weatherDay) {
    let date = new Date(weatherDay.datetime);
    switch (date.getDay()) {
        case 0:
            return 'Sun'
            break;
        case 1:
            return 'Mon'
            break;
        case 2:
            return 'Tue'
            break;
        case 3:
            return 'Wed'
            break;
        case 4:
            return 'Thu'
            break;
        case 5:
            return 'Fri'
            break;
        case 6:
            return 'Sat'
            break;

    };

};

server.listen(PORT, () => {
    console.log("Serevr is up");
});
