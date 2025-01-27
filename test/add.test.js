const request = require('supertest');
const app = require('../app'); // Path to your Express app
const mongoose = require('mongoose');
jest.setTimeout(10000);
describe('POST /api/add', () => {
    // Connect to the test database
    beforeAll(async () => {
        await mongoose.connect('mongodb+srv://omrimercado16:OMRIMER12@cluster0.tzlys.mongodb.net/final?retryWrites=true&w=majority&appName=Cluster0', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    });

    // Clean up database after each test
    afterEach(async () => {
        await mongoose.connection.db.collection('costs').deleteMany({});
    });

    // Disconnect from the database after all tests
    afterAll(async () => {
        await mongoose.disconnect();
    });

    it('should create a new cost item and return 201', async () => {
        const response = await request(app)
            .post('/api/add')
            .send({
                description: 'groceries',
                category: 'food',
                userid: '123456',
                sum: 200,
            });

        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('_id');
        expect(response.body.description).toBe('groceries');
    });

    it('should return 400 if required fields are missing', async () => {
        const response = await request(app)
            .post('/api/add')
            .send({
                description: 'groceries',
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.error).toBe('Missing required fields: description, category, userid, or sum');
    });
});
