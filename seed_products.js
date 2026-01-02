
require('dotenv').config();
const mysql = require('mysql2/promise');

async function seedProducts() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE
    });

    try {
        // 1. Get a user ID
        let [users] = await connection.execute('SELECT id FROM users LIMIT 1');

        if (users.length === 0) {
            console.log('No users found. Creating Admin user...');
            // Insert Admin user (password: 'adminpass') matching database.sql
            await connection.execute(
                "INSERT INTO `users` (`name`, `student_id`, `phone`, `dept`, `password`, `role`) VALUES ('Admin', 'admin', '000-0000', 'System', '$2a$10$E/a3J4E6b.2y.l5eM9Q1d.p2mN3S5n6O.Y.A.3jO2Xv3aB/4.W.O', 'admin')"
            );
            [users] = await connection.execute('SELECT id FROM users LIMIT 1');
        }

        const userId = users[0].id;

        // 2. Clear existing products (optional, for clean demo)
        await connection.execute('DELETE FROM products');
        console.log('Cleared existing products.');

        // 3. Define placeholder products
        const products = [
            {
                title: 'Calculus Textbook',
                description: 'Used calculus textbook in good condition. 8th Edition.',
                price: 45.00,
                // Using placehold.co for reliable, descriptive images
                image_url: 'https://placehold.co/400x300?text=Calculus+Textbook',
                status: 'available'
            },
            {
                title: 'Graphing Calculator',
                description: 'TI-84 Plus, works perfectly. Batteries included.',
                price: 80.00,
                image_url: 'https://placehold.co/400x300?text=Graphing+Calculator',
                status: 'available'
            },
            {
                title: 'Lab Coat',
                description: 'White lab coat, size M. Barely used.',
                price: 15.00,
                image_url: 'https://placehold.co/400x300?text=Lab+Coat',
                status: 'available'
            },
            {
                title: 'Desk Lamp',
                description: 'LED desk lamp with adjustable brightness.',
                price: 20.00,
                image_url: 'https://placehold.co/400x300?text=Desk+Lamp',
                status: 'available'
            },
            {
                title: 'Psychology 101 Notes',
                description: 'Comprehensive handwritten notes for Psych 101.',
                price: 10.00,
                image_url: 'https://placehold.co/400x300?text=Psychology+Notes',
                status: 'available'
            }
        ];

        // 4. Insert products
        console.log(`Seeding ${products.length} products for User ID: ${userId}...`);
        for (const p of products) {
            await connection.execute(
                'INSERT INTO products (user_id, title, description, price, image_url, status) VALUES (?, ?, ?, ?, ?, ?)',
                [userId, p.title, p.description, p.price, p.image_url, p.status]
            );
        }

        console.log('✅  Products seeded successfully!');

    } catch (error) {
        console.error('❌  Seeding failed:', error);
    } finally {
        await connection.end();
    }
}

seedProducts();
