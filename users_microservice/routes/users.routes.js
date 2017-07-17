'use strict'

var express = require('express');
var passport = require('passport');
var config = require('../config/main');
var jwt = require('jsonwebtoken');

var users = require('../controllers/users.controller');

//create API group routes
var apiRoutes = express.Router();

//bring in passport strategy we have defined
require('../config/passport')(passport);


//receive the profiles of an user
apiRoutes.get('/usuarios', passport.authenticate('jwt', {session: false}), users.getusuarios);

//receive the profiles of an user
apiRoutes.get('/usuario/:idUsuario?', passport.authenticate('jwt', {session: false}), users.getusuario);

//delete a profiles of an user
apiRoutes.delete('/usuario/:idUsuario', passport.authenticate('jwt', {session: false}), users.deleteusuario);

//receive the profiles of an user
apiRoutes.put('/usuario/:idUsuario', passport.authenticate('jwt', {session: false}), users.putusuario);


module.exports = apiRoutes;
