'use strict'

var sequelize = require('sequelize');
var bcrypt = require('bcrypt-nodejs');
var models = require('../models/maria');
var http = require('http');
var Ubicacion = models.ubicacion;
var Placa = models.placa;
var Elemento = models.elemento;
var Errores = models.errores;
var config = require("../config/main");
var respuesta = require('../helpers/respuesta');

var Stomp = require('stompjs');

var headers = {
    login: 'usertest',
    passcode: 'test'
};

//Ubicacion.sync({force: true});
//Placa.sync({force: true});
//Tipo.sync({force: true});
//Elemento.sync({force: true});

//Errores.sync();


//localhost:3706/api/value/:idElemento
//json: {elemento}
function valueElement(req, res){

    console.log("entra en value...")
    var elem = req.params.idElemento;

    //Busca el elemento
    Elemento.findOne({where: {id_elemento: elem}})
        .then(function(el){
            console.log("entra en elemento...")
            //si existe el elemento
            if(el){
                //si está activo el elemento
                if(el.activo){
                    //busca la placa del elemento
                    Placa.findOne({where: {id_placa: el.id_placa}})
                        .then(function(pl){
                            console.log("entra en placa...")
                            //si existe la placa
                            if(pl){
                                //si está activa la placa
                                if(pl.activo){
                                    //busca la ubicacion de la placa del elemento
                                    Ubicacion.findOne({where: {id_ubicacion: pl.id_ubicacion}})
                                        .then(function(ub){
                                            console.log("entra en ubicacion...")
                                            //si existe la ubicacion
                                            if(ub){
                                                //Si está activa la ubicación
                                                if(ub.activo){
                                                    //Acción
                                                    // var express = require('express');
                                                    //  var http = require('http');
                                                    //  var ioS = require('socket.io');
                                                    //  var app = express();
                                                    //  var server = http.Server(app);
                                                    //  var io = ioS(server);


                                                    console.log("AQUI EMPIEZA EL TEMA SOCKET")
                                                    //Comunicacion con temperatura
                                                    // io.on('connection', function(socket) {
                                                    //  console.log("Start.........");
                                                    //  io.sockets.emit('Salon_1/TEMP', "CUALQUIERCOSA");
                                                    //  console.log("SERVER -> EMITE PETICION");
                                                    //  io.sockets.on('Salon_1/TEMP', function (req) {
                                                    //  console.log("SERVER -> RECIBE RESPUESTA");
                                                    //  console.log("SERVER -> " + req);
                                                    //  respuesta(req, res, 205, req, "elemento OK", 0);
                                                    //  });
                                                    //  });

                                                    var client1 = Stomp.overWS('http://localhost:15674/ws');
                                                    client1.connect(headers, function() {
                                                        console.log("CONECTADO...");

                                                        client1.subscribe("/queue/devolTemp", function(data){
                                                            console.log("Recibe respuesta Temperatura " + data.body);
                                                            console.log("ANTES DE RESPUESTA(REQ, RES, ...)");

                                                        });

                                                        client1.send("/queue/peticTemp", {priority: 9}, "");

                                                        respuesta(req, res, 200, "OK", "elemento OK", 0);
                                                    });


                                                }
                                                //si no está activa la ubicación
                                                else{
                                                    respuesta(req, res, 205, null, "ubicacion is inactive", 1);
                                                }
                                            }
                                            //si no existe la ubicación
                                            else{
                                                respuesta(req, res, 205, null, "ubicacion does not exists", 1);
                                            }
                                        })
                                }
                                //si no está activa la placa
                                else{
                                    respuesta(req, res, 205, null, "placa is inactive", 1);
                                }
                            }
                            //Si no existe la placa
                            else{
                                respuesta(req, res, 205, null, "placa does not exists", 1);
                            }
                        })
                }
                //si no está activo el elemento
                else{
                    respuesta(req, res, 205, null, "elemento is inactive", 1);
                }
            }
            //Si no existe el elemento
            else{
                respuesta(req, res, 205, null, "elemento does not exists", 1);
            }
        })

}

module.exports = {
    valueElement
}
