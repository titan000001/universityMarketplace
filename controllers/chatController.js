// controllers/chatController.js
const db = require('../config/database');

const getChatHistory = async (req, res) => {
    try {
        const { room } = req.params;
        const userId = req.user.userId;
        const userRole = req.user.role;

        // Room format: prod-{pid}-buy-{bid}-sell-{sid}
        const roomRegex = /^prod-\d+-buy-(\d+)-sell-(\d+)$/;
        const match = room.match(roomRegex);

        if (!match) {
            return res.status(400).json({ message: 'Invalid room format.' });
        }

        const buyerId = parseInt(match[1]);
        const sellerId = parseInt(match[2]);

        // Access Control: Must be buyer, seller, or admin
        if (userId !== buyerId && userId !== sellerId && userRole !== 'admin') {
             return res.status(403).json({ message: 'Access denied.' });
        }

        const [messages] = await db.query(
            `SELECT m.*, u.name as sender_name
             FROM messages m
             JOIN users u ON m.sender_id = u.id
             WHERE m.room_id = ?
             ORDER BY m.created_at ASC`,
            [room]
        );

        res.json(messages);
    } catch (error) {
        console.error('Get Chat History Error:', error);
        res.status(500).json({ message: 'Server error fetching chat history.' });
    }
};

const saveMessage = async (room, senderId, message) => {
    try {
        await db.query(
            'INSERT INTO messages (room_id, sender_id, message) VALUES (?, ?, ?)',
            [room, senderId, message]
        );
        return true;
    } catch (error) {
        console.error('Save Message Error:', error);
        return false;
    }
};

module.exports = {
    getChatHistory,
    saveMessage
};
