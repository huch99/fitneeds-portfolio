package com.project.app.attendance.service;

import java.util.List;

import com.project.app.attendance.dto.AttendanceRequestDto;
import com.project.app.attendance.dto.AttendanceResponseDto;

public interface AttendanceService {
	/**
	 * 출석 생성 (예약 기반)
	 */
	AttendanceResponseDto createAttendance(AttendanceRequestDto requestDto);
	
	/**
	 * 나의 출석현황 조회
	 */
	List<AttendanceResponseDto> getMyAttendances(String userId);
	
	/**
	 * 출석 상태 변경 (출석, 결석, 취소)
	 */
	void updateAttendanceStatus(Long attendanceId, String userId, String attendanceStatusCode);
	
	/**
	 * 예약 ID로 출석 조회
	 */
	AttendanceResponseDto getAttendanceByReservationId(Long reservationId, String userId);
	
	/**
	 * 사용자 출석체크 (기간권용)
	 * 예약 ID로 출석체크
	 */
	AttendanceResponseDto checkAttendanceByUser(Long reservationId, String userId);
}

