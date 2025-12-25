const db = require('../config/database');

// Create a review
const createReview = async (req, res) => {
    try {
        const reviewerId = req.user.userId;
        const { targetUserId, rating, comment } = req.body;

        if (reviewerId === parseInt(targetUserId)) {
            return res.status(400).json({ message: 'You cannot review yourself.' });
        }

        await db.query(
            'INSERT INTO reviews (reviewer_id, target_user_id, rating, comment) VALUES (?, ?, ?, ?)',
            [reviewerId, targetUserId, rating, comment]
        );

        res.status(201).json({ message: 'Review submitted successfully.' });
    } catch (error) {
        console.error('Create Review Error:', error);
        res.status(500).json({ message: 'Server error submitting review.' });
    }
};

// Get reviews for a user
const getReviews = async (req, res) => {
    try {
        const { userId } = req.params;
        const [reviews] = await db.query(
            `SELECT r.*, u.name as reviewer_name 
             FROM reviews r 
             JOIN users u ON r.reviewer_id = u.id 
             WHERE r.target_user_id = ? 
             ORDER BY r.created_at DESC`,
            [userId]
        );

        // Calculate average rating
        const [avgResult] = await db.query(
            'SELECT AVG(rating) as averageRating, COUNT(*) as count FROM reviews WHERE target_user_id = ?',
            [userId]
        );

        const stats = avgResult[0];

        res.json({ reviews, stats });
    } catch (error) {
        console.error('Get Reviews Error:', error);
        res.status(500).json({ message: 'Server error fetching reviews.' });
    }
};

module.exports = {
    createReview,
    getReviews
};
