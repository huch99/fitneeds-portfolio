package com.project.app.reservation.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.project.app.reservation.service.ReservationService;
import com.project.app.review.dto.ReservationReviewDto;
import com.project.app.review.service.ReservationReviewService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/reservation")
@RequiredArgsConstructor
public class ReservationController {

	private final ReservationService reservationService;
	private final ReservationReviewService reservationReviewService;

	/**
	 * ========================= 내 예약 목록 조회 =========================
	 * GET /api/reservation/my?userId=UUID
	 * 
	 * 기존 예약 로직이 있다면 이 메서드에서 기존 서비스를 호출하도록 수정 가능
	 */
	@GetMapping("/my")
	public ResponseEntity<List<Map<String, Object>>> getMyReservations(
			@RequestParam("userId") String userId) {
		log.info("[ReservationController] getMyReservations 호출 - userId: {}", userId);
		
		List<Map<String, Object>> reservations = reservationService.getMyReservations(userId);
		log.info("[ReservationController] 조회 결과 개수: {}", reservations != null ? reservations.size() : 0);
		
		if (reservations != null && !reservations.isEmpty()) {
			log.info("[ReservationController] 첫 번째 예약 데이터: {}", reservations.get(0));
		}
		
		return ResponseEntity.ok(reservations);
	}

	/**
	 * ========================= 결제완료된 예약 목록 조회 =========================
	 * GET /api/reservation/my/completed?userId=UUID
	 * 
	 * 리뷰 작성 가능한 예약 목록을 반환합니다.
	 */
	@GetMapping("/my/completed")
	public ResponseEntity<List<ReservationReviewDto>> getMyCompletedReservations(
			@RequestParam("userId") String userId) {
		log.info("[ReservationController] getMyCompletedReservations 호출 - userId: {}", userId);
		
		List<ReservationReviewDto> completedReservations = 
				reservationReviewService.getCompletedReservationsForReview(userId);
		
		log.info("[ReservationController] 결제완료 예약 조회 결과 개수: {}", 
				completedReservations != null ? completedReservations.size() : 0);
		
		return ResponseEntity.ok(completedReservations);
	}
}

