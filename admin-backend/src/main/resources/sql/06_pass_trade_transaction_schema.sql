-- PASS_TRADE_TRANSACTION 테이블 생성
CREATE TABLE PASS_TRADE_TRANSACTION (
    trade_id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '거래ID',
    post_id BIGINT NOT NULL COMMENT '게시글ID',
    buyer_usr_id VARCHAR(50) NOT NULL COMMENT '구매자ID',
    trade_amt DECIMAL(15, 2) NOT NULL COMMENT '거래금액',
    stts_cd VARCHAR(20) NOT NULL COMMENT '거래상태코드',
    buy_qty INT NOT NULL COMMENT '구매수량',
    payment_id BIGINT COMMENT '결제ID',
    reg_dt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '등록일시',
    upd_dt TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일시',
    CONSTRAINT fk_pass_trade_transaction_post FOREIGN KEY (post_id) REFERENCES PASS_TRADE_POST(post_id),
    CONSTRAINT fk_pass_trade_transaction_buyer FOREIGN KEY (buyer_usr_id) REFERENCES USERS(user_id),
    CONSTRAINT fk_pass_trade_transaction_payment FOREIGN KEY (payment_id) REFERENCES PAYMENT(payment_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='이용권거래';

