// config/database.js
const mysql = require('mysql2');

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
}).promise();

db.getConnection()
    .then(connection => {
        console.log('✅  MySQL Connection successful!');
        connection.release();
    })
    .catch(err => {
        console.error('❌  MySQL Connection failed:', err.message);
    });

module.exports = db;
