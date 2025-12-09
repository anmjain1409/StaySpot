-- MySQL Database Setup Script for StaySpot Application

-- Create Database
CREATE DATABASE IF NOT EXISTS stayspot_db;
USE stayspot_db;

-- Create Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert Sample Data (Optional)
INSERT INTO users (username, email, password, full_name) VALUES
('demo_user', 'demo@stayspot.com', '$2a$10$Q.9vY1xKq1J1LzK1QyPBGu1R5L2R3S4T5U6V7W8X9Y0Z1A2B3C4D5', 'Demo User');
