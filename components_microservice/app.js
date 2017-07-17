'use strict'

var express = require('express');
var bodyParser = require('body-parser');
var passport = require('passport');
var helmet = require('helmet');
var cors = require('cors');

var config = require('./config/main');
var routesUser = require('./routes/users.routes');

var app = express();

//bodyParser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//declaration of view engine
app.set("view engine", "pug");

//habilitamos el uso de cors
app.use(cors());

// initialize passport for use
app.use(passport.initialize());

//añadimos algo de seguridad con helmet
app.use(helmet());
app.use(helmet.noCache());

//ruta base
app.use('/api', routesUser);

module.exports = app;