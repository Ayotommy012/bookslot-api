const {DataTypes, Model} = require('sequelize');
const sequelize = require('../config/database');

class Booking extends Model{}

Booking.init(
    {
        id:{
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        status: {
            type: DataTypes.ENUM('confirmed', 'cancelled'),
            defaultValue: 'confirmed',
        },
    },
    {
        sequelize,
        modelName: 'Booking',
        tableName: 'bookings',
        indexes: [
            {
                unique: true,
                fields: ['UserId', 'SlotId'],
                name: 'unique_user_slot_booking',
            },
        ]
    }
);
module.exports = Booking;