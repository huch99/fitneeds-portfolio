-- 운동 종목 테이블 생성 쿼리
CREATE TABLE IF NOT EXISTS sport_type (
    sport_id   BIGINT NOT NULL AUTO_INCREMENT,
    sport_nm   VARCHAR(100) NOT NULL,
    sport_memo VARCHAR(500) NULL,
    use_yn     TINYINT(1) NOT NULL DEFAULT 1,
    reg_dt     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    upd_dt     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    del_dt     DATETIME NULL,
    PRIMARY KEY (sport_id),
    INDEX idx_sport_type_useyn (use_yn),
    INDEX idx_sport_type_sportnm (sport_nm)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- 샘플 데이터
INSERT INTO sport_type(sport_nm, sport_memo, use_yn, reg_dt, upd_dt)
    VALUES ('헬스', '근력 증강 및 유산소 운동을 기본으로 하는 운동입니다.', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO sport_type(sport_nm, sport_memo, use_yn, reg_dt, upd_dt)
    VALUES ('요가', '몸과 마음을 이완하는 운동입니다.', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO sport_type(sport_nm, sport_memo, use_yn, reg_dt, upd_dt)
    VALUES ('수영', '생존 수영부터 다양한 영법까지 수영에 대한 모든 것', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
