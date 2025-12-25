const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { verifyToken } = require('../middleware/authMiddleware');

// GET /api/notifications - Get all notifications for user
router.get('/', verifyToken, notificationController.getNotifications);

// PUT /api/notifications/:id/read - Mark a notification as read
router.put('/:id/read', verifyToken, notificationController.markAsRead);

module.exports = router;
