// controllers/shopController.js
const db = require('../config/database');
const { deleteFile } = require('../utils/fileUtils');

const getShops = async (req, res) => {
    try {
        const query = `
            SELECT s.*, u.name as owner_name, 
            (SELECT AVG(rating) FROM reviews WHERE target_user_id = s.user_id) as average_rating,
            (SELECT COUNT(*) FROM reviews WHERE target_user_id = s.user_id) as review_count
            FROM shops s 
            JOIN users u ON s.user_id = u.id 
            ORDER BY s.created_at DESC
        `;
        const [shops] = await db.query(query);
        res.json(shops);
    } catch (error) {
        console.error('Get Shops Error:', error);
        res.status(500).json({ message: 'Server error fetching shops.' });
    }
};

const getShopById = async (req, res) => {
    try {
        const { id } = req.params;
        const [shops] = await db.query(`
            SELECT s.*, u.name AS ownerName, u.student_id, u.dept
            FROM shops s
            JOIN users u ON s.user_id = u.id
            WHERE s.id = ?
        `, [id]);

        if (shops.length === 0) {
            return res.status(404).json({ message: 'Shop not found.' });
        }

        const shop = shops[0];
        const [products] = await db.query('SELECT * FROM products WHERE shop_id = ? AND status = "available"', [id]);

        res.json({ ...shop, products });
    } catch (error) {
        console.error('Get Shop Error:', error);
        res.status(500).json({ message: 'Server error fetching shop details.' });
    }
};

const getMyShop = async (req, res) => {
    try {
        const userId = req.user.userId;
        const [shops] = await db.query('SELECT * FROM shops WHERE user_id = ?', [userId]);
        res.json(shops); // Returns array of shops owned by user
    } catch (error) {
        console.error('Get My Shop Error:', error);
        res.status(500).json({ message: 'Server error fetching your shop.' });
    }
};

const createShop = async (req, res) => {
    try {
        const { name, bio } = req.body;
        const userId = req.user.userId;
        const logoUrl = req.files && req.files['logo'] ? `/uploads/${req.files['logo'][0].filename}` : '';
        const bannerUrl = req.files && req.files['banner'] ? `/uploads/${req.files['banner'][0].filename}` : '';

        if (!name) {
            return res.status(400).json({ message: 'Shop name is required.' });
        }

        const [result] = await db.query(
            'INSERT INTO shops (user_id, name, bio, logo_url, banner_url) VALUES (?, ?, ?, ?, ?)',
            [userId, name, bio || '', logoUrl, bannerUrl]
        );

        res.status(201).json({ message: 'Shop created successfully!', shopId: result.insertId });
    } catch (error) {
        console.error('Create Shop Error:', error);
        res.status(500).json({ message: 'Server error creating shop.' });
    }
};

const updateShop = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, bio } = req.body;
        const userId = req.user.userId;

        const [existing] = await db.query('SELECT * FROM shops WHERE id = ? AND user_id = ?', [id, userId]);
        if (existing.length === 0) {
            return res.status(404).json({ message: 'Shop not found or permission denied.' });
        }

        const oldLogo = existing[0].logo_url;
        const oldBanner = existing[0].banner_url;

        let logoUrl = oldLogo;
        let bannerUrl = oldBanner;

        if (req.files) {
            if (req.files['logo']) {
                logoUrl = `/uploads/${req.files['logo'][0].filename}`;
                if (oldLogo) await deleteFile(oldLogo);
            }
            if (req.files['banner']) {
                bannerUrl = `/uploads/${req.files['banner'][0].filename}`;
                if (oldBanner) await deleteFile(oldBanner);
            }
        }

        await db.query(
            'UPDATE shops SET name = ?, bio = ?, logo_url = ?, banner_url = ? WHERE id = ?',
            [name || existing[0].name, bio || existing[0].bio, logoUrl, bannerUrl, id]
        );

        res.json({ message: 'Shop updated successfully!' });
    } catch (error) {
        console.error('Update Shop Error:', error);
        res.status(500).json({ message: 'Server error updating shop.' });
    }
};

const deleteShop = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;

        const [existing] = await db.query('SELECT * FROM shops WHERE id = ? AND user_id = ?', [id, userId]);
        if (existing.length === 0) {
            return res.status(404).json({ message: 'Shop not found or permission denied.' });
        }

        const { logo_url, banner_url } = existing[0];

        await db.query('DELETE FROM shops WHERE id = ?', [id]);

        if (logo_url) await deleteFile(logo_url);
        if (banner_url) await deleteFile(banner_url);

        res.json({ message: 'Shop deleted successfully.' });
    } catch (error) {
        console.error('Delete Shop Error:', error);
        res.status(500).json({ message: 'Server error deleting shop.' });
    }
};

module.exports = {
    getShops,
    getShopById,
    getMyShop,
    createShop,
    updateShop,
    deleteShop
};
