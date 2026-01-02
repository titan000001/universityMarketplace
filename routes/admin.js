// routes/admin.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/adminMiddleware');

// All routes in this file are protected and require admin privileges
router.use(verifyToken, isAdmin);

// GET /api/admin/users - Get all users
router.get('/users', adminController.getAllUsers);

// DELETE /api/admin/users/:id - Delete a user
router.delete('/users/:id', isAdmin, adminController.deleteUser);

// GET /api/admin/analytics - Get platform stats
router.get('/analytics', isAdmin, adminController.getAnalytics);

module.exports = router;
