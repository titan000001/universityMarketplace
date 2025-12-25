// controllers/reportController.js
const db = require('../config/database');
const Joi = require('joi');

const reportSchema = Joi.object({
    target_type: Joi.string().valid('product', 'user', 'shop', 'review').required(),
    target_id: Joi.number().integer().required(),
    reason: Joi.string().min(5).required()
});

const createReport = async (req, res) => {
    try {
        const { error } = reportSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const userId = req.user.userId;
        const { target_type, target_id, reason } = req.body;

        // In a real app, we would verify if the target exists.
        // For now, we assume it does or the admin will handle invalid reports.

        await db.query(
            'INSERT INTO reports (reporter_id, target_type, target_id, reason) VALUES (?, ?, ?, ?)',
            [userId, target_type, target_id, reason]
        );

        res.status(201).json({ message: 'Report submitted successfully.' });
    } catch (error) {
        console.error('Create Report Error:', error);
        res.status(500).json({ message: 'Server error submitting report.' });
    }
};

const getReports = async (req, res) => {
    try {
        // Only admin should access this, protected by route middleware
        const [reports] = await db.query(
            `SELECT r.*, u.name as reporter_name
             FROM reports r
             JOIN users u ON r.reporter_id = u.id
             ORDER BY r.created_at DESC`
        );
        res.json(reports);
    } catch (error) {
        console.error('Get Reports Error:', error);
        res.status(500).json({ message: 'Server error fetching reports.' });
    }
};

module.exports = {
    createReport,
    getReports
};
