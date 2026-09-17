ALTER TABLE `chase_bootleg_stations` ADD COLUMN IF NOT EXISTS `mode` VARCHAR(16) NOT NULL DEFAULT 'dj';

CREATE TABLE IF NOT EXISTS `chase_bootleg_tracks` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `station_id` INT UNSIGNED NOT NULL,
    `position` INT NOT NULL,
    `provider` VARCHAR(16) NOT NULL,
    `url` VARCHAR(300) NOT NULL,
    `title` VARCHAR(120) NOT NULL,
    `duration` INT UNSIGNED NOT NULL,
    `added_by` VARCHAR(100) NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `chase_bootleg_track_position` (`station_id`, `position`),
    CONSTRAINT `chase_bootleg_track_station` FOREIGN KEY (`station_id`) REFERENCES `chase_bootleg_stations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
