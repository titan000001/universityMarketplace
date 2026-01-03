// controllers/userController.js
const db = require('../config/database');
const { deleteFile } = require('../utils/fileUtils');

const getUserProfile = async (req, res) => {
    try {
        const { id } = req.params;

        if (db.mockMode && db.mockMode()) {
            console.warn('⚠️  Serving MOCK PROFILE');
            return res.json({
                user: {
                    id: id,
                    name: 'Mock User',
                    dept: 'Computer Science',
                    bio: 'This is a mock profile running in offline mode.',
                    avatar_url: 'https://placehold.co/150',
                    social_links: '{"twitter": "@mock", "instagram": "@mock"}'
                },
                products: [
                    { id: 101, title: 'Calculus Early Transcendentals', price: '89.99', image_url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f', created_at: new Date() }
                ]
            });
        }

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
        if (db.mockMode && db.mockMode()) {
            console.warn('⚠️  Mock Profile Update Successful');
            const avatarUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
            return res.json({ message: 'Profile updated successfully (Mock)', avatarUrl });
        }

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

        // Fetch old avatar if we are updating it
        let oldAvatarUrl = null;
        if (avatarUrl !== undefined) {
            const [users] = await db.query('SELECT avatar_url FROM users WHERE id = ?', [userId]);
            if (users.length > 0) {
                oldAvatarUrl = users[0].avatar_url;
            }
        }

        const [result] = await db.query(query, params);

        if (result.affectedRows > 0 && avatarUrl !== undefined && oldAvatarUrl) {
            await deleteFile(oldAvatarUrl);
        }

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
