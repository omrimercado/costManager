const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const Cost = require('../models/cost');

// Increase Jest timeout
jest.setTimeout(10000);

describe('GET /api/report', () => {
    beforeAll(async () => {
        await mongoose.connect(
            'mongodb+srv://omrimercado16:OMRIMER12@cluster0.tzlys.mongodb.net/final?retryWrites=true&w=majority&appName=Cluster0',
            { useNewUrlParser: true, useUnifiedTopology: true }
        );
    });

    afterEach(async () => {
        await mongoose.connection.db.collection('costs').deleteMany({});
    });

    afterAll(async () => {
        await mongoose.disconnect();
    });

    it('should return total cost for a specific user, year, and month', async () => {
        // Insert test data
        await Cost.create([
            { description: 'rent', category: 'housing', userid: '123456', sum: 1200, created_at: new Date('2024-01-15T10:00:00Z') },
            { description: 'groceries', category: 'food', userid: '123456', sum: 200, created_at: new Date('2024-02-01T10:00:00Z') }
        ]);

        // Send request to API
        const response = await request(app).get('/api/report?id=123456&year=2024&month=1');

        // Debug response
        console.log(response.body);

        // Validate response
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('user_id', '123456');
        expect(response.body).toHaveProperty('year', '2024');
        expect(response.body).toHaveProperty('month', '1');
        expect(response.body.total_cost).toBe(1200);
        expect(response.body.items).toHaveLength(1);
    });


    it('should return a valid response with an empty items array if no costs match the criteria', async () => {
        const response = await request(app).get('/api/report?id=1234567&year=2025&month=3');

        // Debug the response if necessary
        console.log(response.body);

        // Assertions
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('user_id', '1234567');
        expect(response.body).toHaveProperty('year', '2025');
        expect(response.body).toHaveProperty('month', '3');
        expect(response.body.total_cost).toBe(0); // Total cost should be 0
        expect(response.body.items).toEqual([]);  // Items should be an empty array
    });

    it('should return 400 if required query parameters are missing', async () => {
        const response = await request(app).get('/api/report');
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('error', 'Missing required query parameters: id, year, or month');
    });

    it('should return 400 for invalid year or month', async () => {
        const response = await request(app).get('/api/report?id=1234567&year=abcd&month=13');
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('error', 'Invalid year or month. Month should be between 1 and 12.');
    });

    it('should handle server errors gracefully', async () => {
        // Mock Cost.find to throw an error
        jest.spyOn(Cost, 'find').mockImplementation(() => {
            throw new Error('Database error');
        });

        const response = await request(app).get('/api/report?id=1234567&year=2025&month=1');

        // Assertions
        expect(response.statusCode).toBe(500);
        expect(response.body).toHaveProperty('error', 'An error occurred while generating the report');

        // Restore the original implementation
        Cost.find.mockRestore();
    });
});
