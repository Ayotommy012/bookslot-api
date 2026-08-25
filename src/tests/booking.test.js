const request = require('supertest');
const app = require('../app');
const { User, Resource, Slot, Booking } = require('../models');

describe('Booking capacity logic', () => {
  let resource;

  beforeEach(async () => {
    await Booking.destroy({ where: {}, force: true });
    await Slot.destroy({ where: {}, force: true });
    await Resource.destroy({ where: {}, force: true });
    await User.destroy({ where: {}, force: true });
    resource = await Resource.create({ name: 'Room A', category: 'room' });
  });

  async function registerUser(email) {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email, password: 'password123' });
    return res.body.token;
  }

  test('rejects booking a slot at capacity', async () => {
    const slot = await Slot.create({
      start_time: new Date(Date.now() + 3600000),
      end_time: new Date(Date.now() + 7200000),
      capacity: 1,
      ResourceId: resource.id,
    });

    const tokenA = await registerUser('a@test.com');
    const tokenB = await registerUser('b@test.com');

    const first = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ slotId: slot.id });
    expect(first.status).toBe(201);

    const second = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${tokenB}`)
      .send({ slotId: slot.id });
    expect(second.status).toBe(409);
  });
  test('rejects double booking of the same slot by the same user', async () => {
    const slot = await Slot.create({
        start_time: new Date(Date.now() + 3600000),
        end_time: new Date(Date.now() + 7200000),
        capacity: 5,
        ResourceId: resource.id,
    });
    const token = await registerUser('c@test.com');

    const first = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${token}`)
        .send({ slotId: slot.id });
    expect(first.status).toBe(201);

    const second = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${token}`)
        .send({ slotId: slot.id });
    expect(second.status).toBe(409);
  });

  test('two concurrent requests for last spot only one succeeds', async () => {
    const slot = await Slot.create({
      start_time: new Date(Date.now() + 3600000),
      end_time: new Date(Date.now() + 7200000),
      capacity: 1,
      ResourceId: resource.id,
    });
    const tokenA = await registerUser('race-a@test.com');
    const tokenB = await registerUser('race-b@test.com');

    const [resA, resB] = await Promise.all([
      request(app).post('/api/bookings').set('Authorization', `Bearer ${tokenA}`).send({ slotId: slot.id }),
      request(app).post('/api/bookings').set('Authorization', `Bearer ${tokenB}`).send({ slotId: slot.id }),
    ]);

    const statuses = [resA.status, resB.status];
    expect(statuses).toEqual([201, 409]);
  
  const confirmedCount = await Booking.count({ where: { SlotId: slot.id, status: 'confirmed' } });
  expect(confirmedCount).toBe(1);
  })
})