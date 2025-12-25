# 🚀 Deployment Guide

This guide explains how to deploy your **University Student Marketplace** to the production cloud.

We recommend **Railway** or **Render** because they support both **Node.js** apps and **MySQL** databases easily.

---

## Option 1: Railway (Recommended)
Railway is extremely easy for full-stack apps with databases.

### 1. Prerequisites
- Push your latest code to GitHub.

### 2. Create Project
1.  Log in to [Railway.app](https://railway.app/).
2.  Click **"New Project"** -> **"Deploy from GitHub repo"**.
3.  Select your repository (`universityMarketplace`).

### 3. Add Database
1.  In your project view, click **"New"** -> **"Database"** -> **"MySQL"**.
2.  Railway will create a database and provide variables like `MYSQLHOST`, `MYSQLUSER`, etc.

### 4. Configure Environment Variables
1.  Go to your **Node.js Service** settings -> **Variables**.
2.  Add the variable names your app uses, but map them to Railway's provided values:
    -   `DB_HOST` -> `${MYSQLHOST}`
    -   `DB_USER` -> `${MYSQLUSER}`
    -   `DB_PASSWORD` -> `${MYSQLPASSWORD}`
    -   `DB_DATABASE` -> `${MYSQLDATABASE}`
    -   `DB_PORT` -> `${MYSQLPORT}`
    -   `JWT_SECRET` -> (Generate a random string)
    -   `PORT` -> `3000` (or leave empty, Railway sets this automatically)

### 5. Deployment
- Railway automatically builds and deploys when you verify the settings.
- Once green, your app is live!

---

## Option 2: Render
Render is another great option with a free tier.

### 1. Database
1.  Log in to [Render.com](https://render.com/).
2.  Click **"New +"** -> **"MySQL"**.
3.  Name it (e.g., `marketplace-db`) and create it.
4.  Copy the **"Internal Cloud URL"** or individual connection details.

### 2. Web Service
1.  Click **"New +"** -> **"Web Service"**.
2.  Connect your GitHub repo.
3.  Settings:
    -   **Environment**: `Node`
    -   **Build Command**: `npm install`
    -   **Start Command**: `npm start`
4.  **Environment Variables** (Advanced):
    -   Add `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_DATABASE`, `JWT_SECRET`.

---

## ⚠️ Important Production Notes

1.  **CORS & CSP**:
    -   In `server.js`, update the `connectSrc` in Helmet and `cors` origin to match your **actual production domain** (e.g., `https://my-uni-market.railway.app`) instead of `localhost`.
    -   Currently, they are set to allow `*` or `localhost`, which is fine for testing but should be locked down.

2.  **Database Migration**:
    -   When you first deploy, your cloud database will be empty.
    -   You may need to run your SQL scripts (like the contents of `fix_schema.js` or a raw SQL dump) to create tables.
    -   **Tip**: You can often connect to your cloud DB using a tool like **DBeaver** or **TablePlus** and run your `CREATE TABLE` scripts there.

3.  **File Uploads**:
    -   This app stores images in the local `uploads/` folder.
    -   **Warning**: On Railway/Render (and Heroku), the filesystem is *ephemeral*. This means uploaded images will **disappear** when the server restarts.
    -   **Solution**: For a real production app, you should integrate **Cloudinary** or **AWS S3** for image storage.
