'use strict'

var express = require('express');
var passport = require('passport');
var config = require('../config/main');
var jwt = require('jsonwebtoken');

var crontasks = require('../controllers/crontask.component.js');

//create API group routes
var apiRoutes = express.Router();

//bring in passport strategy we have defined
require('../config/passport')(passport);

//create a new crontask
apiRoutes.post('/cron', passport.authenticate('jwt', {session: false}), crontasks.postcrontask);

//receive the profiles of an user
apiRoutes.get('/crons', passport.authenticate('jwt', {session: false}), crontasks.getcrontasks);

//receive the profiles of an user
apiRoutes.get('/cron/:idCron', passport.authenticate('jwt', {session: false}), crontasks.getcrontask);

//delete a profiles of an user
apiRoutes.delete('/cron/:idCron', passport.authenticate('jwt', {session: false}), crontasks.deletecrontask);

//receive the profiles of an user
apiRoutes.put('/cron/:idCron', passport.authenticate('jwt', {session: false}), crontasks.putcrontask);

//receive the profiles of an user
apiRoutes.put('/cronDisable/:idCron', passport.authenticate('jwt', {session: false}), crontasks.putcrontaskenabledisable);

//receive the profiles of an user
apiRoutes.put('/cronEnable/:idCron', passport.authenticate('jwt', {session: false}), crontasks.putcrontaskenabledisable);

module.exports = apiRoutes;
