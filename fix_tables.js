require('dotenv').config();
const db = require('./config/database');

const run = async () => {
    try {
        console.log('Creating missing tables...');

        const createReports = `
        CREATE TABLE IF NOT EXISTS reports (
          id INT AUTO_INCREMENT PRIMARY KEY,
          reporter_id INT NOT NULL,
          target_type VARCHAR(50) NOT NULL,
          target_id INT NOT NULL,
          reason TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (reporter_id) REFERENCES users(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `;

        const createMessages = `
        CREATE TABLE IF NOT EXISTS messages (
          id INT AUTO_INCREMENT PRIMARY KEY,
          room_id VARCHAR(255) NOT NULL,
          sender_id INT NOT NULL,
          message TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `;

        await db.query(createReports);
        console.log('✅ Reports table created.');
        await db.query(createMessages);
        console.log('✅ Messages table created.');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating tables:', error);
        process.exit(1);
    }
};

run();
