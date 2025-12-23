package com.project.app.review.service;

import com.project.app.review.dto.ReviewDto;
import com.project.app.review.mapper.ReviewMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ReviewServiceImpl implements ReviewService {

    private final ReviewMapper reviewMapper;

    public ReviewServiceImpl(ReviewMapper reviewMapper) {
        this.reviewMapper = reviewMapper;
    }

    public void createReview(ReviewDto reviewDto) {
        reviewMapper.insertReview(reviewDto);
    }

    public List<ReviewDto> getMyReviewList(String userId) {
        return reviewMapper.selectMyReviewList(userId);
    }

    public void updateReview(Long reviewId, String userId, ReviewDto reviewDto) {
        // 본인 체크
        int count = reviewMapper.countByReviewIdAndUserId(reviewId, userId);
        if (count == 0) {
            throw new RuntimeException("권한이 없습니다. 본인 리뷰만 수정 가능합니다.");
        }

        reviewDto.setReviewId(reviewId);
        reviewMapper.updateReview(reviewDto);
    }

    public void deleteReview(Long reviewId, String userId) {
        // 본인 체크
        int count = reviewMapper.countByReviewIdAndUserId(reviewId, userId);
        if (count == 0) {
            throw new RuntimeException("권한이 없습니다. 본인 리뷰만 삭제 가능합니다.");
        }

        reviewMapper.deleteReview(reviewId);
    }
}

