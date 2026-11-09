USE umc_week1;

CREATE TABLE region (
    region_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL
);

CREATE TABLE food_category (
    food_category_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL
);

CREATE TABLE store (
    store_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    address VARCHAR(255) NOT NULL,
    region_id BIGINT NOT NULL,

    FOREIGN KEY (region_id)
        REFERENCES region(region_id)
);

CREATE TABLE mission (
    mission_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    reward_point INT NOT NULL,
    deadline DATETIME,
    store_id BIGINT NOT NULL,

    FOREIGN KEY (store_id)
        REFERENCES store(store_id)
);

CREATE TABLE member (
    member_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL,
    nickname VARCHAR(50) NOT NULL,
    created_at DATETIME NOT NULL
);

CREATE TABLE social_account (
    social_account_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    provider VARCHAR(20) NOT NULL,
    provider_user_id VARCHAR(255) NOT NULL,
    member_id BIGINT NOT NULL,

    FOREIGN KEY (member_id)
        REFERENCES member(member_id)
);

CREATE TABLE member_mission (
    member_mission_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    member_id BIGINT NOT NULL,
    mission_id BIGINT NOT NULL,
    status VARCHAR(20) NOT NULL,
    completed_at DATETIME NULL,

    FOREIGN KEY (member_id)
        REFERENCES member(member_id),

    FOREIGN KEY (mission_id)
        REFERENCES mission(mission_id)
);