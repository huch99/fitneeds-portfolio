package com.project.app.review.service;

import com.project.app.review.dto.ReviewDto;
import com.project.app.review.mapper.ReviewMapper;
import com.project.app.reservation.service.ReservationHistoryService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@Transactional
public class ReviewServiceImpl implements ReviewService {

    private final ReviewMapper reviewMapper;
    private final ReservationHistoryService reservationHistoryService;

    public ReviewServiceImpl(ReviewMapper reviewMapper, ReservationHistoryService reservationHistoryService) {
        this.reviewMapper = reviewMapper;
        this.reservationHistoryService = reservationHistoryService;
    }

    public void createReview(ReviewDto reviewDto) {
        log.info("[ReviewServiceImpl] 리뷰 작성 시작 - historyId: {}, reservationId: {}", 
                reviewDto.getHistoryId(), reviewDto.getReservationId());
        
        // 리뷰 저장
        reviewMapper.insertReview(reviewDto);
        
        // 이용내역의 리뷰 작성 여부 업데이트 (이용내역 ID 우선 사용)
        if (reviewDto.getHistoryId() != null) {
            reservationHistoryService.updateReviewWrittenByHistoryId(reviewDto.getHistoryId(), true);
            log.info("[ReviewServiceImpl] 이용내역 리뷰 작성 여부 업데이트 완료 - historyId: {}", reviewDto.getHistoryId());
        } else if (reviewDto.getReservationId() != null) {
            // 하위 호환성: reservationId로도 업데이트 가능
            reservationHistoryService.updateReviewWritten(reviewDto.getReservationId(), true);
            log.info("[ReviewServiceImpl] 이용내역 리뷰 작성 여부 업데이트 완료 - reservationId: {}", reviewDto.getReservationId());
        }
        
        log.info("[ReviewServiceImpl] 리뷰 작성 완료");
    }

    public List<ReviewDto> getMyReviewList(String userId) {
        log.info("[ReviewServiceImpl] getMyReviewList 호출됨 - userId: {}", userId);
        try {
            List<ReviewDto> result = reviewMapper.selectMyReviewList(userId);
            log.info("[ReviewServiceImpl] 조회 성공 - 결과 개수: {}", result != null ? result.size() : 0);
            return result;
        } catch (Exception e) {
            log.error("[ReviewServiceImpl] 조회 실패 - userId: {}, 에러: {}", userId, e.getMessage(), e);
            throw e;
        }
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
        log.info("[ReviewServiceImpl] 리뷰 삭제 시작 - reviewId: {}, userId: {}", reviewId, userId);
        
        // 본인 체크
        int count = reviewMapper.countByReviewIdAndUserId(reviewId, userId);
        if (count == 0) {
            throw new RuntimeException("권한이 없습니다. 본인 리뷰만 삭제 가능합니다.");
        }

        // 리뷰 삭제 전에 리뷰 정보 조회 (이용내역 ID 확인용)
        ReviewDto review = reviewMapper.selectReviewDetail(reviewId);
        if (review == null) {
            throw new RuntimeException("리뷰를 찾을 수 없습니다.");
        }

        // 리뷰 삭제 (소프트 삭제)
        reviewMapper.deleteReview(reviewId);
        log.info("[ReviewServiceImpl] 리뷰 삭제 완료 - reviewId: {}", reviewId);

        // 이용내역의 리뷰 작성 여부를 'N'으로 업데이트
        // 해당 이용내역에 다른 리뷰가 있는지 확인 필요
        if (review.getHistoryId() != null) {
            // 이용내역 ID로 리뷰 조회하여 다른 리뷰가 있는지 확인
            List<ReviewDto> remainingReviews = reviewMapper.selectReviewByHistoryId(
                    review.getHistoryId(), userId);
            
            // 남은 리뷰가 없으면 이용내역의 reviewWritten을 'N'으로 업데이트
            if (remainingReviews == null || remainingReviews.isEmpty()) {
                reservationHistoryService.updateReviewWrittenByHistoryId(review.getHistoryId(), false);
                log.info("[ReviewServiceImpl] 이용내역 리뷰 작성 여부 업데이트 완료 - historyId: {}, reviewWritten: N", 
                        review.getHistoryId());
            } else {
                log.info("[ReviewServiceImpl] 해당 이용내역에 다른 리뷰가 있어 이용내역 상태 유지 - historyId: {}", 
                        review.getHistoryId());
            }
        } else if (review.getReservationId() != null) {
            // 하위 호환성: reservationId로도 처리
            List<ReviewDto> remainingReviews = reviewMapper.selectReviewByReservationId(
                    review.getReservationId(), userId);
            
            if (remainingReviews == null || remainingReviews.isEmpty()) {
                reservationHistoryService.updateReviewWritten(review.getReservationId(), false);
                log.info("[ReviewServiceImpl] 이용내역 리뷰 작성 여부 업데이트 완료 - reservationId: {}, reviewWritten: N", 
                        review.getReservationId());
            }
        }
        
        log.info("[ReviewServiceImpl] 리뷰 삭제 프로세스 완료");
    }

}

