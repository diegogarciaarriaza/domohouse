var config = require('../../config/main');

var mongoose = require('mongoose');
mongoose.connect('mongodb://' + config.domohousemongo.host + '/' + config.domohousemongo.database);

var db = mongoose.connection;

db.on('error', function(){
    console.log("Error de conectividad con mongodb")
});
db.once('open', function(){
    console.log("Conectado correctamente a mongodb");
});

var errorSchema = mongoose.Schema({
    code: Number,
    message: String,
    date: Date
});

var Error = mongoose.model('Error', errorSchema);

module.exports = Error;