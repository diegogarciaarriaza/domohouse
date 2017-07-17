var Error = require("../models/mongo/errores")
/*
 Error.find(function (err, errors) {
    if (err) return console.error(err);
    console.log(errors);
 })
*/

module.exports = function respuesta(req, res, code, data, message, error){
    var url = req.path.split('/')[1];
    var method = req.method;
    res.json({code: code, data: data, message: message});

    if(error){
        //Errores.build({code: code, message: method + ' ' + url + ' -> ' + message, fecha: new Date()}).save();
        var error = new Error({metodo: method, url: url, codigo: code, data: data, mensaje: message, date: new Date()});
        error.save(function (err, entity) {
            if (err) return console.error(err);
            console.log(entity)
        });
    }
};