CREATE DATABASE umc_mission DEFAULT CHARACTER SET utf8mb4;
USE umc_mission;

CREATE TABLE region (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL
);

CREATE TABLE food_category (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL
);

CREATE TABLE member (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,
  phone_number VARCHAR(20),
  gender VARCHAR(10),
  birth_date DATE,
  address VARCHAR(255),
  created_at DATETIME NOT NULL
);

CREATE TABLE store (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  region_id BIGINT NOT NULL,
  food_category_id BIGINT NOT NULL,
  name VARCHAR(100) NOT NULL,
  address VARCHAR(255),
  phone_number VARCHAR(20),
  FOREIGN KEY (region_id) REFERENCES region(id),
  FOREIGN KEY (food_category_id) REFERENCES food_category(id)
);

CREATE TABLE mission (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  store_id BIGINT NOT NULL,
  title VARCHAR(100) NOT NULL,
  description VARCHAR(255),
  minimum_amount INT,
  reward_point INT,
  deadline DATETIME,
  FOREIGN KEY (store_id) REFERENCES store(id)
);

CREATE TABLE member_mission (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  member_id BIGINT NOT NULL,
  mission_id BIGINT NOT NULL,
  status VARCHAR(20) NOT NULL,
  started_at DATETIME,
  completed_at DATETIME NULL,
  FOREIGN KEY (member_id) REFERENCES member(id),
  FOREIGN KEY (mission_id) REFERENCES mission(id)
);