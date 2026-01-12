-- PASS_LOG 테이블 생성
CREATE TABLE PASS_LOG (
    pass_log_id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '이용권로그ID',
    user_pass_id BIGINT NOT NULL COMMENT '이용권ID',
    chg_type_cd VARCHAR(30) NOT NULL COMMENT '변경유형코드',
    chg_cnt INT NOT NULL COMMENT '변경횟수',
    chg_rsn VARCHAR(255) COMMENT '변경사유',
    pocs_usr_id VARCHAR(50) COMMENT '처리사용자ID',
    reg_dt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '등록일시',
    CONSTRAINT fk_pass_log_user_pass FOREIGN KEY (user_pass_id) REFERENCES USER_PASS(user_pass_id),
    CONSTRAINT fk_pass_log_user_admin FOREIGN KEY (pocs_usr_id) REFERENCES USERS_ADMIN(user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='이용권로그';

