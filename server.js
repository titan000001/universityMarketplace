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
        scriptSrc: ["'self'", "'unsafe-inline'", "cdn.tailwindcss.com", "unpkg.com", "cdn.socket.io", "cdnjs.cloudflare.com"],
        imgSrc: ["'self'", "data:", "unpkg.com", "a.tile.openstreetmap.org", "b.tile.openstreetmap.org", "c.tile.openstreetmap.org"],
        connectSrc: ["'self'", "ws://localhost:3000", "http://localhost:3000"], // Adjust for production
    },
}));

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

app.use(cors()); // Allows requests from your frontend
app.use(bodyParser.json()); // Parses incoming JSON data
app.use(express.static(path.join(__dirname, 'public'))); // Serves static files (HTML, CSS, JS) from the 'public' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- 5. API Routes ---
app.use('/api', apiRoutes);

// --- 5. Socket.IO Logic ---
io.on('connection', (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on('join_room', (data) => {
        socket.join(data);
        console.log(`User with ID: ${socket.id} joined room: ${data}`);
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
server.listen(PORT, () => { // Listen with the http server, not the express app
    console.log(`✅  Server is running on http://localhost:${PORT}`);
});
