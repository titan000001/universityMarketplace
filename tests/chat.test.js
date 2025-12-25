
const request = require('supertest');
const app = require('../server');
const db = require('../config/database');
const jwt = require('jsonwebtoken');

jest.mock('../config/database');

describe('Chat Endpoints', () => {
    let token;

    beforeAll(() => {
        token = jwt.sign({ userId: 1, role: 'user' }, process.env.JWT_SECRET || 'testsecret');
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /api/chat/history/:room', () => {
        it('should return chat history for a valid room', async () => {
            const mockMessages = [
                { id: 1, message: 'Hello', sender_id: 1, created_at: new Date() },
                { id: 2, message: 'Hi', sender_id: 2, created_at: new Date() }
            ];
            db.query.mockResolvedValue([mockMessages]);

            const res = await request(app)
                .get('/api/chat/history/prod-1-buy-1-sell-2')
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveLength(2);
            expect(db.query).toHaveBeenCalledWith(
                expect.stringContaining('SELECT m.*, u.name as sender_name'),
                expect.arrayContaining(['prod-1-buy-1-sell-2'])
            );
        });

        it('should handle database errors', async () => {
            db.query.mockRejectedValue(new Error('DB Error'));

            const res = await request(app)
                .get('/api/chat/history/prod-1-buy-1-sell-2')
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toBe(500);
        });
    });
});
