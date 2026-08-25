const {sequelize, Slot, Booking} = require('../models');

async function createBooking(req, res){
    const {slotId} = req.body;
    const userId = req.user.id;

    try{
        const booking = await sequelize.transaction(async (t) => {
            const slot = await Slot.findByPk(slotId, {
                transaction: t,
                lock: t.LOCK.UPDATE,
            });
            if (!slot) throw new Error('SLOT_NOT_FOUND');
            if (slot.status === 'cancelled') throw new Error('SLOT_CANCELLED');

            const currentCount = await Booking.count({
                where:{SlotId: slotId, status:'confirmed'},
                transaction: t,
            })

            if (currentCount >= slot.capacity) throw new Error('SLOT_FULL');

            const newBooking = await Booking.create(
            { UserId: userId, SlotId: slotId, status: 'confirmed' },
                { transaction: t }
            );
            if (currentCount + 1 >= slot.capacity) {
                slot.status = 'full'
                await slot.save({transaction: t})
            }
        return newBooking;
        });
        return res.status(201).json(booking);
            }  catch (err) {
        const knownErrors = {
            SLOT_NOT_FOUND: [404, 'slot not found'],
            SLOT_CANCELLED: [409, 'Slot has been cancelled'],
            SLOT_FULL: [409, 'Slot is fully booked'],
        };
        if (knownErrors[err.message]) {
            const [statusCode, message] = knownErrors[err.message];
            return res.status(statusCode).json({ error: message });
        }

        if (err.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ error: 'You already booked this slot' });
        }

        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function cancelBooking(req, res) {
    const {id} = req.params;
    const userId = req.user.id;
    
    const booking = await Booking.findOne({where: {id, UserId: userId}});
    if (!booking) return res.status(404).json({error: 'Booking not found'});

    booking.status = 'cancelled';
    await booking.save();

    const slot = await Slot.findByPk(booking.SlotId);
    if (slot && slot.status === 'full') {
        slot.status = 'open'
        await slot.save();
    }
    return res.json({message: 'Booking cancelled' });
}

async function myBookings(req, res) {
    const booking = await Booking.findAll({
        where: {UserId: req.user.id},
        include: [{model: Slot, include: ['Resource']}]
    });
    return res.json(booking);
}

module.exports = { createBooking, cancelBooking, myBookings };