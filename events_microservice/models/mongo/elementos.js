var config = require('../../config/main');

var mongoose = require('mongoose');
mongoose.connect('mongodb://' + config.domohouseElementosMongo.host + '/' + config.domohouseElementosMongo.database);

var db = mongoose.connection;

db.on('error', function(){
    console.log("Error de conectividad con " + 'mongodb://' + config.domohouseElementosMongo.host + '/' + config.domohouseElementosMongo.database)
});
db.once('open', function(){
    console.log("Conectado correctamente a " + 'mongodb://' + config.domohouseElementosMongo.host + '/' + config.domohouseElementosMongo.database);
});
//ubicacion: ubicacion, placa: placa, elemento: elemento, tipo: tipo, valor: valor, date: new Date()}
var elementSchema = mongoose.Schema({
    ubicacion: String,
    placa: String,
    elemento: String,
    tipo: String,
    valor: Number,
    date: Date
});

var Element = mongoose.model('Elementos', elementSchema);

module.exports = Element;