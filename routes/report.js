// routes/report.js
const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { verifyToken } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/adminMiddleware');

router.post('/', verifyToken, reportController.createReport);
router.get('/', verifyToken, isAdmin, reportController.getReports);

module.exports = router;
