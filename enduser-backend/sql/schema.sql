-- ============================================
-- FitNeeds DB 스키마 생성 SQL
-- 데이터베이스: fitneedsdb
-- DBMS: MariaDB
-- ============================================

-- 데이터베이스 생성 (필요시)
-- CREATE DATABASE IF NOT EXISTS fitneedsdb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USE fitneedsdb;

-- ============================================
-- 1. USER 테이블 (회원 정보)
-- ============================================
CREATE TABLE IF NOT EXISTS `USER` (
    `userId` VARCHAR(50) NOT NULL PRIMARY KEY COMMENT '회원 ID',
    `email` VARCHAR(100) COMMENT '이메일',
    `userName` VARCHAR(50) NOT NULL COMMENT '회원 이름',
    `password` VARCHAR(255) NOT NULL COMMENT '비밀번호',
    `auth` VARCHAR(50) COMMENT '권한'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='회원 정보 테이블';

-- ============================================
-- 2. SCHEDULE 테이블 (운동 스케줄)
-- ============================================
CREATE TABLE IF NOT EXISTS `SCHEDULE` (
    `schd_id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '스케줄 ID',
    `exercise_name` VARCHAR(100) COMMENT '운동명',
    `exercise_date` DATETIME COMMENT '운동 날짜/시간',
    `exercise_location` VARCHAR(100) COMMENT '운동 장소',
    `trainer_name` VARCHAR(50) COMMENT '트레이너 이름',
    `capacity` INT DEFAULT 0 COMMENT '정원',
    `current_count` INT DEFAULT 0 COMMENT '현재 예약 인원'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='운동 스케줄 테이블';

-- ============================================
-- 3. TICKET 테이블 (이용권)
-- ============================================
CREATE TABLE IF NOT EXISTS `TICKET` (
    `tkt_id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '이용권 ID',
    `usr_id` VARCHAR(50) NOT NULL COMMENT '회원 ID',
    `ticket_type` VARCHAR(50) COMMENT '이용권 종류',
    `remaining_count` INT DEFAULT 0 COMMENT '남은 횟수',
    `expiry_date` DATETIME COMMENT '만료일',
    FOREIGN KEY (`usr_id`) REFERENCES `USER`(`userId`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='이용권 테이블';

-- ============================================
-- 4. RESERVATION 테이블 (예약)
-- ============================================
CREATE TABLE IF NOT EXISTS `RESERVATION` (
    `rsv_id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '예약 ID',
    `usr_id` VARCHAR(50) NOT NULL COMMENT '회원 ID',
    `schd_id` BIGINT NOT NULL COMMENT '스케줄 ID',
    `tkt_id` BIGINT COMMENT '이용권 ID',
    `stts_cd` VARCHAR(20) NOT NULL DEFAULT 'RESERVED' COMMENT '상태코드 (RESERVED, CANCELLED, COMPLETED)',
    `reg_dt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '등록일시',
    `cncl_rsn` VARCHAR(255) COMMENT '취소/변경사유',
    `mod_usr_ID` VARCHAR(50) COMMENT '수정자ID',
    `rsvd_dt` DATETIME NOT NULL COMMENT '예약날짜 (사용자 선택날짜)',
    FOREIGN KEY (`usr_id`) REFERENCES `USER`(`userId`) ON DELETE CASCADE,
    FOREIGN KEY (`schd_id`) REFERENCES `SCHEDULE`(`schd_id`) ON DELETE CASCADE,
    FOREIGN KEY (`tkt_id`) REFERENCES `TICKET`(`tkt_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='예약 테이블';

-- ============================================
-- 5. PAYMENT 테이블 (결제)
-- ============================================
CREATE TABLE IF NOT EXISTS `PAYMENT` (
    `pay_id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '결제 ID',
    `rsv_id` BIGINT NOT NULL COMMENT '예약 ID',
    `usr_id` VARCHAR(50) NOT NULL COMMENT '회원 ID',
    `payment_status` VARCHAR(50) NOT NULL DEFAULT 'BANK_TRANSFER_PENDING' COMMENT '결제 상태 (BANK_TRANSFER_PENDING, BANK_TRANSFER_COMPLETED)',
    `payment_amount` DECIMAL(10, 2) COMMENT '결제 금액',
    `payment_date` DATETIME COMMENT '결제일시',
    `reg_dt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '등록일시',
    FOREIGN KEY (`rsv_id`) REFERENCES `RESERVATION`(`rsv_id`) ON DELETE CASCADE,
    FOREIGN KEY (`usr_id`) REFERENCES `USER`(`userId`) ON DELETE CASCADE,
    UNIQUE KEY `uk_payment_reservation` (`rsv_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='결제 테이블';

-- ============================================
-- 6. ATTENDANCE 테이블 (출석)
-- ============================================
CREATE TABLE IF NOT EXISTS `ATTENDANCE` (
    `att_id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '출석 ID',
    `usr_id` VARCHAR(50) NOT NULL COMMENT '회원 ID',
    `rsv_id` BIGINT COMMENT '예약 ID',
    `tkt_id` BIGINT NOT NULL COMMENT '사용한 이용권 ID',
    `prod_id` BIGINT NOT NULL COMMENT '이용권 상품ID',
    `att_dt` DATE NOT NULL COMMENT '출석일',
    `att_stts_cd` VARCHAR(20) NOT NULL DEFAULT 'ATTEND' COMMENT '출석상태 (ATTEND, ABSENT, CANCEL)',
    `mod_dt` DATETIME COMMENT '수정일시',
    `mod_usr_id` VARCHAR(50) COMMENT '수정자ID',
    FOREIGN KEY (`usr_id`) REFERENCES `USER`(`userId`) ON DELETE CASCADE,
    FOREIGN KEY (`rsv_id`) REFERENCES `RESERVATION`(`rsv_id`) ON DELETE SET NULL,
    FOREIGN KEY (`tkt_id`) REFERENCES `TICKET`(`tkt_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='출석 테이블';

-- ============================================
-- 7. REVIEW 테이블 (리뷰)
-- ============================================
CREATE TABLE IF NOT EXISTS `REVIEW` (
    `RVW_ID` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '리뷰 ID',
    `RSV_ID` BIGINT NOT NULL COMMENT '예약 ID',
    `RATING` INT NOT NULL COMMENT '별점 (1-5)',
    `CONTENT` TEXT COMMENT '후기 내용',
    `INST_ID` BIGINT NOT NULL COMMENT '강사 ID',
    `REG_DT` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '작성일',
    FOREIGN KEY (`RSV_ID`) REFERENCES `RESERVATION`(`rsv_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='리뷰 테이블';

-- ============================================
-- 인덱스 생성
-- ============================================
CREATE INDEX `idx_reservation_user` ON `RESERVATION`(`usr_id`);
CREATE INDEX `idx_reservation_schedule` ON `RESERVATION`(`schd_id`);
CREATE INDEX `idx_reservation_status` ON `RESERVATION`(`stts_cd`);
CREATE INDEX `idx_payment_user` ON `PAYMENT`(`usr_id`);
CREATE INDEX `idx_payment_status` ON `PAYMENT`(`payment_status`);
CREATE INDEX `idx_attendance_user` ON `ATTENDANCE`(`usr_id`);
CREATE INDEX `idx_attendance_date` ON `ATTENDANCE`(`att_dt`);
CREATE INDEX `idx_review_reservation` ON `REVIEW`(`RSV_ID`);

