package com.project.app.payment.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.project.app.reservation.entity.Reservation;
import com.project.app.user.entity.User;

/**
 * 결제 엔티티
 * 실제 데이터베이스 테이블 구조에 맞춘 엔티티
 * 실제 테이블: pay_id, ord_no, usr_id, pay_type_cd, ref_id, pay_amt, pay_method, stts_cd, reg_dt, pg_order_no
 */
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "payment")
public class Payment {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "pay_id")
	private Long paymentId;
	
	@Column(name = "ord_no", nullable = false, unique = true, length = 100)
	private String orderNo; // 주문번호
	
	@ManyToOne
	@JoinColumn(name = "usr_id", referencedColumnName = "user_id", nullable = false)
	private User user;
	
	@Column(name = "pay_type_cd", nullable = false, length = 20)
	private String payTypeCd; // 결제 타입 코드
	
	@Column(name = "ref_id")
	private Long refId; // 참조 ID (예약 ID 등)
	
	@Column(name = "pay_amt", nullable = false)
	private Integer payAmount; // 결제금액 (INT)
	
	@Column(name = "pay_method", nullable = false, length = 20)
	private String payMethod; // 결제 방법
	
	@Column(name = "stts_cd", nullable = false, length = 20)
	private String statusCode; // 상태 코드 (COMPLETED, PENDING 등)
	
	@Column(name = "reg_dt", nullable = false)
	private LocalDateTime registrationDateTime; // 등록일시
	
	@Column(name = "pg_order_no", length = 100)
	private String pgOrderNo; // PG 주문번호
	
	// JPA 관계를 위한 예약 참조 (ref_id를 통해 연결)
	@ManyToOne
	@JoinColumn(name = "ref_id", insertable = false, updatable = false)
	private Reservation reservation;
	
	// 편의 메서드: paymentStatus (stts_cd를 BANK_TRANSFER_COMPLETED 형식으로 변환)
	public String getPaymentStatus() {
		if ("COMPLETED".equals(statusCode)) {
			return "BANK_TRANSFER_COMPLETED";
		} else if ("PENDING".equals(statusCode)) {
			return "BANK_TRANSFER_PENDING";
		}
		return statusCode;
	}
	
	// 편의 메서드: paymentAmount (BigDecimal로 변환)
	public BigDecimal getPaymentAmount() {
		return payAmount != null ? BigDecimal.valueOf(payAmount) : null;
	}
	
	// 편의 메서드: paymentDate (reg_dt를 paymentDate로 사용)
	public LocalDateTime getPaymentDate() {
		return registrationDateTime;
	}
}

