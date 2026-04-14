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
    role VARCHAR(20) DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Landlord Requests Table
CREATE TABLE IF NOT EXISTS landlord_requests (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    aadhaar VARCHAR(20) NOT NULL,
    contact VARCHAR(15) NOT NULL,
    country_code VARCHAR(5) NOT NULL,
    status VARCHAR(20) DEFAULT 'Pending',
    remark TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Properties Table
CREATE TABLE IF NOT EXISTS properties (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    owner_username VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    address TEXT NOT NULL,
    house_no VARCHAR(50),
    street_no VARCHAR(50),
    rent_price DECIMAL(10,2),
    house_type VARCHAR(50),
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    status VARCHAR(20) DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_owner_username (owner_username),
    INDEX idx_status (status),
    FOREIGN KEY (owner_username) REFERENCES users(username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Property Amenities Table (for list)
CREATE TABLE IF NOT EXISTS property_amenities (
    property_id BIGINT NOT NULL,
    amenity VARCHAR(100) NOT NULL,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
    PRIMARY KEY (property_id, amenity)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    property_id BIGINT NOT NULL,
    landlord_id BIGINT NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING',
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (property_id) REFERENCES properties(id),
    FOREIGN KEY (landlord_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert Sample Data (Optional)
INSERT INTO users (username, email, password, full_name, role) VALUES
('demo_user', 'demo@stayspot.com', '$2a$10$Q.9vY1xKq1J1LzK1QyPBGu1R5L2R3S4T5U6V7W8X9Y0Z1A2B3C4D5', 'Demo User', 'USER'),
('admin', 'admin@stayspot.com', '$2a$10$Q.9vY1xKq1J1LzK1QyPBGu1R5L2R3S4T5U6V7W8X9Y0Z1A2B3C4D5', 'Admin User', 'ADMIN');
