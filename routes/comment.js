// routes/comment.js
const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { verifyToken } = require('../middleware/authMiddleware');

// GET /api/comments/:productId - Get all comments for a product
router.get('/:productId', commentController.getCommentsForProduct);

// POST /api/comments/:productId - Create a new comment for a product
router.post('/:productId', verifyToken, commentController.createComment);

module.exports = router;
