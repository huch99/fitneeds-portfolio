package com.project.app.attendance.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.app.attendance.dto.AttendanceRequestDto;
import com.project.app.attendance.dto.AttendanceResponseDto;
import com.project.app.attendance.service.AttendanceService;

import lombok.extern.slf4j.Slf4j;

/**
 * 출석 컨트롤러
 * 예약한 내용을 토대로 출석현황을 관리합니다.
 * 모든 API는 JWT 인증 토큰이 필요합니다.
 * Authorization 헤더에 "Bearer {token}" 형식으로 토큰을 포함해야 합니다.
 */
@Slf4j
@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {
	
	private final AttendanceService attendanceService;
	
	public AttendanceController(AttendanceService attendanceService) {
		this.attendanceService = attendanceService;
	}
	
	/**
	 * 현재 인증된 사용자의 userId를 가져옵니다.
	 */
	private String getCurrentUserId() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		if (authentication == null || !authentication.isAuthenticated()) {
			throw new RuntimeException("인증되지 않은 사용자입니다.");
		}
		return authentication.getName();
	}
	
	/**
	 * 출석 생성 (예약 기반)
	 * POST /api/attendance
	 * 헤더: Authorization: Bearer {token}
	 */
	@PostMapping
	public ResponseEntity<?> createAttendance(@RequestBody AttendanceRequestDto requestDto) {
		try {
			String currentUserId = getCurrentUserId();
			requestDto.setUserId(currentUserId);
			
			AttendanceResponseDto response = attendanceService.createAttendance(requestDto);
			return ResponseEntity.status(HttpStatus.CREATED).body(response);
		} catch (Exception e) {
			log.error("출석 생성 중 오류 발생", e);
			return ResponseEntity.status(HttpStatus.BAD_REQUEST)
					.body("출석 생성 중 오류가 발생했습니다: " + e.getMessage());
		}
	}
	
	/**
	 * 나의 출석현황 조회
	 * GET /api/attendance/my
	 * 헤더: Authorization: Bearer {token}
	 */
	@GetMapping("/my")
	public ResponseEntity<?> getMyAttendances() {
		try {
			String currentUserId = getCurrentUserId();
			List<AttendanceResponseDto> attendances = attendanceService.getMyAttendances(currentUserId);
			return ResponseEntity.ok(attendances);
		} catch (Exception e) {
			log.error("출석현황 조회 중 오류 발생", e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("출석현황 조회 중 오류가 발생했습니다: " + e.getMessage());
		}
	}
	
	/**
	 * 예약 ID로 출석 조회
	 * GET /api/attendance/reservation/{reservationId}
	 * 헤더: Authorization: Bearer {token}
	 */
	@GetMapping("/reservation/{reservationId}")
	public ResponseEntity<?> getAttendanceByReservationId(@PathVariable("reservationId") Long reservationId) {
		try {
			String currentUserId = getCurrentUserId();
			AttendanceResponseDto response = attendanceService.getAttendanceByReservationId(reservationId, currentUserId);
			return ResponseEntity.ok(response);
		} catch (Exception e) {
			log.error("예약별 출석 조회 중 오류 발생", e);
			return ResponseEntity.status(HttpStatus.NOT_FOUND)
					.body("예약별 출석 조회 중 오류가 발생했습니다: " + e.getMessage());
		}
	}
	
	/**
	 * 출석 상태 변경 (출석, 결석, 취소)
	 * PUT /api/attendance/{attendanceId}/status
	 * 헤더: Authorization: Bearer {token}
	 * Body: { "attendanceStatusCode": "ATTEND" | "ABSENT" | "CANCEL" }
	 */
	@PutMapping("/{attendanceId}/status")
	public ResponseEntity<?> updateAttendanceStatus(
			@PathVariable("attendanceId") Long attendanceId,
			@RequestBody AttendanceStatusUpdateRequest request) {
		try {
			String currentUserId = getCurrentUserId();
			attendanceService.updateAttendanceStatus(attendanceId, currentUserId, request.getAttendanceStatusCode());
			return ResponseEntity.ok("출석 상태가 변경되었습니다.");
		} catch (Exception e) {
			log.error("출석 상태 변경 중 오류 발생", e);
			return ResponseEntity.status(HttpStatus.BAD_REQUEST)
					.body("출석 상태 변경 중 오류가 발생했습니다: " + e.getMessage());
		}
	}
	
	/**
	 * 사용자 출석체크 (기간권용)
	 * POST /api/attendance/reservation/{reservationId}/check
	 * 헤더: Authorization: Bearer {token}
	 * 기간권 이용권의 경우 사용자가 직접 출석체크
	 */
	@PostMapping("/reservation/{reservationId}/check")
	public ResponseEntity<?> checkAttendanceByUser(@PathVariable("reservationId") Long reservationId) {
		try {
			String currentUserId = getCurrentUserId();
			AttendanceResponseDto response = attendanceService.checkAttendanceByUser(reservationId, currentUserId);
			return ResponseEntity.ok(response);
		} catch (Exception e) {
			log.error("사용자 출석체크 중 오류 발생", e);
			return ResponseEntity.status(HttpStatus.BAD_REQUEST)
					.body("출석체크 중 오류가 발생했습니다: " + e.getMessage());
		}
	}
	
	/**
	 * 출석 상태 변경 요청 DTO
	 */
	public static class AttendanceStatusUpdateRequest {
		private String attendanceStatusCode;
		
		public String getAttendanceStatusCode() {
			return attendanceStatusCode;
		}
		
		public void setAttendanceStatusCode(String attendanceStatusCode) {
			this.attendanceStatusCode = attendanceStatusCode;
		}
	}
}

