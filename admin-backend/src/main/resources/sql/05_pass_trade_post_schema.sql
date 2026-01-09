-- PASS_TRADE_POST 테이블 생성
CREATE TABLE PASS_TRADE_POST (
    post_id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '게시글ID',
    seller_id VARCHAR(50) NOT NULL COMMENT '판매자ID',
    user_pass_id BIGINT NOT NULL COMMENT '이용권ID',
    title VARCHAR(255) NOT NULL COMMENT '제목',
    cntnt TEXT NOT NULL COMMENT '내용',
    sell_qty DECIMAL(10, 2) NOT NULL COMMENT '판매수량',
    sale_amt DECIMAL(15, 2) NOT NULL COMMENT '판매가격',
    stts_cd VARCHAR(20) NOT NULL COMMENT '게시글상태코드',
    del_yn BOOLEAN NOT NULL DEFAULT FALSE COMMENT '삭제여부',
    reg_dt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '등록일시',
    upd_dt TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일시',
    CONSTRAINT fk_pass_trade_post_user_pass FOREIGN KEY (user_pass_id) REFERENCES USER_PASS(user_pass_id),
    CONSTRAINT fk_pass_trade_post_seller FOREIGN KEY (seller_id) REFERENCES USERS(user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='이용권거래게시글';

