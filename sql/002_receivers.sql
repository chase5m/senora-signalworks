CREATE TABLE IF NOT EXISTS `chase_bootleg_receivers` (
    `vehicle_key` VARCHAR(80) NOT NULL,
    `framework` VARCHAR(8) NOT NULL,
    `plate` VARCHAR(16) NOT NULL,
    `model` BIGINT NOT NULL,
    `installer` VARCHAR(100) NOT NULL,
    `status` VARCHAR(24) NOT NULL DEFAULT 'prepared',
    `station_id` INT UNSIGNED NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`vehicle_key`),
    KEY `chase_bootleg_receiver_plate` (`plate`),
    CONSTRAINT `chase_bootleg_receiver_station` FOREIGN KEY (`station_id`) REFERENCES `chase_bootleg_stations` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `chase_bootleg_device_orders` (
    `order_key` VARCHAR(80) NOT NULL,
    `actor` VARCHAR(100) NOT NULL,
    `device` VARCHAR(16) NOT NULL,
    `item` VARCHAR(64) NOT NULL,
    `status` VARCHAR(24) NOT NULL DEFAULT 'paid',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`order_key`),
    KEY `chase_bootleg_device_order_actor` (`actor`, `status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
