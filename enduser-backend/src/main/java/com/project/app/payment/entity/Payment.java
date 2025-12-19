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
 * 결제 엔티티 (조회용)
 * 실제 데이터베이스 테이블 구조에 맞춘 엔티티
 */
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "PAYMENT")
public class Payment {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "pay_id")
	private Long paymentId;
	
	@OneToOne
	@JoinColumn(name = "rsv_id", nullable = false, unique = true)
	private Reservation reservation;
	
	@ManyToOne
	@JoinColumn(name = "usr_id", referencedColumnName = "userId", nullable = false)
	private User user;
	
	@Column(name = "payment_status", nullable = false, length = 50)
	private String paymentStatus; // BANK_TRANSFER_PENDING, BANK_TRANSFER_COMPLETED
	
	@Column(name = "payment_amount", precision = 10, scale = 2)
	private BigDecimal paymentAmount;
	
	@Column(name = "payment_date")
	private LocalDateTime paymentDate;
	
	@Column(name = "reg_dt", nullable = false)
	private LocalDateTime registrationDateTime; // 등록일시
}

