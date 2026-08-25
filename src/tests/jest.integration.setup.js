process.env.JWT_SECRET = 'test_secret';
process.env.NODE_ENV = 'test';

const {sequelize} = require('../models')

beforeAll(async () => {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });
});

afterAll(async () => {
    await sequelize.close();
});