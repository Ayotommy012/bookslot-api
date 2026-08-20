const express = require('express');
const {
  createBooking,
  cancelBooking,
  myBookings,
} = require('../controllers/bookingController');
const {requireAuth} = require('../middleware/auth')

const router = express.Router();

router.use(requireAuth);

router.post('/', createBooking);

router.get('/me', myBookings);

router.patch('/:id/cancel', cancelBooking);

module.exports = router;