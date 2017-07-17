var bcrypt = require('bcrypt-nodejs');

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('usuarios', {
		id_usuario: {
			type: DataTypes.INTEGER(2).UNSIGNED,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
        nombre: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        apellido_1: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        apellido_2: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        login: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
		passwd: {
			type: DataTypes.STRING(64),
			allowNull: false
		},
        rol: {
            type: DataTypes.INTEGER(2),
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
		},
		fecha_caducidad: {
			type: DataTypes.DATE,
			allowNull: true
		}
	}, {
		tableName: 'usuarios',
		timestamps: false,
		freezeTableName: true,
        instanceMethods: {
            generateHash: function(password) {
                return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
            },
            validPassword: function(password) {
                return bcrypt.compareSync(password, this.password);
            }
        },
        hooks:{
		    beforeCreate: function(user, options){
		        user.passwd = user.generateHash(user.passwd);
            }
        }
	});
};
