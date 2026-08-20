const express = require('express')
const authRoutes = require('./routes/authRoutes');
const resourceRoutes = require('./routes/resourceRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

const app = express();

app.use(express.json())

app.get('/health', (req, res) => res.json({status: 'ok'}));
app.use('/api/auth', authRoutes)
app.use('/api/resources', resourceRoutes);
app.use('/api/bookings', bookingRoutes);
//404 Handler
app.use((req, res) => res.status(404).json({error: 'Not Found' }))

//central error handler
app.use((err, req, res, next) =>{
    console.error(err);
    res.status(500).json({error: 'Internal Server Error'});
})



module.exports = app;