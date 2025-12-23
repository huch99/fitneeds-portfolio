package com.project.app.userAdmin.entity; // 패키지 변경

import java.time.LocalDateTime;

import org.hibernate.annotations.ColumnDefault;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "BRANCH") //USER는 예약어이므로 'USERS' 사용
@Data // @Getter, @Setter, @ToString, @EqualsAndHashCode, @RequiredArgsConstructor 포함
@NoArgsConstructor
@AllArgsConstructor // 모든 필드를 인자로 받는 생성자 (Builder 사용 시 내부적으로 활용)
@Builder // Builder 패턴 제공
public class Branch {

	// brch_id (BIGINT, PRIMARY KEY)
    @Id // 기본 키로 지정
    @Column(name = "brch_id", nullable = false) // 컬럼 이름 명시, NULL 허용 안함
    private Long brchId;

    @Column(name = "brch_nm", length = 50, nullable = false) // 컬럼 이름, 길이 50, NULL 허용 안함
    private String brchNm;

    // addr (VARCHAR(255))
    @Column(name = "addr", length = 255) // 컬럼 이름, 길이 255, NULL 허용 (정보에 명시되지 않아 기본적으로 NULL 허용)
    private String addr;

    @Column(name = "oper_yn", columnDefinition = "TINYINT(1)", nullable = false) // TINYINT(1)은 Java에서 boolean으로 매핑
    private boolean operYn;

    @Column(name = "reg_dt", nullable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime regDt;

    @Column(name = "upd_dt") 
    private LocalDateTime updDt;
 
}