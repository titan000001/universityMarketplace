// controllers/wishlistController.js
const db = require('../config/database');

const getWishlist = async (req, res) => {
    try {
        const userId = req.user.userId;
        const [wishlist] = await db.query(
            `SELECT p.* FROM products p
             JOIN wishlist w ON p.id = w.product_id
             WHERE w.user_id = ?`,
            [userId]
        );
        res.json(wishlist);
    } catch (error) {
        console.error('Get Wishlist Error:', error);
        res.status(500).json({ message: 'Server error fetching wishlist.' });
    }
};

const addToWishlist = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { productId } = req.body;

        await db.query('INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)', [userId, productId]);

        res.status(201).json({ message: 'Product added to wishlist.' });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Product already in wishlist.' });
        }
        console.error('Add to Wishlist Error:', error);
        res.status(500).json({ message: 'Server error adding to wishlist.' });
    }
};

const removeFromWishlist = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { productId } = req.params;

        const [result] = await db.query('DELETE FROM wishlist WHERE user_id = ? AND product_id = ?', [userId, productId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Product not found in wishlist.' });
        }

        res.json({ message: 'Product removed from wishlist.' });
    } catch (error) {
        console.error('Remove from Wishlist Error:', error);
        res.status(500).json({ message: 'Server error removing from wishlist.' });
    }
};

module.exports = {
    getWishlist,
    addToWishlist,
    removeFromWishlist,
};
