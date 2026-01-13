SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `CLASS_ATTENDANCE`;
DROP TABLE IF EXISTS `CLASS_RESERVATION`;
DROP TABLE IF EXISTS `CLASS_SCHEDULE`;

DROP TABLE IF EXISTS `TEACHER_SETTLEMENT_ITEM`;
DROP TABLE IF EXISTS `TEACHER_SETTLEMENT`;
DROP TABLE IF EXISTS `TEACHER_CERTIFICATE`;
DROP TABLE IF EXISTS `TEACHER_CAREER`;
DROP TABLE IF EXISTS `TEACHER_SPORT`;
DROP TABLE IF EXISTS `TEACHER_PROFILE`;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE `TEACHER_PROFILE`
(
    `USER_ID`         varchar(50)  NOT NULL,
    `BRCH_ID`         BIGINT       NOT NULL,
    `STTS_CD`         varchar(20)  NOT NULL DEFAULT 'ACTIVE',
    `HIRE_DT`         date         NOT NULL,
    `LEAVE_DT`        date         NULL,
    `LEAVE_RSN`       varchar(255) NULL,
    `INTRO`           varchar(255) NULL,
    `PROFILE_IMG_URL` varchar(500) NULL,
    `REG_DT`          datetime     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `UPD_DT`          datetime     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `UPD_USER_ID`     varchar(50)  NULL,
    KEY `IDX_TEACHER_PROFILE_BRCH_ID` (`BRCH_ID`),
    KEY `IDX_TEACHER_PROFILE_UPD_USER_ID` (`UPD_USER_ID`),
    PRIMARY KEY (`USER_ID`),
    CONSTRAINT `FK_TEACHER_PROFILE_USER_ID` FOREIGN KEY (`USER_ID`) REFERENCES `USERS_ADMIN` (`USER_ID`),
    CONSTRAINT `FK_TEACHER_PROFILE_BRCH_ID` FOREIGN KEY (`BRCH_ID`) REFERENCES `BRANCH` (`brch_id`),
    CONSTRAINT `FK_TEACHER_PROFILE_UPD_USER_ID` FOREIGN KEY (`UPD_USER_ID`) REFERENCES `USERS_ADMIN` (`USER_ID`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE TABLE `TEACHER_SPORT`
(
    `USER_ID`  varchar(50) NOT NULL,
    `SPORT_ID` BIGINT      NOT NULL,
    `MAIN_YN`  tinyint(1)  NOT NULL DEFAULT 0,
    `SORT_NO`  int         NOT NULL DEFAULT 1,
    `REG_DT`   datetime    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `UPD_DT`   datetime    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`USER_ID`, `SPORT_ID`),
    CONSTRAINT `FK_TEACHER_SPORT_USER_ID` FOREIGN KEY (`USER_ID`) REFERENCES `USERS_ADMIN` (`USER_ID`),
    CONSTRAINT `FK_TEACHER_SPORT_SPORT_ID` FOREIGN KEY (`SPORT_ID`) REFERENCES `SPORT_TYPE` (`sport_id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE TABLE `TEACHER_CAREER`
(
    `CAREER_ID`   BIGINT AUTO_INCREMENT NOT NULL,
    `USER_ID`     varchar(50)           NOT NULL,
    `ORG_NM`      varchar(255)          NOT NULL,
    `ROLE_NM`     varchar(255)          NULL,
    `STRT_DT`     date                  NOT NULL,
    `END_DT`      date                  NULL,
    `REG_DT`      datetime              NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `UPD_DT`      datetime              NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `UPD_USER_ID` varchar(50)           NULL,
    KEY `IDX_TEACHER_CAREER_USER_ID` (`USER_ID`),
    KEY `IDX_TEACHER_CAREER_UPD_USER_ID` (`UPD_USER_ID`),
    PRIMARY KEY (`CAREER_ID`),
    CONSTRAINT `FK_TEACHER_CAREER_USER_ID` FOREIGN KEY (`USER_ID`) REFERENCES `USERS_ADMIN` (`USER_ID`),
    CONSTRAINT `FK_TEACHER_CAREER_UPD_USER_ID` FOREIGN KEY (`UPD_USER_ID`) REFERENCES `USERS_ADMIN` (`USER_ID`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE TABLE `TEACHER_CERTIFICATE`
(
    `CERT_ID`     BIGINT AUTO_INCREMENT NOT NULL,
    `USER_ID`     varchar(50)           NOT NULL,
    `CERT_NM`     varchar(255)          NOT NULL,
    `ISSUER`      varchar(255)          NULL,
    `ACQ_DT`    date                  NULL,
    `REG_DT`      datetime              NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `UPD_DT`      datetime              NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `UPD_USER_ID` varchar(50)           NULL,
    KEY `IDX_TEACHER_CERTIFICATE_USER_ID` (`USER_ID`),
    KEY `IDX_TEACHER_CERTIFICATE_UPD_USER_ID` (`UPD_USER_ID`),
    PRIMARY KEY (`CERT_ID`),
    CONSTRAINT `FK_TEACHER_CERTIFICATE_USER_ID` FOREIGN KEY (`USER_ID`) REFERENCES `USERS_ADMIN` (`USER_ID`),
    CONSTRAINT `FK_TEACHER_CERTIFICATE_UPD_USER_ID` FOREIGN KEY (`UPD_USER_ID`) REFERENCES `USERS_ADMIN` (`USER_ID`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE TABLE `TEACHER_SETTLEMENT`
(
    `STLM_ID`     BIGINT AUTO_INCREMENT NOT NULL,
    `STLM_MONTH`  varchar(7)            NOT NULL,
    `BRCH_ID`     BIGINT                NOT NULL,
    `USER_ID`     varchar(50)           NOT NULL,
    `CLASS_CNT`   int                   NOT NULL DEFAULT 0,
    `GROSS_AMT`   decimal(19, 4)        NOT NULL DEFAULT 0,
    `FEE_RATE`    decimal(5, 2)         NOT NULL DEFAULT 10,
    `FEE_AMT`     decimal(19, 4)        NOT NULL DEFAULT 0,
    `NET_AMT`     decimal(19, 4)        NOT NULL DEFAULT 0,
    `STTS_CD`     varchar(20)           NOT NULL DEFAULT 'TARGET',
    `PAY_PLN_DT`  date                  NULL,
    `PAID_DT`     date                  NULL,
    `REG_DT`      datetime              NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `UPD_DT`      datetime              NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `UPD_USER_ID` varchar(50)           NULL,
    KEY `IDX_TEACHER_SETTLEMENT_BRCH_ID` (`BRCH_ID`),
    KEY `IDX_TEACHER_SETTLEMENT_USER_ID` (`USER_ID`),
    KEY `IDX_TEACHER_SETTLEMENT_UPD_USER_ID` (`UPD_USER_ID`),
    PRIMARY KEY (`STLM_ID`),
    CONSTRAINT `FK_TEACHER_SETTLEMENT_BRCH_ID` FOREIGN KEY (`BRCH_ID`) REFERENCES `BRANCH` (`brch_id`),
    CONSTRAINT `FK_TEACHER_SETTLEMENT_USER_ID` FOREIGN KEY (`USER_ID`) REFERENCES `USERS_ADMIN` (`USER_ID`),
    CONSTRAINT `FK_TEACHER_SETTLEMENT_UPD_USER_ID` FOREIGN KEY (`UPD_USER_ID`) REFERENCES `USERS_ADMIN` (`USER_ID`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE TABLE `TEACHER_SETTLEMENT_ITEM`
(
    `STLM_ITEM_ID` BIGINT AUTO_INCREMENT NOT NULL,
    `STLM_ID`      BIGINT                NOT NULL,
    `SCHD_ID`      BIGINT                NOT NULL,
    `GROSS_AMT`    decimal(19, 4)        NOT NULL DEFAULT 0,
    `FEE_AMT`      decimal(19, 4)        NOT NULL DEFAULT 0,
    `NET_AMT`      decimal(19, 4)        NOT NULL DEFAULT 0,
    `LINE_STTS_CD` varchar(20)           NOT NULL DEFAULT 'NORMAL',
    `REG_DT`       datetime              NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `UPD_DT`       datetime              NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `UPD_USER_ID`  varchar(50)           NULL,
    KEY `IDX_TEACHER_SETTLEMENT_ITEM_STLM_ID` (`STLM_ID`),
    KEY `IDX_TEACHER_SETTLEMENT_ITEM_SCHD_ID` (`SCHD_ID`),
    KEY `IDX_TEACHER_SETTLEMENT_ITEM_UPD_USER_ID` (`UPD_USER_ID`),
    PRIMARY KEY (`STLM_ITEM_ID`),
    CONSTRAINT `FK_TEACHER_SETTLEMENT_ITEM_STLM_ID` FOREIGN KEY (`STLM_ID`) REFERENCES `TEACHER_SETTLEMENT` (`STLM_ID`),
    CONSTRAINT `FK_TEACHER_SETTLEMENT_ITEM_SCHD_ID` FOREIGN KEY (`SCHD_ID`) REFERENCES `SCHEDULE` (`schd_id`),
    CONSTRAINT `FK_TEACHER_SETTLEMENT_ITEM_UPD_USER_ID` FOREIGN KEY (`UPD_USER_ID`) REFERENCES `USERS_ADMIN` (`USER_ID`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE TABLE `CLASS_SCHEDULE`
(
    `SCHD_ID`     BIGINT AUTO_INCREMENT NOT NULL,
    `BRANCH_ID`   BIGINT                NOT NULL,
    `SPORT_ID`    BIGINT                NOT NULL,
    `USER_ID`     varchar(50)           NOT NULL,
    `CLASS_TITLE` varchar(200)          NOT NULL,
    `START_AT`    datetime              NOT NULL,
    `END_AT`      datetime              NOT NULL,
    `CAPACITY`    int                   NOT NULL DEFAULT 1,
    `STATUS_CODE` varchar(50)           NOT NULL DEFAULT 'OPEN',
    `CREATED_AT`  timestamp             NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `UPDATED_AT`  timestamp             NOT NULL DEFAULT CURRENT_TIMESTAMP,
    KEY `IDX_CLASS_SCHEDULE_BRANCH_ID` (`BRANCH_ID`),
    KEY `IDX_CLASS_SCHEDULE_SPORT_ID` (`SPORT_ID`),
    KEY `IDX_CLASS_SCHEDULE_USER_ID` (`USER_ID`),
    PRIMARY KEY (`SCHD_ID`),
    CONSTRAINT `FK_CLASS_SCHEDULE_BRANCH_ID` FOREIGN KEY (`BRANCH_ID`) REFERENCES `BRANCH` (`brch_id`),
    CONSTRAINT `FK_CLASS_SCHEDULE_SPORT_ID` FOREIGN KEY (`SPORT_ID`) REFERENCES `SPORT_TYPE` (`sport_id`),
    CONSTRAINT `FK_CLASS_SCHEDULE_USER_ID` FOREIGN KEY (`USER_ID`) REFERENCES `USERS_ADMIN` (`USER_ID`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE TABLE `CLASS_RESERVATION`
(
    `RSV_ID`      BIGINT AUTO_INCREMENT NOT NULL,
    `SCHD_ID`     BIGINT                NOT NULL,
    `USER_ID`     varchar(50)           NOT NULL,
    `STATUS_CODE` varchar(50)           NOT NULL DEFAULT 'RESERVED',
    `PAID_AMOUNT` int                   NULL,
    `CANCEL_AT`   datetime              NULL,
    `CREATED_AT`  timestamp             NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `UPDATED_AT`  timestamp             NOT NULL DEFAULT CURRENT_TIMESTAMP,
    KEY `IDX_CLASS_RESERVATION_SCHD_ID` (`SCHD_ID`),
    KEY `IDX_CLASS_RESERVATION_USER_ID` (`USER_ID`),
    PRIMARY KEY (`RSV_ID`),
    CONSTRAINT `FK_CLASS_RESERVATION_SCHD_ID` FOREIGN KEY (`SCHD_ID`) REFERENCES `CLASS_SCHEDULE` (`SCHD_ID`),
    CONSTRAINT `FK_CLASS_RESERVATION_USER_ID` FOREIGN KEY (`USER_ID`) REFERENCES `USERS` (`USER_ID`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE TABLE `CLASS_ATTENDANCE`
(
    `ATND_ID`    BIGINT AUTO_INCREMENT NOT NULL,
    `RSV_ID`     BIGINT                NOT NULL,
    `ATND_YN`    char(1)               NOT NULL DEFAULT 'N',
    `CHECKIN_AT` datetime              NULL,
    `CREATED_AT` timestamp             NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `UPDATED_AT` timestamp             NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`ATND_ID`),
    UNIQUE KEY `UK_CLASS_ATTENDANCE_RSV_ID` (`RSV_ID`),
    CONSTRAINT `FK_CLASS_ATTENDANCE_RSV_ID` FOREIGN KEY (`RSV_ID`) REFERENCES `CLASS_RESERVATION` (`RSV_ID`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE CLASS_ATTENDANCE;
TRUNCATE TABLE CLASS_RESERVATION;
TRUNCATE TABLE CLASS_SCHEDULE;

TRUNCATE TABLE TEACHER_SETTLEMENT_ITEM;
TRUNCATE TABLE TEACHER_SETTLEMENT;
TRUNCATE TABLE TEACHER_CERTIFICATE;
TRUNCATE TABLE TEACHER_CAREER;
TRUNCATE TABLE TEACHER_SPORT;
TRUNCATE TABLE TEACHER_PROFILE;

SET FOREIGN_KEY_CHECKS = 1;

/* =========================
   1) 고정 USER_ID
   ========================= */
SET @SYS := '00000000-0000-0000-0000-000000000001';
SET @BAD := '00000000-0000-0000-0000-000000000002';
SET @T1  := '3a1c1111-2222-3333-4444-555555555555';
SET @T2  := '7b2d1111-2222-3333-4444-555555555555';

SET @M1  := '10000000-0000-0000-0000-000000000001';
SET @M2  := '10000000-0000-0000-0000-000000000002';


/* =========================
   2) 부모 테이블 생성
   ========================= */

-- 2-1) branch (AUTO_INCREMENT)
INSERT IGNORE INTO branch (addr, brch_nm, oper_yn, reg_dt, upd_dt)
VALUES ('서울 강남구', 'DUMMY_강남점', b'1', NOW(6), NOW(6));
SET @BR1 := IF(LAST_INSERT_ID() = 0,
               (SELECT brch_id FROM branch WHERE brch_nm='DUMMY_강남점' ORDER BY brch_id DESC LIMIT 1),
               LAST_INSERT_ID());

INSERT IGNORE INTO branch (addr, brch_nm, oper_yn, reg_dt, upd_dt)
VALUES ('서울 마포구', 'DUMMY_홍대점', b'1', NOW(6), NOW(6));
SET @BR2 := IF(LAST_INSERT_ID() = 0,
               (SELECT brch_id FROM branch WHERE brch_nm='DUMMY_홍대점' ORDER BY brch_id DESC LIMIT 1),
               LAST_INSERT_ID());

-- 2-2) sport_type (AUTO_INCREMENT)
INSERT IGNORE INTO sport_type (del_dt, reg_dt, sport_memo, sport_nm, upd_dt, use_yn)
VALUES (NULL, NOW(6), '더미 종목', 'DUMMY_PT', NOW(6), 1);
SET @SP1 := IF(LAST_INSERT_ID() = 0,
               (SELECT sport_id FROM sport_type WHERE sport_nm='DUMMY_PT' ORDER BY sport_id DESC LIMIT 1),
               LAST_INSERT_ID());

INSERT IGNORE INTO sport_type (del_dt, reg_dt, sport_memo, sport_nm, upd_dt, use_yn)
VALUES (NULL, NOW(6), '더미 종목', 'DUMMY_필라테스', NOW(6), 1);
SET @SP2 := IF(LAST_INSERT_ID() = 0,
               (SELECT sport_id FROM sport_type WHERE sport_nm='DUMMY_필라테스' ORDER BY sport_id DESC LIMIT 1),
               LAST_INSERT_ID());

INSERT IGNORE INTO sport_type (del_dt, reg_dt, sport_memo, sport_nm, upd_dt, use_yn)
VALUES (NULL, NOW(6), '더미 종목', 'DUMMY_요가', NOW(6), 1);
SET @SP3 := IF(LAST_INSERT_ID() = 0,
               (SELECT sport_id FROM sport_type WHERE sport_nm='DUMMY_요가' ORDER BY sport_id DESC LIMIT 1),
               LAST_INSERT_ID());

-- 2-3) users (회원) - PK 고정 UUID, email UNIQUE
INSERT IGNORE INTO users (user_id, email, password, user_name, phone_number, role, cash_point, grade_point, is_active, agree_at)
VALUES
    (@M1, 'dummy_member1@test.com', 'x', '더미회원A', '010-9000-0001', 'USER', 0, 0, 1, NOW()),
    (@M2, 'dummy_member2@test.com', 'x', '더미회원B', '010-9000-0002', 'USER', 0, 0, 1, NOW());

-- 2-4) users_admin (관리자/강사)
INSERT IGNORE INTO users_admin (user_id, email, password, user_name, phone_number, role, is_active, agree_at, brch_id)
VALUES
    (@SYS, 'dummy_sys@test.com',      'x', '더미시스템', '010-8000-0001', 'SYSTEM_ADMIN', 1, NOW(), NULL),
    (@BAD, 'dummy_branch@test.com',   'x', '더미지점장', '010-8000-0002', 'BRANCH_ADMIN', 1, NOW(), @BR1),
    (@T1,  'dummy_teacher1@test.com', 'x', '더미강사1',  '010-8000-1001', 'TEACHER',      1, NOW(), @BR1),
    (@T2,  'dummy_teacher2@test.com', 'x', '더미강사2',  '010-8000-1002', 'TEACHER',      1, NOW(), @BR2);


/* =========================
   3) program / schedule 생성
   ========================= */

-- 3-1) program (AUTO_INCREMENT)
INSERT IGNORE INTO program (one_time_amt, prog_nm, reg_dt, rwd_game_pnt, upd_dt, use_yn, brch_id, sport_id)
VALUES (30000, 'DUMMY_PT 프로그램(강남)', NOW(6), 0, NOW(6), 1, @BR1, @SP1);
SET @P1 := IF(LAST_INSERT_ID() = 0,
              (SELECT prog_id FROM program WHERE prog_nm='DUMMY_PT 프로그램(강남)' ORDER BY prog_id DESC LIMIT 1),
              LAST_INSERT_ID());

INSERT IGNORE INTO program (one_time_amt, prog_nm, reg_dt, rwd_game_pnt, upd_dt, use_yn, brch_id, sport_id)
VALUES (20000, 'DUMMY_요가 프로그램(홍대)', NOW(6), 0, NOW(6), 1, @BR2, @SP3);
SET @P2 := IF(LAST_INSERT_ID() = 0,
              (SELECT prog_id FROM program WHERE prog_nm='DUMMY_요가 프로그램(홍대)' ORDER BY prog_id DESC LIMIT 1),
              LAST_INSERT_ID());

-- 3-2) schedule (AUTO_INCREMENT)
INSERT IGNORE INTO schedule
(description, end_tm, max_nop_cnt, reg_dt, rsv_cnt, strt_dt, strt_tm, stts_cd, upd_dt, brch_id, prog_id, user_id)
VALUES
    ('DUMMY_정산용 스케줄(PT)',  '11:00:00.000000', 10, NOW(6), 0, '2026-01-10', '10:00:00.000000', 'OPEN', NOW(6), @BR1, @P1, @T1);
SET @SCHD1 := IF(LAST_INSERT_ID() = 0,
                 (SELECT schd_id FROM schedule WHERE description='DUMMY_정산용 스케줄(PT)' ORDER BY schd_id DESC LIMIT 1),
                 LAST_INSERT_ID());

INSERT IGNORE INTO schedule
(description, end_tm, max_nop_cnt, reg_dt, rsv_cnt, strt_dt, strt_tm, stts_cd, upd_dt, brch_id, prog_id, user_id)
VALUES
    ('DUMMY_정산용 스케줄(요가)', '19:00:00.000000', 12, NOW(6), 0, '2026-01-11', '18:00:00.000000', 'OPEN', NOW(6), @BR2, @P2, @T2);
SET @SCHD2 := IF(LAST_INSERT_ID() = 0,
                 (SELECT schd_id FROM schedule WHERE description='DUMMY_정산용 스케줄(요가)' ORDER BY schd_id DESC LIMIT 1),
                 LAST_INSERT_ID());


/* =========================
   4) 강사관리(풀세트) 더미
   ========================= */

-- 4-1) teacher_profile
INSERT IGNORE INTO teacher_profile
(USER_ID, BRCH_ID, STTS_CD, HIRE_DT, LEAVE_DT, LEAVE_RSN, INTRO, PROFILE_IMG_URL, REG_DT, UPD_DT, UPD_USER_ID)
VALUES
    (@T1, @BR1, 'ACTIVE', '2025-10-01', NULL, NULL, '더미강사1 소개', NULL, NOW(), NOW(), @BAD),
    (@T2, @BR2, 'HIDDEN', '2025-11-01', NULL, NULL, '더미강사2 소개', NULL, NOW(), NOW(), @BAD);

-- 4-2) teacher_sport
INSERT IGNORE INTO teacher_sport (USER_ID, SPORT_ID, MAIN_YN, SORT_NO)
VALUES
    (@T1, @SP1, 1, 1),
    (@T1, @SP2, 0, 2),
    (@T2, @SP3, 1, 1);

-- 4-3) teacher_career
INSERT IGNORE INTO teacher_career (USER_ID, ORG_NM, ROLE_NM, STRT_DT, END_DT, UPD_USER_ID)
VALUES
    (@T1, '더미센터A', '트레이너', '2022-01-01', '2024-12-31', @BAD),
    (@T1, '더미센터B', '헤드 트레이너', '2025-01-01', NULL, @BAD),
    (@T2, '더미요가원', '요가 강사', '2021-03-01', NULL, @BAD);

-- 4-4) teacher_certificate
INSERT IGNORE INTO teacher_certificate (USER_ID, CERT_NM, ISSUER, ACQ_DT, UPD_USER_ID)
VALUES
    (@T1, '더미자격증1', '더미기관', '2021-06-10', @BAD),
    (@T1, '더미자격증2', '더미기관', '2023-02-15', @BAD),
    (@T2, '더미자격증3', '더미기관', '2020-09-01', @BAD);

-- 4-5) teacher_settlement
INSERT IGNORE INTO teacher_settlement
(STLM_MONTH, BRCH_ID, USER_ID, CLASS_CNT, GROSS_AMT, FEE_RATE, FEE_AMT, NET_AMT, STTS_CD, PAY_PLN_DT, PAID_DT, UPD_USER_ID)
VALUES
    ('2026-01', @BR1, @T1, 2, 55000.0000, 10.00, 5500.0000, 49500.0000, 'TARGET', NULL, NULL, @BAD);
SET @STLM1 := IF(LAST_INSERT_ID() = 0,
                 (SELECT STLM_ID FROM teacher_settlement
                  WHERE STLM_MONTH='2026-01' AND USER_ID=@T1 AND BRCH_ID=@BR1
                  ORDER BY STLM_ID DESC LIMIT 1),
                 LAST_INSERT_ID());

INSERT IGNORE INTO teacher_settlement
(STLM_MONTH, BRCH_ID, USER_ID, CLASS_CNT, GROSS_AMT, FEE_RATE, FEE_AMT, NET_AMT, STTS_CD, PAY_PLN_DT, PAID_DT, UPD_USER_ID)
VALUES
    ('2026-01', @BR2, @T2, 1, 20000.0000, 10.00, 2000.0000, 18000.0000, 'TARGET', NULL, NULL, @BAD);
SET @STLM2 := IF(LAST_INSERT_ID() = 0,
                 (SELECT STLM_ID FROM teacher_settlement
                  WHERE STLM_MONTH='2026-01' AND USER_ID=@T2 AND BRCH_ID=@BR2
                  ORDER BY STLM_ID DESC LIMIT 1),
                 LAST_INSERT_ID());

-- 4-6) teacher_settlement_item
INSERT IGNORE INTO teacher_settlement_item (STLM_ID, SCHD_ID, GROSS_AMT, FEE_AMT, NET_AMT, LINE_STTS_CD, UPD_USER_ID)
VALUES
    (@STLM1, @SCHD1, 30000.0000, 3000.0000, 27000.0000, 'NORMAL', @BAD),
    (@STLM1, @SCHD2, 25000.0000, 2500.0000, 22500.0000, 'NORMAL', @BAD),
    (@STLM2, @SCHD2, 20000.0000, 2000.0000, 18000.0000, 'NORMAL', @BAD);


/* =========================
   5) 내 수업관리(풀세트) 더미
   ========================= */

-- 5-1) class_schedule (AUTO_INCREMENT)
INSERT IGNORE INTO class_schedule
(BRANCH_ID, SPORT_ID, USER_ID, CLASS_TITLE, START_AT, END_AT, CAPACITY, STATUS_CODE)
VALUES
    (@BR1, @SP1, @T1, 'DUMMY_강사1 - 수업 A', '2026-01-10 10:00:00', '2026-01-10 11:00:00', 10, 'OPEN');
SET @CS1 := IF(LAST_INSERT_ID() = 0,
               (SELECT SCHD_ID FROM class_schedule WHERE CLASS_TITLE='DUMMY_강사1 - 수업 A' ORDER BY SCHD_ID DESC LIMIT 1),
               LAST_INSERT_ID());

INSERT IGNORE INTO class_schedule
(BRANCH_ID, SPORT_ID, USER_ID, CLASS_TITLE, START_AT, END_AT, CAPACITY, STATUS_CODE)
VALUES
    (@BR1, @SP2, @T1, 'DUMMY_강사1 - 수업 B', '2026-01-12 14:00:00', '2026-01-12 15:00:00', 8, 'OPEN');
SET @CS2 := IF(LAST_INSERT_ID() = 0,
               (SELECT SCHD_ID FROM class_schedule WHERE CLASS_TITLE='DUMMY_강사1 - 수업 B' ORDER BY SCHD_ID DESC LIMIT 1),
               LAST_INSERT_ID());

INSERT IGNORE INTO class_schedule
(BRANCH_ID, SPORT_ID, USER_ID, CLASS_TITLE, START_AT, END_AT, CAPACITY, STATUS_CODE)
VALUES
    (@BR2, @SP3, @T2, 'DUMMY_강사2 - 수업 C', '2026-01-11 18:00:00', '2026-01-11 19:00:00', 12, 'OPEN');
SET @CS3 := IF(LAST_INSERT_ID() = 0,
               (SELECT SCHD_ID FROM class_schedule WHERE CLASS_TITLE='DUMMY_강사2 - 수업 C' ORDER BY SCHD_ID DESC LIMIT 1),
               LAST_INSERT_ID());

-- 5-2) class_reservation
INSERT IGNORE INTO class_reservation (SCHD_ID, USER_ID, STATUS_CODE, PAID_AMOUNT, CANCEL_AT)
VALUES
    (@CS1, @M1, 'RESERVED', 30000, NULL);
SET @R1 := IF(LAST_INSERT_ID() = 0,
              (SELECT RSV_ID FROM class_reservation WHERE SCHD_ID=@CS1 AND USER_ID=@M1 ORDER BY RSV_ID DESC LIMIT 1),
              LAST_INSERT_ID());

INSERT IGNORE INTO class_reservation (SCHD_ID, USER_ID, STATUS_CODE, PAID_AMOUNT, CANCEL_AT)
VALUES
    (@CS1, @M2, 'CANCELED', 30000, '2026-01-09 20:00:00');

INSERT IGNORE INTO class_reservation (SCHD_ID, USER_ID, STATUS_CODE, PAID_AMOUNT, CANCEL_AT)
VALUES
    (@CS2, @M1, 'RESERVED', 25000, NULL);

INSERT IGNORE INTO class_reservation (SCHD_ID, USER_ID, STATUS_CODE, PAID_AMOUNT, CANCEL_AT)
VALUES
    (@CS3, @M1, 'RESERVED', 20000, NULL);
SET @R4 := IF(LAST_INSERT_ID() = 0,
              (SELECT RSV_ID FROM class_reservation WHERE SCHD_ID=@CS3 AND USER_ID=@M1 ORDER BY RSV_ID DESC LIMIT 1),
              LAST_INSERT_ID());

INSERT IGNORE INTO class_reservation (SCHD_ID, USER_ID, STATUS_CODE, PAID_AMOUNT, CANCEL_AT)
VALUES
    (@CS3, @M2, 'RESERVED', 20000, NULL);

-- 5-3) class_attendance
INSERT IGNORE INTO class_attendance (RSV_ID, ATND_YN, CHECKIN_AT)
VALUES
    (@R1, 'Y', '2026-01-10 09:58:00'),
    (@R4, 'N', NULL);


/* =========================
   6) 검증
   ========================= */
SELECT 'users_admin' t, COUNT(*) cnt
FROM users_admin
WHERE user_id IN (
                  '00000000-0000-0000-0000-000000000001',
                  '00000000-0000-0000-0000-000000000002',
                  '3a1c1111-2222-3333-4444-555555555555',
                  '7b2d1111-2222-3333-4444-555555555555'
    )
UNION ALL
SELECT 'users', COUNT(*)
FROM users
WHERE user_id IN (
                  '10000000-0000-0000-0000-000000000001',
                  '10000000-0000-0000-0000-000000000002'
    )
UNION ALL
SELECT 'teacher_profile', COUNT(*)
FROM teacher_profile
WHERE USER_ID IN (
                  '3a1c1111-2222-3333-4444-555555555555',
                  '7b2d1111-2222-3333-4444-555555555555'
    )
UNION ALL
SELECT 'class_schedule', COUNT(*)
FROM class_schedule
WHERE USER_ID IN (
                  '3a1c1111-2222-3333-4444-555555555555',
                  '7b2d1111-2222-3333-4444-555555555555'
    );

-- 1) users_admin: 고정 user_id들이 실제로 존재하나?
SELECT user_id, email, role, brch_id
FROM users_admin
WHERE user_id IN (
                  '00000000-0000-0000-0000-000000000001',
                  '00000000-0000-0000-0000-000000000002',
                  '3a1c1111-2222-3333-4444-555555555555',
                  '7b2d1111-2222-3333-4444-555555555555'
    );

-- 2) users(회원): 고정 user_id들이 존재하나?
SELECT user_id, email, role
FROM users
WHERE user_id IN (
                  '10000000-0000-0000-0000-000000000001',
                  '10000000-0000-0000-0000-000000000002'
    );

-- 3) teacher_profile 실제로 들어갔나?
SELECT *
FROM teacher_profile
WHERE USER_ID IN (
                  '3a1c1111-2222-3333-4444-555555555555',
                  '7b2d1111-2222-3333-4444-555555555555'
    );

-- 4) class_schedule 실제로 들어갔나?
SELECT SCHD_ID, USER_ID, CLASS_TITLE
FROM class_schedule
WHERE USER_ID IN (
                  '3a1c1111-2222-3333-4444-555555555555',
                  '7b2d1111-2222-3333-4444-555555555555'
    );
