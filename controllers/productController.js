// controllers/productController.js
const db = require('../config/database');

// Helper: Process Categories
const processCategories = async (connection, productId, categories) => {
    if (categories) {
        const categoryIds = Array.isArray(categories) ? categories : [categories];
        const categoryValues = categoryIds.map(catId => [productId, catId]);
        await connection.query('INSERT INTO product_categories (product_id, category_id) VALUES ?', [categoryValues]);
    }
};

const getAllProducts = async (req, res, next) => {
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
        next(error);
    }
};

const getProductById = async (req, res, next) => {
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
            res.status(404);
            throw new Error('Product not found.');
        }

        const product = products[0];

        // Analytics: Calculate average price for this category
        let averagePrice = null;
        let productCount = 0;

        if (product.categories) {
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
        next(error);
    }
};

const createProduct = async (req, res, next) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const { title, description, price, categories, location_name, latitude, longitude, tags } = req.body;
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';
        const userId = req.user.userId;

        if (!title || !description || !price) {
            res.status(400);
            throw new Error('Title, description, and price are required.');
        }

        const [result] = await connection.query(
            'INSERT INTO products (title, description, price, image_url, user_id, latitude, longitude, location_name, tags) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [title, description, price, imageUrl, userId, latitude || null, longitude || null, location_name || '', tags || '']
        );
        const productId = result.insertId;

        await processCategories(connection, productId, categories);

        await connection.commit();
        res.status(201).json({ message: 'Product listed successfully!', productId });
    } catch (error) {
        await connection.rollback();
        next(error);
    } finally {
        connection.release();
    }
};

const getMyProducts = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const [products] = await db.query('SELECT * FROM products WHERE user_id = ? ORDER BY created_at DESC', [userId]);
        res.json(products);
    } catch (error) {
        next(error);
    }
};

const deleteProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;

        const [result] = await db.query(
            'DELETE FROM products WHERE id = ? AND user_id = ?',
            [id, userId]
        );

        if (result.affectedRows === 0) {
            res.status(404);
            throw new Error('Product not found or you do not have permission to delete it.');
        }

        res.json({ message: 'Product deleted successfully.' });
    } catch (error) {
        next(error);
    }
};

const updateProduct = async (req, res, next) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        const { id } = req.params;
        const { title, description, price, categories, tags } = req.body;
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : req.body.image_url;
        const userId = req.user.userId;

        if (!title || !description || !price) {
            res.status(400);
            throw new Error('All product fields are required.');
        }

        const [result] = await connection.query(
            'UPDATE products SET title = ?, description = ?, price = ?, image_url = ?, tags = ? WHERE id = ? AND user_id = ?',
            [title, description, price, imageUrl, tags || '', id, userId]
        );

        if (result.affectedRows === 0) {
            res.status(404);
            throw new Error('Product not found or you do not have permission to update it.');
        }

        await connection.query('DELETE FROM product_categories WHERE product_id = ?', [id]);
        await processCategories(connection, id, categories);

        await connection.commit();
        res.json({ message: 'Product updated successfully.' });
    } catch (error) {
        await connection.rollback();
        next(error);
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
