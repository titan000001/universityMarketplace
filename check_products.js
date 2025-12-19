
require('dotenv').config();
const mysql = require('mysql2/promise');

async function checkProducts() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE
    });

    const [rows] = await connection.execute('SELECT COUNT(*) as count FROM products');
    console.log(`Product count: ${rows[0].count}`);
    await connection.end();
}

checkProducts().catch(console.error);
