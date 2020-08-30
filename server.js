'use strict';

const express = require('express');
const server = express();
require('dotenv').config();

const PORT = process.env.PORT || 2000;


server.get('/', (req, res) => {
    res.send('please wait');
})

server.listen(PORT, () => {
    console.log("Serevr is up");
});