'use strict'

var bcrypt = require('bcrypt-nodejs');
var models = require('../models/maria');
var http = require('http');
var Usuarios = models.usuarios;
var config = require("../config/main");
var respuesta = require('../helpers/respuesta');


//Usuarios.sync({force: true});
//Accesos.sync({force: true});
//Errores.sync();

//localhost:3703/api/usuario/1
//return:
//{"code": 200, "data": [1], "message": "user deleted successfully"}
//requires JWT and param idUsuario
function deleteusuario(req, res){
    if(req.user.rol != 1) {
        respuesta(req, res, 401, null, 'No permissions', 1);
    } else {
        var id = req.params.idUsuario;
        Usuarios.update(
            {activo: 0},
            {where: {id_usuario: id}}
        )
            .then(function (entity) {
                if (!entity) {
                    respuesta(req, res, 205, null, 'user does not found', 1);
                } else {
                    respuesta(req, res, 200, entity, 'user deleted successfully', 1);
                }
            }).catch(function (error) {
            respuesta(req, res, 418, error, 'Something was wrong', 1);
        });
    }
}

//localhost:3703/api/usuario/1
//return:
//json: {"code":200,"data":null,"message":"success"}
//requires JWT and param idUsuario
function getusuario(req, res){
    if(req.user.rol != 1){
        respuesta(req, res, 401, null, 'User no has permissions', 1);
    }
    else {
        let id;
        req.params.idUsuario ? id = req.params.idUsuario : id = req.user.id_usuario

        Usuarios
            .findOne({
                where: {id_usuario: id}
            })
            .then(function (entity) {
                if (!entity) {
                    respuesta(req, res, 205, null, 'Not user found', 0);
                } else {
                    respuesta(req, res, 200, entity, 'success', 0);
                }
            });

    }
}

//localhost:3703/api/usuarios
//return:
//json: [{"code":200,"data":null,"message":"success"}]
//requires JWT
function getusuarios(req, res){
    if(req.user.rol != 1){
        respuesta(req, res, 401, null, 'User no has permissions', 1);
    }
    else {console.log("get usuarios")
        Usuarios
            .findAll()
            .then(function (entity) {
                if (entity.length === 0) {
                    respuesta(req, res, 205, null, 'Not users found', 0);
                } else {
                    respuesta(req, res, 200, entity, 'success', 0);
                }
            });

    }
}

//requires json{nombre:, estado:, extension:}
//returns json{}
function putusuario(req, res){
    if(!req.body['json']) {
        respuesta(req, res, 401, null, 'No data received', 1);
    } else {
        var json = req.body['json'];
        json = JSON.parse(json);

        var nombre = json.nombre;
        var apellido1 = json.apellido_1;
        var apellido2 = json.apellido_2;
        var rol = json.rol;
        var login = json.login;
        var passwd = json.passwd;
        var activo = json.activo;

        if (!nombre || !apellido1 || !apellido2 || !rol || !activo) {
            respuesta(req, res, 401, null, 'No params received', 1);
        } else {
            var id = req.params.idUsuario;
            //buscamos un mensaje con id
            Usuarios.findOne({where: {id_usuario: id}})
                .then(function(entity) {
                    if (!entity) {
                        respuesta(req, res, 205, null, 'Not user found', 0);
                    }
                    else {
                        Usuarios.update(
                            {nombre: nombre, apellido_1: apellido1, apellido_2: apellido2, rol: rol, activo: activo},
                            {where: {id_usuario: id}}
                        )
                            .then(function (entity) {
                                if (!entity) {
                                    respuesta(req, res, 205, null, 'Not user found', 1);
                                } else {
                                    respuesta(req, res, 200, entity, 'user updated successfully', 0);
                                }
                            }).catch(function (error) {
                            respuesta(req, res, 418, null, 'Something was wrong', 1);
                        });

                    }
                });
        }
    }
}

module.exports = {
    deleteusuario, getusuario, getusuarios, putusuario,
}
