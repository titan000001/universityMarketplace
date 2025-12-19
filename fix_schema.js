
require('dotenv').config();
const mysql = require('mysql2/promise');

async function fixSchema() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE
    });

    // Check/Add columns to users table
    const userColumns = [
        "role VARCHAR(20) DEFAULT 'user'",
        "phone VARCHAR(20)",
        "dept VARCHAR(50)",
        "student_id VARCHAR(20)",
        "bio TEXT",                  // NEW
        "avatar_url VARCHAR(255)",   // NEW
        "social_links TEXT"          // NEW (JSON string)
    ];

    for (const col of userColumns) {
        try {
            console.log(`Adding user ${col.split(' ')[0]}...`);
            await connection.execute(`ALTER TABLE users ADD COLUMN ${col}`);
            console.log(`✅  User column added.`);
        } catch (err) {
            // Ignore duplicate column errors
        }
    }

    // Check/Add columns to products table
    const productColumns = [
        "title VARCHAR(255)",
        "description TEXT",
        "price DECIMAL(10, 2)",
        "image_url VARCHAR(255)",
        "status VARCHAR(20) DEFAULT 'available'",
        "latitude DECIMAL(10, 8)",
        "longitude DECIMAL(11, 8)",
        "location_name VARCHAR(255)",
        "tags TEXT"                  // NEW
    ];
    for (const col of productColumns) {
        try {
            console.log(`Adding product ${col.split(' ')[0]}...`);
            await connection.execute(`ALTER TABLE products ADD COLUMN ${col}`);
            console.log(`✅  Product column added.`);
        } catch (err) {
            // Ignore duplicate column errors
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

    // Create orders table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        total_amount DECIMAL(10, 2) NOT NULL,
        status VARCHAR(20) DEFAULT 'confirmed',
        created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    console.log('✅  Checked/Created orders table.');

    // Create order_items table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT NOT NULL,
        product_id INT NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    console.log('✅  Checked/Created order_items table.');

    await connection.end();
}

fixSchema();
