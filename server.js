// server.js
// Main backend file for the University Student Marketplace

// --- 1. Imports ---
require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const apiRoutes = require('./routes/api');
require('./config/database'); // Establishes database connection

// --- 2. Setup ---
const app = express();
const PORT = process.env.PORT || 3000;

// --- 3. Middleware ---
app.use(cors()); // Allows requests from your frontend
app.use(bodyParser.json()); // Parses incoming JSON data
app.use(express.static(path.join(__dirname, 'public'))); // Serves static files (HTML, CSS, JS) from the 'public' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- 4. API Routes ---
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
