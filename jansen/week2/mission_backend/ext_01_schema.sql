-- 확장 과제용 DB (1주차 ERD 기준, 2주차 실습 DB와 분리)
DROP DATABASE IF EXISTS umc_week1_ext;
CREATE DATABASE umc_week1_ext DEFAULT CHARACTER SET utf8mb4;
USE umc_week1_ext;

-- ===== 1주차 ERD 원본 =====
CREATE TABLE `region` (
	`region_id`	BIGINT	NOT NULL,
	`region_name`	VARCHAR(100)	NOT NULL
);

CREATE TABLE `store` (
	`store_id`	BIGINT	NOT NULL,
	`region_id`	BIGINT	NOT NULL,
	`store_name`	VARCHAR(100)	NOT NULL,
	`category`	VARCHAR(50)	NULL,
	`address`	VARCHAR(255)	NULL,
	`rating`	FLOAT	NULL
);

CREATE TABLE `mission` (
	`mission_id`	BIGINT	NOT NULL,
	`store_id`	BIGINT	NOT NULL,
	`title`	VARCHAR(100)	NOT NULL,
	`min_order_amount`	INT	NULL,
	`reward_point`	INT	NULL
);

CREATE TABLE `member` (
	`member_id`	BIGINT	NOT NULL,
	`name`	VARCHAR(50)	NOT NULL,
	`nickname`	VARCHAR(50)	NOT NULL,
	`email`	VARCHAR(100)	NOT NULL,
	`gender`	VARCHAR(10)	NULL,
	`birth_date`	DATE	NULL,
	`address`	VARCHAR(255)	NULL,
	`total_point`	BIGINT	NULL	DEFAULT 0
);

CREATE TABLE `member_social_login` (
	`login_id`	BIGINT	NOT NULL,
	`member_id`	BIGINT	NOT NULL,
	`provider`	VARCHAR(20)	NOT NULL,
	`social_uid`	VARCHAR(100)	NOT NULL
);

CREATE TABLE `food_category` (
	`category_id`	BIGINT	NOT NULL,
	`category_name`	VARCHAR(50)	NOT NULL
);

CREATE TABLE `member_food_category` (
	`member_id`	BIGINT	NOT NULL,
	`category_id`	BIGINT	NOT NULL
);

CREATE TABLE `member_mission` (
	`member_mission_id`	BIGINT	NOT NULL,
	`member_id`	BIGINT	NOT NULL,
	`mission_id`	BIGINT	NOT NULL,
	`progress_status`	VARCHAR(20)	NOT NULL,
	`auth_number`	VARCHAR(20)	NULL,
	`completed_at`	DATETIME	NULL
);

ALTER TABLE `region` ADD CONSTRAINT `PK_REGION` PRIMARY KEY (`region_id`);
ALTER TABLE `store` ADD CONSTRAINT `PK_STORE` PRIMARY KEY (`store_id`);
ALTER TABLE `mission` ADD CONSTRAINT `PK_MISSION` PRIMARY KEY (`mission_id`);
ALTER TABLE `member` ADD CONSTRAINT `PK_MEMBER` PRIMARY KEY (`member_id`);
ALTER TABLE `member_social_login` ADD CONSTRAINT `PK_MEMBER_SOCIAL_LOGIN` PRIMARY KEY (`login_id`);
ALTER TABLE `food_category` ADD CONSTRAINT `PK_FOOD_CATEGORY` PRIMARY KEY (`category_id`);
ALTER TABLE `member_food_category` ADD CONSTRAINT `PK_MEMBER_FOOD_CATEGORY` PRIMARY KEY (`member_id`, `category_id`);
ALTER TABLE `member_mission` ADD CONSTRAINT `PK_MEMBER_MISSION` PRIMARY KEY (`member_mission_id`);

ALTER TABLE `member_food_category` ADD CONSTRAINT `FK_member_TO_member_food_category_1`
	FOREIGN KEY (`member_id`) REFERENCES `member` (`member_id`);
ALTER TABLE `member_food_category` ADD CONSTRAINT `FK_food_category_TO_member_food_category_1`
	FOREIGN KEY (`category_id`) REFERENCES `food_category` (`category_id`);

-- ===== 2주차 보완: 1주차 ERD에서 빠져 있던 FK =====
ALTER TABLE `store` ADD CONSTRAINT `FK_region_TO_store_1`
	FOREIGN KEY (`region_id`) REFERENCES `region` (`region_id`);
ALTER TABLE `mission` ADD CONSTRAINT `FK_store_TO_mission_1`
	FOREIGN KEY (`store_id`) REFERENCES `store` (`store_id`);
ALTER TABLE `member_social_login` ADD CONSTRAINT `FK_member_TO_member_social_login_1`
	FOREIGN KEY (`member_id`) REFERENCES `member` (`member_id`);
ALTER TABLE `member_mission` ADD CONSTRAINT `FK_member_TO_member_mission_1`
	FOREIGN KEY (`member_id`) REFERENCES `member` (`member_id`);
ALTER TABLE `member_mission` ADD CONSTRAINT `FK_mission_TO_member_mission_1`
	FOREIGN KEY (`mission_id`) REFERENCES `mission` (`mission_id`);
