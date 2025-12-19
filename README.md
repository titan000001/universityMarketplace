# University Student Marketplace

A full-stack web application that provides a marketplace for university students to buy and sell used goods. This project is built with a modular and scalable architecture, making it a great foundation for a real-world application.

## Features

-   **User Authentication:** Secure user registration and login with JWT-based authentication.
-   **Product Listings:** Users can create, edit, and delete their own product listings.
-   **Image Uploads:** A file upload system for product images.
-   **Admin Role:** An admin role with a dashboard to manage users.
-   **Search and Filtering:** A search bar to find products by title and a filter to browse by category.
-   **User Profiles:** Public user profiles to display all items a user is selling.
-   **Modular Backend:** The backend is structured with controllers, routes, and middleware for easy maintenance and scalability.
-   **Modular Frontend:** The frontend is organized into views, services, and a router, making it easy to add new features.

## Tech Stack

-   **Frontend:** Vanilla JavaScript (ESM), Tailwind CSS
--   **Backend:** Node.js, Express.js
-   **Database:** MySQL
-   **Authentication:** JSON Web Tokens (JWT)
-   **Image Uploads:** Multer

---

## Prerequisites

Before you begin, ensure you have the following installed on your system:

-   [Node.js](https://nodejs.org/en/download/) (LTS version recommended)
-   [MySQL](https://dev.mysql.com/downloads/mysql/)

---

## Installation and Setup

Follow these steps to get the project running on your local machine.

### 1. Clone the Repository

```sh
git clone <your-repository-url>
cd <repository-folder>
```

### 2. Install Dependencies

Install the required npm packages for the backend:

```sh
npm install
```

### 3. Set Up the Database

1.  **Start MySQL:** Ensure your MySQL server is running.
2.  **Create the Database:** Open your MySQL client and run the following command:
    ```sql
    CREATE DATABASE marketplace;
    ```
3.  **Import the Schema and Data:** Use the provided `database.sql` file to create the tables and insert the sample admin user and categories.
    ```sql
    -- In your MySQL client, while connected to the 'marketplace' database:
    SOURCE /path/to/your/project/database.sql;
    ```

### 4. Configure Environment Variables

1.  **Create a `.env` file:** In the root of the project, create a new file named `.env`.
2.  **Add Configuration:** Copy the contents of `.env.example` (or the block below) into your new `.env` file and update the values to match your local setup.

    ```env
    # .env

    # --- Server Configuration ---
    PORT=3000

    # --- JWT Configuration ---
    JWT_SECRET='your_super_secret_jwt_key_change_this'

    # --- MySQL Database Configuration ---
    DB_HOST='localhost'
    DB_USER='root'
    DB_PASSWORD='your_mysql_password'
    DB_DATABASE='marketplace'
    ```

---

## Running the Application

1.  **Start the Backend Server:**
    ```sh
    npm start
    ```
    You should see a confirmation that the server is running on `http://localhost:3000`.

2.  **Access the Frontend:**
    Open your web browser and navigate to [http://localhost:3000](http://localhost:3000).

The application should now be fully functional. You can log in with the default admin credentials:
-   **Student ID:** `admin`
-   **Password:** `adminpass`

---

## Project Structure

```
.
├── config/                # Database configuration
├── controllers/           # Backend route logic
├── middleware/            # Custom Express middleware
├── public/                # Frontend files
│   ├── js/
│   │   ├── services/      # API service
│   │   ├── views/         # Frontend view templates and logic
│   │   ├── app.js         # Main frontend entry point
│   │   └── router.js      # Frontend router
│   └── index.html         # Main HTML file
├── routes/                # API routes
├── uploads/               # Directory for user-uploaded images
├── validators/            # Joi validation schemas
├── .env                   # Environment variables (ignored by git)
├── .gitignore             # Git ignore file
├── database.sql           # MySQL database schema and sample data
├── package.json           # Project metadata and dependencies
└── server.js              # Main backend Express server file
```
