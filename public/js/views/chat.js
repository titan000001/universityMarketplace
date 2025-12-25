// public/js/views/chat.js
import { apiRequest } from '../services/api.js';

let socket;

const chatView = () => `
    <div class="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden flex flex-col h-[600px] transition-colors duration-200">
        <!-- Header -->
        <div class="bg-indigo-600 p-4 text-white flex justify-between items-center">
            <h2 class="text-xl font-bold"><i class="fas fa-comments mr-2"></i>Chat with Seller</h2>
            <span id="connection-status" class="text-xs bg-indigo-500 px-2 py-1 rounded-full">Connecting...</span>
        </div>

        <!-- Messages Area -->
        <div id="chat-messages" class="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50 dark:bg-gray-900 border-b dark:border-gray-700">
            <!-- Messages will appear here -->
            <div class="text-center text-gray-500 text-sm mt-4">Start of conversation</div>
        </div>

        <!-- Input Area -->
        <form id="chat-form" class="p-4 bg-white dark:bg-gray-800 flex gap-2">
            <input type="text" id="message-input" class="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Type a message..." required autocomplete="off">
            <button type="submit" class="bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-700 transition-colors">
                <i class="fas fa-paper-plane"></i>
            </button>
        </form>
    </div>
`;

const initChat = async (param) => {
    // Param format: productId-sellerId  (e.g., "1-5")
    // Note: Our simple router might pass "1-5" as a single string if we define route as /chat/:params
    // Let's assume the router passes the full string after /chat/

    // Parse params manually if needed, or assume router handles /:p1/:p2
    // For this simple router, let's parse the param string "productId-sellerId"
    const [productId, sellerId] = param.split('-');

    const currentUser = JSON.parse(atob(localStorage.getItem('token').split('.')[1]));
    const buyerId = currentUser.userId;

    // Room ID: unique to this transaction pair
    const room = `prod-${productId}-buy-${buyerId}-sell-${sellerId}`;
    let userName = currentUser.name || "User";

    // Initialize Socket
    if (!socket) {
        socket = io('http://localhost:3000'); // Connect to backend
    }

    const statusEl = document.getElementById('connection-status');
    const messagesEl = document.getElementById('chat-messages');

    // Join Room
    socket.emit('join_room', room);
    statusEl.textContent = 'Connected';
    statusEl.classList.remove('bg-indigo-500');
    statusEl.classList.add('bg-green-500');

    // Listen for messages
    socket.off('receive_message'); // Remove old listeners to prevent duplicates
    socket.on('receive_message', (data) => {
        appendMessage(data, false);
    });

    // Send Message
    document.getElementById('chat-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.getElementById('message-input');
        const message = input.value;

        if (message.trim()) {
            const messageData = {
                room: room,
                author: userName,
                message: message,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };

            socket.emit('send_message', messageData);
            appendMessage(messageData, true); // Show my own message immediately
            input.value = '';
        }
    });

    function appendMessage(data, isOwn) {
        const div = document.createElement('div');
        div.className = `flex ${isOwn ? 'justify-end' : 'justify-start'}`;

        div.innerHTML = `
            <div class="max-w-xs md:max-w-md p-3 rounded-lg ${isOwn ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white dark:bg-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 rounded-bl-none shadow-sm'}">
                ${!isOwn ? `<p class="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">${data.author}</p>` : ''}
                <p>${data.message}</p>
                <p class="text-xs ${isOwn ? 'text-indigo-200' : 'text-gray-400'} text-right mt-1">${data.time}</p>
            </div>
        `;
        messagesEl.appendChild(div);
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }
};

export { chatView, initChat };
