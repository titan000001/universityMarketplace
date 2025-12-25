// routes/api.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const productController = require('../controllers/productController');
const categoryRoutes = require('./category');
const userRoutes = require('./user');
const wishlistRoutes = require('./wishlist');
const commentRoutes = require('./comment');
const adminRoutes = require('./admin');
const orderRoutes = require('./order');
const shopRoutes = require('./shop');
const { verifyToken } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// --- Auth Routes ---
router.post('/register', authController.register);
router.post('/login', authController.login);

// --- User Routes ---
router.use('/users', userRoutes);

// --- Wishlist Routes ---
router.use('/wishlist', wishlistRoutes);

// --- Comment Routes ---
router.use('/comments', commentRoutes);

// --- Category Routes ---
router.use('/categories', categoryRoutes);

// --- Product Routes ---
router.get('/products', productController.getAllProducts);
router.get('/products/:id', productController.getProductById);
router.post('/products', verifyToken, upload.single('image'), productController.createProduct);
router.get('/my-products', verifyToken, productController.getMyProducts);
router.delete('/products/:id', verifyToken, productController.deleteProduct);
router.put('/products/:id', verifyToken, upload.single('image'), productController.updateProduct);

// --- Admin Routes ---
router.use('/admin', adminRoutes);

// --- Order Routes ---
router.use('/orders', orderRoutes);

// --- Shop Routes ---
router.use('/shops', shopRoutes);

module.exports = router;
