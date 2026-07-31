require('dotenv').config();
const app = require('./app')
const sequelize = require('./config/database')

const PORT = process.env.PORT || 3000

async function start() {
    try {
        await sequelize.authenticate()
        console.log('Database connection established')

        if(process.env.NODE_ENV == 'development'){
            await sequelize.sync();
        }
       app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
    } catch (error) {
        console.error('Unable to start server:', error);
        process.exit(1);
    }
}

start();