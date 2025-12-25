
const request = require('supertest');
const app = require('../server'); // Adjust path as needed
const db = require('../config/database');
const jwt = require('jsonwebtoken');

jest.mock('../config/database');

describe('Report Endpoints', () => {
    let token;
    let adminToken;

    beforeAll(() => {
        token = jwt.sign({ userId: 1, role: 'user' }, process.env.JWT_SECRET || 'testsecret');
        adminToken = jwt.sign({ userId: 2, role: 'admin' }, process.env.JWT_SECRET || 'testsecret');
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /api/reports', () => {
        it('should create a report successfully', async () => {
            db.query.mockResolvedValue([{ insertId: 1 }]);

            const res = await request(app)
                .post('/api/reports')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    target_type: 'product',
                    target_id: 1,
                    reason: 'Inappropriate content'
                });

            expect(res.statusCode).toBe(201);
            expect(res.body.message).toBe('Report submitted successfully.');
            expect(db.query).toHaveBeenCalledWith(
                expect.stringContaining('INSERT INTO reports'),
                expect.arrayContaining([1, 'product', 1, 'Inappropriate content'])
            );
        });

        it('should fail validation', async () => {
            const res = await request(app)
                .post('/api/reports')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    target_type: 'invalid',
                    target_id: 1,
                    reason: 'Bad' // too short
                });

            expect(res.statusCode).toBe(400);
        });
    });

    describe('GET /api/reports', () => {
        it('should return reports for admin', async () => {
            db.query.mockResolvedValue([[{ id: 1, reason: 'Bad' }]]);

            const res = await request(app)
                .get('/api/reports')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveLength(1);
        });

        it('should deny access for non-admin', async () => {
            const res = await request(app)
                .get('/api/reports')
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toBe(403);
        });
    });
});
