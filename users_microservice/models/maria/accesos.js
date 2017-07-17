var bcrypt = require('bcrypt-nodejs');

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('accesos', {
		id_acceso: {
			type: DataTypes.INTEGER(11).UNSIGNED,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
        id_usuario: {
            type: DataTypes.INTEGER(2).UNSIGNED,
            allowNull: false,
        },
		fecha_acceso: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
		}
	}, {
		tableName: 'accesos',
		timestamps: false,
		freezeTableName: true
	});
};
