package com.project.app.attendance.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 출석 응답 DTO
 * 마이페이지에서 출석현황을 조회할 때 사용
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AttendanceResponseDto {
	private Long attendanceId; // 출석ID (att_id)
	
	// 예약 정보
	private Long reservationId; // 예약ID (rsv_id) - NULL 가능
	
	// 이용권 정보
	private Long ticketId; // 이용권ID (tkt_id)
	
	// 출석 정보
	private LocalDate attendanceDate; // 출석일 (att_dt)
	private String attendanceStatusCode; // 출석상태 (att_stts_cd): ATTEND, ABSENT, CANCEL
	
	// 수정 정보
	private LocalDateTime modifyDateTime; // 수정일시 (mod_dt) - NULL 가능
	private String modifyUserId; // 수정자ID (mod_usr_id) - NULL 가능
}

