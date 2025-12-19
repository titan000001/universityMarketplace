// routes/user.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

const { verifyToken } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// PUT /api/users/profile - Update own profile (Must be before /:id)
router.put('/profile', verifyToken, upload.single('avatar'), userController.updateProfile);

// GET /api/users/:id - Get a user's profile
router.get('/:id', userController.getUserProfile);

module.exports = router;
