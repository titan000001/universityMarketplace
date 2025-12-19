// controllers/orderController.js
const db = require('../config/database');

const createOrder = async (req, res) => {
    const { productIds } = req.body;
    const buyerId = req.user.userId;

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
        return res.status(400).json({ message: 'No items to checkout.' });
    }

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        for (const productId of productIds) {
            // Check if product exists and is available
            const [rows] = await connection.query(
                'SELECT * FROM products WHERE id = ? FOR UPDATE',
                [productId]
            );

            if (rows.length === 0) {
                throw new Error(`Product with ID ${productId} not found.`);
            }

            const product = rows[0];
            if (product.status !== 'available') {
                throw new Error(`Product "${product.title}" is no longer available.`);
            }

            if (product.user_id === buyerId) {
                throw new Error(`You cannot buy your own product: "${product.title}".`);
            }

            // Create Order
            await connection.query(
                'INSERT INTO orders (buyer_id, product_id) VALUES (?, ?)',
                [buyerId, productId]
            );

            // Update Product Status
            await connection.query(
                'UPDATE products SET status = ? WHERE id = ?',
                ['sold', productId]
            );
        }

        await connection.commit();
        res.status(201).json({ message: 'Order placed successfully!' });
    } catch (error) {
        await connection.rollback();
        console.error('Checkout Error:', error);
        if (error.message.includes('Product') || error.message.includes('available') || error.message.includes('own product')) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Server error processing order.' });
        }
    } finally {
        connection.release();
    }
};

module.exports = {
    createOrder,
};
