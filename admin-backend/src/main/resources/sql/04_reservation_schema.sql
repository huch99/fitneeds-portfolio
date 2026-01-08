-- RESERVATION 테이블 생성
CREATE TABLE RESERVATION (
    rsv_id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '예약ID',
    usr_id VARCHAR(50) NOT NULL COMMENT '사용자ID',
    schd_id BIGINT NOT NULL COMMENT '스케줄ID',
    brch_id BIGINT NOT NULL COMMENT '지점ID',
    pass_id BIGINT COMMENT '이용권ID',
    stts_cd VARCHAR(20) NOT NULL COMMENT '예약상태코드',
    rsv_dt DATE NOT NULL COMMENT '예약날짜',
    rsv_time TIME NOT NULL COMMENT '예약시간',
    reg_dt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '등록일시',
    upd_dt TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일시',
    cncl_rsn VARCHAR(255) COMMENT '취소사유',
    upd_id VARCHAR(50) COMMENT '수정자',
    CONSTRAINT fk_reservation_user FOREIGN KEY (usr_id) REFERENCES USERS(user_id),
    CONSTRAINT fk_reservation_schedule FOREIGN KEY (schd_id) REFERENCES SCHEDULE(schd_id),
    CONSTRAINT fk_reservation_branch FOREIGN KEY (brch_id) REFERENCES BRANCH(brch_id),
    CONSTRAINT fk_reservation_user_pass FOREIGN KEY (pass_id) REFERENCES USER_PASS(user_pass_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='예약';

