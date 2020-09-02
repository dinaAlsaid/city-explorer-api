"use strict";

const express = require("express");
const server = express();
const cors = require("cors");
const superagent = require("superagent");
const pg = require("pg");

require("dotenv").config();

const PORT = process.env.PORT || 2000;
const client = new pg.Client(process.env.DATABASE_URL);
server.use(cors());

//routing
server.get("/", (req, res) => {
    res.status(200).send("please wait");
});

server.get("/weather", weatherHandler);
server.get("/location", locationHandler);
server.get("/trails", trailHandler);
server.use("*", notFoundHandler);
server.use(errorHandler);

function checkDB(city, url,res) {
    let location;
    let safeValues = [city];
    let SQL = `SELECT * FROM t1 WHERE search_query=$1;`;

    client.query(SQL, safeValues).then((results) => {
        if (results.rows.length != 0) {
    
            location = results.rows[0];
            console.log("from DB",location);
            res.status(200).send(location);


        } else {
            superagent.get(url).then((data) => {
                location = new Location(city, data.body); //the get will return All the data but the data we need is in the body
                let SQL2 = `INSERT INTO t1 VALUES ('${city}','${location.formatted_query}','${location.latitude}','${location.longitude}');`;
                client.query(SQL2); //don't need to wait for it to process
                console.log("from API");
                res.status(200).send(location);

            });
        }
    });


}

//callback functions
function locationHandler(req, res) {
    let city = req.query.city;
    let key = process.env.GEOCODE_API_KEY;
    var url = `https://eu1.locationiq.com/v1/search.php?key=${key}&q=${city}&format=json`;

    let loc = checkDB(city, url,res);
}

function weatherHandler(req, res) {
    let key = process.env.WEATHER_API_KEY;
    let lon = req.query.longitude;
    let lat = req.query.latitude;
    let url = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=${key}`;

    superagent
        .get(url)
        .then((weather) => {
            let foreCast = weather.body.data.map((item) => new Forecast(item));
            res.send(foreCast);
        })
        .catch(() => {
            errorHandler(req, res);
        });
}

function trailHandler(req, res) {
    let key = process.env.TRAIL_API_KEY;
    let lon = req.query.longitude;
    let lat = req.query.latitude;
    let url = `https://www.hikingproject.com/data/get-trails?lat=${lat}&lon=${lon}&key=${key}`;
    //   let tenTrails=[];

    superagent
        .get(url)
        .then((hike) => {
            //   for (let i = 0; i < hike.body.trails.length && i<10; i++) {
            //       tenTrails.push(hike.body.trails[i]);
            //   }
            let trail = hike.body.trails.map((item) => new Trail(item));
            res.send(trail);
        })
        .catch(() => {
            errorHandler(req, res);
        });
}

function errorHandler(req, res) {
    res.status(500).send({
        status: 500,
        responseText: "Sorry, something went wrong",
    });
}
function notFoundHandler(req, res) {
    res.status(404).send("Not Found");
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
}
Forecast.prototype.weekDay = function (weatherDay) {
    let date = new Date(weatherDay.datetime);
    switch (date.getDay()) {
        case 0:
            return "Sun";
            break;
        case 1:
            return "Mon";
            break;
        case 2:
            return "Tue";
            break;
        case 3:
            return "Wed";
            break;
        case 4:
            return "Thu";
            break;
        case 5:
            return "Fri";
            break;
        case 6:
            return "Sat";
            break;
    }
};
function Trail(trailData) {
    this.name = trailData.name;
    this.location = trailData.location;
    this.length = trailData.length;
    this.stars = trailData.stars;
    this.star_votes = trailData.starVotes;
    this.summary = trailData.summary;
    this.conditions = `${trailData.conditionStatus}: ${trailData.conditionDetails}`;
    this.condition_date = trailData.conditionDate.split(" ")[0];
    this.condition_time = trailData.conditionDate.split(" ")[1];
}

client.connect().then(() => {
    server.listen(PORT, () => {
        console.log("Serevr is up");
    });
});
