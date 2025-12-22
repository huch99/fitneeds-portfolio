package com.project.app.payment.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentResponseDto {
	private Long paymentId; // 결제 ID
	private Long reservationId; // 예약 ID
	private String programName; // 프로그램 이름
	private String option; // 옵션 (개인 레슨, 그룹 레슨 등)
	private BigDecimal paymentAmount; // 결제금액
	private LocalDateTime paymentDate; // 결제일자
	private String paymentStatus; // 결제 상태 (BANK_TRANSFER_COMPLETED, BANK_TRANSFER_PENDING 등)
	private String cancelRefundStatus; // 취소/환불 상태 (null, 취소완료, 환불완료)
}

