# University Student Marketplace - Comprehensive Project Guide

This document serves as the "Source of Truth" for the University Student Marketplace project. It details the architecture, feature-to-code mapping, and core logic flows, allowing anyone to understand the entire system without prior knowledge.

---

## 1. Project Overview

**University Student Marketplace** is a web-based platform designed for university students to buy and sell used items (textbooks, electronics, etc.). It features user accounts, student-run shops, product listings, real-time chat between buyers and sellers, and an administrative focus.

### Technology Stack
- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Frontend**: Vanilla JavaScript (SPA Architecture), Tailwind CSS
- **Real-time**: Socket.IO
- **Security**: Helmet, Rate Limiting, JWT (JSON Web Tokens), bcryptjs

---

## 2. System Architecture

### 2.1 Backend Structure
The backend is built with Express.js and follows the MVC (Model-View-Controller) pattern (though "Views" are client-side).

- **Entry Point**: `server.js`
  - Initializes Express app and HTTP server.
  - Configures middleware (CORS, Helmet, Rate Limit).
  - Sets up Socket.IO for real-time chat.
  - Mounts API routes at `/api`.
  - Serves static frontend files from `public/`.
- **Configuration**: `config/database.js` handles MySQL connection pooling.
- **Routes**: `routes/api.js` is the main aggregator. It delegates to specific route files (e.g., `user.js`, `product.js`) which define endpoints like `GET /products` or `POST /login`.
- **Controllers**: Located in `controllers/`. These contain the business logic. They receive requests, interact with the database, and send responses.
  - Example: `productController.js` handles fetching, creating, and deleting products.

### 2.2 Frontend Structure
The frontend is a **Single Page Application (SPA)** built without a framework (like React or Vue), using raw JavaScript modules.

- **Shell**: `public/index.html` contains the base layout (Navbar, Footer, `#main-content` div).
- **Core Logic**:
  - `public/js/app.js`: Application entry point. Handles global state (Dark Mode, Navbar updates, Socket connection).
  - `public/js/router.js`: Handles client-side routing. Maps URL hashes (e.g., `#/login`) to specific **Views**.
- **Views**: Located in `public/js/views/`. Each file (e.g., `home.js`, `login.js`) exports:
  - `view(params)`: Returns the HTML string for that page.
  - `init(params)`: Runs JavaScript logic (event listeners, data fetching) after the HTML is injected.
- **Services**: `public/js/services/api.js` is a wrapper for `fetch` that handles Authorization headers and error parsing.

### 2.3 Database Schema
The database (`marketplace`) consists of several relational tables:

- **users**: Stores student accounts, roles (user/admin), and hashed passwords.
- **shops**: Allows users to create "storefronts". Links to `users`.
- **products**: Items listed for sale. Linked to `users` and optionally `shops`.
- **carts** & **cart_items**: Manages temporary shopping lists.
- **orders**: Records completed transactions.
- **messages**: Stores chat history for specific negotiation rooms.
- **notifications**: System alerts for users.
- **reviews**: User-to-user ratings.

---

## 3. Feature & Code Mapping

This section maps user-facing features to the specific files that implement them.

| Feature | Description | Backend Files | Frontend Files |
| :--- | :--- | :--- | :--- |
| **Authentication** | Register/Login, JWT generation. | `controllers/authController.js`<br>`routes/api.js` | `js/views/login.js`<br>`js/views/register.js` |
| **Products** | Browsing, searching, and viewing details. | `controllers/productController.js`<br>`routes/product.js` | `js/views/home.js`<br>`js/views/product-detail.js` |
| **Selling** | Listing new items, image upload. | `controllers/productController.js`<br>`middleware/uploadMiddleware.js` | `js/views/sell.js`<br>`js/views/my-products.js` |
| **Shops** | User-created storefronts. | `controllers/shopController.js` | `js/views/shopsView.js`<br>`js/views/shopProfileView.js` |
| **Cart** | Adding items, viewing cart. | `controllers/cartController.js` | `js/views/cart.js`<br>`js/services/cart.js` |
| **Checkout & Orders** | Placing orders, viewing order history. | `controllers/orderController.js` | `js/views/checkout.js`<br>`js/views/orders.js` |
| **Chat** | Real-time messaging between users. | `controllers/chatController.js`<br>`server.js` (Socket Logic) | `js/views/chat.js`<br>`js/app.js` (Socket Client) |
| **Admin** | Dashboard to manage users/products. | `controllers/adminController.js` | `js/views/adminView.js` |

---

## 4. Key Logic Flows

### 4.1 User Authentication Flow
1.  **User Input**: User enters credentials on `login.js`.
2.  **API Call**: `apiRequest('/login', 'POST', { student_id, password })` sends data to backend.
3.  **Backend Verification** (`authController.js`):
    -   Queries `users` table by `student_id`.
    -   Compares hashed password using `bcrypt.compare()`.
4.  **Token Generation**: If valid, generates a **JWT** containing `userId`, `role`, and `name`.
5.  **Response**: Sends token to client.
6.  **Client Storage**: `login.js` stores token in `localStorage`.
7.  **Redirect**: Router navigates to `#/`. `app.js` detects login and updates Navbar.

### 4.2 Real-time Chat Flow
1.  **Initiation**: User clicks "Chat with Seller" on a product page.
2.  **Routing**: Navigates to `#/chat/prod-{pid}-buy-{bid}-sell-{sid}`.
3.  **Room Connection**:
    -   `chat.js` emits `join_room` event via Socket.IO.
    -   `server.js` validates user permission (Must be buyer, seller, or admin) and joins the socket to the room.
4.  **Messaging**:
    -   User types message and hits send.
    -   `chat.js` emits `send_message`.
    -   `server.js` receives event -> calls `chatController.saveMessage` (persists to DB) -> broadcasts `receive_message` to the room.
5.  **Receiving**: Other user in the room receives `receive_message` event and DOM is updated.

### 4.3 Detailed Product Creation Flow
1.  **Form**: User fills out details in `sell.js`. Image is selected.
2.  **Upload**: `FormData` object constructs the payload (multipart/form-data).
3.  **Middleware** (`uploadMiddleware.js`): Intercepts request, saves file to `uploads/` directory, attaches `req.file` info.
4.  **Controller** (`productController.js`):
    -   Reads text fields from `req.body`.
    -   Constructs image URL from `req.file.filename`.
    -   Inserts record into `products` table.
5.  **Success**: Returns 201 Created. Client redirects to **My Products**.

---

## 5. Security & Best Practices
- **Password Safety**: Passwords are never stored in plain text. They are salted and hashed using `bcryptjs`.
- **API Protection**:
    -   `express-rate-limit`: Prevents brute-force attacks (limited to 1000 reqs/15min).
    -   `helmet`: Sets secure HTTP headers (including Content Security Policy).
- **Authorization**:
    -   `verifyToken` (middleware/authMiddleware.js): Checks for valid JWT in `Authorization` header before allowing access to protected routes (e.g., selling, checkout).
    -   Backend checks resource ownership (e.g., you can't delete someone else's product).

---

## 6. How to Run & Maintain
- **Start Server**: `npm start` (Runs `node server.js`).
- **Database**: Ensure MySQL is running and `database.sql` has been imported.
- **Environment**: `PORT`, `DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME`, `JWT_SECRET` must be set in `.env`.
