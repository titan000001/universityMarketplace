// config/database.js
const mysql = require('mysql2');

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
}).promise();

let mockMode = false;

db.getConnection()
    .then(connection => {
        console.log('✅  MySQL Connection successful!');
        connection.release();
    })
    .catch(err => {
        console.error('❌  MySQL Connection failed:', err.message);
        console.warn('⚠️  Switching to MOCK MODE. Data will be served from local fallbacks.');
        mockMode = true;
    });

// Attach the flag to the pool object for easy access
db.mockMode = () => mockMode;

module.exports = db;
