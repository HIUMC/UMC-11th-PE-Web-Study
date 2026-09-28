CREATE TABLE member (
    member_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    nickname VARCHAR(30) NOT NULL
);

CREATE TABLE store (
    store_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    address VARCHAR(100) NOT NULL
);

CREATE TABLE mission (
    mission_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    store_id BIGINT NOT NULL,
    title VARCHAR(100) NOT NULL,
    reward_point INT NOT NULL,
    FOREIGN KEY (store_id)
        REFERENCES store(store_id)
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

INSERT INTO member (nickname)
VALUES
    ('연서'),
    ('지훈'),
    ('서현');

INSERT INTO store (name, address)
VALUES
    ('연남커피', '서울 마포구 연남동'),
    ('합정키친', '서울 마포구 합정동'),
    ('신촌베이커리', '서울 서대문구 신촌동');

INSERT INTO mission (store_id, title, reward_point)
VALUES
    (1, '아메리카노 주문하기', 200),
    (1, '매장 방문 인증하기', 300),
    (2, '식사 후 리뷰 작성하기', 500),
    (3, '빵 2개 이상 구매하기', 250);

INSERT INTO member_mission (member_id, mission_id, status, completed_at)
VALUES
    (1, 1, '완료', '2026-09-15 14:30:00'),
    (1, 2, '진행중', NULL),
    (1, 3, '완료', '2026-09-20 18:10:00'),
    (2, 2, '완료', '2026-09-18 11:20:00'),
    (3, 4, '완료', '2026-09-19 16:40:00');

SELECT
    mb.nickname,
    m.title AS mission_title,
    s.name AS store_name,
    mm.completed_at
FROM member_mission mm
JOIN member mb
    ON mm.member_id = mb.member_id
JOIN mission m
    ON mm.mission_id = m.mission_id
JOIN store s
    ON m.store_id = s.store_id
WHERE mb.nickname = '연서'
  AND mm.status = '완료'
ORDER BY mm.completed_at DESC
LIMIT 5;

/*기준 테이블은 회원별 미션 수행 내역을 저장하는 MEMBER_MISSION입니다. 
회원 정보를 확인하기 위해 MEMBER, 미션 정보를 확인하기 위해 MISSION, 
미션이 등록된 가게 이름을 확인하기 위해 STORE를 JOIN했습니다. WHERE 조건으로 
특정 회원이면서 상태가 ‘완료’인 미션만 조회하고, completed_at을 내림차순으로 
정렬하여 최근 완료한 미션 5개를 조회했습니다.*/