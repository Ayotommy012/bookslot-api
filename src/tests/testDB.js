const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('sqlite::memory:', {
  logging: false,
  pool: { max: 1, min: 0, idle: Infinity },
});

module.exports = sequelize;