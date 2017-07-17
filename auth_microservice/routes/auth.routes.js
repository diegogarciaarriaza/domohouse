'use strict'

var express = require('express');
var passport = require('passport');
var config = require('../config/main');
var jwt = require('jsonwebtoken');

var auth = require('../controllers/auth.controller');

//create API group routes
var apiRoutes = express.Router();

//bring in passport strategy we have defined
require('../config/passport')(passport);

//Register users
apiRoutes.post('/register', auth.register);

//authenticate the new user and get a JWT
apiRoutes.post('/authenticate', auth.authenticate);

//protect dashboard route with JWT
apiRoutes.get('/dashboard', passport.authenticate('jwt', {session: false}), auth.dashboard);

module.exports = apiRoutes;



