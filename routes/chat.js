// routes/chat.js
const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/history/:room', verifyToken, chatController.getChatHistory);

module.exports = router;
