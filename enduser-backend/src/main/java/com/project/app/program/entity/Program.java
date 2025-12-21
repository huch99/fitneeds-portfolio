package com.project.app.program.entity;

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

/**
 * 프로그램 엔티티
 * 실제 테이블 구조: prog_id, prog_nm, sport_id, use_yn, one_time_amt, rwd_game_point, reg_dt, upd_dt
 */
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "PROGRAM")
public class Program {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "prog_id")
	private Long programId;
	
	@Column(name = "prog_nm", nullable = false, length = 255)
	private String programName; // 프로그램 이름
	
	@Column(name = "sport_id", nullable = false)
	private Long sportId; // 스포츠 타입 ID
	
	@Column(name = "use_yn")
	private Boolean useYn; // 사용 여부
	
	@Column(name = "one_time_amt", nullable = false)
	private Integer oneTimeAmount; // 1회 이용 금액
	
	@Column(name = "rwd_game_point", nullable = false)
	private Integer rewardGamePoint; // 보상 게임 포인트
	
	@Column(name = "reg_dt", nullable = false)
	private java.time.LocalDateTime registrationDateTime; // 등록일시
	
	@Column(name = "upd_dt", nullable = false)
	private java.time.LocalDateTime updateDateTime; // 수정일시
}

