// routes/order.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { verifyToken } = require('../middleware/authMiddleware');

// POST /api/orders - Create a new order
router.post('/', verifyToken, orderController.createOrder);

module.exports = router;
