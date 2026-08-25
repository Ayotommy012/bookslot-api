process.env.JWT_SECRET = 'test_secret';
process.env.NODE_ENV = 'test';

const sequelize = require('./testDb');
require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});