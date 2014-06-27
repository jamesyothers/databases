


DROP DATABASE IF EXISTS `genealogy`;
CREATE DATABASE genealogy;
USE genealogy;

-- ---
-- Globals
-- ---

-- SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
-- SET FOREIGN_KEY_CHECKS=0;

-- ---
-- Table 'people'
--
-- ---

DROP TABLE IF EXISTS `people`;

CREATE TABLE `people` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL,
  `birth` DATE NULL DEFAULT NULL,
  `death` DATE NULL DEFAULT NULL,
  `gender` CHAR NOT NULL,
  `child_of` INTEGER NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
);

-- ---
-- Table 'parents'
--
-- ---

DROP TABLE IF EXISTS `parents`;

CREATE TABLE `parents` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `mother_id` INTEGER NULL DEFAULT NULL,
  `father_id` INTEGER NULL DEFAULT NULL,
  `divorced` bit(1) NULL DEFAULT 0,
  PRIMARY KEY (`id`)
);

-- ---
-- Foreign Keys
-- ---

ALTER TABLE `people` ADD FOREIGN KEY (child_of) REFERENCES `parents` (`id`);
ALTER TABLE `parents` ADD FOREIGN KEY (mother_id) REFERENCES `people` (`id`);
ALTER TABLE `parents` ADD FOREIGN KEY (father_id) REFERENCES `people` (`id`);

-- ---
-- Table Properties
-- ---

-- ALTER TABLE `people` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `parents` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ---
-- Test Data
-- ---

-- INSERT INTO `people` (`id`,`name`,`birth`,`death`,`gender`,`child_of`) VALUES
-- ('','','','','','');
-- INSERT INTO `parents` (`id`,`mother_id`,`father_id`,`divorced`) VALUES
-- ('','','','');

