-- This script creates the database schema for the University Student Marketplace.
-- To use this file, run the following command in your MySQL shell:
-- SOURCE path/to/database.sql;

CREATE DATABASE IF NOT EXISTS marketplace;

USE marketplace;

-- Users table to store student information
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `student_id` VARCHAR(100) NOT NULL UNIQUE,
  `phone` VARCHAR(20) NOT NULL,
  `dept` VARCHAR(100) NOT NULL,
  `password` VARCHAR(255) NOT NULL COMMENT 'Stores hashed password',
  `role` VARCHAR(50) NOT NULL DEFAULT 'user'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Products table to store items for sale
CREATE TABLE IF NOT EXISTS `products` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `price` DECIMAL(10, 2) NOT NULL,
  `image_url` VARCHAR(2083) NOT NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'available',
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Categories table for products
CREATE TABLE IF NOT EXISTS `categories` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Product_categories table to link products and categories (many-to-many)
CREATE TABLE IF NOT EXISTS `product_categories` (
  `product_id` INT NOT NULL,
  `category_id` INT NOT NULL,
  PRIMARY KEY (`product_id`, `category_id`),
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert an admin user
INSERT INTO `users` (`name`, `student_id`, `phone`, `dept`, `password`, `role`)
VALUES ('Admin', 'admin', '000-0000', 'System', '$2a$10$E/a3J4E6b.2y.l5eM9Q1d.p2mN3S5n6O.Y.A.3jO2Xv3aB/4.W.O', 'admin'); -- password is 'adminpass'

-- Insert some sample categories
INSERT INTO `categories` (`name`) VALUES
('Textbooks'),
('Electronics'),
('Furniture'),
('Clothing'),
('Other');

-- Wishlist table to store user's favorite products
CREATE TABLE IF NOT EXISTS `wishlist` (
  `user_id` INT NOT NULL,
  `product_id` INT NOT NULL,
  PRIMARY KEY (`user_id`, `product_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Comments table for products
CREATE TABLE IF NOT EXISTS `comments` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `product_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `comment` TEXT NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/* 
  Sample Data (Optional - for testing)

  -- Insert a sample user
  -- Note: The password 'password123' is shown here for demonstration.
  -- In the application, this will be a securely hashed password.
  INSERT INTO `users` (`name`, `student_id`, `phone`, `dept`, `password`) 
  VALUES ('John Doe', '12345', '555-1234', 'Computer Science', '$2a$10$example.hashed.password');

  -- Insert a sample product listed by the sample user
  INSERT INTO `products` (`user_id`, `title`, `description`, `price`, `image_url`)
  VALUES (1, 'Used Calculus Textbook', 'Great condition, minimal highlighting.', 45.50, 'https://via.placeholder.com/150');
*/
