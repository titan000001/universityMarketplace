
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
        // Generate a valid token for protected routes
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
            expect(res.body[0]).toHaveProperty('title', 'Book');
            expect(db.query).toHaveBeenCalledTimes(1);
        });

        it('should filter products by search query', async () => {
            db.query.mockResolvedValueOnce([[]]); // Mock empty result for simplicity

            const res = await request(app).get('/api/products?search=Book');

            expect(res.statusCode).toEqual(200);
            // Check that the query contained the LIKE clause
            const queryCall = db.query.mock.calls[0];
            expect(queryCall[0]).toContain('p.title LIKE ?');
            expect(queryCall[1]).toContain('%Book%');
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
            // Mock transaction start
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

        it('should fail if unauthenticated', async () => {
            const res = await request(app)
                .post('/api/products')
                .send(newProduct);

            expect(res.statusCode).toEqual(401); // Or 403 depending on middleware
        });
    });

    describe('GET /api/products/:id', () => {
        it('should return product details', async () => {
            const mockProduct = {
                id: 1,
                title: 'Book',
                description: 'Desc',
                price: 10,
                sellerId: 1,
                sellerName: 'User',
                categories: 'Textbooks'
            };

            db.query.mockResolvedValueOnce([[mockProduct]]);

            const res = await request(app).get('/api/products/1');

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('id', 1);
        });

        it('should return 404 if product not found', async () => {
            db.query.mockResolvedValueOnce([[]]);

            const res = await request(app).get('/api/products/999');

            expect(res.statusCode).toEqual(404);
        });
    });
});
