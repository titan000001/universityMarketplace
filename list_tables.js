
require('dotenv').config();
const mysql = require('mysql2/promise');

async function listTables() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE
    });

    try {
        const [rows] = await connection.execute('SHOW TABLES');
        console.log('Tables in database:', rows.map(r => Object.values(r)[0]));
    } catch (error) {
        console.error(error);
    } finally {
        await connection.end();
    }
}

listTables();
