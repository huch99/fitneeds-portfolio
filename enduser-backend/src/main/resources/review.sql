-- 기존 테이블 삭제 및 새 스키마로 재생성
DROP TABLE IF EXISTS review;
DROP TABLE IF EXISTS review_dev;

USE fitneedsdb;

CREATE TABLE review (
    review_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    content TEXT,
    user_id VARCHAR(255) NOT NULL,
    user_type VARCHAR(50),
    reservation_id BIGINT,
    rating INT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_visible TINYINT(1) NOT NULL DEFAULT 1
);
-- 개발용 더미 데이터 삽입
INSERT INTO review(title, content, user_id, user_type, reservation_id, rating, is_visible)
VALUES
('훌륭한 수업', '정말 좋은 수업이었습니다!', '1', 'USER', 101, 5, 1),
('친절한 강사님', '강사님이 친절했어요.', '2', 'USER', 102, 4, 1),
('유익한 시간', '조금 어려웠지만 유익했어요.', '1', 'USER', 103, 3, 1),
('완벽한 경험', '완벽한 수업 경험이었어요!', '3', 'USER', 104, 5, 1),
('아쉬운 점', '조금 부족했어요.', '2', 'USER', 105, 2, 1),
('전문적인 수업', '친절하고 전문적이었어요.', '1', 'USER', 106, 4, 1),
('재수강 희망', '또 듣고 싶어요!', '3', 'USER', 107, 5, 1),
('보통 수준', '보통 수준입니다.', '2', 'USER', 108, 3, 1),
('만족스러운 수업', '만족스러운 수업이었어요.', '1', 'USER', 109, 4, 1),
('최고의 강사', '강사님 최고!', '3', 'USER', 110, 5, 1);

-- 확인
SELECT * FROM review;



-- 리뷰 조회 예시
SELECT
    review_id AS reviewId,
    title,
    content,
    user_id AS userId,
    user_type AS userType,
    reservation_id AS reservationId,
    rating,
    created_at AS createdAt,
    updated_at AS updatedAt,
    is_visible AS isVisible
FROM
    review
WHERE
    user_id = '1'
    AND is_visible = 1
ORDER BY
    created_at DESC;
