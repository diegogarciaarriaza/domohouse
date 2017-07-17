/*var Error = require("../models/mongo/errores")

Error.find(function (err, errors) {
    if (err) return console.error(err);
    console.log(errors);
})
*/

module.exports = function respuesta(req, res, code, data, message, error){
    var url = req.path.split('/')[1];
    var method = req.method;
    res.json({code: code, data: data, message: message});
    console.log(method + ' ' + url + ' ->  code: ' + code + ', data: ' + data + ', message: ' + message);
    if(error){
        //Errores.build({code: code, message: method + ' ' + url + ' -> ' + message, fecha: new Date()}).save();
        var errorX = new Error({code: 200, message: "Prueba de error en mongoose", date: new Date()});
        errorX.save(function (err, entity) {
            if (err) return console.error(err);
            console.log(entity)
        });
    }
};