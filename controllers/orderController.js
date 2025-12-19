// controllers/orderController.js
const db = require('../config/database');

const createOrder = async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const userId = req.user.userId;
        const { items } = req.body; // Expecting array of { id, price }

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'No items in order.' });
        }

        // Calculate total
        const totalAmount = items.reduce((sum, item) => sum + parseFloat(item.price), 0);

        // Create Order
        const [orderResult] = await connection.query(
            'INSERT INTO orders (user_id, total_amount) VALUES (?, ?)',
            [userId, totalAmount]
        );
        const orderId = orderResult.insertId;

        // Create Order Items and Update Product Status
        for (const item of items) {
            // Check if available
            const [rows] = await connection.query(
                'SELECT status FROM products WHERE id = ? FOR UPDATE',
                [item.id]
            );

            if (rows.length === 0 || rows[0].status !== 'available') {
                throw new Error(`Product ${item.id} is no longer available.`);
            }

            // Insert Item
            await connection.query(
                'INSERT INTO order_items (order_id, product_id, price) VALUES (?, ?, ?)',
                [orderId, item.id, item.price]
            );

            // Mark Product as Sold
            await connection.query(
                'UPDATE products SET status = "sold" WHERE id = ?',
                [item.id]
            );
        }

        await connection.commit();
        res.status(201).json({ message: 'Order placed successfully!', orderId });
    } catch (error) {
        await connection.rollback();
        console.error('Create Order Error:', error);
        res.status(400).json({ message: error.message || 'Server error creating order.' });
    } finally {
        connection.release();
    }
};

module.exports = { createOrder };
