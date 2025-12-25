// controllers/productController.js
const db = require('../config/database');

const getAllProducts = async (req, res) => {
    try {
        const { search, category } = req.query;

        let query = `
            SELECT p.id, p.title, p.price, p.image_url, u.id AS sellerId, u.name AS sellerName, GROUP_CONCAT(c.name) AS categories
            FROM products p
            JOIN users u ON p.user_id = u.id
            LEFT JOIN product_categories pc ON p.id = pc.product_id
            LEFT JOIN categories c ON pc.category_id = c.id
        `;

        const queryParams = [];
        let whereClauses = [];

        if (search) {
            whereClauses.push(`p.title LIKE ?`);
            queryParams.push(`%${search}%`);
        }

        if (category) {
            // This part is a bit tricky because a product can have multiple categories.
            // We need to filter products that have at least one of the specified categories.
            // A subquery is a good way to handle this.
            whereClauses.push(`p.id IN (SELECT product_id FROM product_categories WHERE category_id = ?)`);
            queryParams.push(category);
        }

        if (whereClauses.length > 0) {
            query += ` WHERE ${whereClauses.join(' AND ')}`;
        }

        query += ` GROUP BY p.id ORDER BY p.created_at DESC`;

        const [products] = await db.query(query, queryParams);
        res.json(products);
    } catch (error) {
        console.error('Get Products Error:', error);
        res.status(500).json({ message: 'Server error fetching products.' });
    }
};

const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const [products] = await db.query(
            `SELECT p.id, p.title, p.description, p.price, p.image_url, p.tags, u.id AS sellerId, u.name AS sellerName, u.phone AS sellerPhone, u.dept AS sellerDept, GROUP_CONCAT(c.name) AS categories
             FROM products p
             JOIN users u ON p.user_id = u.id
             LEFT JOIN product_categories pc ON p.id = pc.product_id
             LEFT JOIN categories c ON pc.category_id = c.id
             WHERE p.id = ?
             GROUP BY p.id`,
            [id]
        );

        if (products.length === 0) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        const product = products[0];

        // Analytics: Calculate average price for this category
        let averagePrice = null;
        let productCount = 0;

        if (product.categories) {
            // Get the first category (primary for comparison)
            const firstCategory = product.categories.split(',')[0];

            const [stats] = await db.query(`
                SELECT AVG(p.price) as avgPrice, COUNT(p.id) as count
                FROM products p
                JOIN product_categories pc ON p.id = pc.product_id
                JOIN categories c ON pc.category_id = c.id
                WHERE c.name = ? AND p.status = 'available'
            `, [firstCategory]);

            if (stats.length > 0) {
                averagePrice = parseFloat(stats[0].avgPrice);
                productCount = stats[0].count;
            }
        }

        res.json({ ...product, averagePrice, categoryProductCount: productCount });
    } catch (error) {
        console.error('Get Product Detail Error:', error);
        res.status(500).json({ message: 'Server error fetching product details.' });
    }
};

const createProduct = async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const { title, description, price, categories, location_name, latitude, longitude, tags } = req.body;
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';
        const userId = req.user.userId;

        if (!title || !description || !price) {
            return res.status(400).json({ message: 'Title, description, and price are required.' });
        }

        const [result] = await connection.query(
            'INSERT INTO products (title, description, price, image_url, user_id, latitude, longitude, location_name, tags) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [title, description, price, imageUrl, userId, latitude || null, longitude || null, location_name || '', tags || '']
        );
        const productId = result.insertId;

        if (categories) {
            const categoryIds = Array.isArray(categories) ? categories : [categories];
            const categoryValues = categoryIds.map(catId => [productId, catId]);
            await connection.query('INSERT INTO product_categories (product_id, category_id) VALUES ?', [categoryValues]);
        }

        await connection.commit();
        res.status(201).json({ message: 'Product listed successfully!', productId });
    } catch (error) {
        await connection.rollback();
        console.error('Create Product Error:', error);
        res.status(500).json({ message: 'Server error creating product.' });
    } finally {
        connection.release();
    }
};

const getMyProducts = async (req, res) => {
    try {
        const userId = req.user.userId;
        const [products] = await db.query('SELECT * FROM products WHERE user_id = ? ORDER BY created_at DESC', [userId]);
        res.json(products);
    } catch (error) {
        console.error('Get My Products Error:', error);
        res.status(500).json({ message: 'Server error fetching user products.' });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;

        const [result] = await db.query(
            'DELETE FROM products WHERE id = ? AND user_id = ?',
            [id, userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Product not found or you do not have permission to delete it.' });
        }

        res.json({ message: 'Product deleted successfully.' });
    } catch (error) {
        console.error('Delete Product Error:', error);
        res.status(500).json({ message: 'Server error deleting product.' });
    }
};

const updateProduct = async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        const { id } = req.params;
        const { title, description, price, categories, tags } = req.body;
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : req.body.image_url;
        const userId = req.user.userId;

        if (!title || !description || !price) {
            return res.status(400).json({ message: 'All product fields are required.' });
        }

        const [result] = await connection.query(
            'UPDATE products SET title = ?, description = ?, price = ?, image_url = ?, tags = ? WHERE id = ? AND user_id = ?',
            [title, description, price, imageUrl, tags || '', id, userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Product not found or you do not have permission to update it.' });
        }

        await connection.query('DELETE FROM product_categories WHERE product_id = ?', [id]);
        if (categories) {
            const categoryIds = Array.isArray(categories) ? categories : [categories];
            const categoryValues = categoryIds.map(catId => [id, catId]);
            await connection.query('INSERT INTO product_categories (product_id, category_id) VALUES ?', [categoryValues]);
        }

        await connection.commit();
        res.json({ message: 'Product updated successfully.' });
    } catch (error) {
        await connection.rollback();
        console.error('Update Product Error:', error);
        res.status(500).json({ message: 'Server error updating product.' });
    } finally {
        connection.release();
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    getMyProducts,
    deleteProduct,
    updateProduct,
};
