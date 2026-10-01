-- =========================================================
-- 2주차 확장 미션: 1주차 ERD 기반 "내가 진행 중인 미션 목록"
-- 공통 실습 DB(umc_book)와 섞이지 않도록 별도 DB 사용
-- =========================================================

DROP DATABASE IF EXISTS umc_mission;
CREATE DATABASE umc_mission DEFAULT CHARACTER SET utf8mb4;
USE umc_mission;

-- ---------- 01. 스키마 (확장 쿼리에 필요한 테이블만) ----------
CREATE TABLE region (
    region_id  BIGINT PRIMARY KEY AUTO_INCREMENT,
    name       VARCHAR(50) NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NULL
);

CREATE TABLE member (
    member_id    BIGINT PRIMARY KEY AUTO_INCREMENT,
    name         VARCHAR(50) NOT NULL,
    nickname     VARCHAR(50) NOT NULL,
    phone_number VARCHAR(20) NULL,
    gender       ENUM('NONE', 'MALE', 'FEMALE') NOT NULL,
    birth_date   DATE NULL,
    address      VARCHAR(255) NULL,
    point        INT NOT NULL DEFAULT 0,
    created_at   DATETIME NOT NULL,
    updated_at   DATETIME NULL,
    deleted_at   DATETIME NULL
);

CREATE TABLE store (
    store_id   BIGINT PRIMARY KEY AUTO_INCREMENT,
    region_id  BIGINT NOT NULL,
    name       VARCHAR(100) NOT NULL,
    address    VARCHAR(255) NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NULL,
    deleted_at DATETIME NULL,
    FOREIGN KEY (region_id) REFERENCES region(region_id)
);

CREATE TABLE mission (
    mission_id   BIGINT PRIMARY KEY AUTO_INCREMENT,
    store_id     BIGINT NOT NULL,
    reward_point INT NOT NULL,
    description  VARCHAR(255) NOT NULL,
    created_at   DATETIME NOT NULL,
    updated_at   DATETIME NULL,
    deleted_at   DATETIME NULL,
    FOREIGN KEY (store_id) REFERENCES store(store_id)
);

CREATE TABLE member_mission (
    member_mission_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    member_id         BIGINT NOT NULL,
    mission_id        BIGINT NOT NULL,
    status            ENUM('CHALLENGING', 'COMPLETE') NOT NULL,
    created_at        DATETIME NOT NULL,
    updated_at        DATETIME NULL,
    FOREIGN KEY (member_id)  REFERENCES member(member_id),
    FOREIGN KEY (mission_id) REFERENCES mission(mission_id)
);

-- ---------- 02. 더미 데이터 ----------
INSERT INTO region (name, created_at) VALUES
    ('강남구', '2026-08-01 09:00:00'),
    ('서초구', '2026-08-01 09:00:00');

INSERT INTO member (name, nickname, gender, created_at) VALUES
    ('민서', '민서', 'FEMALE', '2026-08-01 10:00:00'),
    ('수현', '수현', 'MALE',   '2026-08-01 11:00:00');

INSERT INTO store (region_id, name, address, created_at) VALUES
    (1, '갓덴스시 강남점', '서울 강남구 테헤란로 109 강남제일빌딩 1층', '2026-08-02 09:00:00'),
    (1, '뱅뱅막국수',      '서울 강남구 도곡로 112 서한빌딩 1층',     '2026-08-02 09:00:00');

INSERT INTO mission (store_id, reward_point, description, created_at, deleted_at) VALUES
    (1, 500,  '12,000원 이상 식사하기', '2026-08-03 09:00:00', NULL),
    (1, 300,  '리뷰 작성하기',          '2026-08-03 09:00:00', NULL),
    (2, 1000, '15,000원 이상 식사하기', '2026-08-03 09:00:00', NULL),
    (2, 200,  '종료된 이벤트 미션',     '2026-08-03 09:00:00', '2026-08-15 00:00:00');

INSERT INTO member_mission (member_id, mission_id, status, created_at) VALUES
    (1, 1, 'CHALLENGING', '2026-08-20 12:00:00'),
    (1, 2, 'COMPLETE',    '2026-08-21 12:00:00'),
    (1, 3, 'CHALLENGING', '2026-08-25 12:00:00'),
    (1, 4, 'CHALLENGING', '2026-08-10 12:00:00'),
    (2, 1, 'CHALLENGING', '2026-08-22 12:00:00');

-- ---------- 03. 확장 쿼리: 내가 진행 중인 미션 목록 ----------
-- 요구사항: "로그인한 사용자가 진행 중인 미션을 최근에 시작한 순으로 10개 보여 준다."
SELECT mm.member_mission_id,
       s.name         AS store_name,
       m.description,
       m.reward_point,
       mm.created_at  AS started_at
FROM member_mission mm
JOIN mission m ON mm.mission_id = m.mission_id
JOIN store   s ON m.store_id    = s.store_id
WHERE mm.member_id  = 1
  AND mm.status     = 'CHALLENGING'
  AND m.deleted_at IS NULL
ORDER BY mm.created_at DESC, mm.member_mission_id DESC
LIMIT 10 OFFSET 0;

-- 예상 결과 (2행)
-- 3 | 뱅뱅막국수      | 15,000원 이상 식사하기 | 1000 | 2026-08-25 12:00:00
-- 1 | 갓덴스시 강남점 | 12,000원 이상 식사하기 |  500 | 2026-08-20 12:00:00
