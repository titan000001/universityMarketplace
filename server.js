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
        origin: process.env.CLIENT_URL || "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true
    }
});

// --- 4. Middleware ---
// Security Headers
app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "cdn.tailwindcss.com", "unpkg.com", "cdn.socket.io", "cdnjs.cloudflare.com", "cdn.jsdelivr.net"],
        imgSrc: ["'self'", "data:", "unpkg.com", "placehold.co", "a.tile.openstreetmap.org", "b.tile.openstreetmap.org", "c.tile.openstreetmap.org"],
        connectSrc: ["'self'", "ws://localhost:3000", "http://localhost:3000", process.env.APP_URL || ""].filter(Boolean),
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
const { saveMessage } = require('./controllers/chatController');

io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
        return next(new Error("Authentication error"));
    }
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return next(new Error("Authentication error"));
        }
        socket.user = decoded;
        next();
    });
});

io.on('connection', (socket) => {
    console.log(`User Connected: ${socket.id}, UserID: ${socket.user.userId}`);

    socket.on('join_room', (data) => {
        // Verify if the user has permission to join this room
        const roomRegex = /^prod-\d+-buy-(\d+)-sell-(\d+)$/;
        const match = data.match(roomRegex);

        let isAuthorized = false;

        if (match) {
            const buyerId = parseInt(match[1]);
            const sellerId = parseInt(match[2]);
            const userId = socket.user.userId;
            const userRole = socket.user.role;

            if (userId === buyerId || userId === sellerId || userRole === 'admin') {
                isAuthorized = true;
            }
        }

        if (socket.user && isAuthorized) {
            socket.join(data);
            console.log(`User with ID: ${socket.id} joined room: ${data}`);
        } else {
            console.log(`User with ID: ${socket.id} denied access to room: ${data}`);
            // Optionally emit an error back to the client
            socket.emit('error', { message: 'Access denied to room.' });
        }
    });

    socket.on('join_notifications', (userId) => {

        if (userId) {
            socket.join(`user_${userId}`);
            console.log(`User ${userId} joined notification channel`);
        }
    });

    socket.on('send_message', async (data) => {
        console.log("Message Sent:", data);

        // Save to database
        if (socket.user && socket.user.userId) {
            await saveMessage(data.room, socket.user.userId, data.message);
        }

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
