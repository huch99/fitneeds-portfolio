USE fitneedsdb;

CREATE TABLE review_dev (
    review_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    reservation_id BIGINT NOT NULL,
    rating INT NOT NULL,
    content TEXT,
    instructor_id BIGINT NOT NULL,
    reg_dt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE review (
    review_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    reservation_id BIGINT NOT NULL,
    rating INT NOT NULL,
    content TEXT,
    instructor_id BIGINT NOT NULL,
    reg_dt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
-- 개발용 더미 데이터 삽입
INSERT INTO review(reservation_id, rating, content, instructor_id)
VALUES
(101, 5, '정말 좋은 수업이었습니다!', 1),
(102, 4, '강사님이 친절했어요.', 2),
(103, 3, '조금 어려웠지만 유익했어요.', 1),
(104, 5, '완벽한 수업 경험이었어요!', 3),
(105, 2, '조금 부족했어요.', 2),
(106, 4, '친절하고 전문적이었어요.', 1),
(107, 5, '또 듣고 싶어요!', 3),
(108, 3, '보통 수준입니다.', 2),
(109, 4, '만족스러운 수업이었어요.', 1),
(110, 5, '강사님 최고!', 3);

-- 확인
SELECT * FROM review;