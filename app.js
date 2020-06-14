const express = require('express');
const app = express();
const getDataRoute = require('./api/routes/getdata.js');
var bodyParser = require('body-parser');

app.use('/getdata', getDataRoute);
module.exports = app;
