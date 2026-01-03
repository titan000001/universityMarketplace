// controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const { registerSchema, loginSchema } = require('../validators/authValidator');
const JWT_SECRET = process.env.JWT_SECRET;

const register = async (req, res) => {
    try {
        if (db.mockMode && db.mockMode()) {
            console.warn('⚠️  Serving MOCK REGISTRATION');
            return res.status(201).json({ message: 'Mock User registered successfully!', userId: 999 });
        }

        const { error } = registerSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const { name, student_id, phone, dept, password } = req.body;

        const [existingUsers] = await db.query('SELECT * FROM users WHERE student_id = ?', [student_id]);
        if (existingUsers.length > 0) {
            return res.status(409).json({ message: 'A user with this Student ID already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await db.query(
            'INSERT INTO users (name, student_id, phone, dept, password, role) VALUES (?, ?, ?, ?, ?, ?)',
            [name, student_id, phone, dept, hashedPassword, 'user']
        );

        res.status(201).json({ message: 'User registered successfully!', userId: result.insertId });
    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ message: 'Server error during registration.' });
    }
};

const login = async (req, res) => {
    try {
        if (db.mockMode && db.mockMode()) {
            console.warn('⚠️  Serving MOCK LOGIN');
            const token = jwt.sign(
                { userId: 1, name: 'Mock User', role: 'user' },
                JWT_SECRET || 'mock_secret',
                { expiresIn: '1h' }
            );
            return res.json({ message: 'Mock Login successful!', token });
        }

        const { error } = loginSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const { student_id, password } = req.body;

        const [users] = await db.query('SELECT * FROM users WHERE student_id = ?', [student_id]);
        const user = users[0];

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const token = jwt.sign(
            { userId: user.id, name: user.name, role: user.role },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ message: 'Login successful!', token });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Server error during login.' });
    }
};

module.exports = {
    register,
    login,
};
