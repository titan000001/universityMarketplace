// controllers/userController.js
const db = require('../config/database');

const getUserProfile = async (req, res) => {
    try {
        const { id } = req.params;

        const [users] = await db.query('SELECT id, name, dept, bio, avatar_url, social_links FROM users WHERE id = ?', [id]);
        const user = users[0];

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const [products] = await db.query('SELECT * FROM products WHERE user_id = ? ORDER BY created_at DESC', [id]);

        res.json({ user, products });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching user profile.' });
    }
};

const updateProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { bio, social_links } = req.body;
        let avatarUrl = undefined;

        if (req.file) {
            avatarUrl = `/uploads/${req.file.filename}`;
        }

        // Build query dynamically
        let query = 'UPDATE users SET ';
        const params = [];

        if (bio !== undefined) {
            query += 'bio = ?, ';
            params.push(bio);
        }
        if (social_links !== undefined) {
            query += 'social_links = ?, ';
            params.push(social_links);
        }
        if (avatarUrl !== undefined) {
            query += 'avatar_url = ?, ';
            params.push(avatarUrl);
        }

        // Remove trailing comma
        query = query.slice(0, -2);
        query += ' WHERE id = ?';
        params.push(userId);

        await db.query(query, params);

        res.json({ message: 'Profile updated successfully', avatarUrl });
    } catch (error) {
        console.error('Update Profile Error:', error);
        res.status(500).json({ message: 'Server error updating profile.' });
    }
};

module.exports = {
    getUserProfile,
    updateProfile,
};
