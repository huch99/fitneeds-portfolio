package com.project.app.review.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.app.board.dto.BoardDto;
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
     * 나의 리뷰 목록 조회
     * GET /api/reviews
     */
    @GetMapping
    public ResponseEntity<List<ReviewDto>> getAllReviews() {
        return ResponseEntity.ok(reviewService.getAllReviews());
    }

    /**
     * 예약 ID로 리뷰 조회
     * GET /api/reviews/id/1
     */
    @GetMapping("/id/{id}")
    public ResponseEntity<List<ReviewDto>> getReviewById(@PathVariable Long id) {
    	List<BoardDto> review = reviewService.getReviewById(id);
        if (review != null) {
            return ResponseEntity.ok(review); // 200 OK + 데이터
        } else {
            return ResponseEntity.notFound().build(); // 404 Not Found
        }
    }
    
    /**
     * 작성자로 게시글 조회
     * GET /api/reviews/author/admin
     */
    @GetMapping("/author/{author}")
    public ResponseEntity<List<ReviewDto>> getReviewByAuthor(@PathVariable String Author) {
    	List<ReviewDto> board = reviewService.getReviewByAuthor(Author);
        if (review != null) {
            return ResponseEntity.ok(review);
        } else {
            return ResponseEntity.notFound().build();
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
    public ResponseEntity<ReviewDto> createReview(@RequestBody ReviewDto reviewDto){
    	reviewService.createReview(reviewDto);
    	// 201 Created 상태 코드와 함께 생성된 데이터 반환
    	return ResponseEntity.status(HttpStatus.CREATED).body(reviewDto);
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
    @PutMapping("/{id}")
    public ResponseEntity<ReviewDto> updateReview(@PathVariable Long id, @RequestBody ReviewDto reviewDto){
    	// URL의 id를 DTO에 설정 (어떤 게시글을 수정할지 명확히 하기 위해)
    	reviewDto.setId(id);
    	reviewService.updateBoard(reviewDto);
    	return ResponseEntity.ok(reviewDto); // 200 OK + 수정된 데이터
    }
    
    /**
     * 리뷰 삭제
     * DELETE /api/reviews/{reviewId}
     * 헤더: Authorization: Bearer {token}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReviewById(@PathVariable Long id){
    	reviewService.deleteReviewById(id);
        // 삭제 성공 시 본문 없이 200 OK만 반환
        return ResponseEntity.ok().build();
    }
}

