package com.project.app.review.controller;

import com.project.app.review.dto.ReviewDto;
import com.project.app.review.service.ReviewServiceImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

	private final ReviewServiceImpl reviewService;

	public ReviewController(ReviewServiceImpl reviewService) {
		this.reviewService = reviewService;
	}

	/**
	 * ========================= USER 리뷰 작성 =========================
	 */
	@PostMapping
	public ResponseEntity<Void> createReview(@RequestBody ReviewDto reviewDto) {
		// ⚠️ 로그인 연동 전 임시 처리
		if (reviewDto.getUserId() == null) {
			reviewDto.setUserId("1"); // 추후 로그인 사용자 ID로 교체
		}

		reviewService.createReview(reviewDto);
		return ResponseEntity.ok().build();
	}

	/**
	 * ========================= 🔥 내가 쓴 리뷰 목록 조회 (USER)
	 *
	 * GET /api/reviews/my?userId=UUID =========================
	 */
	@GetMapping("/my")
	public ResponseEntity<List<ReviewDto>> getMyReviewList(@RequestParam("userId") String userId) {
		log.info("==========================================");
		log.info("[ReviewController] getMyReviewList 호출됨!!!");
		log.info("[ReviewController] userId: {}", userId);
		log.info("==========================================");
		try {
			List<ReviewDto> result = reviewService.getMyReviewList(userId);
			log.info("[ReviewController] 조회 결과 개수: {}", result != null ? result.size() : 0);
			return ResponseEntity.ok(result);
		} catch (Exception e) {
			log.error("[ReviewController] 예외 발생: {}", e.getMessage(), e);
			throw e;
		}
	}

	/**
	 * ========================= ✏️ 내가 쓴 리뷰 수정 (본인만)
	 *
	 * PUT /api/reviews/{reviewId}?userId=UUID =========================
	 */
	@PutMapping("/{reviewId}")
	public ResponseEntity<Void> updateReview(@PathVariable("reviewId") Long reviewId,
			@RequestParam("userId") String userId, @RequestBody ReviewDto dto) {
		reviewService.updateReview(reviewId, userId, dto);
		return ResponseEntity.ok().build();
	}

	/**
	 * ========================= 🗑 내가 쓴 리뷰 삭제 (본인만, 소프트 삭제)
	 *
	 * DELETE /api/reviews/{reviewId}?userId=UUID =========================
	 */
	@DeleteMapping("/{reviewId}")
	public ResponseEntity<Void> deleteReview(@PathVariable("reviewId") Long reviewId,
			@RequestParam("userId") String userId) {
		reviewService.deleteReview(reviewId, userId);
		return ResponseEntity.ok().build();
	}
}
