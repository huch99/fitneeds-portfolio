


-- 1. 지점 테이블
CREATE TABLE branch (
    brch_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    brch_nm VARCHAR(50) NOT NULL,
    addr VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    oper_yn TINYINT(1) NOT NULL DEFAULT 1,
    reg_dt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    upd_dt DATETIME(6) ON UPDATE CURRENT_TIMESTAMP(6)
);

-- 2. 지점 정보 테이블
CREATE TABLE branch_info (
    br_info_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    brch_id BIGINT,
    open_time TIME NOT NULL DEFAULT '06:00:00',
    close_time TIME NOT NULL DEFAULT '23:00:00',
    break_start_time TIME,
    break_end_time TIME,
    holiday_info TEXT,
    policy_info TEXT,
    creat_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    upd_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (brch_id) REFERENCES branch(brch_id)
);

-- 3. 프로그램 테이블
CREATE TABLE program (
    prog_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    prog_nm VARCHAR(255) NOT NULL,
    sport_id VARCHAR(255) NOT NULL,
    type_cd VARCHAR(255) NOT NULL,
    detail_type_cd TEXT,
    one_time_amt INT NOT NULL,
    rwd_game_point INT NOT NULL,
    use_yn TINYINT(1) DEFAULT 1,
    reg_dt DATETIME,
    upd_dt DATETIME
);

-- 4. 스케줄 테이블
CREATE TABLE schedule (
    schd_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    brch_id BIGINT,
    prog_id BIGINT NOT NULL,
    usr_id VARCHAR(50) NOT NULL,
    strt_dt DATE NOT NULL,
    end_dt DATE NOT NULL,
    strt_tm TIME NOT NULL,
    end_tm TIME NOT NULL,
    max_nop_cnt INT DEFAULT 10,
    rsv_cnt INT DEFAULT 0,
    stts_cd VARCHAR(20) DEFAULT 'OPEN',
    description TEXT,
    reg_dt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    upd_dt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (prog_id) REFERENCES program(prog_id),
    FOREIGN KEY (usr_id) REFERENCES users_admin(user_id),
    INDEX idx_schedule_date (strt_dt)
);


-- ============================================
-- 데이터 INSERT
-- ============================================

-- 지점 데이터
INSERT INTO branch (brch_nm, addr, phone, oper_yn) VALUES
('수원본점', '경기도 수원시 영통구 월드컵로 123', '031-111-2222', 1),
('강남점', '서울특별시 강남구 테헤란로 456', '02-111-2222', 1),
('잠실점', '서울특별시 송파구 올림픽로 300', '02-222-3333', 1),
('홍대점', '서울특별시 마포구 홍익로 123', '02-333-4444', 1),
('영통점', '경기도 수원시 영통구 원천동', '031-333-4444', 1),
('기흥점', '경기도 용인시 기흥구 기흥로 789', '031-444-5555', 1),
('인계점', '경기도 수원시 팔달구 인계동', '031-666-7777', 1),
('분당점', '경기도 성남시 분당구 정자동', '031-777-8888', 1),
('일산점', '경기도 고양시 일산서구 주엽동', '031-888-9999', 1);


-- 지점 정보 데이터
INSERT INTO branch_info (brch_id, open_time, close_time, break_start_time, break_end_time, holiday_info, policy_info) VALUES
(1, '06:00:00', '23:00:00', NULL, NULL, '연중무휴', '주차장 무료 제공, 수건 대여 가능'),
(2, '06:30:00', '22:30:00', '12:00:00', '13:00:00', '매주 월요일 휴무', '주차장 유료 (2시간 무료), 락커룸 이용료 별도'),
(3, '07:00:00', '22:00:00', '13:00:00', '14:00:00', '매주 화요일 휴무', '주차장 유료 (1시간 무료)'),
(4, '06:00:00', '23:00:00', '12:00:00', '13:00:00', '매주 수요일 휴무', '주차장 무료 제공'),
(5, '07:00:00', '22:00:00', NULL, NULL, '연중무휴', '주차장 무료 제공'),
(6, '06:00:00', '22:30:00', '13:00:00', '14:00:00', '매주 목요일 휴무', '주차장 무료 제공, 샤워실 완비'),
(7, '07:00:00', '21:00:00', '12:30:00', '13:30:00', '매주 금요일 휴무', '주차장 유료, 개인 트레이닝 가능'),
(8, '06:30:00', '22:00:00', NULL, NULL, '연중무휴', '주차장 무료 제공, 키즈존 운영'),
(9, '07:00:00', '21:30:00', '13:00:00', '14:00:00', '매주 일요일 휴무', '주차장 무료 제공, 사우나 시설 완비');




-- 프로그램 데이터
INSERT INTO program (prog_nm, sport_id, type_cd, detail_type_cd, one_time_amt, rwd_game_point, reg_dt, upd_dt) VALUES
('수원본점 요가 기초 클래스', '1', 'PERSONAL', 'BEGINNER', 15000, 100, NOW(), NOW()),
('강남점 탁구 기초 클래스', '13', 'PERSONAL', 'BEGINNER', 20000, 100, NOW(), NOW()),
('강남점 러닝 중급 클래스', '15', 'GROUP', 'INTERMEDIATE', 25000, 150, NOW(), NOW()),
('잠실점 요가 기초 클래스', '1', 'PERSONAL', 'BEGINNER', 20000, 100, NOW(), NOW()),
('잠실점 탁구 중급 클래스', '13', 'GROUP', 'INTERMEDIATE', 25000, 150, NOW(), NOW()),
('홍대점 필라테스 고급 클래스', '2', 'GROUP', 'ADVANCED', 30000, 200, NOW(), NOW()),
('영통점 헬스 기초 클래스', '3', 'PERSONAL', 'BEGINNER', 18000, 120, NOW(), NOW()),
('기흥점 수영 중급 클래스', '4', 'GROUP', 'INTERMEDIATE', 28000, 180, NOW(), NOW()),
('인계점 복싱 기초 클래스', '6', 'GROUP', 'BEGINNER', 22000, 140, NOW(), NOW()),
('분당점 댄스 중급 클래스', '5', 'GROUP', 'INTERMEDIATE', 24000, 160, NOW(), NOW());


-- 스케줄 데이터
INSERT INTO schedule (brch_id, prog_id, usr_id, strt_dt, end_dt, strt_tm, end_tm, max_nop_cnt, rsv_cnt, stts_cd, description) VALUES
(1, 1, 'teacher001', '2026-02-01', '2026-02-01', '09:00:00', '10:30:00', 8, 2, 'OPEN', '초보자 환영'),
(2, 2, 'teacher002', '2026-02-01', '2026-02-01', '13:00:00', '15:00:00', 10, 0, 'OPEN', NULL),
(3, 4, 'teacher003', '2026-02-01', '2026-02-01', '14:00:00', '15:30:00', 12, 5, 'OPEN', '요가매트 제공'),
(4, 6, 'teacher004', '2026-02-02', '2026-02-02', '10:00:00', '12:00:00', 15, 8, 'OPEN', '필라테스 기구 사용'),
(5, 8, 'teacher005', '2026-02-03', '2026-02-03', '16:00:00', '17:30:00', 6, 3, 'OPEN', '수영복 필수'),
(1, 7, 'teacher001', '2026-02-04', '2026-02-04', '11:00:00', '12:30:00', 10, 4, 'OPEN', '헬스장 이용 안내'),
(2, 3, 'teacher002', '2026-02-05', '2026-02-05', '07:00:00', '08:00:00', 20, 12, 'OPEN', '아침 러닝 클래스');

