// controllers/categoryController.js
const db = require('../config/database');

const getAllCategories = async (req, res) => {
    try {
        if (db.mockMode && db.mockMode()) {
            console.warn('⚠️  Serving MOCK CATEGORIES');
            return res.json([
                { id: 1, name: 'Textbooks' },
                { id: 2, name: 'Electronics' },
                { id: 3, name: 'Furniture' },
                { id: 4, name: 'Appliances' }
            ]);
        }

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
