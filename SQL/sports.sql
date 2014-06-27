

DROP DATABASE IF EXISTS `sports`;
CREATE DATABASE sports;
USE sports;


-- ---
-- Globals
-- ---

-- SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
-- SET FOREIGN_KEY_CHECKS=0;

-- ---
-- Table 'player'
--
-- ---

DROP TABLE IF EXISTS `player`;

CREATE TABLE `player` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL,
  `age` INTEGER(100) NOT NULL,
  `weight` INTEGER NOT NULL,
  `experience` INTEGER(100) NOT NULL,
  `team` INTEGER NOT NULL,
  PRIMARY KEY (`id`)
);

-- ---
-- Table 'team'
--
-- ---

DROP TABLE IF EXISTS `team`;

CREATE TABLE `team` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(20) NOT NULL,
  `mascot` VARCHAR(50) NULL,
  PRIMARY KEY (`id`)
);

-- ---
-- Table 'games'
--
-- ---

DROP TABLE IF EXISTS `games`;

CREATE TABLE `games` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `status` ENUM('scheduled', 'in progress', 'completed') NOT NULL,
  `start_time` DATETIME NOT NULL,
  `team1` INTEGER NOT NULL,
  `team2` INTEGER NOT NULL,
  `score1` INTEGER NULL DEFAULT NULL,
  `score2` INTEGER NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
);

-- ---
-- Foreign Keys
-- ---

ALTER TABLE `player` ADD FOREIGN KEY (team) REFERENCES `team` (`id`);
ALTER TABLE `games` ADD FOREIGN KEY (team1) REFERENCES `team` (`id`);
ALTER TABLE `games` ADD FOREIGN KEY (team2) REFERENCES `team` (`id`);

-- ---
-- Table Properties
-- ---

-- ALTER TABLE `player` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `team` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `games` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ---
-- Test Data
-- ---

-- INSERT INTO `player` (`id`,`name`,`age`,`weight`,`experience`,`team`) VALUES
-- ('','','','','','');
-- INSERT INTO `team` (`id`,`name`,`mascot`) VALUES
-- ('','','');
-- INSERT INTO `games` (`id`,`status`,`start_time`,`team1`,`team2`,`score1`,`score2`) VALUES
-- ('','','','','','','');

