var bcrypt = require('bcrypt-nodejs');

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('tipo', {
		id_tipo: {
			type: DataTypes.INTEGER(2).UNSIGNED,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
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
		tableName: 'tipo',
		timestamps: false,
		freezeTableName: true
	});
};
