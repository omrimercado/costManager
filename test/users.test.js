const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/user');
const Cost = require('../models/cost');

// Increase Jest timeout
jest.setTimeout(10000);

describe('GET /api/users/:id', () => {
    beforeAll(async () => {
        await mongoose.connect(
            'mongodb+srv://omrimercado16:OMRIMER12@cluster0.tzlys.mongodb.net/final?retryWrites=true&w=majority&appName=Cluster0',
            { useNewUrlParser: true, useUnifiedTopology: true }
        );
    });

    afterEach(async () => {
        await mongoose.connection.db.collection('users').deleteMany({});
        await mongoose.connection.db.collection('costs').deleteMany({});
    });

    afterAll(async () => {
        await mongoose.disconnect();
    });

    it('should return user details with total costs', async () => {
        // Insert test user
        await User.create({
            id: '12345678',
            first_name: 'Omri',
            last_name: 'Mercado',
            birthday: '1995-01-01',
            marital_status: 'single',
        });

        // Insert associated costs
        await Cost.create([
            { description: 'groceries', category: 'food', userid: '12345678', sum: 200 },
            { description: 'rent', category: 'housing', userid: '12345678', sum: 1200 },
        ]);

        // Debug inserted data
        console.log('Users:', await User.find());
        console.log('Costs:', await Cost.find());

        // Send GET request
        const response = await request(app).get('/api/users/12345678');
        console.log(response.body);
        // Assertions
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('first_name', 'Omri');
        expect(response.body).toHaveProperty('last_name', 'Mercado');
        expect(response.body).toHaveProperty('id', '12345678');
        expect(response.body).toHaveProperty('total', 1400); // Total costs = 200 + 1200
    });

    it('should return 404 if user is not found', async () => {
        const response = await request(app).get('/api/users/999999');

        // Assertions
        expect(response.statusCode).toBe(404);
        expect(response.body).toHaveProperty('error', 'User not found');
    });
});
