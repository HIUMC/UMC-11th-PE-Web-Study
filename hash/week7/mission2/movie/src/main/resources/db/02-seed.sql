USE umc_movie;

INSERT INTO member (email, password, nickname)
VALUES
    ('noco@umc.com', 'dummy-password-not-for-login', '수현'),
    ('minseo@umc.com', 'dummy-password-not-for-login', '민서'),
    ('empty@umc.com', 'dummy-password-not-for-login', '평점없음');

INSERT INTO rating (member_id, movie_id, score, comment)
SELECT member_id, 550, 5, '최고의 영화!'
FROM member
WHERE email = 'noco@umc.com';

INSERT INTO rating (member_id, movie_id, score, comment)
SELECT member_id, 155, 4, '다시 봐도 명작'
FROM member
WHERE email = 'noco@umc.com';

INSERT INTO rating (member_id, movie_id, score, comment)
SELECT member_id, 550, 3, '호불호가 갈릴 것 같아요'
FROM member
WHERE email = 'minseo@umc.com';