-- ================================
-- 리뷰
-- ================================
CREATE TABLE review (
    review_id      BIGINT AUTO_INCREMENT PRIMARY KEY,
    title          VARCHAR(255),
    content        TEXT,

    user_id        VARCHAR(255) NOT NULL,
    user_type      VARCHAR(50),

    reservation_id BIGINT,
    history_id     BIGINT,

    rating         DECIMAL(2,1),

    created_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
                     ON UPDATE CURRENT_TIMESTAMP,

    is_visible     TINYINT(1) NOT NULL DEFAULT 1
);

INSERT INTO review (
    title,
    content,
    user_id,
    user_type,
    reservation_id,
    rating,
    is_visible
) VALUES (
    '수업 너무 좋았어요',
    '강사님 설명이 친절하고 분위기도 좋아서 만족했습니다.',
    '0ef59f5e0bc54abc891236e3a15e3bda',
    'USER',
    1,
    5,
    1
);

INSERT INTO review (
    title,
    content,
    user_id,
    user_type,
    history_id,
    rating,
    is_visible
) VALUES (
    '재등록 의사 있어요',
    '운동 효과가 확실해서 다음 달에도 이용하려고 합니다.',
    'c9d97230213a4dba98bad77dc63f0b52',
    'USER',
    2,
    4,
    1
);



DROP TABLE review;
-- 확인
SELECT * FROM review;

-- ================================
-- 이용내역
-- ================================
INSERT INTO RESERVATION_HISTORY (
    history_id,
    reservation_id,
    user_id,
    schedule_id,
    sport_name,
    brch_id,
    trainer_id,
    trainer_name,
    rsv_dt,
    rsv_time,
    ref_id,
    reg_dt,
    review_written
) VALUES
(
    1,
    1001,
    'c9d97230213a4dba98bad77dc63f0b52',
    2001,
    '요가',
    1,
    501,
    '김트레이너',
    '2025-01-05',
    '10:00:00',
    2001,
    NOW(),
    'N'
),
(
    2,
    1002,
    'c9d97230213a4dba98bad77dc63f0b52',
    2002,
    '필라테스',
    1,
    502,
    '이트레이너',
    '2025-01-07',
    '14:00:00',
    2002,
    NOW(),
    'N'
),
(
    3,
    1003,
    'c9d97230213a4dba98bad77dc63f0b52',
    2003,
    '헬스 PT',
    2,
    503,
    '박트레이너',
    '2025-01-03',
    '18:30:00',
    2003,
    NOW(),
    'N'
);

SELECT * FROM reservation_history;