



-- ---
-- Globals
-- ---

-- SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
-- SET FOREIGN_KEY_CHECKS=0;

-- ---
-- Table 'books'
--
-- ---

DROP DATABASE IF EXISTS `library`;
CREATE DATABASE library;
USE library;

DROP TABLE IF EXISTS `books`;

CREATE TABLE `books` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(20) NOT NULL,
  `author` INTEGER NOT NULL,
  `copies` INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`)
);

-- ---
-- Table 'authors'
--
-- ---

DROP TABLE IF EXISTS `authors`;

CREATE TABLE `authors` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(40) NOT NULL,
  PRIMARY KEY (`id`)
);

-- ---
-- Table 'customers'
--
-- ---

DROP TABLE IF EXISTS `customers`;

CREATE TABLE `customers` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`id`)
);

-- ---
-- Table 'borrow_log'
--
-- ---

DROP TABLE IF EXISTS `borrow_log`;

CREATE TABLE `borrow_log` (
  `cust_id` INTEGER NOT NULL,
  `book_id` INTEGER NOT NULL,
  PRIMARY KEY (`cust_id`, `book_id`)
);

-- ---
-- Foreign Keys
-- ---

-- ALTER TABLE `books` ADD FOREIGN KEY (`id`) REFERENCES `borrow_log` (`book_id`);
ALTER TABLE `borrow_log` ADD FOREIGN KEY (`book_id`) REFERENCES `books` (`id`);
ALTER TABLE `books` ADD FOREIGN KEY (`author`) REFERENCES `authors` (`id`);
ALTER TABLE `customers` ADD FOREIGN KEY (`id`) REFERENCES `borrow_log` (`cust_id`);
ALTER TABLE `borrow_log` ADD FOREIGN KEY (`cust_id`) REFERENCES `customers` (`id`);

-- ---
-- Table Properties
-- ---

-- ALTER TABLE `books` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `authors` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `customers` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `borrow_log` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ---
-- Test Data
-- ---

-- INSERT INTO `books` (`id`,`title`,`author`,`copies`) VALUES
-- ('','','','');
-- INSERT INTO `authors` (`id`,`name`) VALUES
-- ('','');
-- INSERT INTO `customers` (`id`,`name`) VALUES
-- ('','');
-- INSERT INTO `borrow_log` (`cust_id`,`book_id`) VALUES
-- ('','');

