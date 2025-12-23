package com.project.app.review.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project.app.review.dto.*;
import com.project.app.review.mapper.ReviewMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewMapper reviewMapper;

    @Transactional
    public void createReview(ReviewCreateRequest request, String userId) {

        if (reviewMapper.existsByReservationId(request.getReservationId())) {
            throw new RuntimeException("이미 리뷰가 작성된 예약입니다.");
        }

        reviewMapper.insertReview(
            request.getReservationId(),
            request.getRating(),
            request.getContent(),
            userId
        );
    }

    public List<ReviewResponse> getMyReviews(String userId) {
        return reviewMapper.selectReviewsByUserId(userId);
    }

    @Transactional
    public void updateReview(Long reviewId, ReviewUpdateRequest request, String userId) {

        ReviewResponse review = reviewMapper.selectReviewById(reviewId);
        if (review == null) {
            throw new RuntimeException("리뷰가 존재하지 않습니다.");
        }

        reviewMapper.updateReview(
            reviewId,
            request.getRating(),
            request.getContent(),
            userId
        );
    }

    @Transactional
    public void deleteReview(Long reviewId, String userId) {
        reviewMapper.deleteReview(reviewId, userId);
    }
}
