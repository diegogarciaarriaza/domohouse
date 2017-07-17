var ElementoM = require("../models/mongo/elementos")
/*
 Error.find(function (err, errors) {
    if (err) return console.error(err);
    console.log(errors);
 })
*/

module.exports = function respuesta(ubicacion, placa, elemento, tipo, valor){

    var elemen = new ElementoM({ubicacion: ubicacion, placa: placa, elemento: elemento,
        tipo: tipo, valor: valor, date: new Date()});

    elemen.save(function (err, entity) {
        if (err) return console.error(err);
        //console.log(entity)

        //consulta en mongo y mongoose para obtener el valor min/max de un elemento:
        //var minimo = db.elementos.find({elemento : "Sal_P1_Temp1"}).sort({"valor" : 1}).limit(1);
        /*ElementoM
            .findOne({elemento: "Sal_P1_Temp1"})
            .sort({valor: -1})
            .exec(function(err, res) {
                console.log("MAX: " + res.valor);
            });
        ElementoM
            .findOne({elemento: "Sal_P1_Temp1"})
            .sort({valor: 1})
            .exec(function(err, res) {
                console.log("MIN: " + res.valor);
            });*/
    });
}
