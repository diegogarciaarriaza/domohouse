'use strict'

var models = require('../models/maria');
var Usuarios = models.usuarios;
var Accesos = models.accesos;
var config = require("../config/main");
var jwt = require("jsonwebtoken");
var bcrypt = require('bcrypt-nodejs');

//Usuarios.sync({force: true});
//Accesos.sync({force: true});

//register a new user
//localhost:3702/api/register
//json: {"nombre": "Diego", "apellido_1": "Garcia", "login": "dgarcia", "passwd": "000077"}
/*return {
"code": 200,
    "message": "Registered"
}*/
function register(req, res){
    if(!req.body['json']){
        res.body.json({code: 205, message: 'Please enter an login and password to register'});
    } else {
        var json = req.body.json;
        json = JSON.parse(json);

        var nombre = json.nombre;
        var apellido1 = json.apellido_1;
        var apellido2 = json.apellido_2;
        var login = json.login;
        var passwd = json.passwd;

        if (!login || !passwd) {
            res.json({code: 500, message: 'Please enter a json with login and password to register'});
        }
        else {
            Usuarios.findOne({where: {login: login}})
                .then(function (user) {
                    if (user) {
                        res.json({code: 205, message: 'Usuario exists already!'});
                    } else {
                        //var password = bcrypt.hashSync(req.body.passwd, bcrypt.genSaltSync(10), null);

                        //mediante el hook beforecreate, recuperaremos el password y lo codificaremos antes de que
                        //se cree la entidad, el nombre lo asignaremos también ahí.
                        Usuarios
                            .build({nombre: nombre, apellido_1: apellido1, apellido_2 : apellido2, rol: '1',
                                login: login, passwd: passwd, activo: true, fecha_alta: new Date(),
                                fecha_caducidad: new Date})
                            .save()
                            .then(function (user) {
                                res.json({code: 200, message: 'Registered'});
                            }).catch(function (error) {
                            res.json({code: 418, message: 'Something was wrong'});
                        });

                    }
                });
        }
    }
}

//authenticate the new user and get a JWT
//localhost:3702/api/authenticate
//json: {"login": "dgarcia", "passwd": "000077"}
/*return:
{
"code": 200,
    "token": "JWT eyJhbGciOiJIUzI1NiIsI..."
}*/
function authenticate(req, res){

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,contenttype'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed


    console.log(req.body.json);
    if(!req.body['json']){
        res.json({code: 205, message: 'Please enter an login and password to authenticate'});
    } else {
        var json = req.body.json;
        json = JSON.parse(json);
        var login = json.login;
        var passwd = json.passwd;
        Usuarios
            .findOne({where: {login: login}})
            .then(function (user, err) {
                if (err) throw err;
                if (!user) {
                    res.send({code: 205, passwd: 'Authentication failed. User not found'});
                } else {
                    var bcrypt = require('bcrypt-nodejs');
                    if (bcrypt.compareSync(passwd, user.passwd)) {
                        /*var token = jwt.sign(JSON.stringify(user), config.secret)/*, {
                         expiresIn: 3600
                         });*/
                        var token = jwt.sign({user}, config.secret, {expiresIn: 84600}); //10 minutos ó 600 segundos
                        res.setHeader('Access-Control-Allow-Origin', '*');

                        Accesos
                            .build({id_usuario: user.id_usuario, fecha_acceso: new Date()})
                            .save()
                            .then(function (acceso) {
                                res.json({code: 200, token: 'JWT ' + token});
                            }).catch(function (error) {
                            res.json({code: 418, message: 'Something was wrong'});
                        });
                    } else {
                        res.json({205: false, message: 'Authentication failed, password did not match'});
                    }
                }
            });
    }
}


//dasboard after loaded
function dashboard(req, res){
    res.send('It worked!, User id is ' + req.user.id + ' name is ' + req.user.login);
}

module.exports = {
    register,
    authenticate,
    dashboard
}
