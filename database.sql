-- ============================================================================
-- ROOK WALL STUDIO — ASSIGNMENT VII DATABASE SCHEMA
-- File: database.sql
-- Database: registration_db
-- Table: users
-- Directly importable via phpMyAdmin or MySQL CLI
-- ============================================================================

-- 1. Create Database if not exists
CREATE DATABASE IF NOT EXISTS `registration_db`
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `registration_db`;

-- 2. Drop existing table if needed (clean setup)
DROP TABLE IF EXISTS `users`;

-- 3. Create users Table
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `phone` VARCHAR(20) NOT NULL,
  `dob` DATE NOT NULL,
  `gender` VARCHAR(20) NOT NULL,
  `address` TEXT NOT NULL,
  `course` VARCHAR(100) NOT NULL,
  `profile_pic` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Sample Record for Initial Verification (Optional)
INSERT INTO `users` (`name`, `email`, `phone`, `dob`, `gender`, `address`, `course`, `profile_pic`)
VALUES
('Alexander Cross', 'alexander.cross@rookwallstudio.com', '+91 98765 43210', '1998-05-14', 'Male', '742 Evergreen Terrace, Mumbai Film City, Maharashtra 400065', 'Information Technology', 'default_avatar.png')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);
