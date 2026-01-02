const db = require('../config/database');

// Get notifications for the authenticated user
const getNotifications = async (req, res) => {
    try {
        const userId = req.user.userId;
        const [notifications] = await db.query(
            'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 20',
            [userId]
        );
        res.json(notifications);
    } catch (error) {
        console.error('Get Notifications Error:', error);
        res.status(500).json({ message: 'Server error fetching notifications.' });
    }
};

// Mark a notification as read
const markAsRead = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;

        await db.query(
            'UPDATE notifications SET is_read = TRUE WHERE id = ? AND user_id = ?',
            [id, userId]
        );
        res.json({ message: 'Notification marked as read.' });
    } catch (error) {
        console.error('Mark Read Error:', error);
        res.status(500).json({ message: 'Server error updating notification.' });
    }
};

// Create a notification (Internal helper, not an API endpoint usually)
const createNotification = async (userId, message, type) => {
    try {
        await db.query(
            'INSERT INTO notifications (user_id, message, type) VALUES (?, ?, ?)',
            [userId, message, type]
        );
    } catch (error) {
        console.error('Create Notification Error:', error);
    }
};

module.exports = {
    getNotifications,
    markAsRead,
    createNotification
};
