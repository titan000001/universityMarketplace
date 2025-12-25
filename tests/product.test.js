
// tests/product.test.js

process.env.JWT_SECRET = 'test_secret';

// Mock the database
jest.mock('../config/database');
const db = require('../config/database');

const request = require('supertest');
const app = require('../server');
const jwt = require('jsonwebtoken');

describe('Product Endpoints', () => {

    let token;

    beforeAll(() => {
        token = jwt.sign(
            { userId: 1, name: 'Test User', role: 'user' },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
    });

    beforeEach(() => {
        jest.resetAllMocks();
    });

    describe('GET /api/products', () => {
        it('should fetch all products', async () => {
            const mockProducts = [
                { id: 1, title: 'Book', price: 10, categories: 'Textbooks' },
                { id: 2, title: 'Laptop', price: 500, categories: 'Electronics' }
            ];

            db.query.mockResolvedValueOnce([mockProducts]);

            const res = await request(app).get('/api/products');

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveLength(2);
        });
    });

    describe('POST /api/products', () => {
        const newProduct = {
            title: 'New Book',
            description: 'A great book',
            price: 20,
            image_url: 'http://example.com/image.jpg',
            categories: [1, 2]
        };

        it('should create a product successfully', async () => {
            db.getConnection.mockResolvedValue({
                beginTransaction: jest.fn(),
                query: jest.fn()
                    .mockResolvedValueOnce([{ insertId: 10 }]) // Insert product
                    .mockResolvedValueOnce([]), // Insert categories
                commit: jest.fn(),
                release: jest.fn()
            });

            const res = await request(app)
                .post('/api/products')
                .set('Authorization', `Bearer ${token}`)
                .send(newProduct);

            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty('productId', 10);
        });
    });
});
