var bcrypt = require('bcrypt-nodejs');

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('crontask', {
        id_crontask: {
            type: DataTypes.INTEGER(5).UNSIGNED,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        cron: {
            type: DataTypes.STRING(256),
            allowNull: false
        },
        task: {
            type: DataTypes.STRING(256),
            allowNull: false
        },
        id_elemento: {
            type: DataTypes.INTEGER(4).UNSIGNED,
            allowNull: false,
        },
        id_usuario: {
            type: DataTypes.INTEGER(2).UNSIGNED,
            allowNull: false,
        },
        nombre: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        descripcion: {
            type: DataTypes.STRING(1000),
            allowNull: false
        },
        borrado: {
            type: DataTypes.INTEGER(1),
            allowNull: false,
            defaultValue: '0'
        },
        activo: {
            type: DataTypes.INTEGER(1),
            allowNull: false,
            defaultValue: '1'
        },
        fecha_alta: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
        }
    }, {
        tableName: 'crontask',
        timestamps: false,
        freezeTableName: true
    });
};
