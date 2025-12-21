package com.project.app.review.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.project.app.reservation.entity.Reservation;

/**
 * 리뷰 엔티티
 * 실제 데이터베이스 테이블 구조에 맞춘 엔티티
 */
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "REVIEW")
public class Review {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "rvw_id")
	private Long reviewId;
	
	@ManyToOne
	@JoinColumn(name = "rsv_id", nullable = false)
	private Reservation reservation;
	
	@Column(name = "rating", nullable = false)
	private Integer rating; // 별점 (1-5)
	
	@Column(name = "content", length = 1000)
	private String content; // 리뷰 내용
	
	@Column(name = "inst_id")
	private Long instructorId; // 강사 ID (선택적)
	
	@Column(name = "reg_dt", nullable = false)
	private LocalDateTime registrationDateTime; // 작성일시
}

