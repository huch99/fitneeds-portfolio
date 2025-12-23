package com.project.app.review.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.project.app.review.dto.ReviewCreateRequest;
import com.project.app.review.dto.ReviewResponse;
import com.project.app.review.dto.ReviewUpdateRequest;
import com.project.app.review.service.ReviewService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    /** 공통 메서드: 현재 로그인 사용자 ID 추출 */
    private String getLoginUserId() {
        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null) {
            return null; // ⭐ 여기 중요
        }

        if (!authentication.isAuthenticated()) {
            return null;
        }

        return authentication.getName();
    }

    @PostMapping
    public ResponseEntity<Void> createReview(
            @RequestBody ReviewCreateRequest dto
    ) {
        reviewService.createReview(dto, getLoginUserId());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/my")
    public ResponseEntity<List<ReviewResponse>> getMyReviews() {
        return ResponseEntity.ok(
                reviewService.getMyReviews(getLoginUserId())
        );
    }

    @PutMapping("/{reviewId}")
    public ResponseEntity<Void> updateReview(
            @PathVariable Long reviewId,
            @RequestBody ReviewUpdateRequest dto
    ) {
        reviewService.updateReview(reviewId, dto, getLoginUserId());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<Void> deleteReview(
            @PathVariable Long reviewId
    ) {
        reviewService.deleteReview(reviewId, getLoginUserId());
        return ResponseEntity.ok().build();
    }
}


