// controllers/productController.js
const db = require('../config/database');
const { deleteFile } = require('../utils/fileUtils');
const { productSchema } = require('../validators/commonValidator');

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
        if (db.mockMode && db.mockMode()) {
            console.warn('⚠️  Serving MOCK PRODUCTS');
            const mockProducts = [
                { id: 101, title: 'Calculus Early Transcendentals', price: '89.99', image_url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f', sellerId: 1, sellerName: 'Jane Doe', shopName: 'Janes Books', categories: 'Textbooks' },
                { id: 102, title: 'TI-84 Plus CE Color', price: '120.00', image_url: 'https://images.unsplash.com/photo-1587145820266-a5951eebebb1', sellerId: 2, sellerName: 'John Smith', shopName: 'Tech Resale', categories: 'Electronics' },
                { id: 103, title: 'Dorm Fridge (Mini)', price: '45.00', image_url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a', sellerId: 3, sellerName: 'Bob Builder', shopName: null, categories: 'Appliances' }
            ];
            return res.json(mockProducts);
        }

        const { search, category } = req.query;

        let query = `
            SELECT p.id, p.title, p.price, p.image_url, u.id AS sellerId, u.name AS sellerName, s.name AS shopName, s.id AS shopId, GROUP_CONCAT(c.name) AS categories
            FROM products p
            JOIN users u ON p.user_id = u.id
            LEFT JOIN shops s ON p.shop_id = s.id
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
            whereClauses.push(`p.id IN (SELECT product_id FROM product_categories WHERE category_id IN (?))`);
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
        if (db.mockMode && db.mockMode()) {
            console.warn('⚠️  Serving MOCK PRODUCT DETAIL');
            const { id } = req.params;
            // Simple mock detail based on ID or generic
            return res.json({
                id: id,
                title: 'Mock Product Detail',
                description: 'This is a mock description for demonstration purposes because the database is offline.',
                price: '99.99',
                image_url: 'https://placehold.co/600x400',
                sellerId: 1,
                sellerName: 'Mock Seller',
                sellerPhone: '555-0123',
                sellerDept: 'Computer Science',
                categories: 'Textbooks, Electronics',
                averagePrice: 100,
                categoryProductCount: 5,
                tags: 'mock, demo, offline'
            });
        }

        const { id } = req.params;
        const [products] = await db.query(
            `SELECT p.id, p.title, p.description, p.price, p.image_url, p.tags, p.shop_id, u.id AS sellerId, u.name AS sellerName, u.phone AS sellerPhone, u.dept AS sellerDept, s.name AS shopName, GROUP_CONCAT(c.name) AS categories
             FROM products p
             JOIN users u ON p.user_id = u.id
             LEFT JOIN shops s ON p.shop_id = s.id
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
            // Get the first category (primary for comparison)
            const firstCategory = product.categories.split(',')[0].trim();
            const [stats] = await db.query(`
                SELECT AVG(p.price) as avgPrice, COUNT(p.id) as count
                FROM products p
                JOIN product_categories pc ON p.id = pc.product_id
                JOIN categories c ON pc.category_id = c.id
                WHERE c.name = ? AND p.status = 'available'
            `, [firstCategory]);

            if (stats.length > 0 && stats[0].avgPrice !== null) {
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

        const { error } = productSchema.validate(req.body);
        if (error) {
            await connection.rollback();
            return res.status(400).json({ message: error.details[0].message });
        }

        const { title, description, price, categories, location_name, latitude, longitude, tags, shop_id } = req.body;
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';
        const userId = req.user.userId;

        if (!title || !description || !price) {
            res.status(400);
            throw new Error('Title, description, and price are required.');
        }

        const lat = latitude ? parseFloat(latitude) : null;
        const lng = longitude ? parseFloat(longitude) : null;

        // Tag Sanitization (limit length and remove extra spaces)
        let sanitizedTags = '';
        if (tags) {
            sanitizedTags = tags.split(',').map(tag => tag.trim()).filter(tag => tag).join(',').substring(0, 255);
        }

        // Shop Ownership Validation
        if (shop_id) {
            const [shops] = await connection.query('SELECT id FROM shops WHERE id = ? AND user_id = ?', [shop_id, userId]);
            if (shops.length === 0) {
                await connection.rollback();
                return res.status(403).json({ message: 'Invalid shop ID or you do not own this shop.' });
            }
        }

        const [result] = await connection.query(
            'INSERT INTO products (title, description, price, image_url, user_id, latitude, longitude, location_name, tags, shop_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [title, description, price, imageUrl, userId, lat, lng, location_name || '', sanitizedTags, shop_id || null]
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

        const [products] = await db.query(
            'SELECT image_url FROM products WHERE id = ? AND user_id = ?',
            [id, userId]
        );

        if (products.length === 0) {
            return res.status(404).json({ message: 'Product not found or you do not have permission to delete it.' });
        }

        const oldImageUrl = products[0].image_url;

        const [result] = await db.query(
            'DELETE FROM products WHERE id = ? AND user_id = ?',
            [id, userId]
        );

        if (result.affectedRows === 0) {
            res.status(404);
            throw new Error('Product not found or you do not have permission to delete it.');
        }

        if (result.affectedRows > 0 && oldImageUrl) {
            await deleteFile(oldImageUrl);
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
        // Validate req.body. Note: Joi validation might need to handle form-data specificities if numbers come as strings
        // Ideally we validate before transaction but let's keep it here for now

        // For update, we might allow partial updates? But the original code expects all fields.
        // We can reuse productSchema but it requires all fields.
        // Let's assume for now the frontend sends everything or we construct it.
        // Actually, the schema requires title, description, price.

        const { error } = productSchema.validate(req.body);
        if (error) {
            await connection.rollback();
            return res.status(400).json({ message: error.details[0].message });
        }

        const { title, description, price, categories, tags, shop_id } = req.body;
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : req.body.image_url;
        const userId = req.user.userId;

        if (!title || !description || !price) {
            res.status(400);
            throw new Error('All product fields are required.');
        }

        const [existingProducts] = await connection.query(
            'SELECT image_url FROM products WHERE id = ? AND user_id = ?',
            [id, userId]
        );

        if (existingProducts.length === 0) {
            return res.status(404).json({ message: 'Product not found or you do not have permission to update it.' });
        }

        const oldImageUrl = existingProducts[0].image_url;

        // Tag Sanitization
        let sanitizedTags = '';
        if (tags) {
            sanitizedTags = tags.split(',').map(tag => tag.trim()).filter(tag => tag).join(',').substring(0, 255);
        }

        // Shop Ownership Validation
        if (shop_id) {
            const [shops] = await connection.query('SELECT id FROM shops WHERE id = ? AND user_id = ?', [shop_id, userId]);
            if (shops.length === 0) {
                await connection.rollback();
                return res.status(403).json({ message: 'Invalid shop ID or you do not own this shop.' });
            }
        }

        const [result] = await connection.query(
            'UPDATE products SET title = ?, description = ?, price = ?, image_url = ?, tags = ?, shop_id = ? WHERE id = ? AND user_id = ?',
            [title, description, price, imageUrl, sanitizedTags, shop_id || null, id, userId]
        );

        if (result.affectedRows === 0) {
            res.status(404);
            throw new Error('Product not found or you do not have permission to update it.');
        }

        if (result.affectedRows > 0 && req.file && oldImageUrl && oldImageUrl !== imageUrl) {
            await deleteFile(oldImageUrl);
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
