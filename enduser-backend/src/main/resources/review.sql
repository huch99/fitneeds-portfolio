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

DROP TABLE review;

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


INSERT INTO review (title, content, user_id, user_type, reservation_id, rating, created_at, updated_at, is_visible) VALUES
('운동 후기 1', '오늘 수업 정말 즐거웠어요!', 'user_001', '회원', 1001, 5, NOW(), NOW(), 1),
('운동 후기 2', '강사님 설명이 이해하기 쉬웠습니다.', 'user_002', '회원', 1002, 4, NOW(), NOW(), 1),
('운동 후기 3', '시설이 깨끗하고 편안했습니다.', 'user_003', '회원', 1003, 5, NOW(), NOW(), 1),
('운동 후기 4', '다소 힘든 수업이었지만 만족합니다.', 'user_001', '회원', 1004, 4, NOW(), NOW(), 1),
('운동 후기 5', '다른 회원들과 함께해서 즐거웠습니다.', 'user_002', '회원', 1005, 5, NOW(), NOW(), 1),
('운동 후기 6', '예약 과정이 조금 불편했어요.', 'user_004', '회원', 1006, 3, NOW(), NOW(), 1),
('운동 후기 7', '강사님이 친절하고 상세히 지도해주셨습니다.', 'user_003', '회원', 1007, 5, NOW(), NOW(), 1),
('운동 후기 8', '시설은 좋지만, 수업 시간이 맞지 않았습니다.', 'user_005', '회원', 1008, 3, NOW(), NOW(), 1),
('운동 후기 9', '적극 추천합니다!', 'user_001', '회원', 1009, 5, NOW(), NOW(), 1),
('운동 후기 10', '수업 내용이 알차고 유익했습니다.', 'user_006', '회원', 1010, 4, NOW(), NOW(), 1);


-- 확인
SELECT * FROM review;


