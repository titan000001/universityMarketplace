
// tests/auth.test.js

// Set environment variables before any imports
process.env.JWT_SECRET = 'test_secret';

// Mock the database module using the file in config/__mocks__/database.js
jest.mock('../config/database');

const db = require('../config/database');
const request = require('supertest');
const app = require('../server');
const bcrypt = require('bcryptjs');

describe('Auth Endpoints', () => {

    beforeEach(() => {
        // Reset all mocks to ensure no contamination between tests
        jest.resetAllMocks();
    });

    describe('POST /api/register', () => {
        // Updated phone number to meet min length requirement (10 chars)
        const newUser = {
            name: 'Test Student',
            student_id: 'test_student',
            phone: '123-456-7890',
            dept: 'CS',
            password: 'password123'
        };

        it('should register a new user successfully', async () => {
            // 1. Mock checking for existing user (return empty array)
            // db.query returns [rows, fields]
            db.query.mockResolvedValueOnce([[]]);

            // 2. Mock insertion (return result with insertId)
            db.query.mockResolvedValueOnce([{ insertId: 1 }]);

            const res = await request(app)
                .post('/api/register')
                .send(newUser);

            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty('message', 'User registered successfully!');
            expect(db.query).toHaveBeenCalledTimes(2);
        });

        it('should fail if user already exists', async () => {
            // Mock existing user
            db.query.mockResolvedValueOnce([[{ id: 1, student_id: 'test_student' }]]);

            const res = await request(app)
                .post('/api/register')
                .send(newUser);

            expect(res.statusCode).toEqual(409);
            expect(res.body).toHaveProperty('message', 'A user with this Student ID already exists.');
        });

        it('should fail validation if fields are missing', async () => {
             const res = await request(app)
                .post('/api/register')
                .send({});

             expect(res.statusCode).toEqual(400);
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

            // Mock finding user
            db.query.mockResolvedValueOnce([[mockUser]]);

            const res = await request(app)
                .post('/api/login')
                .send(credentials);

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('token');
        });

        it('should fail with invalid credentials', async () => {
             const hashedPassword = await bcrypt.hash('password123', 10);
            const mockUser = { id: 1, name: 'Test', student_id: 'test_student', password: hashedPassword, role: 'user' };

            // Mock finding user (user exists)
            db.query.mockResolvedValueOnce([[mockUser]]);

            const res = await request(app)
                .post('/api/login')
                .send({ student_id: 'test_student', password: 'wrongpassword' });

            expect(res.statusCode).toEqual(401);
             expect(res.body).toHaveProperty('message', 'Invalid credentials.');
        });

        it('should fail if user not found', async () => {
             // Mock finding no user
            db.query.mockResolvedValueOnce([[]]);

            const res = await request(app)
                .post('/api/login')
                .send(credentials);

            expect(res.statusCode).toEqual(404);
            expect(res.body).toHaveProperty('message', 'User not found.');
        });
    });
});
