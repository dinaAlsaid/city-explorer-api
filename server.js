'use strict';

const express = require('express');
const server = express();
require('dotenv').config();
const cors = require('cors');

const PORT = process.env.PORT || 2000;
server.use(cors());

//main page
server.get('/', (req, res) => {
    res.send('please wait');
});

//location route 
server.get('/location', (req , res) => {
    const locationData = require('./data/location.json');
    let city = req.query.city;
    let location=new Location(city,locationData);
    // console.log(city);
    // locationData.forEach(item => {
    //     location.push( new Location(city,item) );
    // })
    res.send(location);

    // res.send("let's see what happens"); we can only have one response (will cause an error)
});
function Location(city,data){
    this.search_query = city;
    this.formatted_query = data[0].display_name;
    this.latitude = data[0].lat;
    this.longotude = data[0].lon;
}

// server.get('/weather', (req , res) => {
//     const locationData = require('./data/weather.json');
//     let foreCast =new Forecast(weatherData);
    // console.log(city);
    // locationData.forEach(item => {
    //     location.push( new Location(city,item) );
    // })
    // res.send(location);

    // res.send("let's see what happens"); we can only have one response (will cause an error)
// });
// function Location(weather){
//     this.forecast= ;
//     this.time = weather.data.display_name;
// }
// {
//     "forecast": "Partly cloudy until afternoon.",
//     "time": "Mon Jan 01 2001"
//   },
server.listen(PORT, () => {
    console.log("Serevr is up");
});