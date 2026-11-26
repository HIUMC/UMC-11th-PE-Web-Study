USE umc_movie;

INSERT INTO member (email, password, nickname) VALUES
    ('noco@umc.com', '$2a$10$tUkyZW/gEiT5HIxanbSp/uFZ/IGafbw3Lmr532nxsG3yDkk/Zig92', '수현'),
    ('minseo@umc.com', '$2a$10$tUkyZW/gEiT5HIxanbSp/uFZ/IGafbw3Lmr532nxsG3yDkk/Zig92', '민서'),
    ('jiwoo@umc.com', '$2a$10$tUkyZW/gEiT5HIxanbSp/uFZ/IGafbw3Lmr532nxsG3yDkk/Zig92', '지우');

INSERT INTO rating (member_id, movie_id, score, comment) VALUES
    (1, 550, 5, '최고의 영화!'),
    (1, 155, 4, '다시 봐도 명작'),
    (2, 550, 3, '호불호가 갈릴 것 같아요');
