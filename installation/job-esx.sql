INSERT IGNORE INTO `jobs` (`name`, `label`) VALUES ('signalworks', 'Senora Signalworks');

INSERT INTO `job_grades` (`job_name`, `grade`, `name`, `label`, `salary`, `skin_male`, `skin_female`)
SELECT 'signalworks', 0, 'operator', 'Operator', 0, '{}', '{}'
WHERE NOT EXISTS (SELECT 1 FROM `job_grades` WHERE `job_name` = 'signalworks' AND `grade` = 0);

INSERT INTO `job_grades` (`job_name`, `grade`, `name`, `label`, `salary`, `skin_male`, `skin_female`)
SELECT 'signalworks', 1, 'broadcaster', 'Broadcaster', 0, '{}', '{}'
WHERE NOT EXISTS (SELECT 1 FROM `job_grades` WHERE `job_name` = 'signalworks' AND `grade` = 1);

INSERT INTO `job_grades` (`job_name`, `grade`, `name`, `label`, `salary`, `skin_male`, `skin_female`)
SELECT 'signalworks', 2, 'manager', 'Station Manager', 0, '{}', '{}'
WHERE NOT EXISTS (SELECT 1 FROM `job_grades` WHERE `job_name` = 'signalworks' AND `grade` = 2);
