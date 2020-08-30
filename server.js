'use strict';

const express = require('express');
const server = express();
require('dotenv').config();

const PORT = process.env.PORT || 2000;

//main page
server.get('/', (req, res) => {
    res.send('please wait');
});

//location route 
server.get('/location', (req , res) => {
    const locationData = require('./data/location.json');
    let city = req.query.city;
    let location=[];
    // console.log(city);
    locationData.forEach(item => {
        location.push( new Location(city,item) );
    })
    res.send(location);

    // res.send("let's see what happens"); we can only have one response (will cause an error)
});
function Location(city,data){
    this.search_query = city;
    this.formatted_query = data.display_name;
    this.latitude = data.lat;
    this.longotude = data.lon;
}


server.listen(PORT, () => {
    console.log("Serevr is up");
});