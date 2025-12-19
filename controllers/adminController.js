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

module.exports = {
    getAllUsers,
    deleteUser,
};
