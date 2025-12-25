package com.project.app.review.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.project.app.review.dto.HistoryReviewResponseDto;
import com.project.app.review.dto.ReservationReviewDto;
import com.project.app.review.dto.ReviewDto;
import com.project.app.review.service.ReservationReviewService;
import com.project.app.review.service.ReviewHistoryService;
import com.project.app.review.service.ReviewServiceImpl;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

	private final ReviewServiceImpl reviewService;
	private final ReservationReviewService reservationReviewService;
	private final ReviewHistoryService reviewHistoryService;

	public ReviewController(
			ReviewServiceImpl reviewService, 
			ReservationReviewService reservationReviewService,
			ReviewHistoryService reviewHistoryService) {
		
		this.reviewService = reviewService;
		this.reservationReviewService = reservationReviewService;
		this.reviewHistoryService = reviewHistoryService;
	}

	/**
	 * ========================= USER 리뷰 작성 =========================
	 * POST /api/reviews
	 */
	@PostMapping
	public ResponseEntity<Map<String, Object>> createReview(@RequestBody ReviewDto reviewDto) {
		try {
			// JWT 토큰에서 사용자 ID 추출
			Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
			String userId = authentication.getName();
			
			// 리뷰 DTO에 사용자 ID 설정
			reviewDto.setUserId(userId);

			log.info("[ReviewController] 리뷰 작성 요청 - historyId: {}, reservationId: {}, userId: {}", 
					reviewDto.getHistoryId(), reviewDto.getReservationId(), userId);

			// 리뷰 작성
			reviewService.createReview(reviewDto);

			// 응답 데이터 구성
			Map<String, Object> response = new HashMap<>();
			response.put("status", "SUCCESS");
			response.put("message", "리뷰가 작성되었습니다.");
			response.put("data", null);

			log.info("[ReviewController] 리뷰 작성 완료");

			return ResponseEntity.ok(response);

		} catch (Exception e) {
			log.error("[ReviewController] 리뷰 작성 중 오류 발생", e);

			Map<String, Object> errorResponse = new HashMap<>();
			errorResponse.put("status", "ERROR");
			errorResponse.put("message", "리뷰 작성 중 오류가 발생했습니다: " + e.getMessage());
			errorResponse.put("data", null);

			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
		}
	}

	/**
	 * ========================= 🔥 내가 쓴 리뷰 목록 조회 (USER)
	 *
	 * GET /api/reviews/my =========================
	 */
	@GetMapping("/my")
	public ResponseEntity<Map<String, Object>> getMyReviewList() {
		try {
			// JWT 토큰에서 사용자 ID 추출
			Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
			String userId = authentication.getName();

			log.info("[ReviewController] 내 리뷰 목록 조회 요청 - userId: {}", userId);

			List<ReviewDto> result = reviewService.getMyReviewList(userId);

			// 응답 데이터 구성
			Map<String, Object> response = new HashMap<>();
			response.put("status", "SUCCESS");
			response.put("message", "조회 성공");
			response.put("data", result);

			log.info("[ReviewController] 조회 결과 개수: {}", result != null ? result.size() : 0);

			return ResponseEntity.ok(response);

		} catch (Exception e) {
			log.error("[ReviewController] 예외 발생: {}", e.getMessage(), e);

			Map<String, Object> errorResponse = new HashMap<>();
			errorResponse.put("status", "ERROR");
			errorResponse.put("message", "리뷰 목록 조회 중 오류가 발생했습니다: " + e.getMessage());
			errorResponse.put("data", null);

			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
		}
	}

	/**
	 * ========================= ✏️ 내가 쓴 리뷰 수정 (본인만)
	 *
	 * PUT /api/reviews/{reviewId} =========================
	 */
	@PutMapping("/{reviewId}")
	public ResponseEntity<Map<String, Object>> updateReview(
			@PathVariable("reviewId") Long reviewId,
			@RequestBody ReviewDto dto) {
		try {
			// JWT 토큰에서 사용자 ID 추출
			Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
			String userId = authentication.getName();

			log.info("[ReviewController] 리뷰 수정 요청 - reviewId: {}, userId: {}", reviewId, userId);

			// 리뷰 수정
			reviewService.updateReview(reviewId, userId, dto);

			// 응답 데이터 구성
			Map<String, Object> response = new HashMap<>();
			response.put("status", "SUCCESS");
			response.put("message", "리뷰가 수정되었습니다.");
			response.put("data", null);

			log.info("[ReviewController] 리뷰 수정 완료 - reviewId: {}", reviewId);

			return ResponseEntity.ok(response);

		} catch (RuntimeException e) {
			log.warn("[ReviewController] 리뷰 수정 실패 - reviewId: {}", reviewId, e);

			Map<String, Object> errorResponse = new HashMap<>();
			errorResponse.put("status", "BAD_REQUEST");
			errorResponse.put("message", e.getMessage());
			errorResponse.put("data", null);

			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);

		} catch (Exception e) {
			log.error("[ReviewController] 리뷰 수정 중 오류 발생 - reviewId: {}", reviewId, e);

			Map<String, Object> errorResponse = new HashMap<>();
			errorResponse.put("status", "ERROR");
			errorResponse.put("message", "리뷰 수정 중 오류가 발생했습니다: " + e.getMessage());
			errorResponse.put("data", null);

			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
		}
	}

	/**
	 * ========================= 🗑 내가 쓴 리뷰 삭제 (본인만, 소프트 삭제)
	 *
	 * DELETE /api/reviews/{reviewId} =========================
	 */
	@DeleteMapping("/{reviewId}")
	public ResponseEntity<Map<String, Object>> deleteReview(
			@PathVariable("reviewId") Long reviewId) {
		try {
			// JWT 토큰에서 사용자 ID 추출
			Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
			String userId = authentication.getName();

			log.info("[ReviewController] 리뷰 삭제 요청 - reviewId: {}, userId: {}", reviewId, userId);

			// 리뷰 삭제 (이용내역의 reviewWritten도 함께 업데이트됨)
			reviewService.deleteReview(reviewId, userId);

			// 응답 데이터 구성
			Map<String, Object> response = new HashMap<>();
			response.put("status", "SUCCESS");
			response.put("message", "리뷰가 삭제되었습니다.");
			response.put("data", null);

			log.info("[ReviewController] 리뷰 삭제 완료 - reviewId: {}", reviewId);

			return ResponseEntity.ok(response);

		} catch (RuntimeException e) {
			log.warn("[ReviewController] 리뷰 삭제 실패 - reviewId: {}", reviewId, e);

			Map<String, Object> errorResponse = new HashMap<>();
			errorResponse.put("status", "BAD_REQUEST");
			errorResponse.put("message", e.getMessage());
			errorResponse.put("data", null);

			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);

		} catch (Exception e) {
			log.error("[ReviewController] 리뷰 삭제 중 오류 발생 - reviewId: {}", reviewId, e);

			Map<String, Object> errorResponse = new HashMap<>();
			errorResponse.put("status", "ERROR");
			errorResponse.put("message", "리뷰 삭제 중 오류가 발생했습니다: " + e.getMessage());
			errorResponse.put("data", null);

			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
		}
	}
	
	@GetMapping("/my/completed-reservations")
    public List<ReservationReviewDto> getCompletedReservationsForReview(
            @RequestParam String userId
    ) {
        return reservationReviewService.getCompletedReservationsForReview(userId);
    }

	/**
	 * 특정 이용내역 항목에서 작성된 리뷰 조회
	 * 
	 * GET /api/reviews/history/{historyId}
	 * 
	 * @param historyId 이용내역 ID
	 * @return 리뷰 목록 응답
	 */
	@GetMapping("/history/{historyId}")
	public ResponseEntity<Map<String, Object>> getReviewByHistoryId(
			@PathVariable("historyId") Long historyId) {
		try {
			// JWT 토큰에서 사용자 ID 추출
			Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
			String userId = authentication.getName();

			log.info("[ReviewController] 이용내역 리뷰 조회 요청 - historyId: {}, userId: {}", historyId, userId);

			// 이용내역 리뷰 조회
			List<HistoryReviewResponseDto> reviews = reviewHistoryService.getReviewByHistoryId(historyId, userId);

			// 응답 데이터 구성
			Map<String, Object> response = new HashMap<>();
			response.put("status", "SUCCESS");
			response.put("message", "조회 성공");
			response.put("data", reviews);

			log.info("[ReviewController] 이용내역 리뷰 조회 완료 - 개수: {}", reviews.size());

			return ResponseEntity.ok(response);

		} catch (RuntimeException e) {
			log.warn("[ReviewController] 이용내역 리뷰 조회 실패 - historyId: {}", historyId, e);

			Map<String, Object> errorResponse = new HashMap<>();
			errorResponse.put("status", "BAD_REQUEST");
			errorResponse.put("message", e.getMessage());
			errorResponse.put("data", null);

			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);

		} catch (Exception e) {
			log.error("[ReviewController] 이용내역 리뷰 조회 중 오류 발생 - historyId: {}", historyId, e);

			Map<String, Object> errorResponse = new HashMap<>();
			errorResponse.put("status", "ERROR");
			errorResponse.put("message", "이용내역 리뷰 조회 중 오류가 발생했습니다: " + e.getMessage());
			errorResponse.put("data", null);

			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
		}
	}
	
}
