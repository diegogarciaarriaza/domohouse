'use strict'

var sequelize = require('sequelize');
var bcrypt = require('bcrypt-nodejs');
var models = require('../models/maria');
var http = require('http');
var Elemento = models.elemento;
var Crontask = models.crontask
var Errores = models.errores;
var config = require("../config/main");
var respuesta = require('../helpers/respuesta');
//var CRON = require('../helpers/manageCron');

//Crontask.sync({force: true});

//Errores.sync();


//FACTORIZAR ESTO
var Cron = require('node-cron');

var Crons = {}; // create an empty json

function manageCron(idCron, cron, task, accion){

    console.log("ENTRANDO EN MANAGE CRON: " + idCron);

    switch (accion){
        case "start": {
            console.log("STARTING CRONTASK")
            var tarea = Cron.schedule(cron, function() {
                console.log('Ejecutando tarea programada: ' + cron + " " + task + " at " + new Date());
                launchSchedule(task)
            }, false);

            tarea.start();
            /*console.log("TAREA : ");
            console.log(tarea);*/

            Crons[idCron] = tarea;

            break;
        }

        case "destroy": {
            console.log("DESTROYING CRONTASK")
            var tarea = Crons[idCron];
            /*console.log("TAREA : ")
            console.log(tarea)*/
            if(tarea) {
                //console.log(tarea);
                tarea.destroy();

                //Crons.pop(idCron);
            }else{
                console.log("TAREA YA PARADA");
            }

            break;
        }

        default : {}
    }
    //console.log(Crons)
    return 1;
}

function launchSchedule(task){

    var options = {
        host: config.schedule.host,
        path: task,
        port: config.schedule.port,
        method: 'GET',
        headers: {'Authorization': 'JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkX3VzdWFyaW8iOjEsIm5vbWJyZSI6IkRpZWdvIiwiYXBlbGxpZG9fMSI6IkdhcmNpYSIsImFwZWxsaWRvXzIiOiJBcnJpYXphIiwibG9naW4iOiJkZ2FyY2lhIiwicGFzc3dkIjoiJDJhJDEwJHN3czBWNmcyMUlCVklHeFU5azhwN3U0eFR0dk1kZGcxd09HQUtES2JXYjZDMUQxV29TRmtpIiwicm9sIjoxLCJhY3Rpdm8iOjEsImZlY2hhX2FsdGEiOiIyMDE3LTA2LTI3VDAwOjI2OjE0LjAwMFoiLCJmZWNoYV9jYWR1Y2lkYWQiOiIyMDE3LTA2LTI3VDAwOjI2OjE0LjAwMFoifSwiaWF0IjoxNTAwMjI3NTEyLCJleHAiOjE1MDAzMTIxMTJ9.bpYrUAvPvFNxiIdQ7Svk0pu42ut2_J0nutf4SEdiA9U'}
    };

    var req = http.request(options, function(response){
        console.log("entra en callback")
        var str = ''
        response.on('data', function (chunk) {
            str += chunk;
        });

        response.on('end', function () {
            console.log(str);
        });
    });

    req.end();
}

//FACTORIZAR HASTA AQUI

function contingencia(){
    Crontask
        .findAll()
        .then(function (entity) {
            console.log("CRONTASKS: " + entity.length)
            if (entity.length > 0) {
                for (var i = 0; i < entity.length; i++){
                    if(entity[i].activo == 1 && entity[i].borrado == 0) {
                        console.log("Recuperando crontask: " + entity[i].cron + " - " + entity[i].task)
                        manageCron(entity[i].id_crontask, entity[i].cron, entity[i].task, "start");
                        //console.log("CRONS"); console.log(Crons)
                    }
                }
            }
        });
}

contingencia(function(){})


//localhost:3705/api/cron
//return json: {"nombre": "cuarto0"}
//requires JWT and idElemento
function postcrontask(req, res){
    if(!req.body['json']){
        respuesta(req, res, 205, null, 'Please enter params', 1);
    } else {
        var json = req.body.json;
        json = JSON.parse(json);

        var elemento = json.idElemento;
        var nombre = json.nombre
        var descripcion = json.descripcion;
        var cron = json.cron;
        var task = json.task;

        if (!elemento || !nombre || !descripcion || !cron || !task) {
            respuesta(req, res, 500, null, 'Please enter all params in the json to register', 1);
        }
        else {
            if (Cron.validate(cron)) {
                Elemento.findOne({where: {id_elemento: elemento}})
                    .then(function (entity) {
                        if (!entity) {
                            respuesta(req, res, 205, null, 'Elemento needs to exists!', 1);
                        }
                        else {
                            Crontask.findOne({where: {nombre: nombre}})
                                .then(function (crontask) {
                                    if (crontask) {
                                        respuesta(req, res, 205, null, 'Crontask`s name already exists!', 1);
                                    }
                                    else {
                                        Crontask
                                            .build({
                                                cron: cron,
                                                task: task,
                                                id_elemento: elemento,
                                                id_usuario: req.user.id_usuario,
                                                nombre: nombre,
                                                descripcion: descripcion,
                                                activo: true,
                                                borrado: false,
                                                fecha_alta: new Date()
                                            })
                                            .save()
                                            .then(function (entity) {
                                                manageCron(entity.id_crontask, '*/5 * * * * *', 'TAREA PROGRAMADA 1', 'start');
                                                respuesta(req, res, 200, entity, 'Crontask registered successfully', 0);
                                            }).catch(function (error) {
                                            respuesta(req, res, 418, null, 'Something was wrong' + error, 1);
                                        });

                                    }
                                });
                        }

                    });
            }
            else {
                respuesta(req, res, 401, null, 'Invalid cron pattern', 1);
            }
        }
    }
}

//localhost:3704/api/elemento/1
//return:
//json: {"code":200,"data":null,"message":"success"}
//requires JWT and param idPlaca
function getcrontask(req, res){
    if(req.user.rol != 1){
        respuesta(req, res, 401, null, 'User no has permissions', 1);
    }
    else {
        Crontask
            .findOne({
                where: {id_crontask: req.params.idCron}
            })
            .then(function (entity) {
                if (!entity) {
                    respuesta(req, res, 205, null, 'Crontask not found', 0);
                } else {
                    respuesta(req, res, 200, entity, 'success', 0);
                }
            });

    }
}

//localhost:3704/api/elementos
//return:
//json: [{"code":200,"data":null,"message":"success"}]
//requires JWT
function getcrontasks(req, res){
    if(req.user.rol != 1){
        respuesta(req, res, 401, null, 'User no has permissions', 1);
    }
    else {
        Crontask
            .findAll()
            .then(function (entity) {
                if (entity.length === 0) {
                    respuesta(req, res, 205, null, 'Crontask not found', 0);
                } else {
                    respuesta(req, res, 200, entity, 'success', 0);
                }
            });

    }
}

//localhost:3704/api/placa/1
//return:
//json: [{"code":200,"data":[1],"message":"success"}]
//requires JWT
function deletecrontask(req, res){
    if(req.user.rol != 1) {
        respuesta(req, res, 401, null, 'No permissions', 1);
    } else {
        var id = req.params.idCron;
        Crontask.update(
            {borrado: 1, activo: 0},
            {where: {id_crontask: id}}
        )
            .then(function (entity) {
                if (!entity) {
                    respuesta(req, res, 205, null, 'crontask not found', 1);
                } else {
                    manageCron(entity.id_crontask, entity.cron, entity.task, "destroy");
                    respuesta(req, res, 200, entity, 'crontask deleted successfully', 1);
                }
            }).catch(function (error) {
            respuesta(req, res, 418, error, 'Something was wrong', 1);
        });
    }
}

//localhost:3704/api/placa/1
//return:
//json: [{"code":200,"data":[1],"message":"success"}]
//requires JWT
function putcrontaskenabledisable(req, res){
    if(req.user.rol != 1) {
        respuesta(req, res, 401, null, 'No permissions', 1);
    } else {
        if((req.url).split('/')[1] == 'cronDisable'){
            var active = 0;
        }
        else {
            var active = 1;
        }

        var id = req.params.idCron;

        Crontask.findOne({where: {id_crontask: id}})
            .then(function(crontask){
                if(!crontask){
                    respuesta(req, res, 205, null, 'crontask not found', 1);
                }
                else{
                    Crontask.update(
                        {activo: active},
                        {where: {id_crontask: id}}
                    )
                        .then(function (entity) {

                            manageCron(crontask.id_crontask, crontask.cron, crontask.task, "destroy");
                            if(active){
                                manageCron(crontask.id_crontask, crontask.cron, crontask.task, "start");
                            }

                            respuesta(req, res, 200, entity, 'crontask updated successfully', 1);

                        }).catch(function (error) {
                        respuesta(req, res, 418, error, 'Something was wrong', 1);
                    });
                }
            }).catch(function (error) {
            respuesta(req, res, 418, error, 'Something was wrong', 1);
        });
    }
}

//localhost:3704/api/placa/1
//requires json{nombre:, activo}
//returns json{}
function putcrontask(req, res){
    if(!req.body['json']) {
        respuesta(req, res, 401, null, 'No data received', 1);
    } else {
        var json = req.body['json'];
        json = JSON.parse(json);

        var nombre = json.nombre;
        var descripcion = json.descripcion;
        var elemento = json.idElemento;
        var cron = json.cron;
        var task = json.task;

        if((req.url).split('/')[1] == 'cronDisable'){
            var active = 0;
        }
        else {
            var active = 1;
        }

        if (!nombre || !descripcion || !elemento || !cron || !task) {
            respuesta(req, res, 401, null, 'No params received', 1);
        } else {
            var id = req.params.idCron;
            //buscamos un mensaje con id
            Crontask.findOne({where: {id_crontask: id}})
                .then(function(crontask) {
                    if (!crontask) {
                        respuesta(req, res, 205, null, 'Crontask not found', 0);
                    }
                    else {
                        Crontask.findOne({where: {nombre: nombre}})
                            .then(function(entity) {
                                if (!entity) {
                                    respuesta(req, res, 205, null, 'Crontask alerady exists', 0);
                                }
                                else {
                                    var active = crontask.activo;
                                    Crontask.update(
                                        {cron: cron, task: task, nombre: nombre,
                                            descripcion: descripcion, id_elemento: elemento},
                                        {where: {id_crontask: id}}
                                    )
                                        .then(function (entity) {
                                            if (!entity) {
                                                respuesta(req, res, 205, null, 'Crontask not found', 1);
                                            } else {
                                                manageCron(crontask.id_crontask, cron, task, "destroy");
                                                if(active){
                                                    manageCron(crontask.id_crontask, cron, task, "start");
                                                }
                                                respuesta(req, res, 200, entity, 'crontask updated successfully', 0);
                                            }
                                        }).catch(function (error) {
                                        respuesta(req, res, 418, null, 'Something was wrong', 1);
                                    });
                                }
                            });
                    }
                });
        }
    }
}

module.exports = {
    postcrontask, getcrontask, getcrontasks, deletecrontask, putcrontask, putcrontaskenabledisable
}
