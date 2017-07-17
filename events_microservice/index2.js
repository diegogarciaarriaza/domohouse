'use strict'

var express = require('express');
var bodyParser = require('body-parser');
var passport = require('passport');
var helmet = require('helmet');
var cors = require('cors');

var http = require('http');
var ioS = require('socket.io');
var five = require("johnny-five");
var EtherPort = require("etherport");

var config = require('./config/main');
var routesUser = require('./routes/events.routes.js');

var app = express();
var server = http.Server(app);
var io = ioS(server);

var five = require("johnny-five");
var EtherPort = require("etherport");

var ErroresM = require('./models/mongo/errores');
var ElementosM = require('./models/mongo/elementos');
var elementosHelper = require('./helpers/elementos.helper');

//bodyParser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//declaration of view engine
app.set("view engine", "pug");

//habilitamos el uso de cors
app.use(cors());

// initialize passport for use
app.use(passport.initialize());

//añadimos algo de seguridad con helmet
app.use(helmet());
app.use(helmet.noCache());

//ruta base
app.use('/api', routesUser);

var board = new five.Board({
    id: "Salon_1", //opcional
    port: new EtherPort(3030)
});

var i = 0;

board.on("ready", function() {
    console.log("board ready");
    io.sockets.emit("BOARD", "Board " + board.id + " ready");

    //Sensor Iluminación BH1750
    var light = new five.Light({
        pin: "A5",
        freq: "5000",
        controller: "BH1750"
    });

    light.on("data", function () {
        console.log("ILUMINACIÓN ACTUAL: " + this.value + "lux. " + this.level + " %");
        io.sockets.emit('LUZ', this.value);
        elementosHelper("Salon", "Placa1", "Sal_P1_Ilum1", "Iluminacion", this.value);
    });

    //Sensor de gas MQ2
    //Usaremos la clase genérica 'sensor' de jonny-five
    var gas = new five.Sensor({
        pin: "A1",
        freq: 5000
    });
    gas.on("data", function(){
        console.log(this.scaleTo(0,100) + " %");
        io.sockets.emit('GAS', this.scaleTo(0,100));
    });

    //Relé activado por gas
    /*var rele = new five.Relay({
     type: "NC",
     pin: 10
     });*/
    /*var rele = new five.Relay(8);
     var gas = new five.Sensor({
     pin: "A0",
     freq: 100
     });
     gas.on("change", function() {
     //var value = this.scaleTo(0, 100);
     var value = this.value
     console.log(value);

     io.sockets.emit('LUZ', value);
     if(value > 30) {
     console.log("Encendemos relé");
     rele.on();
     } else{
     console.log("Apagamos relé");
     rele.off();
     }
     });
     this.repl.inject({
     relay: rele
     });*/

    //Sensor de movimiento
    /*var motion = new five.Motion(7);

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
     console.log("data");
     });*/

    //Sensor de temperatura LM35
    var temperature = new five.Thermometer({
        controller: "LM35",
        freq: "5000",
        pin: "A0"
    });

    temperature.on("data", function() {
        console.log("TEMPERATURA ACTUAL: " + this.C + "ºC");
        //console.log("fahrenheit: %d", this.F);
        //console.log("kelvin: %d", this.K);
        io.sockets.emit('TEMP', this.C);
        elementosHelper("Salon", "Placa1", "Sal_P1_Temp1", "Temperatura", this.C);
    });


    //Recepcion de solicitudes via WebSocket y devolución de información
    io.on('connection', function(socket) {
        socket.on('Salon_1/TEMP_req', function (req) {
            console.log("SERVER -> RECIBE PETICION_");
            //ACTUA
            console.log("celsius: " + temperature.F);
            //ENVIA CONFIRMACION
            io.sockets.emit('Salon_1/TEMP_res', JSON.stringify({"board":board.id, "type": "TEMP", "res": temperature.C}));
            console.log("SERVER -> EMITE RESPUESTA_ " + temperature.F);
        });
    });

});

console.log("Esperando a que inicialice el dispositivo.");

/* Las dependencias se podrían haber escrito así:
 var express = require('express');
 var app = express();
 var server = require('http').Server(app);
 var io = require('socket.io')(server);

app.use(express.static('client'));

 var pingpong = 1;
 io.on('connection', function(socket){
 console.log("El nodo con IP: " + socket.handshake.address + " se ha conectado");

 socket.emit('PING', pingpong); console.log("SERVER -> EMITE PING (" + pingpong + ")");

 socket.on('PONG', function(pingpong){ console.log("SERVER -> RECIBE PONG (" + pingpong + ")");
 //messages.push(data);
 setTimeout(function()
 {
 io.sockets.emit('PING', ++pingpong); console.log("SERVER -> EMITE PING (" + pingpong + ")");

 }, 1000)

 })
 })
 */

module.exports = app;

server.listen(3706, function(){
    console.log("el servidor está funcionando en http://localhost:3706");
});

