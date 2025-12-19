
require('dotenv').config();
const mysql = require('mysql2/promise');

async function debugQuery() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE
    });

    const query = `
    SELECT p.id, p.title, p.price, p.image_url, u.id AS sellerId, u.name AS sellerName, GROUP_CONCAT(c.name) AS categories
    FROM products p
    JOIN users u ON p.user_id = u.id
    LEFT JOIN product_categories pc ON p.id = pc.product_id
    LEFT JOIN categories c ON pc.category_id = c.id
    GROUP BY p.id ORDER BY p.created_at DESC
  `;

    try {
        const [rows] = await connection.execute(query);
        console.log('✅ Query successful!');
        console.log('Rows returned:', rows.length);
        if (rows.length > 0) console.log(rows[0]);
    } catch (error) {
        console.error('❌ Query failed:', error.message);
        console.error('SQL State:', error.sqlState);
    } finally {
        await connection.end();
    }
}

debugQuery();
