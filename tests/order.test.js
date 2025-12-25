
// tests/order.test.js

process.env.JWT_SECRET = 'test_secret';

// Mock the database
jest.mock('../config/database');
const db = require('../config/database');

const request = require('supertest');
const app = require('../server');
const jwt = require('jsonwebtoken');

describe('Order Endpoints', () => {

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

    describe('POST /api/orders', () => {
        const orderData = {
            items: [
                { id: 101, price: 10 },
                { id: 102, price: 500 }
            ]
        };

        it('should process a valid order successfully', async () => {
            const mockConnection = {
                beginTransaction: jest.fn(),
                query: jest.fn(),
                commit: jest.fn(),
                rollback: jest.fn(),
                release: jest.fn()
            };
            db.getConnection.mockResolvedValue(mockConnection);

            // 1. Insert Order
            mockConnection.query.mockResolvedValueOnce([{ insertId: 500 }]);

            // Loop for Item 101
            // 2. Check Status
            mockConnection.query.mockResolvedValueOnce([[{ status: 'available', user_id: 2, title: 'Item 1' }]]);
            // 3. Insert Order Item
            mockConnection.query.mockResolvedValueOnce([]);
            // 4. Update Product
            mockConnection.query.mockResolvedValueOnce([]);

            // Loop for Item 102
            // 5. Check Status
            mockConnection.query.mockResolvedValueOnce([[{ status: 'available', user_id: 2, title: 'Item 2' }]]);
            // 6. Insert Order Item
            mockConnection.query.mockResolvedValueOnce([]);
            // 7. Update Product
            mockConnection.query.mockResolvedValueOnce([]);

            const res = await request(app)
                .post('/api/orders')
                .set('Authorization', `Bearer ${token}`)
                .send(orderData);

            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty('message', 'Order placed successfully!');
            expect(res.body).toHaveProperty('orderId', 500);
            expect(mockConnection.commit).toHaveBeenCalled();
            expect(mockConnection.release).toHaveBeenCalled();
        });

        it('should fail if product is not available', async () => {
            const mockConnection = {
                beginTransaction: jest.fn(),
                query: jest.fn(),
                commit: jest.fn(),
                rollback: jest.fn(),
                release: jest.fn()
            };
            db.getConnection.mockResolvedValue(mockConnection);

            // 1. Insert Order
            mockConnection.query.mockResolvedValueOnce([{ insertId: 501 }]);

            // Loop for Item 101 - SOLD
            mockConnection.query.mockResolvedValueOnce([[{ status: 'sold', user_id: 2, title: 'Item 1' }]]);

            const res = await request(app)
                .post('/api/orders')
                .set('Authorization', `Bearer ${token}`)
                .send({ items: [{ id: 101, price: 10 }] });

            expect(res.statusCode).toEqual(400);
            expect(res.body.message).toContain('no longer available');
            expect(mockConnection.rollback).toHaveBeenCalled();
        });

        it('should fail if trying to buy own product', async () => {
            const mockConnection = {
                beginTransaction: jest.fn(),
                query: jest.fn(),
                commit: jest.fn(),
                rollback: jest.fn(),
                release: jest.fn()
            };
            db.getConnection.mockResolvedValue(mockConnection);

             // 1. Insert Order
            mockConnection.query.mockResolvedValueOnce([{ insertId: 502 }]);

            // Loop for Item 101 - Owned by buyer (userId 1)
            mockConnection.query.mockResolvedValueOnce([[{ status: 'available', user_id: 1, title: 'My Book' }]]);

            const res = await request(app)
                .post('/api/orders')
                .set('Authorization', `Bearer ${token}`)
                .send({ items: [{ id: 101, price: 10 }] });

            expect(res.statusCode).toEqual(400);
            expect(res.body.message).toContain('cannot buy your own product');
            expect(mockConnection.rollback).toHaveBeenCalled();
        });
    });
});
