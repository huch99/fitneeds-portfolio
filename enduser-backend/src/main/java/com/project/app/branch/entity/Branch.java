package com.project.app.branch.entity;

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
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter @Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "BRANCH")
public class Branch {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "brch_id", nullable = false)
	private Long brchId;			// 지점 ID
	
	@Column(name = "brch_nm", nullable = false, length = 50)
	private String brchNm;			// 지점 명
	
	@Column(name = "addr", nullable = false, length = 255)
	private String addr;			// 지점 주소
	
	@Column(name = "oper_yn", nullable = false)
	@Builder.Default
	@ColumnDefault("1")
	private boolean operYn = true;			// 운영 여부
	
	@Column(name = "reg_dt", nullable = false)
	private LocalDateTime regDt;	// 등록 일시 (로그 확인용)
	
	@Column(name = "upd_dt", nullable = false)
	private LocalDateTime updDt;	// 수정 일시 (로그 확인용)
}
