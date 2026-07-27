const{DataTypes,Model}=require('sequelize')
const sequelize=require('../config/database')

class Slot extends Model{}

Slot.init(
  {
     id:{
        type:DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey:true
      },
      start_time:{
        type:DataTypes.DATE,
        allowNull:false
      },
      end_time:{
        type:DataTypes.DATE,
        allowNull:false
      },
      capacity:{
        type:DataTypes.INTEGER,
        allowNull:false,
        defaultValue:1,
        validate:{
            min:1
        },
      },
        status:{
          type:DataTypes.ENUM('open', 'full', 'cancelled'),
          defaultValue:'open',
        },
    },

  {
    sequelize,
    modelName:'Slot',
    tableName:'slots',
    validate:{
        endAfterStart(){
            if(this.end_time <= this.start_time){
                throw new Error('end_time must be after start_time')
            }
        }
    }
}
 
);
module.exports = Slot;
    
