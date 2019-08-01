// app.js
var express = require('express');
var bodyParser = require('body-parser');
var swig = require('swig');


// initialize our express app
var app = express();

let port = 3000;
  
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));


  routes = require('./routes/router')(app,express);


app.listen(port, () => {
    console.log('Server is up and running on port numner ' + port);
});
