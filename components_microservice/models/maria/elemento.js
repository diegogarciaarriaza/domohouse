var bcrypt = require('bcrypt-nodejs');

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('elemento', {
		id_elemento: {
			type: DataTypes.INTEGER(4).UNSIGNED,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
        id_placa: {
            type: DataTypes.INTEGER(2).UNSIGNED,
            allowNull: false,
        },
        id_tipo: {
            type: DataTypes.INTEGER(2).UNSIGNED,
            allowNull: false
        },
        pin: {
            type: DataTypes.STRING(5),
            allowNull: false
        },
        nombre: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
		activo: {
			type: DataTypes.INTEGER(1),
			allowNull: false,
			defaultValue: '0'
		},
		fecha_alta: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
		}
	}, {
		tableName: 'elemento',
		timestamps: false,
		freezeTableName: true
	});
};
