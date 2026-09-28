CREATE DATABASE IF NOT EXISTS umc_prac2;
USE umc_prac2;

CREATE TABLE users (
    user_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL
);

CREATE TABLE store (
    store_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    store_name VARCHAR(50) NOT NULL,
    store_region VARCHAR(30) NOT NULL
);

CREATE TABLE mission (
    mission_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    mission_name VARCHAR(100) NOT NULL,
    reward_point INT NOT NULL,
    end_date DATE NOT NULL,
    store_id BIGINT NOT NULL,

    FOREIGN KEY (store_id)
        REFERENCES store(store_id)
);

CREATE TABLE user_mission (
    user_mission_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    mission_id BIGINT NOT NULL,
    mission_status VARCHAR(20) NOT NULL,
    assigned_at DATETIME NOT NULL,
    completed_at DATETIME NULL,

    FOREIGN KEY (user_id)
        REFERENCES users(user_id),

    FOREIGN KEY (mission_id)
        REFERENCES mission(mission_id)
);


INSERT INTO users (name)
VALUES
    ('현준'),
    ('민서'),
    ('수현');

INSERT INTO store (store_name, store_region)
VALUES
    ('와우버거', '마포구'),
    ('홍대카페', '마포구'),
    ('강남분식', '강남구');

INSERT INTO mission (mission_name, reward_point, end_date, store_id)
VALUES
    ('와우버거 방문하기', 500, '2026-09-30', 1),
    ('와우버거 리뷰 작성하기', 800, '2026-10-10', 1),
    ('홍대카페 음료 주문하기', 300, '2026-09-25', 2),
    ('홍대카페 방문하기', 700, '2026-10-05', 2),
    ('강남분식 떡볶이 주문하기', 1000, '2026-10-20', 3);

INSERT INTO user_mission
    (user_id, mission_id, mission_status, assigned_at, completed_at)
VALUES
    (1, 1, 'IN_PROGRESS', '2026-09-18 10:00:00', NULL),
    (1, 2, 'COMPLETED',   '2026-09-10 12:00:00', '2026-09-15 18:00:00'),
    (1, 3, 'IN_PROGRESS', '2026-09-20 14:00:00', NULL),
    (1, 4, 'COMPLETED',   '2026-09-12 09:00:00', '2026-09-19 16:00:00'),
    (2, 1, 'IN_PROGRESS', '2026-09-19 13:00:00', NULL),
    (2, 4, 'IN_PROGRESS', '2026-09-20 15:00:00', NULL),
    (3, 5, 'IN_PROGRESS', '2026-09-20 11:00:00', NULL);

# 요구사항 : 마포구에 있는 가게에서 진행되는 미션 중 아직 종료되지 않은 미션을 보상포인트가 높은 순으로 최대 5개 조회

SELECT
    m.mission_name,
    s.store_name,
    m.reward_point,
    m.end_date
FROM mission m
JOIN store s
    ON m.store_id = s.store_id
WHERE s.store_region = '마포구'
  AND m.end_date >= CURDATE()
ORDER BY m.reward_point DESC, m.end_date ASC
LIMIT 5;
