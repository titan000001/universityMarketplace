// controllers/cartController.js
const db = require('../config/database');

// Helper: Get or Create Cart for User
const getOrCreateCart = async (connection, userId) => {
    let [carts] = await connection.query('SELECT id FROM carts WHERE user_id = ?', [userId]);
    if (carts.length === 0) {
        const [result] = await connection.query('INSERT INTO carts (user_id) VALUES (?)', [userId]);
        return result.insertId;
    }
    return carts[0].id;
};

const getCart = async (req, res, next) => {
    try {
        const userId = req.user.userId;

        // This query fetches cart items directly by joining tables
        const query = `
            SELECT p.id, p.title, p.price, p.image_url, ci.quantity, u.name as sellerName
            FROM carts c
            JOIN cart_items ci ON c.id = ci.cart_id
            JOIN products p ON ci.product_id = p.id
            JOIN users u ON p.user_id = u.id
            WHERE c.user_id = ?
        `;

        const [items] = await db.query(query, [userId]);
        res.json(items);
    } catch (error) {
        next(error);
    }
};

const addToCart = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { productId } = req.body;

        if (!productId) {
            res.status(400);
            throw new Error('Product ID is required.');
        }

        const connection = await db.getConnection();
        try {
            const cartId = await getOrCreateCart(connection, userId);

            // Check if product exists
            const [products] = await connection.query('SELECT id, user_id FROM products WHERE id = ?', [productId]);
            if (products.length === 0) {
                res.status(404);
                throw new Error('Product not found.');
            }
            if (products[0].user_id === userId) {
                res.status(400);
                throw new Error('Cannot add your own product to cart.');
            }

            // Upsert (Insert or Update if exists - though unique constraint handles duplication, we might just ignore or update qty)
            // For now, assuming qty always 1 for this marketplace, or increment?
            // "ON DUPLICATE KEY UPDATE quantity = quantity + 1"
            await connection.query(
                'INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, 1) ON DUPLICATE KEY UPDATE quantity = quantity',
                [cartId, productId]
            );

            res.status(200).json({ message: 'Added to cart.' });
        } finally {
            connection.release();
        }
    } catch (error) {
        next(error);
    }
};

const removeFromCart = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { productId } = req.params;

        const [carts] = await db.query('SELECT id FROM carts WHERE user_id = ?', [userId]);
        if (carts.length === 0) {
            return res.status(404).json({ message: 'Cart empty.' });
        }
        const cartId = carts[0].id;

        await db.query('DELETE FROM cart_items WHERE cart_id = ? AND product_id = ?', [cartId, productId]);
        res.json({ message: 'Removed from cart.' });
    } catch (error) {
        next(error);
    }
};

const syncCart = async (req, res, next) => {
    // Expects an array of product IDs from local storage
    try {
        const userId = req.user.userId;
        const { cart } = req.body; // Array of items [{id, ...}, ...] or just ids?

        if (!Array.isArray(cart)) {
            res.status(400);
            throw new Error('Invalid cart format.');
        }

        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();
            const cartId = await getOrCreateCart(connection, userId);

            // Simple sync logic: Merge local items into server cart.
            // Loop through local cart items and insert if not exists.
            for (const item of cart) {
                const productId = item.id;
                // Verify product and ownership (optional optimization: bulk check)
                 const [products] = await connection.query('SELECT id, user_id FROM products WHERE id = ?', [productId]);
                 if (products.length > 0 && products[0].user_id !== userId) {
                     await connection.query(
                        'INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, 1) ON DUPLICATE KEY UPDATE quantity = quantity',
                        [cartId, productId]
                     );
                 }
            }
            await connection.commit();

            // Return updated server cart
            const query = `
                SELECT p.id, p.title, p.price, p.image_url, ci.quantity, u.name as sellerName
                FROM carts c
                JOIN cart_items ci ON c.id = ci.cart_id
                JOIN products p ON ci.product_id = p.id
                JOIN users u ON p.user_id = u.id
                WHERE c.user_id = ?
            `;
            const [items] = await connection.query(query, [userId]);
            res.json(items);

        } catch (err) {
            await connection.rollback();
            throw err;
        } finally {
            connection.release();
        }
    } catch (error) {
        next(error);
    }
};

module.exports = { getCart, addToCart, removeFromCart, syncCart };
