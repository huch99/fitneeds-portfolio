package com.project.app.review.service;

import java.util.List;

import com.project.app.review.dto.ReviewDto;

public interface ReviewService {
    /**
     * 나의 리뷰 목록 조회
     */
    List<ReviewDto> getMyReviews(String userId);
    
    /**
     * 예약 ID로 리뷰 조회 (권한 체크 포함)
     */
    List<ReviewDto> getReviewByReservationId(Long reservationId, String userId);
    
    /**
     * 리뷰 생성 (권한 체크 포함)
     */
    ReviewDto createReview(ReviewDto reviewDto, String userId);
    
    /**
     * 리뷰 수정 (권한 체크 포함)
     */
    ReviewDto updateReview(ReviewDto reviewDto, String userId);
    
    /**
     * 리뷰 삭제 (권한 체크 포함)
     */
    void deleteReviewById(Long reviewId, String userId);
}

