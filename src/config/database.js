require('dotenv').config();
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        Host: process.env.DB_HOST || 'localhost',
        dialect: 'postgres',
        Port: process.env.DB_PORT || 5432,
        logging: process.env.DB_logging === 'Development'? console.log : false,
});

module.exports = sequelize;