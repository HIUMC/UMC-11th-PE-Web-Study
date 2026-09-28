CREATE DATABASE IF NOT EXISTS umc_week2_my_erd
  DEFAULT CHARACTER SET utf8mb4;
USE umc_week2_my_erd;

CREATE TABLE food_category (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(30) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT uq_food_category_name UNIQUE (name)
) ENGINE=InnoDB;

CREATE TABLE region (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT uq_region_name UNIQUE (name)
) ENGINE=InnoDB;

CREATE TABLE member (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  nickname VARCHAR(30) NOT NULL,
  profile_image_url VARCHAR(500) NULL,
  point INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  CONSTRAINT uq_member_nickname UNIQUE (nickname),
  CONSTRAINT chk_member_point CHECK (point >= 0)
) ENGINE=InnoDB;

CREATE TABLE store (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  address VARCHAR(255) NOT NULL,
  description TEXT NULL,
  image_url VARCHAR(500) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  food_category_id BIGINT NOT NULL,
  region_id BIGINT NOT NULL,
  INDEX idx_store_region_deleted (region_id, deleted_at),
  CONSTRAINT fk_store_food_category
    FOREIGN KEY (food_category_id) REFERENCES food_category(id),
  CONSTRAINT fk_store_region
    FOREIGN KEY (region_id) REFERENCES region(id)
) ENGINE=InnoDB;

CREATE TABLE mission (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(100) NOT NULL,
  description TEXT NULL,
  reward_point INT NOT NULL,
  deadline TIMESTAMP NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'OPEN',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  store_id BIGINT NOT NULL,
  INDEX idx_mission_store_status (store_id, status, deleted_at),
  CONSTRAINT fk_mission_store
    FOREIGN KEY (store_id) REFERENCES store(id),
  CONSTRAINT chk_mission_reward_point CHECK (reward_point > 0),
  CONSTRAINT chk_mission_status CHECK (status IN ('OPEN', 'CLOSED'))
) ENGINE=InnoDB;

CREATE TABLE social_account (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  provider VARCHAR(20) NOT NULL,
  provider_user_id VARCHAR(255) NOT NULL,
  email VARCHAR(255) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,
  member_id BIGINT NOT NULL,
  CONSTRAINT uq_social_provider_user
    UNIQUE (provider, provider_user_id),
  CONSTRAINT uq_social_member_provider
    UNIQUE (member_id, provider),
  CONSTRAINT fk_social_account_member
    FOREIGN KEY (member_id) REFERENCES member(id)
) ENGINE=InnoDB;

CREATE TABLE member_mission (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  status VARCHAR(20) NOT NULL DEFAULT 'IN_PROGRESS',
  started_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,
  member_id BIGINT NOT NULL,
  mission_id BIGINT NOT NULL,
  CONSTRAINT uq_member_mission_pair UNIQUE (member_id, mission_id),
  CONSTRAINT fk_member_mission_member
    FOREIGN KEY (member_id) REFERENCES member(id),
  CONSTRAINT fk_member_mission_mission
    FOREIGN KEY (mission_id) REFERENCES mission(id),
  CONSTRAINT chk_member_mission_status
    CHECK (status IN ('IN_PROGRESS', 'COMPLETED', 'CANCELLED')),
  CONSTRAINT chk_member_mission_completion
    CHECK (
      (status = 'COMPLETED'
        AND completed_at IS NOT NULL
        AND completed_at >= started_at)
      OR (status <> 'COMPLETED' AND completed_at IS NULL)
    )
) ENGINE=InnoDB;

CREATE TABLE member_region_reward (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  reward_point INT NOT NULL DEFAULT 1000,
  rewarded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  region_id BIGINT NOT NULL,
  member_id BIGINT NOT NULL,
  CONSTRAINT uq_member_region_reward UNIQUE (member_id, region_id),
  CONSTRAINT fk_member_region_reward_region
    FOREIGN KEY (region_id) REFERENCES region(id),
  CONSTRAINT fk_member_region_reward_member
    FOREIGN KEY (member_id) REFERENCES member(id),
  CONSTRAINT chk_region_reward_point CHECK (reward_point > 0)
) ENGINE=InnoDB;

SHOW TABLES;