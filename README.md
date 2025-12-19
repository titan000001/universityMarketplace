# 🎓 University Student Marketplace

**A modern, feature-rich platform for students to buy, sell, and connect safely.**

<<<<<<< HEAD
# 🎓 University Student Marketplace

**A modern, feature-rich platform for students to buy, sell, and connect safely.**

![Project Banner](public/images/hero-banner.jpg)

### 📢 Promotional Poster
![Poster](public/images/poster.png)
=======
<img width="2848" height="1504" alt="unimarket-poster" src="https://github.com/user-attachments/assets/f4149a78-43a2-4a2d-a822-6fd129613ed2" />

>>>>>>> e90010410e9323d46d1d75a7de1903e1aa05ad18

## 🚀 About The Project
The **University Student Marketplace** is a full-stack web application designed to create a trusted economy within university campuses. Unlike generic marketplaces, this platform focuses on the specific needs of students: finding textbooks, dorm furniture, and electronics quickly, safely, and locally.

built with scalability and performance in mind, using a modular architecture that separates concerns for easier maintenance and future expansion.

---

## ✨ Key Features

### 🛒 Marketplace & Commerce
- **Smart Search & Filters**: Find exactly what you need with category filters and real-time search.
- **Price Analytics**: **"Great Deal"** badges and **"Fair Market Value"** indicators help users make informed decisions based on real-time data.
- **Checkout System**: A complete "Reserve & Meet" flow where orders track transaction history and automatically mark items as sold.
- **Product Tags**: Hash-tagged keywords (e.g., `#Calculus`, `#Dorm`) for better item discovery.

### 👤 Identity & Social
- **Customizable Profiles**: Users can upload avatars, write bios, and link their social media (LinkedIn, GitHub).
- **Real-Time Chat**: **Socket.io** integration allows instant, private communication between buyers and sellers without leaving the app.
- **User Dashboard**: Manage your listings, view order history, and edit your profile.

### 📍 Location & Safety
- **Campus Map Integration**: Sellers can pin specific meetup spots (e.g., "Main Library") on an interactive **Leaflet.js** map.
- **Visual Meetup Points**: Buyers see exactly where to meet on the product detail page.

### 🎨 User Experience
- **Dark Mode**: Fully supported dark/light theme switching for late-night study sessions.
- **Responsive Design**: Optimized for mobile, tablet, and desktop.
- **Wishlist & Cart**: Save items for later or add multiple items to your cart for a bulk checkout.

---

## 🛠 Tech Stack

**Frontend**
- **Vanilla JavaScript (ESM)**: Lightweight, fast, and modular.
- **Tailwind CSS**: Modern utility-first styling for beautiful, responsive UI.
- **Leaflet.js**: Open-source interactive maps.
- **Socket.io Client**: Real-time bidirectional communication.

**Backend**
- **Node.js & Express**: Robust and scalable server-side environment.
- **MySQL**: Relational database for structured data integrity.
- **Socket.io**: WebSocket server for chat functionality.
- **JWT (JSON Web Tokens)**: Stateless, secure authentication.
- **Multer**: Efficient file handling for image uploads.
- **Bcrypt.js**: Security-first password hashing.

---

## ⚙️ Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/en/download/) (v16+ recommended)
- [MySQL Server](https://dev.mysql.com/downloads/mysql/)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/university-marketplace.git
cd university-marketplace
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Database Setup
1. Create a MySQL database named `marketplace`.
2. Run the provided schema script to create tables and seed initial data:
   ```bash
   node fix_schema.js
   ```
   *(This script automatically checks for missing tables and columns and updates them.)*

### 4. Environment Variables
Create a `.env` file in the root directory:
```env
# Server
PORT=3000

# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_DATABASE=marketplace

# Security
JWT_SECRET=your_super_secret_key
```

### 5. Run the Application
```bash
npm start
```
Visit `http://localhost:3000` in your browser.

---

## 🤝 Contributing
Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License
Distributed under the ISC License.

---

## 📞 Contact
Project Maintainer - Titan 
                  - Tamim
                  -Sumona

Project Link: https://github.com/titan000001/universityMarketplace
