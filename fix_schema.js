
require('dotenv').config();
const mysql = require('mysql2/promise');

async function fixSchema() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE
    });

    const columns = [
        // Users table checks (already ran, but keeping for completeness if re-run)
        { name: 'role', sql: "ALTER TABLE users ADD COLUMN role VARCHAR(50) NOT NULL DEFAULT 'user'" },
        { name: 'phone', sql: "ALTER TABLE users ADD COLUMN phone VARCHAR(20) NOT NULL" },
        { name: 'dept', sql: "ALTER TABLE users ADD COLUMN dept VARCHAR(100) NOT NULL" },
        { name: 'student_id', sql: "ALTER TABLE users ADD COLUMN student_id VARCHAR(100) NOT NULL UNIQUE" },

        // Products table checks
        { name: 'title', sql: "ALTER TABLE products ADD COLUMN title VARCHAR(255) NOT NULL" },
        { name: 'description', sql: "ALTER TABLE products ADD COLUMN description TEXT NOT NULL" },
        { name: 'price', sql: "ALTER TABLE products ADD COLUMN price DECIMAL(10, 2) NOT NULL" },
        { name: 'image_url', sql: "ALTER TABLE products ADD COLUMN image_url VARCHAR(2083) NOT NULL" },
        { name: 'status', sql: "ALTER TABLE products ADD COLUMN status VARCHAR(50) NOT NULL DEFAULT 'available'" }
    ];

    for (const col of columns) {
        try {
            console.log(`Adding ${col.name}...`);
            await connection.execute(col.sql);
            console.log(`✅  ${col.name} added.`);
        } catch (error) {
            if (error.code === 'ER_DUP_FIELDNAME') {
                console.log(`⚠️  ${col.name} already exists.`);
            } else {
                console.error(`❌  Failed to add ${col.name}:`, error.message);
            }
        }
    }

    // Existing column checks...

    // Create missing tables
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    console.log('✅  Checked/Created categories table.');

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS product_categories (
        product_id INT NOT NULL,
        category_id INT NOT NULL,
        PRIMARY KEY (product_id, category_id),
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    console.log('✅  Checked/Created product_categories table.');

    // Insert default categories if empty
    const [cats] = await connection.execute('SELECT COUNT(*) as count FROM categories');
    if (cats[0].count === 0) {
        await connection.execute(`
            INSERT INTO categories (name) VALUES
            ('Textbooks'), ('Electronics'), ('Furniture'), ('Clothing'), ('Other');
        `);
        console.log('✅  Seeded default categories.');
    }

    // Create wishlist table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS wishlist (
        user_id INT NOT NULL,
        product_id INT NOT NULL,
        PRIMARY KEY (user_id, product_id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    console.log('✅  Checked/Created wishlist table.');

    // Create comments table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS comments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_id INT NOT NULL,
        user_id INT NOT NULL,
        comment TEXT NOT NULL,
        created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    console.log('✅  Checked/Created comments table.');

    await connection.end();
}

fixSchema();
