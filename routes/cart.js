// routes/cart.js
const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { verifyToken } = require('../middleware/authMiddleware');

router.use(verifyToken);

router.get('/', cartController.getCart);
router.post('/', cartController.addToCart);
router.post('/sync', cartController.syncCart);
router.delete('/:productId', cartController.removeFromCart);

module.exports = router;
