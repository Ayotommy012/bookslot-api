const {DataTypes,Model} = require('sequelize');
const sequelize = require('../config/database');

class Resource extends Model{}

Resource.init(
    {
        id:{
            type: DataTypes.UUID,
            defaultValue:DataTypes.UUIDV4,
            primaryKey:true,
        },
        name:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        description:{
            type:DataTypes.TEXT,
        },
        category:{
            type:DataTypes.STRING,
        }
    },
    {
    sequelize,
    modelName:'Resource',
    tableName:'resources'
    }
);
module.exports = Resource;