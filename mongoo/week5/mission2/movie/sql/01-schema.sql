-- 새 설치/테이블 확인용. 기존 테이블과 데이터는 삭제하지 않는다.
-- IF NOT EXISTS는 기존 테이블 구조를 교정하지 않는다. 구조가 다르면 SHOW CREATE TABLE로 확인한다.
CREATE DATABASE IF NOT EXISTS umc_movie_week5 CHARACTER SET utf8mb4;

CREATE TABLE IF NOT EXISTS umc_movie_week5.member (
    member_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(254) NOT NULL UNIQUE,
    password VARCHAR(60) NOT NULL,
    nickname VARCHAR(50) NOT NULL UNIQUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS umc_movie_week5.rating (
    rating_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    member_id BIGINT NOT NULL,
    movie_id BIGINT NOT NULL,
    score TINYINT NOT NULL,
    comment TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES umc_movie_week5.member(member_id),
    UNIQUE KEY uk_rating_member_movie (member_id, movie_id)
);
CREATE TABLE IF NOT EXISTS umc_movie_week5.favorite (
    favorite_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    member_id BIGINT NOT NULL,
    movie_id BIGINT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES umc_movie_week5.member(member_id),
    UNIQUE KEY uk_favorite_member_movie (member_id, movie_id)
);
SHOW TABLES FROM umc_movie_week5;
