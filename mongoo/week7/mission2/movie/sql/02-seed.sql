-- 수현 2개, 민서 1개. 기존 회원/평점은 덮어쓰지 않는다.
-- 앞서 이미 입력한 경우에는 건너뛰어도 된다. 전체 선택 실행해도 중복 데이터가 생기지 않는다.
START TRANSACTION;
INSERT INTO umc_movie_week5.member (email, password, nickname)
SELECT 'noco@umc.com', '$2a$10$dummyEncodedPasswordValue', '수현'
WHERE NOT EXISTS (SELECT 1 FROM umc_movie_week5.member WHERE email='noco@umc.com' OR nickname='수현');
INSERT INTO umc_movie_week5.member (email, password, nickname)
SELECT 'minseo@umc.com', '$2a$10$dummyEncodedPasswordValue', '민서'
WHERE NOT EXISTS (SELECT 1 FROM umc_movie_week5.member WHERE email='minseo@umc.com' OR nickname='민서');

INSERT INTO umc_movie_week5.rating (member_id, movie_id, score, comment)
SELECT m.member_id, seed.movie_id, seed.score, seed.comment
FROM umc_movie_week5.member m
JOIN (
    SELECT 'noco@umc.com' AS email, 550 AS movie_id, 5 AS score, '최고의 영화!' AS comment
    UNION ALL SELECT 'noco@umc.com', 155, 4, '다시 봐도 명작'
    UNION ALL SELECT 'minseo@umc.com', 550, 3, '호불호가 갈릴 것 같아요'
) seed ON m.email=seed.email
WHERE NOT EXISTS (
    SELECT 1 FROM umc_movie_week5.rating r
    WHERE r.member_id=m.member_id AND r.movie_id=seed.movie_id
);
COMMIT;

SELECT member_id, email, nickname FROM umc_movie_week5.member ORDER BY member_id;
SELECT m.nickname, r.* FROM umc_movie_week5.rating r
JOIN umc_movie_week5.member m ON r.member_id=m.member_id
ORDER BY r.rating_id DESC;
-- 비밀번호는 로그인 불가능한 임시 문자열이다. 실제 비밀번호/유효한 해시가 아니다.
