const express = require('express')
const authRoutes = require('./routes/authRoutes');
const { OK } = require('sqlite3');

const app = express();

app.use(express.json())

app.get('/health', (req, res) => res.json({status: 'ok'}));
app.use('/api/auth', authRoutes)

//404 Handler
app.use((req, res) => res.status(404).json({error: 'Not Found' }))

//central error handler
app.use((err, req, res, next) =>{
    console.error(err);
    res.status(500).json({error: 'Internal Server Error'});
})

module.exports = app;