package com.project.app.attendance.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 출석 생성 요청 DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AttendanceRequestDto {
	private String userId; // 컨트롤러에서 자동 설정
	private Long reservationId; // 예약ID (선택적)
	private Long ticketId; // 사용한 이용권 ID (필수)
	private Long productId; // 이용권 상품ID (필수)
	private LocalDate attendanceDate; // 출석일
	private String attendanceStatusCode; // 출석상태: ATTEND, ABSENT, CANCEL
}

