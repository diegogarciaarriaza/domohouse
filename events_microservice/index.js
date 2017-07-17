var express = require('express');
var bodyParser = require('body-parser');
var passport = require('passport');
var helmet = require('helmet');
var cors = require('cors');

var http = require('http');
var five = require("johnny-five");
var EtherPort = require("etherport");

var config = require('./config/main');

var app = express();
var server = http.Server(app);

var five = require("johnny-five");
var EtherPort = require("etherport");

var rabbitmq = require("./helpers/rabbitmq")

var ErroresM = require('./models/mongo/errores');
var ElementosM = require('./models/mongo/elementos');
var elementosHelper = require('./helpers/elementos.helper');

var client = rabbitmq.client;
var headers = rabbitmq.headers;

var board = new five.Board({
    id: "Salon_1", //opcional
    port: new EtherPort(3030)
});
var i = 0;

client.connect(headers, function() {

    //Sensor de temperatura LM35
    var temperature;

    board.on("ready", function() {
        console.log("board ready");
        //io.sockets.emit("BOARD", "Board " + board.id + " ready");

        //Sensor Iluminación BH1750
        var light = new five.Light({
            pin: "A5",
            freq: "5000",
            controller: "BH1750"
        });

        light.on("data", function () {
            console.log("ILUMINACIÓN ACTUAL: " + this.value + "lux. " + this.level + " %");
            //io.sockets.emit('LUZ', this.value);
            //elementosHelper("Salon", "Placa1", "Sal_P1_Ilum1", "Iluminacion", this.value);
        });

        //Sensor de movimiento
        var motion = new five.Motion(7);

        motion.on("calibrated", function(){
            console.log("Calibrated");
        })

        motion.on("motionstart", function() {
            console.log("Motion Start");
        });

        motion.on("motionend", function() {
            console.log("Motion End");
        });

        motion.on("change", function() {
            console.log("DETECTION!");
        });

        //Sensor de temperatura LM35
        temperature = new five.Thermometer({
            controller: "LM35",
            freq: "5000",
            pin: "A0"
        });

        temperature.on("data", function() {
            console.log("TEMPERATURA ACTUAL: " + this.C + "ºC");
            //console.log("fahrenheit: %d", this.F);
            //console.log("kelvin: %d", this.K);
            //io.sockets.emit('TEMP', this.C);
            //elementosHelper("Salon", "Placa1", "Sal_P1_Temp1", "Temperatura", this.C);
        });


        //Recepcion de solicitudes via WebSocket y devolución de información

    });

    console.log("CONTECTADO...");

    client.subscribe("/queue/peticTemp", function(){

        console.log("RECIBE Solicitud Temperatura");
        client.send("/queue/devolTemp", {priority: 9}, temperature.C);
    });
});



console.log("Esperando a que inicialice el dispositivo.");

module.exports = app;

server.listen(3706, function(){
    console.log("el servidor está funcionando en http://localhost:3706");
});
