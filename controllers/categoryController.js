// controllers/categoryController.js
const db = require('../config/database');

const getAllCategories = async (req, res) => {
    try {
        const [categories] = await db.query('SELECT * FROM categories ORDER BY name');
        res.json(categories);
    } catch (error) {
        console.error('Get All Categories Error:', error);
        res.status(500).json({ message: 'Server error fetching categories.' });
    }
};

module.exports = {
    getAllCategories,
};
