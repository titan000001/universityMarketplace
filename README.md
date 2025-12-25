# 🎓 University Student Marketplace

**A modern, trusted platform for students to buy, sell, and connect.**

![Banner](public/images/hero-banner.jpg)

## 🚀 Overview
The **University Student Marketplace** is a secure, campus-focused economy. Unlike generic platforms, we prioritize safety and student specific needs—from finding affordable textbooks to selling dorm essentials.

## ✨ Key Features

### 🛒 Commerce
- **Smart Search**: Filter by category, price, or tags (e.g., `#Textbook`).
- **Price Analytics**: Automatically flags "Great Deals" based on market average.
- **Secure Checkout**: "Reserve & Meet" system ensures items aren't sold twice.

### 💬 Social & Identity
- **Real-Time Chat**: Negotiate safely with built-in instant messaging (Socket.io).
- **Verified Profiles**: See seller stats, department, and bio.
- **Wishlist**: Save items for later.

### 📍 Campus Integrated
- **Interactive Maps**: Pinpoint exact meetup locations (Library, Student Center) using Leaflet.js.
- **Department Filters**: Find items relevant to your major.

---

## 🛠 Tech Stack

- **Frontend**: Vanilla JS (ESM), Tailwind CSS, Leaflet.js, Animate.css
- **Backend**: Node.js, Express, Socket.io
- **Database**: MySQL (Transactional Order System)
- **Security**: JWT Auth, BCrypt, Helmet, Rate Limiting

---

## ⚡ Quick Start

### 1. Requirements
- Node.js (v18+)
- MySQL

### 2. Installation
```bash
git clone https://github.com/titan000001/universityMarketplace.git
cd universityMarketplace
npm install
```

### 3. Setup Database
Create a MySQL database named `marketplace`, then run the schema script:
```bash
# Update .env first!
node fix_schema.js
```

### 4. Configure .env
```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_DATABASE=marketplace
JWT_SECRET=secret_key_here
```

### 5. Run
```bash
npm start
```

---

## 📸 Gallery

![Promotional Poster](public/images/poster.png)

*The marketplace home view featuring the new visual identity.*

---

## 📞 Team
- **Titan**
- **Tamim**
- **Sumona**

[Check out the Repository](https://github.com/titan000001/universityMarketplace)
