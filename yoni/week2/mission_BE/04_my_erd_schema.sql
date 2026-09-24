-- 04_my_erd_schema.sql
-- 1주차에 설계한 미션 포인트 서비스 ERD를 MySQL 테이블로 구현

CREATE TABLE region (
    region_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    region_name VARCHAR(50) NOT NULL
);

CREATE TABLE food_category (
    food_category_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    food_category_name VARCHAR(50) NOT NULL
);

CREATE TABLE member (
    member_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL,
    gender ENUM('NONE', 'MALE', 'FEMALE') NOT NULL,
    birth_date DATE NOT NULL,
    address VARCHAR(255) NOT NULL,
    social_provider ENUM('KAKAO', 'NAVER', 'APPLE', 'GOOGLE') NOT NULL,
    social_id VARCHAR(100) NOT NULL
);

CREATE TABLE store (
    store_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    store_name VARCHAR(100) NOT NULL,
    store_address VARCHAR(255) NOT NULL,
    region_id BIGINT NOT NULL,
    food_category_id BIGINT NOT NULL,
    FOREIGN KEY (region_id) REFERENCES region(region_id),
    FOREIGN KEY (food_category_id) REFERENCES food_category(food_category_id)
);

CREATE TABLE mission (
    mission_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    content VARCHAR(255) NOT NULL,
    reward_point INT NOT NULL,
    deadline DATE NOT NULL,
    store_id BIGINT NOT NULL,
    FOREIGN KEY (store_id) REFERENCES store(store_id)
);

CREATE TABLE member_mission (
    member_mission_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    status ENUM('진행중', '완료') NOT NULL,
    completed_at TIMESTAMP NULL,
    member_id BIGINT NOT NULL,
    mission_id BIGINT NOT NULL,
    FOREIGN KEY (member_id) REFERENCES member(member_id),
    FOREIGN KEY (mission_id) REFERENCES mission(mission_id)
);

CREATE TABLE member_food_category (
    member_food_category_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    member_id BIGINT NOT NULL,
    food_category_id BIGINT NOT NULL,
    FOREIGN KEY (member_id) REFERENCES member(member_id),
    FOREIGN KEY (food_category_id) REFERENCES food_category(food_category_id)
);