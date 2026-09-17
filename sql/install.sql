CREATE TABLE IF NOT EXISTS `chase_bootleg_stations` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `owner` VARCHAR(100) NOT NULL,
    `name` VARCHAR(48) NOT NULL,
    `tagline` VARCHAR(100) NOT NULL DEFAULT '',
    `frequency` SMALLINT UNSIGNED NOT NULL,
    `power` VARCHAR(16) NOT NULL DEFAULT 'low',
    `is_public` TINYINT(1) NOT NULL DEFAULT 1,
    `show_title` VARCHAR(64) NOT NULL DEFAULT '',
    `battery` DECIMAL(7,3) NOT NULL DEFAULT 100,
    `balance` BIGINT UNSIGNED NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `chase_bootleg_owner` (`owner`),
    UNIQUE KEY `chase_bootleg_frequency` (`frequency`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `chase_bootleg_crew` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `station_id` INT UNSIGNED NOT NULL,
    `identifier` VARCHAR(100) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `chase_bootleg_station_member` (`station_id`, `identifier`),
    UNIQUE KEY `chase_bootleg_single_crew` (`identifier`),
    CONSTRAINT `chase_bootleg_crew_station` FOREIGN KEY (`station_id`) REFERENCES `chase_bootleg_stations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `chase_bootleg_requests` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `station_id` INT UNSIGNED NOT NULL,
    `sender` VARCHAR(100) NOT NULL,
    `sender_name` VARCHAR(100) NOT NULL,
    `kind` VARCHAR(16) NOT NULL,
    `message` VARCHAR(240) NOT NULL,
    `status` VARCHAR(16) NOT NULL DEFAULT 'pending',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `chase_bootleg_request_station` (`station_id`, `status`, `id`),
    CONSTRAINT `chase_bootleg_request_parent` FOREIGN KEY (`station_id`) REFERENCES `chase_bootleg_stations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `chase_bootleg_ledger` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `station_id` INT UNSIGNED NULL,
    `actor` VARCHAR(100) NOT NULL,
    `kind` VARCHAR(20) NOT NULL,
    `amount` INT UNSIGNED NOT NULL,
    `status` VARCHAR(24) NOT NULL DEFAULT 'prepared',
    `detail` VARCHAR(180) NOT NULL DEFAULT '',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `chase_bootleg_ledger_actor` (`actor`, `status`),
    KEY `chase_bootleg_ledger_station` (`station_id`, `status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
