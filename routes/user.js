// routes/user.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// GET /api/users/:id - Get a user's profile
router.get('/:id', userController.getUserProfile);

module.exports = router;
