// migrations/add_shops.js
require('dotenv').config();
const db = require('../config/database');

async function migrate() {
    try {
        console.log('Starting migration: Adding Shops...');

        // 1. Create shops table
        await db.query(`
            CREATE TABLE IF NOT EXISTS shops (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                name VARCHAR(255) NOT NULL,
                bio TEXT,
                logo_url VARCHAR(2083),
                banner_url VARCHAR(2083),
                status VARCHAR(50) NOT NULL DEFAULT 'active',
                created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);
        console.log('✅  Shops table created.');

        // 2. Add shop_id to products
        const [columns] = await db.query('SHOW COLUMNS FROM products LIKE "shop_id"');
        if (columns.length === 0) {
            await db.query(`
                ALTER TABLE products 
                ADD COLUMN shop_id INT DEFAULT NULL,
                ADD CONSTRAINT fk_product_shop FOREIGN KEY (shop_id) REFERENCES shops(id) ON DELETE SET NULL;
            `);
            console.log('✅  shop_id column added to products table.');
        } else {
            console.log('ℹ️  shop_id column already exists in products table.');
        }

        console.log('✨  Migration completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌  Migration failed:', error);
        process.exit(1);
    }
}

migrate();
