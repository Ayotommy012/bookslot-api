const sequelize  = require('../config/database');
const User = require('./user');
const Resource = require('./resource');
const Slot = require('./slot');
const Booking = require('./Booking');

Resource.hasMany(Slot, {onDelete: 'CASCADE'});
Slot.belongsTo(Resource);

Slot.hasMany(Booking, {onDelete: 'CASCADE'});
Booking.belongsTo(Slot);


User.hasMany(Booking, {onDelete: 'CASCADE'});
Booking.belongsTo(User);

module.exports = {sequelize, User, Resource, Slot, Booking};