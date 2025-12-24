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


INSERT INTO review (title, content, user_id, user_type, reservation_id, rating, created_at, updated_at, is_visible) VALUES
('운동 후기 1', '오늘 수업 정말 즐거웠어요!', 'a4b502adb0df4f7ca9f9ef2879ac1dab', 'USER', 1001, 5, NOW(), NOW(), 1),
('운동 후기 2', '강사님 설명이 이해하기 쉬웠습니다.', 'a4b502adb0df4f7ca9f9ef2879ac1dab', 'USER', 1002, 4, NOW(), NOW(), 1),
('운동 후기 3', '시설이 깨끗하고 편안했습니다.', 'a4b502adb0df4f7ca9f9ef2879ac1dab', 'USER', 1003, 5, NOW(), NOW(), 1),
('운동 후기 4', '다소 힘든 수업이었지만 만족합니다.', 'a4b502adb0df4f7ca9f9ef2879ac1dab', 'USER', 1004, 4, NOW(), NOW(), 1),
('운동 후기 5', '다른 회원들과 함께해서 즐거웠습니다.', 'a4b502adb0df4f7ca9f9ef2879ac1dab', 'USER', 1005, 5, NOW(), NOW(), 1),
('운동 후기 6', '예약 과정이 조금 불편했어요.', 'a4b502adb0df4f7ca9f9ef2879ac1dab', 'USER', 1006, 3, NOW(), NOW(), 1),
('운동 후기 7', '강사님이 친절하고 상세히 지도해주셨습니다.', 'a4b502adb0df4f7ca9f9ef2879ac1dab', 'USER', 1007, 5, NOW(), NOW(), 1)


DROP TABLE review;
-- 확인
SELECT * FROM review;

CREATE TABLE payment (
    pay_id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '결제ID',
    ord_no VARCHAR(100) NOT NULL UNIQUE COMMENT '주문번호',
    usr_id VARCHAR(50) NOT NULL COMMENT '회원(사용자)ID',
    pay_type_cd VARCHAR(20) NOT NULL COMMENT '결제유형(상품구매, 단건결제, 이용권거래)',
    ref_id BIGINT NULL COMMENT '참조ID(단건결제: 스케줄ID, 이용권결제: 이용권상품ID, 거래: 거래게시판ID)',
    pay_amt INT NOT NULL COMMENT '결제금액',
    pay_method VARCHAR(20) NOT NULL COMMENT '결제수단(무통장, 포인트, 카드)',
    stts_cd VARCHAR(20) NOT NULL COMMENT '상태코드',
    reg_dt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '등록일시'
) COMMENT='결제 테이블';


INSERT INTO payment (
    ord_no,
    usr_id,
    pay_type_cd,
    ref_id,
    pay_amt,
    pay_method,
    stts_cd,
    reg_dt
) VALUES
('ORD-20251224-0001', 'a4b502adb0df4f7ca9f9ef2879ac1dab', 'SINGLE_PAY', 1001, 30000, 'BANK',  'PAID', NOW()),
('ORD-20251224-0002', 'a4b502adb0df4f7ca9f9ef2879ac1dab', 'SINGLE_PAY', 1002, 30000, 'BANK',  'PAID', NOW()),
('ORD-20251224-0006', 'a4b502adb0df4f7ca9f9ef2879ac1dab', 'SINGLE_PAY', 1006, 30000, 'BANK',  'CANCEL', NOW()),
('ORD-20251224-0007', 'a4b502adb0df4f7ca9f9ef2879ac1dab', 'SINGLE_PAY', 1007, 30000, 'BANK',  'READY', NOW());

SELECT * FROM payment;

CREATE TABLE reservation (
    rsv_id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id          VARCHAR(50) NOT NULL,
    exercise_name    VARCHAR(100) NOT NULL,   -- 운동명
    facility_name    VARCHAR(100) NOT NULL,   -- 지점명
    instructor_id    BIGINT,
    exercise_dt      DATE NOT NULL,            -- 운동 날짜
    stts_cd          VARCHAR(20) NOT NULL,     -- COMPLETED, CANCELLED
    del_yn           CHAR(1) DEFAULT 'N',
    reg_dt           DATETIME DEFAULT CURRENT_TIMESTAMP,
    upd_dt           DATETIME DEFAULT CURRENT_TIMESTAMP
);

SELECT * FROM reservation;

INSERT INTO reservation (
    user_id,
    exercise_name,
    facility_name,
    instructor_id,
    exercise_dt,
    stts_cd
)
VALUES
('a4b502adb0df4f7ca9f9ef2879ac1dab', '필라테스', '강남점', 1, '2025-01-10', 'COMPLETED'),
('a4b502adb0df4f7ca9f9ef2879ac1dab', '요가', '홍대점', 2, '2025-01-15', 'COMPLETED'),
('a4b502adb0df4f7ca9f9ef2879ac1dab', 'PT', '잠실점', 3, '2025-01-20', 'COMPLETED');