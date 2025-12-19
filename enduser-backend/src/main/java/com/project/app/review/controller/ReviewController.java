package com.project.app.review.controller;

import java.util.List;

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
import org.springframework.web.bind.annotation.RestController;

import com.project.app.review.dto.ReviewDto;
import com.project.app.review.service.ReviewService;

import lombok.extern.slf4j.Slf4j;

/**
 * 리뷰 컨트롤러
 * 리뷰 CRUD (Create, Read, Update, Delete) 기능을 제공하는 REST API
 * 모든 API는 JWT 인증 토큰이 필요합니다.
 * Authorization 헤더에 "Bearer {token}" 형식으로 토큰을 포함해야 합니다.
 */
@Slf4j
@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

	// 리뷰 비즈니스 로직을 처리하는 서비스
    private final ReviewService reviewService;

    // 생성자: ReviewService를 주입받습니다
    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }
    
    /**
     * 현재 인증된 사용자의 userId를 가져옵니다.
     * JWT 토큰에서 추출된 사용자 정보를 사용합니다.
     */
    private String getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            log.error("SecurityContext에 인증 정보가 없습니다.");
            throw new RuntimeException("인증되지 않은 사용자입니다.");
        }
        if (!authentication.isAuthenticated()) {
            log.error("인증되지 않은 사용자입니다. Authentication: {}", authentication);
            throw new RuntimeException("인증되지 않은 사용자입니다.");
        }
        String userId = authentication.getName();
        log.debug("현재 인증된 사용자 ID: {}", userId);
        return userId; // JWT 토큰의 subject (userId)
    }

    /**
     * 나의 리뷰 목록 조회
     * GET /api/reviews/my
     * 헤더: Authorization: Bearer {token}
     */
    @GetMapping("/my")
    public ResponseEntity<?> getMyReviews() {
        try {
            String currentUserId = getCurrentUserId();
            List<ReviewDto> reviews = reviewService.getMyReviews(currentUserId);
            return ResponseEntity.ok(reviews);
        } catch (Exception e) {
            log.error("리뷰 목록 조회 중 오류 발생", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("리뷰 목록 조회 중 오류가 발생했습니다: " + e.getMessage());
        }
    }

    /**
     * 예약 ID로 리뷰 조회
     * GET /api/reviews/reservation/{reservationId}
     * 헤더: Authorization: Bearer {token}
     */
    @GetMapping("/reservation/{reservationId}")
    public ResponseEntity<?> getReviewByReservationId(@PathVariable Long reservationId) {
        try {
            String currentUserId = getCurrentUserId();
            List<ReviewDto> reviews = reviewService.getReviewByReservationId(reservationId, currentUserId);
            return ResponseEntity.ok(reviews);
        } catch (Exception e) {
            log.error("예약별 리뷰 조회 중 오류 발생", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("예약별 리뷰 조회 중 오류가 발생했습니다: " + e.getMessage());
        }
    }

    /**
     * 리뷰 생성
     * POST /api/reviews
     * 헤더: Authorization: Bearer {token}
     * 
     * 요청 본문 예시:
     * {
     *   "reservationId": 1,
     *   "rating": 5,
     *   "content": "정말 좋은 수업이었습니다!",
     *   "instructorId": 1
     * }
     */
    @PostMapping
    public ResponseEntity<?> createReview(@RequestBody ReviewDto reviewDto){
        try {
            String currentUserId = getCurrentUserId();
            ReviewDto createdReview = reviewService.createReview(reviewDto, currentUserId);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdReview);
        } catch (Exception e) {
            log.error("리뷰 생성 중 오류 발생", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("리뷰 생성 중 오류가 발생했습니다: " + e.getMessage());
        }
    }

    /**
     * 리뷰 수정
     * PUT /api/reviews/{reviewId}
     * 헤더: Authorization: Bearer {token}
     * 
     * 요청 본문 예시:
     * {
     *   "rating": 4,
     *   "content": "수정된 후기 내용"
     * }
     */
    @PutMapping("/{reviewId}")
    public ResponseEntity<?> updateReview(@PathVariable Long reviewId, @RequestBody ReviewDto reviewDto){
        try {
            String currentUserId = getCurrentUserId();
            reviewDto.setReviewId(reviewId);
            ReviewDto updatedReview = reviewService.updateReview(reviewDto, currentUserId);
            return ResponseEntity.ok(updatedReview);
        } catch (Exception e) {
            log.error("리뷰 수정 중 오류 발생", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("리뷰 수정 중 오류가 발생했습니다: " + e.getMessage());
        }
    }
    
    /**
     * 리뷰 삭제
     * DELETE /api/reviews/{reviewId}
     * 헤더: Authorization: Bearer {token}
     */
    @DeleteMapping("/{reviewId}")
    public ResponseEntity<?> deleteReviewById(@PathVariable Long reviewId){
        try {
            String currentUserId = getCurrentUserId();
            reviewService.deleteReviewById(reviewId, currentUserId);
            return ResponseEntity.ok("리뷰가 삭제되었습니다.");
        } catch (Exception e) {
            log.error("리뷰 삭제 중 오류 발생", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("리뷰 삭제 중 오류가 발생했습니다: " + e.getMessage());
        }
    }
}

