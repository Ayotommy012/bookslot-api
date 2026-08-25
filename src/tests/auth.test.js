const request = require('supertest');
const app = require('../app');

describe('Auth', () => {
    test('register a new user and return a token', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({email:'test@example.com', password:'password123'})
        
        expect(res.status).toBe(201);
        expect(res.body.token).toBeDefined();
        expect(res.body.user.email).toBe('test@example.com')
    })
    test('rejects login with wrong password', async()=> {
        await request(app)
            .post('/api/auth/register')
            .send({email:'wrongpass@example.com', password:'password123'});

        const res = await request(app)
            .post('/api/auth/login')
            .send({email:'wrongpass@example.com', password:'wrongone'})

        expect(res.status).toBe(401);
    })
})