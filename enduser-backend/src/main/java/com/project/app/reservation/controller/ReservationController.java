package com.project.app.reservation.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.app.reservation.dto.ReservationResponseDto;
import com.project.app.reservation.service.ReservationService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/reservation")
public class ReservationController {
	
	private final ReservationService reservationService;
	
	public ReservationController(ReservationService reservationService) {
		this.reservationService = reservationService;
	}

	/**
	 * 요청 헤더에서 사용자 ID를 가져옵니다.
	 * 프론트엔드의 localStorage에서 가져온 userId가 X-User-Id 헤더로 전달됩니다.
	 * 
	 * @param request HTTP 요청 객체
	 * @return 사용자 ID
	 */
	private String getCurrentUserId(HttpServletRequest request) {
		String userId = request.getHeader("X-User-Id");
		if (userId == null || userId.isEmpty()) {
			log.error("X-User-Id 헤더가 없습니다. localStorage에서 userId를 확인해주세요.");
			throw new RuntimeException("사용자 ID가 없습니다.");
		}
		log.debug("현재 사용자 ID (localStorage에서 가져옴): {}", userId);
		return userId;
	}
	
	/**
	 * 결제완료된 예약 목록 조회 (이용내역 화면)
	 * GET /api/reservation/my/completed
	 * 
	 * 결제 상태가 COMPLETED인 예약만 조회합니다.
	 */
	@GetMapping("/my/completed")
	public ResponseEntity<?> getMyCompletedReservations(HttpServletRequest request) {
		try {
			// localStorage에서 가져온 사용자 ID로 결제완료된 예약 목록 조회
			String currentUserId = getCurrentUserId(request);
			List<ReservationResponseDto> reservations = reservationService.getMyCompletedReservations(currentUserId);
			return ResponseEntity.ok(reservations);
		} catch (Exception e) {
			log.error("결제완료 예약 목록 조회 중 오류 발생", e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("결제완료 예약 목록 조회 중 오류가 발생했습니다: " + e.getMessage());
		}
	}
	
	/**
	 * 나의 운동 목록 조회 (마이페이지)
	 * GET /api/reservation/my
	 */
	@GetMapping("/my")
	public ResponseEntity<?> getMyReservations(HttpServletRequest request) {
		try {
			// localStorage에서 가져온 사용자 ID로 예약 목록 조회
			String currentUserId = getCurrentUserId(request);
			List<ReservationResponseDto> reservations = reservationService.getMyReservations(currentUserId);
			return ResponseEntity.ok(reservations);
		} catch (Exception e) {
			log.error("예약 목록 조회 중 오류 발생", e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("예약 목록 조회 중 오류가 발생했습니다: " + e.getMessage());
		}
	}
	
	/**
	 * 예약 상세 조회
	 * GET /api/reservation/{reservationId}
	 */
	@GetMapping("/{reservationId}")
	public ResponseEntity<?> getReservationById(
			@PathVariable("reservationId") Long reservationId,
			HttpServletRequest request) {
		try {
			// localStorage에서 가져온 사용자 ID로 예약 조회
			String currentUserId = getCurrentUserId(request);
			ReservationResponseDto reservation = reservationService.getReservationById(reservationId);
			
			// 본인의 예약인지 확인
			// ReservationResponseDto에 userId가 없으므로, 서비스에서 검증하거나
			// 별도로 확인이 필요할 수 있음
			return ResponseEntity.ok(reservation);
		} catch (RuntimeException e) {
			log.error("예약 조회 중 오류 발생", e);
			return ResponseEntity.status(HttpStatus.NOT_FOUND)
					.body("예약을 찾을 수 없습니다: " + e.getMessage());
		} catch (Exception e) {
			log.error("예약 조회 중 오류 발생", e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("예약 조회 중 오류가 발생했습니다: " + e.getMessage());
		}
	}
	
	/**
	 * 예약일자 변경 (예약목록)
	 * PATCH /api/reservation/{reservationId}/date
	 * 
	 * 요청 본문 예시:
	 * {
	 *   "reservedDate": "2024-02-15",
	 *   "reservedTime": "14:00:00"
	 * }
	 */
	@PatchMapping("/{reservationId}/date")
	public ResponseEntity<?> updateReservationDate(
			@PathVariable("reservationId") Long reservationId,
			@RequestBody java.util.Map<String, String> requestBody,
			HttpServletRequest request) {
		try {
			String currentUserId = getCurrentUserId(request);
			
			// 요청 본문에서 날짜/시간 추출
			String dateStr = requestBody.get("reservedDate");
			String timeStr = requestBody.get("reservedTime");
			
			if (dateStr == null) {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST)
						.body("예약날짜는 필수입니다.");
			}
			
			java.time.LocalDate reservedDate = java.time.LocalDate.parse(dateStr);
			java.time.LocalTime reservedTime = timeStr != null 
					? java.time.LocalTime.parse(timeStr) 
					: null;
			
			reservationService.updateReservationDate(reservationId, currentUserId, reservedDate, reservedTime);
			return ResponseEntity.ok("예약일자가 변경되었습니다.");
		} catch (Exception e) {
			log.error("예약일자 변경 중 오류 발생", e);
			return ResponseEntity.status(HttpStatus.BAD_REQUEST)
					.body("예약일자 변경 중 오류가 발생했습니다: " + e.getMessage());
		}
	}
	
	/**
	 * 예약 취소 (마이페이지)
	 * PATCH /api/reservation/{reservationId}/cancel
	 * 
	 * 인증된 사용자만 자신의 예약을 취소할 수 있습니다.
	 * 예약 상태를 CANCELLED로 변경합니다.
	 */
	@PatchMapping("/{reservationId}/cancel")
	public ResponseEntity<?> cancelReservation(
			@PathVariable("reservationId") Long reservationId,
			HttpServletRequest request) {
		try {
			// localStorage에서 가져온 사용자 ID로 예약 취소
			String currentUserId = getCurrentUserId(request);
			reservationService.cancelReservation(reservationId, currentUserId);
			return ResponseEntity.ok("예약이 취소되었습니다.");
		} catch (Exception e) {
			log.error("예약 취소 중 오류 발생", e);
			return ResponseEntity.status(HttpStatus.BAD_REQUEST)
					.body("예약 취소 중 오류가 발생했습니다: " + e.getMessage());
		}
	}
}

