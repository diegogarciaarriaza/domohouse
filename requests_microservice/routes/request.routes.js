'use strict'

var express = require('express');
var passport = require('passport');
var config = require('../config/main');
var jwt = require('jsonwebtoken');

var event = require('../controllers/request.component');

//create API group routes
var apiRoutes = express.Router();

//bring in passport strategy we have defined
require('../config/passport')(passport);

//UBICACIONES

//receive the profiles of an user
apiRoutes.get('/value/:idElemento', passport.authenticate('jwt', {session: false}), event.valueElement);

module.exports = apiRoutes;
