'use strict'

var express = require('express');
var passport = require('passport');
var config = require('../config/main');
var jwt = require('jsonwebtoken');

var users = require('../controllers/components.controller.js');

//create API group routes
var apiRoutes = express.Router();

//bring in passport strategy we have defined
require('../config/passport')(passport);

//UBICACIONES

//receive the profiles of an user
apiRoutes.post('/ubicacion', passport.authenticate('jwt', {session: false}), users.postubicacion);

//receive the profiles of an user
apiRoutes.get('/ubicaciones', passport.authenticate('jwt', {session: false}), users.getubicaciones);

//receive the profiles of an user
apiRoutes.get('/ubicacion/:idUbicacion', passport.authenticate('jwt', {session: false}), users.getubicacion);

//delete a profiles of an user
apiRoutes.delete('/ubicacion/:idUbicacion', passport.authenticate('jwt', {session: false}), users.deleteubicacion);

//receive the profiles of an user
apiRoutes.put('/ubicacion/:idUbicacion', passport.authenticate('jwt', {session: false}), users.putubicacion);

//PLACAS

//receive the profiles of an user
apiRoutes.post('/placa', passport.authenticate('jwt', {session: false}), users.postplaca);

//receive the profiles of an user
apiRoutes.get('/placas', passport.authenticate('jwt', {session: false}), users.getplacas);

//receive the profiles of an user
apiRoutes.get('/placa/:idPlaca', passport.authenticate('jwt', {session: false}), users.getplaca);

//delete a profiles of an user
apiRoutes.delete('/placa/:idPlaca', passport.authenticate('jwt', {session: false}), users.deleteplaca);

//receive the profiles of an user
apiRoutes.put('/placa/:idPlaca', passport.authenticate('jwt', {session: false}), users.putplaca);


//PLACAS

//receive the profiles of an user
apiRoutes.post('/tipo', passport.authenticate('jwt', {session: false}), users.posttipo);

//receive the profiles of an user
apiRoutes.get('/tipos', passport.authenticate('jwt', {session: false}), users.gettipos);

//receive the profiles of an user
apiRoutes.get('/tipo/:idTipo', passport.authenticate('jwt', {session: false}), users.gettipo);

//delete a profiles of an user
apiRoutes.delete('/tipo/:idTipo', passport.authenticate('jwt', {session: false}), users.deletetipo);

//receive the profiles of an user
apiRoutes.put('/tipo/:idTipo', passport.authenticate('jwt', {session: false}), users.puttipo);



//ELEMENTOS

//receive the profiles of an user
apiRoutes.post('/elemento', passport.authenticate('jwt', {session: false}), users.postelemento);

//receive the profiles of an user
apiRoutes.get('/elementos', passport.authenticate('jwt', {session: false}), users.getelementos);

//receive the profiles of an user
apiRoutes.get('/elemento/:idElemento', passport.authenticate('jwt', {session: false}), users.getelemento);

//delete a profiles of an user
apiRoutes.delete('/elemento/:idElemento', passport.authenticate('jwt', {session: false}), users.deleteelemento);

//receive the profiles of an user
apiRoutes.put('/elemento/:idElemento', passport.authenticate('jwt', {session: false}), users.putelemento);


module.exports = apiRoutes;
