
// tests/cart.test.js

process.env.JWT_SECRET = 'test_secret';

// Mock the database
jest.mock('../config/database');
const db = require('../config/database');

const request = require('supertest');
const app = require('../server');
const jwt = require('jsonwebtoken');

describe('Cart Endpoints', () => {

    let token;

    beforeAll(() => {
        token = jwt.sign(
            { userId: 1, name: 'Buyer', role: 'user' },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
    });

    beforeEach(() => {
        jest.resetAllMocks();
    });

    describe('GET /api/cart', () => {
        it('should fetch user cart', async () => {
            const mockCartItems = [
                { id: 101, title: 'Item 1', price: 10, quantity: 1 }
            ];
            db.query.mockResolvedValueOnce([mockCartItems]);

            const res = await request(app)
                .get('/api/cart')
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveLength(1);
            expect(res.body[0].title).toBe('Item 1');
        });
    });

    describe('POST /api/cart', () => {
        it('should add item to cart', async () => {
            const mockConnection = {
                query: jest.fn(),
                release: jest.fn()
            };
            db.getConnection.mockResolvedValue(mockConnection);

            // 1. Get/Create Cart (Select fails -> Insert -> Return ID)
            mockConnection.query.mockResolvedValueOnce([[]]); // No cart found
            mockConnection.query.mockResolvedValueOnce([{ insertId: 10 }]); // Insert cart

            // 2. Check Product
            mockConnection.query.mockResolvedValueOnce([[{ id: 99, user_id: 2 }]]); // Product exists, owner 2

            // 3. Upsert Item
            mockConnection.query.mockResolvedValueOnce([{ affectedRows: 1 }]);

            const res = await request(app)
                .post('/api/cart')
                .set('Authorization', `Bearer ${token}`)
                .send({ productId: 99 });

            expect(res.statusCode).toEqual(200);
            expect(res.body.message).toBe('Added to cart.');
        });

        it('should fail if self-purchase', async () => {
            const mockConnection = {
                query: jest.fn(),
                release: jest.fn()
            };
            db.getConnection.mockResolvedValue(mockConnection);

            // 1. Get Cart
            mockConnection.query.mockResolvedValueOnce([[{ id: 10 }]]);

            // 2. Check Product - Owned by user 1 (the buyer)
            mockConnection.query.mockResolvedValueOnce([[{ id: 99, user_id: 1 }]]);

            const res = await request(app)
                .post('/api/cart')
                .set('Authorization', `Bearer ${token}`)
                .send({ productId: 99 });

            expect(res.statusCode).toEqual(400);
            expect(res.body.message).toContain('own product');
        });
    });
});
