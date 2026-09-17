CREATE TABLE IF NOT EXISTS chase_bootleg_receiver_mounts (
    vehicle_key VARCHAR(80) NOT NULL,
    x DOUBLE NOT NULL, y DOUBLE NOT NULL, z DOUBLE NOT NULL,
    rx DOUBLE NOT NULL, ry DOUBLE NOT NULL, rz DOUBLE NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (vehicle_key),
    CONSTRAINT chase_bootleg_mount_receiver FOREIGN KEY (vehicle_key)
        REFERENCES chase_bootleg_receivers (vehicle_key) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
