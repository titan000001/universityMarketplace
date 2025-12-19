// routes/wishlist.js
const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');
const { verifyToken } = require('../middleware/authMiddleware');

// All routes in this file are protected
router.use(verifyToken);

// GET /api/wishlist - Get user's wishlist
router.get('/', wishlistController.getWishlist);

// POST /api/wishlist - Add a product to the wishlist
router.post('/', wishlistController.addToWishlist);

// DELETE /api/wishlist/:productId - Remove a product from the wishlist
router.delete('/:productId', wishlistController.removeFromWishlist);

module.exports = router;
