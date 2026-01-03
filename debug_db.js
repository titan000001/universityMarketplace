require('dotenv').config();
const mysql = require('mysql2');

console.log('Checking environment variables...');
console.log('DB_HOST:', process.env.DB_HOST || 'UNDEFINED');
console.log('DB_USER:', process.env.DB_USER || 'UNDEFINED');
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '******' : 'UNDEFINED');
console.log('DB_DATABASE:', process.env.DB_DATABASE || 'UNDEFINED');

console.log('Attempting connection...');
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

connection.connect(err => {
    if (err) {
        console.error('Connection failed:', err.message);
    } else {
        console.log('Connection successful!');
        connection.end();
    }
});
