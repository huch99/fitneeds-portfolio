package com.project.app.sporttype.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.ColumnDefault;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "SPORT_TYPE")
public class SportType {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "sport_id", nullable = false)
	private Long sportId; 			// 종목 ID
	
	@Column(name = "sport_nm", nullable = false, length = 100)
	private String sportNm;			// 종목 이름
	
	@Column(name = "sport_memo", nullable = true, length = 500)
	private String sportMemo;		// 종목 설명
	
	@Column(name = "use_yn", nullable = false, columnDefinition = "TINYINT(1)")
	@ColumnDefault("1")
	private boolean useYn;			// 종목 사용 여부
	
	@Column(name = "reg_dt", nullable = false)
	@CreatedDate
	private LocalDateTime regDt;	// 등록 일시 (로그 확인용)
	
	@Column(name = "upd_dt", nullable = false)
	@LastModifiedDate
	private LocalDateTime updDt;	// 수정 일시 (로그 확인용)
	
	@Column(name = "del_dt", nullable = true)
	private LocalDateTime delDt;	// 삭제(비활성) 일시 (로그 확인용)

}
