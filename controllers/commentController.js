// controllers/commentController.js
const db = require('../config/database');

const getCommentsForProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const [comments] = await db.query(
            `SELECT c.id, c.comment, c.created_at, u.name AS userName
             FROM comments c
             JOIN users u ON c.user_id = u.id
             WHERE c.product_id = ?
             ORDER BY c.created_at DESC`,
            [productId]
        );
        res.json(comments);
    } catch (error) {
        console.error('Get Comments Error:', error);
        res.status(500).json({ message: 'Server error fetching comments.' });
    }
};

const createComment = async (req, res) => {
    try {
        const { productId } = req.params;
        const { comment } = req.body;
        const userId = req.user.userId;

        if (!comment) {
            return res.status(400).json({ message: 'Comment cannot be empty.' });
        }

        const [result] = await db.query(
            'INSERT INTO comments (product_id, user_id, comment) VALUES (?, ?, ?)',
            [productId, userId, comment]
        );

        res.status(201).json({ message: 'Comment posted successfully!', commentId: result.insertId });
    } catch (error) {
        console.error('Create Comment Error:', error);
        res.status(500).json({ message: 'Server error posting comment.' });
    }
};

module.exports = {
    getCommentsForProduct,
    createComment,
};
