'use strict'

var sequelize = require('sequelize');
var bcrypt = require('bcrypt-nodejs');
var models = require('../models/maria');
var http = require('http');
var Ubicacion = models.ubicacion;
var Placa = models.placa;
var Elemento = models.elemento;
var Tipo = models.tipo;
var Errores = models.errores;
var config = require("../config/main");
var respuesta = require('../helpers/respuesta');


//Ubicacion.sync({force: true});
//Placa.sync({force: true});
//Tipo.sync({force: true});
//Elemento.sync({force: true});

//Errores.sync();

//localhost:3704/api/ubicacion
//json: {"nombre": "cuarto0"}
function postubicacion(req, res){
    if(!req.body['json']){
        res.body.json({code: 205, message: 'Please enter an name'});
    } else {
        var json = req.body.json;
        json = JSON.parse(json);

        var nombre = json.nombre;

        if (!nombre) {
            res.json({code: 500, message: 'Please enter a json with a name to register'});
        }
        else {
            Ubicacion.findOne({where: {nombre: nombre}})
                .then(function (entity) {
                    if (entity) {
                        res.json({code: 205, message: 'Ubicación exists already!'});
                    } else {
                        Ubicacion
                            .build({nombre: nombre, activo: true, fecha_alta: new Date()})
                            .save()
                            .then(function (entity) {
                                res.json({code: 200, message: 'Ubicacion Registered Successfully'});
                            }).catch(function (error) {
                            res.json({code: 418, message: 'Something was wrong'});
                        });

                    }
                });
        }
    }
}

//localhost:3704/api/ubicacion/1
//return:
//json: {"code":200,"data":null,"message":"success"}
//requires JWT and param idUbicacion
function getubicacion(req, res){
    if(req.user.rol != 1){
        respuesta(req, res, 401, null, 'User no has permissions', 1);
    }
    else {
        Ubicacion
            .findOne({
                where: {id_ubicacion: req.params.idUbicacion}
            })
            .then(function (entity) {
                if (!entity) {
                    respuesta(req, res, 205, null, 'Not ubicacion found', 0);
                } else {
                    respuesta(req, res, 200, entity, 'success', 0);
                }
            });

    }
}

//localhost:3704/api/ubicaciones
//return:
//json: [{"code":200,"data":null,"message":"success"}]
//requires JWT
function getubicaciones(req, res){
    if(req.user.rol != 1){
        respuesta(req, res, 401, null, 'User no has permissions', 1);
    }
    else {
        Ubicacion
            .findAll()
            .then(function (entity) {
                if (entity.length === 0) {
                    respuesta(req, res, 205, null, 'Not ubicaciones found', 0);
                } else {
                    respuesta(req, res, 200, entity, 'success', 0);
                }
            });

    }
}

//localhost:3704/api/ubicacion/1
//return:
//json: [{"code":200,"data":[1],"message":"success"}]
//requires JWT and param idUbicacion
function deleteubicacion(req, res){
    if(req.user.rol != 1) {
        respuesta(req, res, 401, null, 'No permissions', 1);
    } else {
        var id = req.params.idUbicacion;
        Ubicacion.update(
            {activo: 0},
            {where: {id_ubicacion: id}}
        )
            .then(function (entity) {
                if (!entity) {
                    respuesta(req, res, 205, null, 'ubicacion does not found', 1);
                } else {
                    respuesta(req, res, 200, entity, 'ubicacion deleted successfully', 1);
                }
            }).catch(function (error) {
            respuesta(req, res, 418, error, 'Something was wrong', 1);
        });
    }
}

//localhost:3704/api/ubicacion/1
//return json{nombre:, activo}
//requieres JWT and idUbicacion
function putubicacion(req, res){
    if(!req.body['json']) {
        respuesta(req, res, 401, null, 'No data received', 1);
    } else {
        var json = req.body['json'];
        json = JSON.parse(json);

        var nombre = json.nombre;
        var activo = json.activo;

        if (!nombre || !activo) {
            respuesta(req, res, 401, null, 'No params received', 1);
        } else {
            var id = req.params.idUbicacion;
            //buscamos un mensaje con id
            Ubicacion.findOne({where: {id_ubicacion: id}})
                .then(function(entity) {
                    if (!entity) {
                        respuesta(req, res, 205, null, 'Not ubicacion found', 0);
                    }
                    else {
                        Ubicacion.update(
                            {nombre: nombre, activo: activo},
                            {where: {id_ubicacion: id}}
                        )
                            .then(function (entity) {
                                if (!entity) {
                                    respuesta(req, res, 205, null, 'Not ubicacion found', 1);
                                } else {
                                    respuesta(req, res, 200, entity, 'ubicacion updated successfully', 0);
                                }
                            }).catch(function (error) {
                            respuesta(req, res, 418, null, 'Something was wrong', 1);
                        });

                    }
                });
        }
    }
}



//localhost:3704/api/placa
//return json: {"nombre": "cuarto0"}
//requires JWT and idUbicaion
function postplaca(req, res){
    if(!req.body['json']){
        res.body.json({code: 205, message: 'Please enter params'});
    } else {
        var json = req.body.json;
        json = JSON.parse(json);

        var ubicacion = json.ubicacion
        var nombre = json.nombre;

        if (!nombre || !ubicacion) {
            res.json({code: 500, message: 'Please enter all params in the json to register'});
        }
        else {
            Ubicacion.findOne({where: {id_ubicacion: ubicacion}})
                .then(function (parent_entity) {
                    if (!parent_entity) {
                        res.json({code: 205, message: 'Ubicación needs to exists!'});
                    }
                    else {


                        Placa.findOne({where: {nombre: nombre}})
                            .then(function (entity) {
                                if (entity) {
                                    res.json({code: 205, message: 'Ubicación exists already!'});
                                } else {
                                    Placa
                                        .build({
                                            id_ubicacion: ubicacion,
                                            nombre: nombre,
                                            activo: true,
                                            fecha_alta: new Date()
                                        })
                                        .save()
                                        .then(function (entity) {
                                            res.json({code: 200, message: 'Placa Registered Successfully'});
                                        }).catch(function (error) {
                                        res.json({code: 418, message: 'Something was wrong'});
                                    });

                                }
                            });
                    }
                });
        }
    }
}

//localhost:3704/api/placa/1
//return:
//json: {"code":200,"data":null,"message":"success"}
//requires JWT and param idPlaca
function getplaca(req, res){
    if(req.user.rol != 1){
        respuesta(req, res, 401, null, 'User no has permissions', 1);
    }
    else {
        Placa
            .findOne({
                where: {id_placa: req.params.idPlaca}
            })
            .then(function (entity) {
                if (!entity) {
                    respuesta(req, res, 205, null, 'Not placa found', 0);
                } else {
                    respuesta(req, res, 200, entity, 'success', 0);
                }
            });

    }
}

//localhost:3704/api/placas
//return:
//json: [{"code":200,"data":null,"message":"success"}]
//requires JWT
function getplacas(req, res){
    if(req.user.rol != 1){
        respuesta(req, res, 401, null, 'User no has permissions', 1);
    }
    else {
        Placa
            .findAll()
            .then(function (entity) {
                if (entity.length === 0) {
                    respuesta(req, res, 205, null, 'Not placas found', 0);
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
function deleteplaca(req, res){
    if(req.user.rol != 1) {
        respuesta(req, res, 401, null, 'No permissions', 1);
    } else {
        var id = req.params.idPlaca;
        Placa.update(
            {activo: 0},
            {where: {id_placa: id}}
        )
            .then(function (entity) {
                if (!entity) {
                    respuesta(req, res, 205, null, 'placa does not found', 1);
                } else {
                    respuesta(req, res, 200, entity, 'placa deleted successfully', 1);
                }
            }).catch(function (error) {
            respuesta(req, res, 418, error, 'Something was wrong', 1);
        });
    }
}

//localhost:3704/api/placa/1
//requires json{nombre:, activo}
//returns json{}
function putplaca(req, res){
    if(!req.body['json']) {
        respuesta(req, res, 401, null, 'No data received', 1);
    } else {
        var json = req.body['json'];
        json = JSON.parse(json);

        var nombre = json.nombre;
        var activo = json.activo;

        if (!nombre || !activo) {
            respuesta(req, res, 401, null, 'No params received', 1);
        } else {
            var id = req.params.idPlaca;
            //buscamos un mensaje con id
            Placa.findOne({where: {id_placa: id}})
                .then(function(entity) {
                    if (!entity) {
                        respuesta(req, res, 205, null, 'Not ubicacion found', 0);
                    }
                    else {
                        Placa.update(
                            {nombre: nombre, activo: activo},
                            {where: {id_placa: id}}
                        )
                            .then(function (entity) {
                                if (!entity) {
                                    respuesta(req, res, 205, null, 'Not placa found', 1);
                                } else {
                                    respuesta(req, res, 200, entity, 'placa updated successfully', 0);
                                }
                            }).catch(function (error) {
                            respuesta(req, res, 418, null, 'Something was wrong', 1);
                        });

                    }
                });
        }
    }
}



//localhost:3704/api/tipo
//json: {"nombre": "cuarto0"}
function posttipo(req, res){
    if(!req.body['json']){
        res.body.json({code: 205, message: 'Please enter an name'});
    } else {
        var json = req.body.json;
        json = JSON.parse(json);

        var nombre = json.nombre;

        if (!nombre) {
            res.json({code: 500, message: 'Please enter a json with a name to register'});
        }
        else {
            Tipo.findOne({where: {nombre: nombre}})
                .then(function (entity) {
                    if (entity) {
                        res.json({code: 205, message: 'Tipo exists already!'});
                    } else {
                        Tipo
                            .build({nombre: nombre, activo: true, fecha_alta: new Date()})
                            .save()
                            .then(function (entity) {
                                res.json({code: 200, message: 'Tipo Registered Successfully'});
                            }).catch(function (error) {
                            res.json({code: 418, message: 'Something was wrong'});
                        });

                    }
                });
        }
    }
}

//localhost:3704/api/tipo/1
//return:
//json: {"code":200,"data":null,"message":"success"}
//requires JWT and param idUbicacion
function gettipo(req, res){
    if(req.user.rol != 1){
        respuesta(req, res, 401, null, 'User no has permissions', 1);
    }
    else {
        Tipo
            .findOne({
                where: {id_tipo: req.params.idTipo}
            })
            .then(function (entity) {
                if (!entity) {
                    respuesta(req, res, 205, null, 'Not tipo found', 0);
                } else {
                    respuesta(req, res, 200, entity, 'success', 0);
                }
            });

    }
}

//localhost:3704/api/tipos
//return:
//json: [{"code":200,"data":null,"message":"success"}]
//requires JWT
function gettipos(req, res){
    if(req.user.rol != 1){
        respuesta(req, res, 401, null, 'User no has permissions', 1);
    }
    else {
        Tipo
            .findAll()
            .then(function (entity) {
                if (entity.length === 0) {
                    respuesta(req, res, 205, null, 'Not tipos found', 0);
                } else {
                    respuesta(req, res, 200, entity, 'success', 0);
                }
            });

    }
}

//localhost:3704/api/tipo/1
//return:
//json: [{"code":200,"data":[1],"message":"success"}]
//requires JWT and param idUbicacion
function deletetipo(req, res){
    if(req.user.rol != 1) {
        respuesta(req, res, 401, null, 'No permissions', 1);
    } else {
        var id = req.params.idTipo;
        Tipo.update(
            {activo: 0},
            {where: {id_tipo: id}}
        )
            .then(function (entity) {
                if (!entity) {
                    respuesta(req, res, 205, null, 'tipo does not found', 1);
                } else {
                    respuesta(req, res, 200, entity, 'tipo deleted successfully', 1);
                }
            }).catch(function (error) {
            respuesta(req, res, 418, error, 'Something was wrong', 1);
        });
    }
}

//localhost:3704/api/tipo/1
//return json{nombre:, activo}
//requieres JWT and idUbicacion
function puttipo(req, res){
    if(!req.body['json']) {
        respuesta(req, res, 401, null, 'No data received', 1);
    } else {
        var json = req.body['json'];
        json = JSON.parse(json);

        var nombre = json.nombre;
        var activo = json.activo;

        if (!nombre || !activo) {
            respuesta(req, res, 401, null, 'No params received', 1);
        } else {
            var id = req.params.idTipo;
            //buscamos un mensaje con id
            Tipo.findOne({where: {id_tipo: id}})
                .then(function(entity) {
                    if (!entity) {
                        respuesta(req, res, 205, null, 'Not ubicacion found', 0);
                    }
                    else {
                        Tipo.update(
                            {nombre: nombre, activo: activo},
                            {where: {id_tipo: id}}
                        )
                            .then(function (entity) {
                                if (!entity) {
                                    respuesta(req, res, 205, null, 'Not tipo found', 1);
                                } else {
                                    respuesta(req, res, 200, entity, 'tipo updated successfully', 0);
                                }
                            }).catch(function (error) {
                            respuesta(req, res, 418, null, 'Something was wrong', 1);
                        });

                    }
                });
        }
    }
}



//localhost:3704/api/elemento
//return json: {"nombre": "cuarto0"}
//requires JWT and idElemento
function postelemento(req, res){
    if(!req.body['json']){
        res.body.json({code: 205, message: 'Please enter params'});
    } else {
        var json = req.body.json;
        json = JSON.parse(json);

        var placa = json.placa;
        var tipo = json.tipo;
        var nombre = json.nombre;
        var pin = json .pin;

        if (!nombre || !placa || !tipo || !pin) {
            res.json({code: 500, message: 'Please enter all params in the json to register'});
        }
        else {
            Placa.findOne({where: {id_placa: placa}})
                .then(function (parent_entity) {
                    if (!parent_entity) {
                        res.json({code: 205, message: 'Placa needs to exists!'});
                    }
                    else {
                        Tipo.findOne({where: {id_tipo: tipo}})
                            .then(function (parent_entity) {
                                if (!parent_entity) {
                                    res.json({code: 205, message: 'Tipo needs to exists!'});
                                }
                                else {
                                    Elemento
                                        .findOne({
                                            where: sequelize.or(
                                                {nombre: nombre},
                                                {pin: pin}
                                            )
                                        })
                                        .then(function (entity) {
                                            if (entity) {
                                                res.json({code: 205, message: 'Elemento exists already!'});
                                            } else {
                                                Elemento
                                                    .build({
                                                        id_placa: placa,
                                                        id_tipo: tipo,
                                                        nombre: nombre,
                                                        activo: true,
                                                        pin: pin,
                                                        fecha_alta: new Date()
                                                    })
                                                    .save()
                                                    .then(function (entity) {
                                                        res.json({code: 200, message: 'Elemento Registered Successfully'});
                                                    }).catch(function (error) {
                                                    res.json({code: 418, message: 'Something was wrong'});
                                                });

                                            }
                                        });
                                }
                            });
                    }
                });
        }
    }
}

//localhost:3704/api/elemento/1
//return:
//json: {"code":200,"data":null,"message":"success"}
//requires JWT and param idPlaca
function getelemento(req, res){
    if(req.user.rol != 1){
        respuesta(req, res, 401, null, 'User no has permissions', 1);
    }
    else {
        Elemento
            .findOne({
                where: {id_elemento: req.params.idElemento}
            })
            .then(function (entity) {
                if (!entity) {
                    respuesta(req, res, 205, null, 'Not elemento found', 0);
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
function getelementos(req, res){
    if(req.user.rol != 1){
        respuesta(req, res, 401, null, 'User no has permissions', 1);
    }
    else {
        Elemento
            .findAll()
            .then(function (entity) {
                if (entity.length === 0) {
                    respuesta(req, res, 205, null, 'Not elementos found', 0);
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
function deleteelemento(req, res){
    if(req.user.rol != 1) {
        respuesta(req, res, 401, null, 'No permissions', 1);
    } else {
        var id = req.params.idElemento;
        Elemento.update(
            {activo: 0},
            {where: {id_elemento: id}}
        )
            .then(function (entity) {
                if (!entity) {
                    respuesta(req, res, 205, null, 'elemento does not found', 1);
                } else {
                    respuesta(req, res, 200, entity, 'elemento deleted successfully', 1);
                }
            }).catch(function (error) {
            respuesta(req, res, 418, error, 'Something was wrong', 1);
        });
    }
}

//localhost:3704/api/placa/1
//requires json{nombre:, activo}
//returns json{}
function putelemento(req, res){
    if(!req.body['json']) {
        respuesta(req, res, 401, null, 'No data received', 1);
    } else {
        var json = req.body['json'];
        json = JSON.parse(json);

        var nombre = json.nombre;
        var activo = json.activo;

        if (!nombre || !activo || !pin) {
            respuesta(req, res, 401, null, 'No params received', 1);
        } else {
            var id = req.params.idElemento;
            //buscamos un mensaje con id
            Elemento.findOne({where: {id_placa: id}})
                .then(function(entity) {
                    if (!entity) {
                        respuesta(req, res, 205, null, 'Not elemento found', 0);
                    }
                    else {
                        Elemento.update(
                            {nombre: nombre, activo: activo, pin: pin},
                            {where: {id_elemento: id}}
                        )
                            .then(function (entity) {
                                if (!entity) {
                                    respuesta(req, res, 205, null, 'Not elemento found', 1);
                                } else {
                                    respuesta(req, res, 200, entity, 'elemento updated successfully', 0);
                                }
                            }).catch(function (error) {
                            respuesta(req, res, 418, null, 'Something was wrong', 1);
                        });

                    }
                });
        }
    }
}

module.exports = {
    postubicacion, getubicacion, getubicaciones, deleteubicacion, putubicacion,
    postplaca, getplaca, getplacas, deleteplaca, putplaca,
    posttipo, gettipo, gettipos, deletetipo, puttipo,
    postelemento, getelemento, getelementos, deleteelemento, putelemento
}
