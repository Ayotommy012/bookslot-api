const sequelize = require('../config/database');
const { DataTypes, Model } = require('sequelize');
const bcrypt = require('bcrypt');

class User extends Model {
    async validatePlainPassword(plainPassword) {
        return await bcrypt.compare(plainPassword, this.password_hash);
    }
}
User.init(
    {
        id: { 
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password_hash: {
            type: DataTypes.STRING,
            allowNull: false
        },
        role: {
            type: DataTypes.ENUM('user', 'admin'),
            defaultValue: 'user'
        },
    },
    {
        sequelize,
        modelName: 'User',
        tableName: 'users',
        hooks: {
            beforeCreate: async (user) => {
                if (user.password_hash) {
                    user.password_hash = await bcrypt.hash(user.password_hash, 10);
                }
            }
        }
    }
);
module.exports = User;