var Sequelize = require('sequelize');
var config = require('../../config/main');
var domohouse = config.domohouse;

var sequelize = new Sequelize(domohouse.database, domohouse.user, domohouse.pass, {
    host: domohouse.host,
    port: domohouse.port,
    dialect: domohouse.dialect,
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },
});

var models = require('sequelize-auto-import')(sequelize, './');

module.exports = models;
