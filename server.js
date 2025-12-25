// server.js
// Main backend file for the University Student Marketplace

// --- 1. Imports ---
require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
const path = require('path');
const apiRoutes = require('./routes/api');
require('./config/database'); // Establishes database connection

// --- 2. Setup ---
const app = express();
const http = require('http'); // Import http module
const { Server } = require("socket.io"); // Import Server from socket.io

// --- 3. Setup ---
const PORT = process.env.PORT || 3000;
const server = http.createServer(app); // Create HTTP server
const io = new Server(server, { // Initialize Socket.io
    cors: {
        origin: "*", // In production, replace with your client URL
        methods: ["GET", "POST"]
    }
});

// --- 4. Middleware ---
// Security Headers
app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "cdn.tailwindcss.com", "unpkg.com", "cdn.socket.io", "cdnjs.cloudflare.com", "cdn.jsdelivr.net"],
        imgSrc: ["'self'", "data:", "unpkg.com", "placehold.co", "a.tile.openstreetmap.org", "b.tile.openstreetmap.org", "c.tile.openstreetmap.org"],
        connectSrc: ["'self'", "ws://localhost:3000", "http://localhost:3000"], // Adjust for production
    },
}));

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // Limit each IP to 1000 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

app.use(cors()); // Allows requests from your frontend
app.use(bodyParser.json()); // Parses incoming JSON data
app.use(express.static(path.join(__dirname, 'public'))); // Serves static files (HTML, CSS, JS) from the 'public' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- 5. API Routes ---
app.use('/api', apiRoutes);

// --- 5. Socket.IO Logic ---
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

io.on('connection', (socket) => {
    // Note: In a production environment, you should use socket.io middleware for this:
    // io.use((socket, next) => { ... verify token ... })

    console.log(`User Connected: ${socket.id}`);

    socket.on('join_room', (data) => {
        // SECURITY TODO: Verify if the user has permission to join this room
        // (e.g., check if they are the buyer or seller for this product/order)
        socket.join(data);
        console.log(`User with ID: ${socket.id} joined room: ${data}`);
    });

    socket.on('join_notifications', (userId) => {

        if (userId) {
            socket.join(`user_${userId}`);
            console.log(`User ${userId} joined notification channel`);
        }
    });

    socket.on('send_message', (data) => {
        console.log("Message Sent:", data);
        socket.to(data.room).emit('receive_message', data);
    });

    socket.on('disconnect', () => {
        console.log('User Disconnected', socket.id);
    });
});

// --- 6. Fallback Route ---
// This ensures that any direct navigation to frontend routes (e.g., /login, /profile) are handled by serving the index.html.
// The frontend router will then display the correct page.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// --- 7. Start Server ---
if (require.main === module) {
    server.listen(PORT, () => {
        console.log(`✅  Server is running on http://localhost:${PORT}`);
    });
}

module.exports = app;
