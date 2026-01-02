// controllers/adminController.js
const db = require('../config/database');

const getAllUsers = async (req, res) => {
    try {
        const [users] = await db.query('SELECT id, name, student_id, phone, dept, role FROM users');
        res.json(users);
    } catch (error) {
        console.error('Get All Users Error:', error);
        res.status(500).json({ message: 'Server error fetching users.' });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.query('DELETE FROM users WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.json({ message: 'User deleted successfully.' });
    } catch (error) {
        console.error('Delete User Error:', error);
        res.status(500).json({ message: 'Server error deleting user.' });
    }
};

const getAnalytics = async (req, res) => {
    try {
        const [userCount] = await db.query('SELECT COUNT(*) as count FROM users');
        const [productCount] = await db.query('SELECT COUNT(*) as count FROM products');
        const [orderCount] = await db.query('SELECT COUNT(*) as count FROM orders');

        // Simple daily joins for the last 7 days
        const [dailyUsers] = await db.query(`
            SELECT DATE(created_at) as date, COUNT(*) as count 
            FROM users 
            WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) 
            GROUP BY DATE(created_at)
        `);

        res.json({
            totalUsers: userCount[0].count,
            totalProducts: productCount[0].count,
            totalOrders: orderCount[0].count,
            dailyUsers
        });
    } catch (error) {
        console.error('Analytics Error:', error);
        res.status(500).json({ message: 'Server error fetching analytics.' });
    }
};

module.exports = {
    getAllUsers,
    deleteUser,
    getAnalytics
};
