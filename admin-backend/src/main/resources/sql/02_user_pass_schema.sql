-- USER_PASS 테이블 생성
CREATE TABLE USER_PASS (
    user_pass_id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '이용권ID',
    usr_id VARCHAR(50) NOT NULL COMMENT '사용자ID',
    sport_id BIGINT NOT NULL COMMENT '스포츠ID',
    pass_status_cd VARCHAR(20) NOT NULL COMMENT '이용권상태코드',
    rmn_cnt INT NOT NULL COMMENT '잔여횟수',
    lst_prod_id BIGINT COMMENT '마지막구매상품ID',
    init_cnt INT NOT NULL COMMENT '초기구매횟수',
    reg_dt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '등록일시',
    upd_dt TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일시',
    CONSTRAINT uk_user_sport_type UNIQUE KEY (usr_id, sport_id),
    CONSTRAINT fk_user_pass_user FOREIGN KEY (usr_id) REFERENCES USERS(user_id),
    CONSTRAINT fk_user_pass_sport FOREIGN KEY (sport_id) REFERENCES SPORT_TYPE(sport_id),
    CONSTRAINT fk_user_pass_product FOREIGN KEY (lst_prod_id) REFERENCES PASS_PRODUCT(prod_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='사용자이용권';

