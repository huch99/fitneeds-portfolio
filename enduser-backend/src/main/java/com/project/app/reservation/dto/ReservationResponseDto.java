package com.project.app.reservation.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 예약 응답 DTO
 * 마이페이지에서 사용할 예약 정보
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReservationResponseDto {
	private Long reservationId; // 예약 ID
	private String exerciseName; // 운동명 (프로그램 이름)
	private LocalDateTime exerciseDate; // 운동 날짜/시간
	private String exerciseLocation; // 운동 장소 (지점명)
	private String trainerName; // 트레이너 이름
	private String paymentStatus; // 결제 상태 (BANK_TRANSFER_PENDING, BANK_TRANSFER_COMPLETED 등)
	
	// 예약목록용 필드
	private LocalDate reservedDate; // 예약날짜 (rsv_dt)
	private LocalTime reservedTime; // 예약시간 (rsv_time)
	private Long programId; // 프로그램 ID (prog_id)
	private String programName; // 프로그램 이름 (prog_nm)
	private BigDecimal paymentAmount; // 결제금액 (one_time_amt)
	
	// 이용목록용 필드
	private String branchName; // 지점명 (brch_nm)
}

