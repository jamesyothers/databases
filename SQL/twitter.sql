



-- ---
-- Globals
-- ---

-- SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
-- SET FOREIGN_KEY_CHECKS=0;

-- ---
-- Table 'users'
--
-- ---

DROP DATABASE IF EXISTS `twitter`;
CREATE DATABASE twitter;
USE twitter;

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `handle` VARCHAR(10) NOT NULL,
  `password` VARCHAR(15) NOT NULL,
  `created_at` DATETIME NOT NULL,
  PRIMARY KEY (`id`)
);

-- ---
-- Table 'follow'
--
-- ---

DROP TABLE IF EXISTS `follow`;

CREATE TABLE `follow` (
  `from` INTEGER NOT NULL,
  `to` INTEGER NOT NULL,
  PRIMARY KEY (`from`, `to`)
);

-- ---
-- Table 'tweets'
--
-- ---

DROP TABLE IF EXISTS `tweets`;

CREATE TABLE `tweets` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `author` INTEGER NOT NULL,
  `msg` VARCHAR(140) NOT NULL,
  `created_at` DATETIME NOT NULL,
  PRIMARY KEY (`id`)
);

-- ---
-- Foreign Keys
-- ---

ALTER TABLE `follow` ADD FOREIGN KEY (`from`) REFERENCES `users` (`id`);
ALTER TABLE `follow` ADD FOREIGN KEY (`to`) REFERENCES `users` (`id`);
ALTER TABLE `tweets` ADD FOREIGN KEY (`author`) REFERENCES `users` (`id`);

-- ---
-- Table Properties
-- ---

-- ALTER TABLE `users` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `follow` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `tweets` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ---
-- Test Data
-- ---

-- INSERT INTO `users` (`id`,`handle`,`password`,`created_at`) VALUES
-- ('','','','');
-- INSERT INTO `follow` (`from`,`to`) VALUES
-- ('','');
-- INSERT INTO `tweets` (`id`,`author`,`msg`,`created_at`) VALUES
-- ('','','','');

