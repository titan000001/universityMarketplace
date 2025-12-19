// controllers/userController.js
const db = require('../config/database');

const getUserProfile = async (req, res) => {
    try {
        const { id } = req.params;

        const [users] = await db.query('SELECT id, name, dept FROM users WHERE id = ?', [id]);
        const user = users[0];

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const [products] = await db.query('SELECT * FROM products WHERE user_id = ? ORDER BY created_at DESC', [id]);

        res.json({ user, products });
    } catch (error) {
        console.error('Get User Profile Error:', error);
        res.status(500).json({ message: 'Server error fetching user profile.' });
    }
};

module.exports = {
    getUserProfile,
};
