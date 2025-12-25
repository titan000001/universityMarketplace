const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { verifyToken } = require('../middleware/authMiddleware');

// POST /api/reviews - Create a new review
router.post('/', verifyToken, reviewController.createReview);

// GET /api/reviews/user/:userId - Get reviews for a specific user
router.get('/user/:userId', reviewController.getReviews);

module.exports = router;
