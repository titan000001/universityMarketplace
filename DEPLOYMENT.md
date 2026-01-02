# 🚀 Free Deployment Guide for Beginners

Want to show off your **University Student Marketplace** to friends? This guide uses **Render** (for the app) and **Aiven** (for the database) to host your project for **100% FREE**.

---

## ⚡ Prerequisites
1.  **GitHub Account**: You need to have this code pushed to a GitHub repository.
2.  **No Credit Card Required**: Both services below have free tiers that don't need a card upfront (usually).

---

## 🛠 Step 1: Set up the FREE Database (Aiven)
We need a place to store your users and products. **Aiven** offers a free MySQL database.

1.  **Sign Up**: Go to [Aiven.io](https://aiven.io/) and sign up.
2.  **Create Service**:
    -   Click **"Create Service"**.
    -   Select **MySQL**.
    -   Choose **Free Plan** (often labeled "Free" or "Hobbyist" in a specific region).
    -   Give it a name (e.g., `marketplace-db`).
    -   Click **Create Service**.
3.  **Get Connection Details**:
    -   Once running, look for the **"Service URI"** or **"Connection Information"**.
    -   You need these 4 things:
        -   **Host**: (e.g., `mysql-1234.aivencloud.com`)
        -   **Port**: (e.g., `12345`)
        -   **User**: (e.g., `avnadmin`)
        -   **Password**: (Hidden, click to reveal)
4.  **Create the Tables**:
    -   You need to run the SQL commands to set up the tables.
    -   Use a tool like **DBeaver** (free app) to connect to your new cloud DB using the details above.
    -   Open `database.sql` from your project, copy the content, paste it into DBeaver/SQL tool, and run it.
    -   **Alternatively**: Render (Step 2) can't easily run the initial SQL for you, so connecting via a tool on your PC is the best way to "seed" the database.

---

## ☁️ Step 2: Deploy the App (Render)
Now we put your code online.

1.  **Sign Up**: Go to [Render.com](https://render.com/) and sign up with GitHub.
2.  **New Web Service**:
    -   Click **"New +"** -> **"Web Service"**.
    -   Connect your `universityMarketplace` repository.
3.  **Configure**:
    -   **Name**: `my-uni-market` (or similar)
    -   **Region**: Closest to you.
    -   **Branch**: `main`
    -   **Runtime**: `Node`
    -   **Build Command**: `npm install`
    -   **Start Command**: `npm start`
    -   **Plan**: Select **"Free"**.
4.  **Environment Variables (Crucial!)**:
    -   Scroll down to **"Environment Variables"**.
    -   Add the following keys and values (from Step 1):
        -   `DB_HOST`: Your Aiven Host
        -   `DB_PORT`: Your Aiven Port
        -   `DB_USER`: Your Aiven User
        -   `DB_PASSWORD`: Your Aiven Password
        -   `DB_DATABASE`: `defaultdb` (or whatever Aiven named it)
        -   `JWT_SECRET`: Type any random long word (e.g., `supersecretpizzaparty`)
        -   `NODE_ENV`: `production`
5.  **Deploy**:
    -   Click **"Create Web Service"**.
    -   Wait 2-3 minutes. If successful, you'll see "Live" and a URL (e.g., `https://my-uni-market.onrender.com`).

---

## ⚠️ Important Limitations (Read This!)

### 1. "My images disappeared!"
-   **Why?** Free hosting services (like Render) have an "Ephemeral Filesystem". This means every time you deploy or the server restarts (which happens daily on free plans), **all files uploaded to the `uploads/` folder are deleted**.
-   **Solution**: For a real Startup, you'd use AWS S3 or Cloudinary. For this demo, just know that **images will vanish** after a while. This is normal behavior for free web servers.

### 2. "The site is slow to load."
-   **Why?** The Render Free tier "spins down" after 15 minutes of inactivity.
-   **What happens**: The first time you visit it after a break, it might take **30-60 seconds** to wake up. Just wait!

---

## 🐛 Troubleshooting

-   **"Connection Error"**: Double-check your `DB_PASSWORD` and `DB_HOST` in Render settings.
-   **"Table 'users' doesn't exist"**: You forgot to run the SQL script (Step 1 -> Create the Tables). You must use a tool like **DBeaver** or **MySQL Workbench** to connect to your remote Aiven database and create the tables.

Good luck! 🎓
