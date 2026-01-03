require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

const run = async () => {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE
    });

    try {
        console.log('🌱 Starting Demo Data Seed...');

        // 1. Ensure Categories Exist
        const categories = [
            'Textbooks', 'Electronics', 'Furniture', 'Clothing', 'Appliances', 'Tickets', 'Other'
        ];

        const catMap = {};
        for (const cat of categories) {
            await connection.execute('INSERT IGNORE INTO categories (name) VALUES (?)', [cat]);
            const [rows] = await connection.execute('SELECT id FROM categories WHERE name = ?', [cat]);
            catMap[cat] = rows[0].id;
        }

        // 2. Create Demo Users
        const users = [
            { name: 'Alice Chen', dept: 'Computer Science', pic: 'https://randomuser.me/api/portraits/women/1.jpg' },
            { name: 'David Smith', dept: 'Business', pic: 'https://randomuser.me/api/portraits/men/2.jpg' },
            { name: 'Sarah Jones', dept: 'Medicine', pic: 'https://randomuser.me/api/portraits/women/3.jpg' },
            { name: 'Michael Brown', dept: 'Engineering', pic: 'https://randomuser.me/api/portraits/men/4.jpg' }
        ];

        const userIds = [];
        const password = await bcrypt.hash('password123', 10);

        for (const u of users) {
            const [rows] = await connection.execute('SELECT id FROM users WHERE student_id = ?', [u.name.replace(' ', '').toLowerCase()]);
            if (rows.length > 0) {
                userIds.push(rows[0].id);
            } else {
                const [res] = await connection.execute(
                    'INSERT INTO users (name, student_id, phone, dept, password, avatar_url) VALUES (?, ?, ?, ?, ?, ?)',
                    [u.name, u.name.replace(' ', '').toLowerCase(), '555-0100', u.dept, password, u.pic]
                );
                userIds.push(res.insertId);
            }
        }

        // 3. Create Demo Products
        const products = [
            {
                title: 'Calculus: Early Transcendentals (8th Ed)',
                description: 'Like new condition, used for MAT101. No markings inside.',
                price: 85.00,
                image_url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80',
                cat: 'Textbooks',
                seller: userIds[0]
            },
            {
                title: 'MacBook Pro 13" (2020)',
                description: 'Great condition, just upgraded. 8GB RAM, 256GB SSD.',
                price: 850.00,
                image_url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca4?auto=format&fit=crop&w=600&q=80',
                cat: 'Electronics',
                seller: userIds[1]
            },
            {
                title: 'Study Desk (White)',
                description: 'Perfect for dorm rooms. Small scratch on the side, barely visible.',
                price: 45.00,
                image_url: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=600&q=80',
                cat: 'Furniture',
                seller: userIds[2]
            },
            {
                title: 'Sony WH-1000XM4 Headphones',
                description: 'Noise cancelling, barely used. Comes with original case.',
                price: 180.00,
                image_url: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=600&q=80',
                cat: 'Electronics',
                seller: userIds[3]
            },
            {
                title: 'Lab Coat (Size M)',
                description: 'Required for Chemistry labs. Clean and verified.',
                price: 15.00,
                image_url: 'https://images.unsplash.com/photo-1584622258957-c331165f1261?auto=format&fit=crop&w=600&q=80',
                cat: 'Clothing',
                seller: userIds[2]
            },
            {
                title: 'Mini Fridge',
                description: 'Keeps drinks cold. Essential for late night study sessions.',
                price: 60.00,
                image_url: 'https://images.unsplash.com/photo-1588820084531-1583d726b219?auto=format&fit=crop&w=600&q=80',
                cat: 'Appliances',
                seller: userIds[3]
            },
            {
                title: 'Introduction to Psychology',
                description: 'Hardcover. Some highlighting in the first few chapters.',
                price: 40.00,
                image_url: 'https://images.unsplash.com/photo-1544716278-e513176f20b5?auto=format&fit=crop&w=600&q=80',
                cat: 'Textbooks',
                seller: userIds[0]
            },
            {
                title: 'Hydro Flask Water Bottle',
                description: '32oz, wide mouth. A few dents but fully functional.',
                price: 20.00,
                image_url: 'https://images.unsplash.com/photo-1602143407151-0111419516eb?auto=format&fit=crop&w=600&q=80',
                cat: 'Other',
                seller: userIds[1]
            },
            {
                title: 'Gaming Monitor 24"',
                description: '144Hz refresh rate. 1080p. Perfect for gaming.',
                price: 120.00,
                image_url: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=600&q=80',
                cat: 'Electronics',
                seller: userIds[3]
            },
            {
                title: 'Concert Ticket - Local Band',
                description: 'One ticket for this Friday at the Student Union.',
                price: 10.00,
                image_url: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&w=600&q=80',
                cat: 'Tickets',
                seller: userIds[0]
            }
        ];

        for (const p of products) {
            const [res] = await connection.execute(
                'INSERT INTO products (title, description, price, image_url, user_id, status, tags) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [p.title, p.description, p.price, p.image_url, p.seller, 'available', 'demo, student, deal']
            );
            const productId = res.insertId;
            const catId = catMap[p.cat];

            if (catId) {
                await connection.execute('INSERT INTO product_categories (product_id, category_id) VALUES (?, ?)', [productId, catId]);
            }
        }

        console.log('✅ Demo data seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
};

run();
