-- 확장: 내 1주차 ERD (미션 리워드 앱)
-- 요구사항: "특정 회원이 진행 중인 미션을 가게 이름과 함께 최신순으로 보여준다."
CREATE DATABASE IF NOT EXISTS umc_mission;
USE umc_mission;

CREATE TABLE member (
  member_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(30) NOT NULL
);
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
  region_id BIGINT NOT NULL,
  food_category_id BIGINT NOT NULL,
  name VARCHAR(100) NOT NULL,
  FOREIGN KEY (region_id) REFERENCES region(region_id),
  FOREIGN KEY (food_category_id) REFERENCES food_category(food_category_id)
);
CREATE TABLE mission (
  mission_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  store_id BIGINT NOT NULL,
  reward_point INT NOT NULL,
  description TEXT,
  FOREIGN KEY (store_id) REFERENCES store(store_id)
);
CREATE TABLE member_mission (
  member_mission_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  member_id BIGINT NOT NULL,
  mission_id BIGINT NOT NULL,
  status TINYINT NOT NULL DEFAULT 0,  -- 0: 진행중, 1: 완료
  created_at DATETIME NOT NULL,
  FOREIGN KEY (member_id) REFERENCES member(member_id),
  FOREIGN KEY (mission_id) REFERENCES mission(mission_id)
);

INSERT INTO member (name) VALUES ('황구');
INSERT INTO region (name) VALUES ('안양동'), ('평촌동');
INSERT INTO food_category (name) VALUES ('한식'), ('분식');
INSERT INTO store (region_id, food_category_id, name) VALUES
  (1, 1, '명지김밥'), (1, 2, '평촌떡볶이'), (2, 1, '안양국밥');
INSERT INTO mission (store_id, reward_point, description) VALUES
  (1, 100, '명지김밥 방문 미션'), (2, 150, '평촌떡볶이 방문 미션'), (3, 200, '안양국밥 방문 미션');
INSERT INTO member_mission (member_id, mission_id, status, created_at) VALUES
  (1, 1, 0, '2026-09-01 10:00:00'),
  (1, 2, 1, '2026-09-02 10:00:00'),
  (1, 3, 0, '2026-09-03 10:00:00');

-- 조회 쿼리
SELECT s.name AS store_name, m.reward_point, mm.status
FROM member_mission mm
JOIN mission m ON mm.mission_id = m.mission_id
JOIN store s   ON m.store_id = s.store_id
WHERE mm.member_id = 1 AND mm.status = 0
ORDER BY mm.created_at DESC;
