
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
            productIds: [101, 102]
        };

        it('should process a valid order successfully', async () => {
            // Mock transaction and queries
            const mockConnection = {
                beginTransaction: jest.fn(),
                query: jest.fn(),
                commit: jest.fn(),
                rollback: jest.fn(),
                release: jest.fn()
            };
            db.getConnection.mockResolvedValue(mockConnection);

            // Mock product 101 query
            mockConnection.query
                .mockResolvedValueOnce([[{ id: 101, title: 'Book', status: 'available', user_id: 2 }]]) // Product 1
                .mockResolvedValueOnce([]) // Insert Order 1
                .mockResolvedValueOnce([]) // Update Product 1
                .mockResolvedValueOnce([[{ id: 102, title: 'Laptop', status: 'available', user_id: 2 }]]) // Product 2
                .mockResolvedValueOnce([]) // Insert Order 2
                .mockResolvedValueOnce([]); // Update Product 2

            const res = await request(app)
                .post('/api/orders')
                .set('Authorization', `Bearer ${token}`)
                .send(orderData);

            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty('message', 'Order placed successfully!');
            expect(mockConnection.beginTransaction).toHaveBeenCalled();
            expect(mockConnection.commit).toHaveBeenCalled();
            expect(mockConnection.rollback).not.toHaveBeenCalled();
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

            // Mock product 101 query - SOLD
            mockConnection.query
                .mockResolvedValueOnce([[{ id: 101, title: 'Book', status: 'sold', user_id: 2 }]]);

            const res = await request(app)
                .post('/api/orders')
                .set('Authorization', `Bearer ${token}`)
                .send({ productIds: [101] });

            expect(res.statusCode).toEqual(400);
            expect(res.body.message).toContain('no longer available');
            expect(mockConnection.rollback).toHaveBeenCalled();
            expect(mockConnection.commit).not.toHaveBeenCalled();
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

            // Mock product 101 query - Owned by user 1 (the buyer)
            mockConnection.query
                .mockResolvedValueOnce([[{ id: 101, title: 'My Book', status: 'available', user_id: 1 }]]);

            const res = await request(app)
                .post('/api/orders')
                .set('Authorization', `Bearer ${token}`)
                .send({ productIds: [101] });

            expect(res.statusCode).toEqual(400);
            expect(res.body.message).toContain('cannot buy your own product');
            expect(mockConnection.rollback).toHaveBeenCalled();
        });

        it('should fail if productIds is empty', async () => {
            const res = await request(app)
                .post('/api/orders')
                .set('Authorization', `Bearer ${token}`)
                .send({ productIds: [] });

            expect(res.statusCode).toEqual(400);
        });
    });
});
