// controllers/orderController.js
const db = require('../config/database');
const { orderSchema } = require('../validators/commonValidator');

const createOrder = async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const { error } = orderSchema.validate(req.body);
        if (error) {
            await connection.rollback();
            return res.status(400).json({ message: error.details[0].message });
        }

        const userId = req.user.userId;
        const { items } = req.body; // Expecting array of { id, price }

        // Initialize order items and total amount
        const orderItems = [];
        let totalAmount = 0;

        // Verify items and fetch current prices
        for (const item of items) {
            // Check if available and fetch price
            const [rows] = await connection.query(
                'SELECT price, status, user_id, title FROM products WHERE id = ? FOR UPDATE',
                [item.id]
            );

            if (rows.length === 0) {
                throw new Error(`Product ${item.id} not found.`);
            }
            if (rows[0].status !== 'available') {
                throw new Error(`Product "${rows[0].title}" is no longer available.`);
            }
            if (rows[0].user_id === userId) {
                throw new Error(`You cannot buy your own product: "${rows[0].title}".`);
            }

            const price = parseFloat(rows[0].price);
            totalAmount += price;
            orderItems.push({ id: item.id, price: price });
        }

        // Create Order
        const [orderResult] = await connection.query(
            'INSERT INTO orders (user_id, total_amount) VALUES (?, ?)',
            [userId, totalAmount]
        );
        const orderId = orderResult.insertId;

        // Create Order Items and Update Product Status
        for (const item of orderItems) {
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

const getMyOrders = async (req, res) => {
    try {
        const userId = req.user.userId;

        // Fetch orders with items and product details
        // We can do this in one query or two. One query with JSON aggregation is efficient in MySQL 5.7/8.0
        // Or simple join and process in JS.

        const [rows] = await db.query(`
            SELECT 
                o.id as orderId, o.total_amount, o.status, o.created_at,
                oi.id as itemId, oi.price as itemPrice,
                p.id as productId, p.title, p.image_url
            FROM orders o
            JOIN order_items oi ON o.id = oi.order_id
            JOIN products p ON oi.product_id = p.id
            WHERE o.user_id = ?
            ORDER BY o.created_at DESC
        `, [userId]);

        // Group by Order ID
        const ordersMap = new Map();

        for (const row of rows) {
            if (!ordersMap.has(row.orderId)) {
                ordersMap.set(row.orderId, {
                    id: row.orderId,
                    total_amount: row.total_amount,
                    status: row.status,
                    created_at: row.created_at,
                    items: []
                });
            }
            const order = ordersMap.get(row.orderId);
            order.items.push({
                id: row.itemId,
                price: row.itemPrice,
                product: {
                    id: row.productId,
                    title: row.title,
                    image_url: row.image_url
                }
            });
        }

        const orders = Array.from(ordersMap.values());
        res.json(orders);
    } catch (error) {
        console.error('Get My Orders Error:', error);
        res.status(500).json({ message: 'Server error fetching orders.' });
    }
};

module.exports = { createOrder, getMyOrders };
