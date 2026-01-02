// routes/shop.js
const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shopController');
const { verifyToken } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public routes
router.get('/', shopController.getShops);
router.get('/:id', shopController.getShopById);

// Protected routes
router.get('/me', verifyToken, shopController.getMyShop);
router.post('/', verifyToken, upload.fields([{ name: 'logo', maxCount: 1 }, { name: 'banner', maxCount: 1 }]), shopController.createShop);
router.put('/:id', verifyToken, upload.fields([{ name: 'logo', maxCount: 1 }, { name: 'banner', maxCount: 1 }]), shopController.updateShop);
router.delete('/:id', verifyToken, shopController.deleteShop);

module.exports = router;
