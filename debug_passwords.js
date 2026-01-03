const mysql = require('mysql2');

const passwords = ['', 'root', 'password', 'admin', '1234', '123456', 'mysql'];

async function testConnection() {
    console.log('Testing common passwords for root user...');

    for (const pass of passwords) {
        console.log(`Trying password: "${pass}"`);
        const connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: pass,
            database: 'marketplace'
        });

        const success = await new Promise(resolve => {
            connection.connect(err => {
                if (err) {
                    // Don't log full error to keep output clean, just code
                    if (err.code === 'ER_ACCESS_DENIED_ERROR') {
                        resolve(false);
                    } else {
                        console.log(`Error: ${err.message}`);
                        resolve(false);
                    }
                } else {
                    console.log(`✅ SUCCESS! Password is: "${pass}"`);
                    connection.end();
                    resolve(true);
                }
            });
        });

        if (success) return;
    }
    console.log('❌ All common passwords failed.');
}

testConnection();
