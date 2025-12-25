
// tests/auth.test.js

process.env.JWT_SECRET = 'test_secret';

// Mock the database
jest.mock('../config/database');
const db = require('../config/database');

const request = require('supertest');
const app = require('../server');
const bcrypt = require('bcryptjs');

describe('Auth Endpoints', () => {

    beforeEach(() => {
        jest.resetAllMocks();
    });

    describe('POST /api/register', () => {
        const newUser = {
            name: 'Test Student',
            student_id: 'test_student',
            phone: '123-456-7890',
            dept: 'CS',
            password: 'password123'
        };

        it('should register a new user successfully', async () => {
            db.query.mockResolvedValueOnce([[]]);
            db.query.mockResolvedValueOnce([{ insertId: 1 }]);

            const res = await request(app)
                .post('/api/register')
                .send(newUser);

            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty('message', 'User registered successfully!');
        });
    });

    describe('POST /api/login', () => {
        const credentials = {
            student_id: 'test_student',
            password: 'password123'
        };

        it('should login successfully with correct credentials', async () => {
            const hashedPassword = await bcrypt.hash('password123', 10);
            const mockUser = { id: 1, name: 'Test', student_id: 'test_student', password: hashedPassword, role: 'user' };

            db.query.mockResolvedValueOnce([[mockUser]]);

            const res = await request(app)
                .post('/api/login')
                .send(credentials);

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('token');
        });
    });
});
