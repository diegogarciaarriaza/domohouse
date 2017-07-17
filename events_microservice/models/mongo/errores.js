var config = require('../../config/main');

var mongoose = require('mongoose');
mongoose.connect('mongodb://' + config.domohouseErroresMongo.host + '/' + config.domohouseErroresMongo.database);

var db = mongoose.connection;

var db = mongoose.connection;

db.on('error', function(){
    console.log("Error de conectividad con " + 'mongodb://' + config.domohouseElementosMongo.host + '/' + config.domohouseElementosMongo.database)
});
db.once('open', function(){
    console.log("vdddf correctamente a " + 'mongodb://' + config.domohouseElementosMongo.host + '/' + config.domohouseElementosMongo.database);
});

var errorSchema = mongoose.Schema({
    code: Number,
    message: String,
    date: Date
});

var Error = mongoose.model('Error', errorSchema);

module.exports = Error;