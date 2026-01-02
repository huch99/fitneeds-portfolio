CREATE DATABASE fitneedsdb;

SHOW DATABASES;

USE fitneedsdb;

SHOW TABLES;

CREATE TABLE MEMBER (
  MBR_ID BIGINT PRIMARY KEY AUTO_INCREMENT,
  MBR_NM VARCHAR(50) NOT NULL,
  EML_ADDR VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE STAFF (
  STAFF_ID BIGINT PRIMARY KEY AUTO_INCREMENT,
  STAFF_NM VARCHAR(50) NOT NULL
);

CREATE TABLE BRANCH (
  BRCH_ID BIGINT PRIMARY KEY AUTO_INCREMENT,
  BRCH_NM VARCHAR(50) NOT NULL
);

CREATE TABLE BRANCH_STAFF (
  BRCH_STF_ID BIGINT PRIMARY KEY AUTO_INCREMENT,
  STAFF_ID BIGINT NOT NULL,
  BRCH_ID BIGINT NOT NULL,
  FOREIGN KEY (STAFF_ID) REFERENCES STAFF(STAFF_ID),
  FOREIGN KEY (BRCH_ID) REFERENCES BRANCH(BRCH_ID)
);

CREATE TABLE community_post (
  post_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  post_type VARCHAR(20) NOT NULL,
  category VARCHAR(20),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  writer_id BIGINT NOT NULL,
  writer_type VARCHAR(20) NOT NULL,
  branch_id BIGINT,
  views INT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT NOW(),
  updated_at DATETIME NOT NULL DEFAULT NOW(),
  sport_type VARCHAR(50),
  recruit_max INT,
  recruit_datetime DATETIME,
  recruit_end_date DATETIME,
  display_start DATETIME,
  display_end DATETIME,
  is_visible BOOLEAN NOT NULL DEFAULT TRUE,
  attachment_path VARCHAR(255),
  FOREIGN KEY (branch_id) REFERENCES BRANCH(BRCH_ID)
);

CREATE TABLE community_recruit_join (
  join_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  post_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  join_type VARCHAR(20) NOT NULL,
  FOREIGN KEY (post_id) REFERENCES community_post(post_id),
  FOREIGN KEY (user_id) REFERENCES MEMBER(MBR_ID),
  UNIQUE KEY uq_post_user (post_id, user_id)
);

CREATE TABLE community_comment (
  comment_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  post_id BIGINT NOT NULL,
  writer_id BIGINT NOT NULL,
  writer_type VARCHAR(20) NOT NULL,
  content TEXT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT NOW(),
  FOREIGN KEY (post_id) REFERENCES community_post(post_id)
);

-- ✅ 회원 가데이터
INSERT INTO MEMBER (MBR_NM, EML_ADDR) VALUES 
('김가빈', 'gabin@test.com'),
('이사용', 'user2@test.com');
SELECT * FROM member;
-- ✅ 직원 가데이터
INSERT INTO STAFF (STAFF_NM) VALUES 
('관리자1'),
('관리자2');
SELECT * FROM staff;
-- ✅ 지점 가데이터
INSERT INTO BRANCH (BRCH_NM) VALUES 
('1지점'),
('2지점');
SELECT * FROM branch;
-- ✅ 지점-직원 매핑
INSERT INTO BRANCH_STAFF (STAFF_ID, BRCH_ID) VALUES 
(1, 1),
(2, 2);
SELECT * FROM branch_staff;
-- ✅ 커뮤니티 일반글
INSERT INTO community_post
(post_type, category, title, content, writer_id, writer_type, views, created_at, updated_at)
VALUES
('COMMUNITY', '자유', '커뮤니티 첫 글입니다', '커뮤니티 테스트 내용입니다.', 1, 'MEMBER', 0, NOW(), NOW());
SELECT * FROM community_post;
-- ✅ 모집글
INSERT INTO community_post
(post_type, category, title, content, writer_id, writer_type, sport_type, recruit_max, recruit_datetime, recruit_end_date, views, created_at, updated_at)
VALUES
('COMMUNITY', '모집', '농구 같이 하실 분 모집합니다', '토요일 저녁 농구할 분 구합니다.', 
 1, 'MEMBER', '농구', 5, 
 DATE_ADD(NOW(), INTERVAL 2 DAY), 
 DATE_ADD(NOW(), INTERVAL 1 DAY), 
 0, NOW(), NOW());
SELECT * FROM community_post;
-- ✅ 공지사항
INSERT INTO community_post
(post_type, title, content, writer_id, writer_type, branch_id, display_start, display_end, is_visible, created_at, updated_at)
VALUES
('NOTICE', '1지점 휴관 안내', '내일은 1지점 휴관입니다.', 1, 'STAFF', 1, NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY), TRUE, NOW(), NOW());
SELECT * FROM community_post;
-- ✅ FAQ
INSERT INTO community_post
(post_type, title, content, writer_id, writer_type, created_at, updated_at)
VALUES
('FAQ', '회원권 환불이 가능한가요?', '환불은 7일 이내 가능합니다.', 1, 'STAFF', NOW(), NOW());
SELECT * FROM community_post;
-- ✅ 모집 참여
INSERT INTO community_recruit_join (post_id, user_id, join_type)
VALUES (2, 2, 'RECRUITED');
SELECT * FROM community_recruit_join;
-- ✅ 댓글
INSERT INTO community_comment (post_id, writer_id, writer_type, content)
VALUES
(1, 2, 'MEMBER', '첫 번째 댓글입니다!'),
(2, 1, 'MEMBER', '농구 모집 관심 있습니다!');
SELECT * FROM community_comment;

SELECT * FROM community_post;
SHOW TABLES;


ALTER TABLE community_comment
ADD comment_visible TINYINT(1) NOT NULL DEFAULT 1 COMMENT '댓글 노출 여부';

ALTER TABLE community_post
ADD post_visible TINYINT(1) NOT NULL DEFAULT 1 COMMENT '게시글 노출 여부';

SELECT * FROM community_post;

DELETE FROM community_post
WHERE writer_type NOT IN ('MEMBER', 'STAFF');

ALTER TABLE community_comment
MODIFY writer_id VARCHAR(50) NOT NULL;

SELECT post_id, post_type, writer_id
FROM community_post
ORDER BY post_id DESC;

DESC community_post;community_postcommunity_postcommunity_postcommunity_postcommunity_post


DESC community_recruit_join;

ALTER TABLE community_recruit_join
MODIFY user_id VARCHAR(50) NOT NULL;


ALTER TABLE community_recruit_join DROP FOREIGN KEY community_recruit_join_ibfk_2;

ALTER TABLE community_recruit_join MODIFY user_id VARCHAR(50) NOT NULL;

SELECT * FROM community_post;

ALTER TABLE community_post
MODIFY writer_id VARCHAR(50) NOT NULL;

SELECT * FROM community_post;

DESC community_post;
DESC community_comment;
SHOW TABLES;

DESC community_recruit_join;

SELECT * FROM community_recruit_join

SELECT * FROM community_post;

SELECT *
FROM community_recruit_join
WHERE post_id = 1033;

SELECT * FROM community_post
WHERE post_type = 'FAQ';

DESC branch;

desc branch_staff;

DROP TABLE branch;

DROP TABLE branch_staff;

DROP TABLE staff;

ROLLBACK;

COMMIT;


SHOW TABLES;

SELECT
    TABLE_NAME,
    COLUMN_NAME,
    CONSTRAINT_NAME,
    REFERENCED_TABLE_NAME,
    REFERENCED_COLUMN_NAME
FROM information_schema.KEY_COLUMN_USAGE
WHERE REFERENCED_TABLE_NAME = 'BRANCH';

DESC branch;

ALTER TABLE branch
ADD COLUMN addr VARCHAR(255) NULL,
ADD COLUMN oper_yn TINYINT(1) NOT NULL DEFAULT 1,
ADD COLUMN reg_dt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN upd_dt TIMESTAMP NULL;

ALTER TABLE community_post DROP FOREIGN KEY community_post_ibfk_1;
ALTER TABLE branch_staff DROP FOREIGN KEY branch_staff_ibfk_2;

DROP TABLE branch;

SELECT * FROM branch;

DESC branch;

DESC community_post;

DESC user;

SELECT * FROM branch;
DESC branch;

SELECT * FROM community_post
WHERE post_type = 'NOTICE';

DESC users_admin;
DESC users;



 INSERT 
    INTO
        community_post
        (             post_type,             title,             content,             writer_id,             writer_type,             branch_id,             display_start,             display_end,             is_visible,             post_visible         )         
    VALUES
        (             'FAQ',             'ddddd112312',             'dddd123123',             NULL,             'ADMIN',             NULL,             NULL,             NULL,             true,             true         );

SELECT * FROM community_post
WHERE post_type = 'FAQ';

SELECT * FROM users;

SELECT * FROM community_post
WHERE post_type = 'FAQ';

DELETE FROM community_post
WHERE post_type = 'FAQ';

SELECT * FROM branch;

SELECT * FROM users;

adeaa7d5174c4be78756651b4dd8c361
adeaa7d5174c4be78756651b4dd8c361