package com.project.app.review.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project.app.payment.entity.Payment;
import com.project.app.payment.repository.PaymentRepository;
import com.project.app.reservation.entity.Reservation;
import com.project.app.reservation.repository.ReservationRepository;
import com.project.app.review.dto.ReviewDto;
import com.project.app.review.entity.Review;
import com.project.app.review.repository.ReviewRepository;

import lombok.extern.slf4j.Slf4j;

/**
 * 리뷰 서비스 구현 클래스
 * ReviewService 인터페이스의 실제 비즈니스 로직을 구현합니다
 * JPA를 사용하여 데이터베이스 작업을 수행합니다.
 */
@Slf4j
@Service
public class ReviewServiceImpl implements ReviewService {

	// JPA Repository: 데이터베이스 작업을 수행하는 인터페이스
    private final ReviewRepository reviewRepository;
    private final ReservationRepository reservationRepository;
    private final PaymentRepository paymentRepository;

    // 생성자: 의존성 주입
    public ReviewServiceImpl(
    		ReviewRepository reviewRepository,
    		ReservationRepository reservationRepository,
    		PaymentRepository paymentRepository) {
        this.reviewRepository = reviewRepository;
        this.reservationRepository = reservationRepository;
        this.paymentRepository = paymentRepository;
    }
    
    /**
     * Review 엔티티를 ReviewDto로 변환
     */
    private ReviewDto toDto(Review review) {
        return ReviewDto.builder()
                .reviewId(review.getReviewId())
                .reservationId(review.getReservation().getReservationId())
                .rating(review.getRating())
                .content(review.getContent())
                .instructorId(review.getInstructorId())
                .registrationDateTime(review.getRegistrationDateTime())
                .build();
    }

    /**
     * 나의 리뷰 목록 조회
     * @param userId 사용자 ID
     * @return 리뷰 목록
     */
    @Override
    public List<ReviewDto> getMyReviews(String userId) {
        List<Review> reviews = reviewRepository.findByUser_UserId(userId);
        return reviews.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }
	
	/**
	 * 예약 ID로 리뷰 조회 (권한 체크 포함)
	 * @param reservationId 예약 ID
	 * @param userId 사용자 ID
	 * @return 리뷰 목록
	 */
	@Override
	public List<ReviewDto> getReviewByReservationId(Long reservationId, String userId) {
		// 권한 체크: 본인의 예약인지 확인
		Reservation reservation = reservationRepository.findByReservationId(reservationId)
				.orElseThrow(() -> new RuntimeException("예약을 찾을 수 없습니다."));
		
		if (!reservation.getUser().getUserId().equals(userId)) {
			throw new RuntimeException("리뷰 조회 권한이 없습니다.");
		}
		
		List<Review> reviews = reviewRepository.findByReservation_ReservationId(reservationId);
		return reviews.stream()
				.map(this::toDto)
				.collect(Collectors.toList());
	}

	/**
	 * 리뷰 생성 (권한 체크 포함)
	 * @Transactional: 데이터베이스 트랜잭션 관리
	 * 
	 * @param reviewDto 생성할 리뷰 정보
	 * @param userId 사용자 ID
	 * @return 생성된 리뷰 정보
	 */
	@Override
	@Transactional
	public ReviewDto createReview(ReviewDto reviewDto, String userId) {
		// 예약 조회 및 권한 체크
		Reservation reservation = reservationRepository.findByReservationId(reviewDto.getReservationId())
				.orElseThrow(() -> new RuntimeException("예약을 찾을 수 없습니다."));
		
		// 본인의 예약인지 확인
		if (!reservation.getUser().getUserId().equals(userId)) {
			throw new RuntimeException("리뷰 작성 권한이 없습니다.");
		}
		
		// 결제완료된 예약인지 확인 (이용내역에 있는 예약만 리뷰 작성 가능)
		Payment payment = paymentRepository.findByRefId(reviewDto.getReservationId())
				.orElse(null);
		
		if (payment == null || !"COMPLETED".equals(payment.getStatusCode())) {
			throw new RuntimeException("결제완료된 예약만 리뷰를 작성할 수 있습니다.");
		}
		
		// 이미 리뷰가 작성되었는지 확인
		List<Review> existingReviews = reviewRepository.findByReservation_ReservationId(reviewDto.getReservationId());
		if (existingReviews != null && !existingReviews.isEmpty()) {
			throw new RuntimeException("이미 리뷰가 작성된 예약입니다.");
		}
		
		// 리뷰 엔티티 생성
		Review review = Review.builder()
				.reservation(reservation)
				.rating(reviewDto.getRating())
				.content(reviewDto.getContent())
				.instructorId(reviewDto.getInstructorId())
				.registrationDateTime(LocalDateTime.now())
				.build();
		
		// 리뷰 저장
		Review savedReview = reviewRepository.save(review);
		
		// DTO로 변환하여 반환
		return toDto(savedReview);
	}
		
	/**
	 * 리뷰 수정 (권한 체크 포함)
	 * @Transactional: 수정 작업도 트랜잭션으로 관리
	 * 
	 * @param reviewDto 수정할 리뷰 정보
	 * @param userId 사용자 ID
	 * @return 수정된 리뷰 정보
	 */
	@Override
	@Transactional
	public ReviewDto updateReview(ReviewDto reviewDto, String userId) {
		// 리뷰 조회
		Review review = reviewRepository.findByReviewId(reviewDto.getReviewId())
				.orElseThrow(() -> new RuntimeException("리뷰를 찾을 수 없습니다."));
		
		// 권한 체크: 본인의 예약에 대한 리뷰인지 확인
		if (!review.getReservation().getUser().getUserId().equals(userId)) {
			throw new RuntimeException("리뷰 수정 권한이 없습니다.");
		}
		
		// 리뷰 수정
		review.setRating(reviewDto.getRating());
		review.setContent(reviewDto.getContent());
		
		// 수정된 리뷰 저장
		Review updatedReview = reviewRepository.save(review);
		
		// DTO로 변환하여 반환
		return toDto(updatedReview);
	}
	
	/**
	 * 리뷰 삭제 (권한 체크 포함)
	 * @Transactional: 삭제 작업도 트랜잭션으로 관리
	 * 
	 * @param reviewId 삭제할 리뷰 ID
	 * @param userId 사용자 ID
	 */
	@Override
	@Transactional
	public void deleteReviewById(Long reviewId, String userId) {
		// 리뷰 조회
		Review review = reviewRepository.findByReviewId(reviewId)
				.orElseThrow(() -> new RuntimeException("리뷰를 찾을 수 없습니다."));
		
		// 권한 체크: 본인의 예약에 대한 리뷰인지 확인
		if (!review.getReservation().getUser().getUserId().equals(userId)) {
			throw new RuntimeException("리뷰 삭제 권한이 없습니다.");
		}
		
		// 리뷰 삭제
		reviewRepository.delete(review);
	}
}

