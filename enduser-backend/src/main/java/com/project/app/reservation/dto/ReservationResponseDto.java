package com.project.app.reservation.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 예약 응답 DTO
 * 마이페이지에서 사용할 예약 정보
 * 화면 표시 필드: 예약ID, 운동명, 운동날짜/시간, 운동장소/트레이너이름, 결제상태
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReservationResponseDto {
	private Long reservationId; // 예약 ID
	private String exerciseName; // 운동명
	private LocalDateTime exerciseDate; // 운동 날짜/시간
	private String exerciseLocation; // 운동 장소
	private String trainerName; // 트레이너 이름
	private String paymentStatus; // 결제 상태 (BANK_TRANSFER_PENDING, BANK_TRANSFER_COMPLETED 등)
}

