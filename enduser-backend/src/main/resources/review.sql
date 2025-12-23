show databases;
select * from fitneedsdb;
use fitneedsdb;

CREATE DATABASE fitneedsdb;

/* ===============================
   1. branch
================================ */
CREATE TABLE branch (
    brch_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    brch_nm VARCHAR(50) NOT NULL,
    addr    VARCHAR(255) NOT NULL,
    oper_yn TINYINT(1) NOT NULL DEFAULT 1,
    reg_dt  DATETIME NOT NULL,
    upd_dt  DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/* ===============================
   2. users
================================ */
CREATE TABLE users (
    user_id      VARCHAR(50) NOT NULL,
    user_name    VARCHAR(100) NOT NULL,
    email        VARCHAR(255) NOT NULL,
    password     VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    role         VARCHAR(50) NOT NULL DEFAULT 'USER',
    cash_point   INT NOT NULL DEFAULT 0,
    grade_point  INT NOT NULL DEFAULT 0,
    is_active    TINYINT(1) NOT NULL DEFAULT 1,
    agree_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    brch_id      BIGINT NULL,

    PRIMARY KEY (user_id),
    UNIQUE KEY uk_users_email (email),
    CONSTRAINT fk_user_branch
        FOREIGN KEY (brch_id) REFERENCES branch(brch_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/* ===============================
   3. SPORT_TYPE
================================ */
CREATE TABLE sport_type (
    sport_id   BIGINT AUTO_INCREMENT PRIMARY KEY,
    sport_nm   VARCHAR(100) NOT NULL,
    sport_memo VARCHAR(500),
    use_yn     TINYINT(1) NOT NULL,
    reg_dt     DATETIME NOT NULL,
    upd_dt     DATETIME NOT NULL,
    del_dt     DATETIME NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/* ===============================
   4. teacher
================================ */
CREATE TABLE teacher (
    teacher_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    teacher_name VARCHAR(80) NOT NULL,
    teacher_phone VARCHAR(30),
    teacher_email VARCHAR(190) UNIQUE,
    teacher_bio TEXT NOT NULL,
    teacher_status VARCHAR(20) NOT NULL DEFAULT '재직',
    profile_image_url VARCHAR(500),
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
        ON UPDATE CURRENT_TIMESTAMP(3),
    resigned_at DATETIME(3),

    CONSTRAINT fk_teacher_user
        FOREIGN KEY (user_id) REFERENCES users(user_id),
    CONSTRAINT chk_teacher_status
        CHECK (teacher_status IN ('재직','휴직','퇴사'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/* ===============================
   5. program
================================ */
CREATE TABLE program (
    prog_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    prog_nm VARCHAR(255) NOT NULL,
    sport_id BIGINT NOT NULL,
    use_yn TINYINT(1) DEFAULT 1,
    one_time_amt INT NOT NULL DEFAULT 0,
    rwd_game_point INT NOT NULL DEFAULT 0,
    reg_dt DATETIME NOT NULL,
    upd_dt DATETIME NOT NULL,

    CONSTRAINT fk_program_sport
        FOREIGN KEY (sport_id) REFERENCES SPORT_TYPE(sport_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/* ===============================
   6. PASS_PRODUCT
================================ */
CREATE TABLE pass_product (
    prod_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    sport_id BIGINT NOT NULL,
    prod_nm VARCHAR(100) NOT NULL,
    prod_amt INT NOT NULL,
    prv_cnt INT NOT NULL,
    use_yn TINYINT(1) NOT NULL DEFAULT 1,
    reg_dt DATETIME NOT NULL,
    upd_dt DATETIME NOT NULL,
    mod_usr_id VARCHAR(50),

    CONSTRAINT fk_product_sport
        FOREIGN KEY (sport_id) REFERENCES SPORT_TYPE(sport_id),
    CONSTRAINT fk_product_user
        FOREIGN KEY (mod_usr_id) REFERENCES users(user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/* ===============================
   7. user_pass
================================ */
CREATE TABLE user_pass (
    user_pass_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usr_id VARCHAR(50) NOT NULL,
    sport_id BIGINT NOT NULL,
    pass_status_cd VARCHAR(50) NOT NULL,
    rmn_cnt INT NOT NULL DEFAULT 0,
    lst_prod_id BIGINT,
    reg_dt DATETIME NOT NULL,
    upd_dt DATETIME NOT NULL,
    init_cnt BIGINT NOT NULL,

    UNIQUE KEY uk_user_sport (usr_id, sport_id),
    CONSTRAINT fk_userpass_user
        FOREIGN KEY (usr_id) REFERENCES users(user_id),
    CONSTRAINT fk_userpass_sport
        FOREIGN KEY (sport_id) REFERENCES SPORT_TYPE(sport_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/* ===============================
   8. schedule
================================ */
CREATE TABLE schedule (
    schd_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    prog_id BIGINT NOT NULL,
    usr_id VARCHAR(50) NOT NULL,
    strt_dt DATE NOT NULL,
    end_dt DATE NOT NULL,
    strt_tm TIME NOT NULL,
    end_tm TIME NOT NULL,
    max_nop_cnt INT NOT NULL,
    rsv_cnt INT NOT NULL DEFAULT 0,
    stts_cd VARCHAR(20) NOT NULL,
    description TEXT,
    reg_dt DATETIME NOT NULL,
    upd_dt DATETIME NOT NULL,

    CONSTRAINT fk_schedule_program
        FOREIGN KEY (prog_id) REFERENCES program(prog_id),
    CONSTRAINT fk_schedule_user
        FOREIGN KEY (usr_id) REFERENCES users(user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/* ===============================
   9. RESERVATION
================================ */
CREATE TABLE reservation (
    rsv_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usr_id VARCHAR(50) NOT NULL,
    schd_id BIGINT NOT NULL,
    pass_id BIGINT,
    stts_cd VARCHAR(20) NOT NULL,
    rsv_dt DATE NOT NULL,
    rsv_time TIME NOT NULL,
    reg_dt DATETIME NOT NULL,
    upd_dt DATETIME NOT NULL,
    cncl_rsn VARCHAR(255),
    upd_id VARCHAR(50),

    CONSTRAINT fk_rsv_user
        FOREIGN KEY (usr_id) REFERENCES users(user_id),
    CONSTRAINT fk_rsv_schedule
        FOREIGN KEY (schd_id) REFERENCES schedule(schd_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/* ===============================
   10. PAYMENT
================================ */
CREATE TABLE payment (
    pay_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ord_no VARCHAR(100) NOT NULL UNIQUE,
    usr_id VARCHAR(50) NOT NULL,
    pay_type_cd VARCHAR(20) NOT NULL,
    ref_id BIGINT,
    pay_amt INT NOT NULL,
    pay_method VARCHAR(20) NOT NULL,
    stts_cd VARCHAR(20) NOT NULL,
    reg_dt DATETIME NOT NULL,
    pg_order_no VARCHAR(100),

    CONSTRAINT fk_payment_user
        FOREIGN KEY (usr_id) REFERENCES users(user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/* ===============================
   11. ATTENDANCE
================================ */
CREATE TABLE attendance (
    att_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usr_id VARCHAR(50) NOT NULL,
    rsv_id BIGINT,
    pass_id BIGINT NOT NULL,
    att_dt DATE NOT NULL,
    att_stts_cd VARCHAR(20) NOT NULL,
    mod_dt DATETIME,
    mod_usr_id VARCHAR(50),

    CONSTRAINT fk_att_user
        FOREIGN KEY (usr_id) REFERENCES users(user_id),
    CONSTRAINT fk_att_rsv
        FOREIGN KEY (rsv_id) REFERENCES RESERVATION(rsv_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/* ===============================
   12. pass_log
================================ */
CREATE TABLE pass_log (
    pass_log_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_pass_id BIGINT NOT NULL,
    chg_type_cd VARCHAR(30) NOT NULL,
    chg_cnt INT NOT NULL,
    chg_rsn VARCHAR(255),
    pocs_usr_id VARCHAR(50),
    reg_dt DATETIME NOT NULL,

    CONSTRAINT fk_passlog_userpass
        FOREIGN KEY (user_pass_id) REFERENCES user_pass(user_pass_id),
    CONSTRAINT fk_passlog_user
        FOREIGN KEY (pocs_usr_id) REFERENCES users(user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/* ===============================
   가데이터: 테스트용 사용자
================================ */
INSERT INTO users (user_id, user_name, email, password, phone_number, role, cash_point, grade_point, is_active, agree_at, brch_id)
VALUES 
    ('testuser1', '테스트사용자1', 'test1@example.com', '$2a$10$dummy', '010-1234-5678', 'USER', 50000, 100, 1, NOW(), NULL),
    ('testuser2', '테스트사용자2', 'test2@example.com', '$2a$10$dummy', '010-2345-6789', 'USER', 30000, 50, 1, NOW(), NULL),
    ('testuser3', '테스트사용자3', 'test3@example.com', '$2a$10$dummy', '010-3456-7890', 'USER', 100000, 200, 1, NOW(), NULL);

/* ===============================
   가데이터: 결제 목록
================================ */
INSERT INTO payment (ord_no, usr_id, pay_type_cd, ref_id, pay_amt, pay_method, stts_cd, reg_dt, pg_order_no)
VALUES 
    -- testuser1의 결제 내역
    ('ORD20240101001', 'testuser1', 'RESERVATION', 1, 50000, 'CARD', 'COMPLETED', '2024-01-15 10:30:00', 'PG20240115001'),
    ('ORD20240102002', 'testuser1', 'RESERVATION', 2, 30000, 'BANK_TRANSFER', 'COMPLETED', '2024-01-20 14:20:00', 'PG20240120002'),
    ('ORD20240103003', 'testuser1', 'PASS', NULL, 100000, 'CARD', 'COMPLETED', '2024-02-01 09:15:00', 'PG20240201003'),
    ('ORD20240104004', 'testuser1', 'RESERVATION', 3, 25000, 'CARD', 'PENDING', '2024-02-10 16:45:00', 'PG20240210004'),
    
    -- testuser2의 결제 내역
    ('ORD20240105005', 'testuser2', 'RESERVATION', 4, 40000, 'CARD', 'COMPLETED', '2024-01-18 11:00:00', 'PG20240118005'),
    ('ORD20240106006', 'testuser2', 'PASS', NULL, 80000, 'BANK_TRANSFER', 'COMPLETED', '2024-01-25 13:30:00', 'PG20240125006'),
    ('ORD20240107007', 'testuser2', 'RESERVATION', 5, 35000, 'CARD', 'COMPLETED', '2024-02-05 15:20:00', 'PG20240205007'),
    
    -- testuser3의 결제 내역
    ('ORD20240108008', 'testuser3', 'RESERVATION', 6, 60000, 'CARD', 'COMPLETED', '2024-01-22 10:00:00', 'PG20240122008'),
    ('ORD20240109009', 'testuser3', 'PASS', NULL, 150000, 'CARD', 'COMPLETED', '2024-01-28 12:00:00', 'PG20240128009'),
    ('ORD20240110010', 'testuser3', 'RESERVATION', 7, 45000, 'BANK_TRANSFER', 'COMPLETED', '2024-02-08 14:00:00', 'PG20240208010'),
    ('ORD20240111011', 'testuser3', 'RESERVATION', 8, 55000, 'CARD', 'PENDING', '2024-02-12 16:30:00', 'PG20240212011'),
    ('ORD20240112012', 'testuser3', 'RESERVATION', 9, 30000, 'CARD', 'COMPLETED', '2024-02-15 09:00:00', 'PG20240215012');

