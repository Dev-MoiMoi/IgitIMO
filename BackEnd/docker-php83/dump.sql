-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: db
-- Generation Time: Dec 04, 2025 at 10:33 AM
-- Server version: 8.0.43
-- PHP Version: 8.3.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `pastry_ecommerce`
--

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `carts`
--

CREATE TABLE `carts` (
  `id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `product_id` bigint UNSIGNED NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int UNSIGNED NOT NULL,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '2025_11_25_124612_create_users_table', 1),
(2, '2025_11_25_124920_create_products_table', 1),
(3, '2025_11_25_124930_create_carts_table', 1),
(4, '2025_11_25_124935_create_user_addresses_table', 1),
(5, '2025_11_25_124940_create_orders_table', 1),
(6, '2025_11_25_124951_create_order_items_table', 1),
(7, '2025_11_25_130128_create_sessions_table', 1),
(8, '2025_11_25_130412_create_cache_table', 1);

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `user_address_id` bigint UNSIGNED DEFAULT NULL,
  `total` decimal(10,2) NOT NULL DEFAULT '0.00',
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `full_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `user_address_id`, `total`, `status`, `full_name`, `phone_number`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 4491.00, 'pending', 'qwe', 'qwe', '2025-12-04 08:43:51', '2025-12-04 08:43:51'),
(2, 1, 1, 2495.00, 'pending', 'qwe', 'qwe', '2025-12-04 08:51:07', '2025-12-04 08:51:07'),
(3, 1, 1, 2495.00, 'pending', 'qwe', 'qwe', '2025-12-04 09:04:03', '2025-12-04 09:04:03');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` bigint UNSIGNED NOT NULL,
  `order_id` bigint UNSIGNED NOT NULL,
  `product_id` bigint UNSIGNED NOT NULL,
  `quantity` int NOT NULL,
  `price_each` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `quantity`, `price_each`, `created_at`, `updated_at`) VALUES
(1, 1, 2, 9, 499.00, '2025-12-04 08:43:51', '2025-12-04 08:43:51'),
(2, 2, 10, 2, 499.00, '2025-12-04 08:51:07', '2025-12-04 08:51:07'),
(3, 2, 14, 3, 499.00, '2025-12-04 08:51:07', '2025-12-04 08:51:07'),
(4, 3, 9, 2, 499.00, '2025-12-04 09:04:03', '2025-12-04 09:04:03'),
(5, 3, 14, 3, 499.00, '2025-12-04 09:04:03', '2025-12-04 09:04:03');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `quantity` int NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `image`, `description`, `quantity`, `price`, `created_at`, `updated_at`) VALUES
(1, 'Piece-of-Cake', 'Products/Piece of cake.png', '[NEW FLAVOR]Everything is easy when you have the cake they want', 5, 499.00, '2025-12-04 01:44:46', '2025-12-04 01:44:46'),
(2, 'Freaky Cake', 'Products/Freaky cake.png', '[NEW FLAVOR]You got the freak, I got the freak, we all got the freak.', 3, 499.00, '2025-12-04 01:44:46', '2025-12-04 01:44:46'),
(3, 'Cake of Melancholia', 'Products/Cake of Melancholia.png', '[NEW FLAVOR]You know what\'s gonna happen...', 8, 999.00, '2025-12-04 01:44:46', '2025-12-04 01:44:46'),
(4, 'Mushroom Delight', 'Products/Mushroom Delight.png', '[NEW FLAVOR]Earthy and sweet.', 2, 499.00, '2025-12-04 01:44:46', '2025-12-04 01:44:46'),
(5, 'Watermelon Zest', 'Products/Watermelon Zest.png', 'Fresh and tangy.', 10, 499.00, '2025-12-04 01:44:46', '2025-12-04 01:44:46'),
(6, 'Black Forest Cake', 'Products/Black Forest Cake.png', 'Classic Black Forest with cherries and chocolate.', 6, 999.00, '2025-12-04 01:44:46', '2025-12-04 01:44:46'),
(7, 'Carrot Cake', 'Products/Carrot Cake.png', 'Moist carrot cake with cream cheese frosting.', 4, 999.00, '2025-12-04 01:44:46', '2025-12-04 01:44:46'),
(8, 'Coffee Cake', 'Products/Coffe Cake.png', 'Warm coffee flavor with crumb topping.', 7, 499.00, '2025-12-04 01:44:46', '2025-12-04 01:44:46'),
(9, 'Hair Themed Cake', 'Products/Hair Themed Cake.png', 'Novelty hair-themed design for stylists.', 2, 499.00, '2025-12-04 01:44:46', '2025-12-04 01:44:46'),
(10, 'Heart Cake', 'Products/Heart Cake.png', 'Perfect for romantic occasions.', 5, 499.00, '2025-12-04 01:44:46', '2025-12-04 01:44:46'),
(11, 'Hotdog Cake', 'Products/Hotdog Cake.png', 'Savory-styled cake shaped like a hotdog (sweet inside).', 1, 999.00, '2025-12-04 01:44:46', '2025-12-04 01:44:46'),
(12, 'IGIT Cake', 'Products/IGIT Cake.png', 'Signature IGIT cake.', 3, 499.00, '2025-12-04 01:44:46', '2025-12-04 01:44:46'),
(13, 'Lemon Poppy Cake', 'Products/Lemon Poppy Cake.png', 'Citrus lemon cake with poppy seeds.', 6, 499.00, '2025-12-04 01:44:46', '2025-12-04 01:44:46'),
(14, 'Pickle Drizzle', 'Products/Pickle Drizzle.png', 'Bold and experimental pickle-drizzle cake.', 2, 499.00, '2025-12-04 01:44:46', '2025-12-04 01:44:46'),
(15, 'Red Velvet Cake', 'Products/Red Velvet Cake.png', 'Classic red velvet with cream cheese.', 8, 499.00, '2025-12-04 01:44:46', '2025-12-04 01:44:46'),
(16, 'Terrarium Cake', 'Products/Terrarium Cake.png', 'Decorative terrarium-style cake.', 2, 499.00, '2025-12-04 01:44:46', '2025-12-04 01:44:46'),
(17, 'Three Layer Chocolate Cake', 'Products/Three Layer Chocolate Cake.png', 'Decadent three-layer chocolate.', 9, 999.00, '2025-12-04 01:44:46', '2025-12-04 01:44:46'),
(18, 'Tripo Cake', 'Products/Tripo Cake.png', 'Triple-texture tripo cake.', 4, 499.00, '2025-12-04 01:44:46', '2025-12-04 01:44:46'),
(19, 'Urchin Cake', 'Products/Urchin Cake.png', 'Artful urchin-inspired design.', 1, 999.00, '2025-12-04 01:44:46', '2025-12-04 01:44:46'),
(20, 'Arachnid Cake', 'Products/Arachnid Cake.png', 'Halloween arachnid themed cake.', 2, 999.00, '2025-12-04 01:44:46', '2025-12-04 01:44:46');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint UNSIGNED NOT NULL,
  `username` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `full_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` enum('user','admin') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'user',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `full_name`, `phone_number`, `role`, `created_at`, `updated_at`) VALUES
(1, 'qwe', NULL, '$2y$12$JoQlszZBc/xih.z7J.wPde5AsXRd8OFAm4TKGwD9hZ0fbUj3.vMYu', 'qwe', 'qwe', 'user', '2025-12-04 01:46:34', '2025-12-04 01:46:34'),
(2, 'admin', 'admin@example.com', '$2y$12$5syYoy6o5xp3wkhdhhMSfulJPY/JnBnd2XCvGnnt1MyosnQIMQ8iy', 'System Administrator', '0000000000', 'admin', '2025-12-04 08:59:29', '2025-12-04 08:59:29');

-- --------------------------------------------------------

--
-- Table structure for table `user_addresses`
--

CREATE TABLE `user_addresses` (
  `id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `region` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `province` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `city` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `barangay` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `postal_code` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `street_building_house` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `label` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'home',
  `is_default` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user_addresses`
--

INSERT INTO `user_addresses` (`id`, `user_id`, `region`, `province`, `city`, `barangay`, `postal_code`, `street_building_house`, `label`, `is_default`, `created_at`, `updated_at`) VALUES
(1, 1, 'qwe', 'qwe', 'qwe', 'qwe', 'qwe', 'qwe', 'Home', 0, '2025-12-04 01:46:34', '2025-12-04 09:04:03');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `carts`
--
ALTER TABLE `carts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `carts_user_id_foreign` (`user_id`),
  ADD KEY `carts_product_id_foreign` (`product_id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `orders_user_id_foreign` (`user_id`),
  ADD KEY `orders_user_address_id_foreign` (`user_address_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_items_order_id_foreign` (`order_id`),
  ADD KEY `order_items_product_id_foreign` (`product_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_username_unique` (`username`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- Indexes for table `user_addresses`
--
ALTER TABLE `user_addresses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_addresses_user_id_foreign` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `carts`
--
ALTER TABLE `carts`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `user_addresses`
--
ALTER TABLE `user_addresses`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `carts`
--
ALTER TABLE `carts`
  ADD CONSTRAINT `carts_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `carts_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_user_address_id_foreign` FOREIGN KEY (`user_address_id`) REFERENCES `user_addresses` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `orders_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_addresses`
--
ALTER TABLE `user_addresses`
  ADD CONSTRAINT `user_addresses_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
