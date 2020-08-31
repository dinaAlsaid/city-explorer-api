'use strict';

const express = require('express');
const server = express();
require('dotenv').config();
const cors = require('cors');

const PORT = process.env.PORT || 2000;
server.use(cors());

//main page
server.get('/', (req, res) => {
    res.status(200).send('please wait');
});

//location route 
// https://eu1.locationiq.com/v1/search.php?key=YOUR_PRIVATE_TOKEN&q=SEARCH_STRING&format=json

server.get('/location', (req, res) => {
    const locationData = require('./data/location.json');
    let city = req.query.city;
    let location = new Location(city, locationData);
    res.send(location);

    // res.send("let's see what happens"); we can only have one response (will cause an error)
});
function Location(city, data) {
    this.search_query = city;
    this.formatted_query = data[0].display_name;
    this.latitude = data[0].lat;
    this.longitude = data[0].lon;
}

//weather route
server.get('/weather', (req, res) => {
    const weatherData = require('./data/weather.json');
    let foreCast = weatherData.data.map((item)=> new Forecast(item));
    res.send(foreCast);
    // res.send("let's see what happens"); we can only have one response (will cause an error)
});

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
// server.get('*',(req,res,error)=>{
//     res.status(404).send({
//         status: 404,
//         responseText: "Sorry, something went wrong",
//     });
// })

server.use((req,res,error)=>{
    res.status(500).send({
        status: 500,
        responseText: "Sorry, something went wrong",
    });
})
server.listen(PORT, () => {
    console.log("Serevr is up");
});
