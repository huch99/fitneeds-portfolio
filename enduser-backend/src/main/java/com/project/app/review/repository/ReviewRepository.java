package com.project.app.review.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.project.app.review.entity.Review;
import com.project.app.reservation.entity.Reservation;

/**
 * 리뷰 Repository (JPA)
 */
@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
	
	/**
	 * 리뷰 ID로 조회
	 */
	Optional<Review> findByReviewId(Long reviewId);
	
	/**
	 * 예약 ID로 리뷰 조회
	 */
	List<Review> findByReservation_ReservationId(Long reservationId);
	
	/**
	 * 예약으로 리뷰 조회
	 */
	List<Review> findByReservation(Reservation reservation);
	
	/**
	 * 사용자 ID로 리뷰 목록 조회 (나의 리뷰)
	 * Reservation을 통해 User와 조인하여 조회
	 */
	@Query("SELECT r FROM Review r " +
		   "JOIN r.reservation res " +
		   "JOIN res.user u " +
		   "WHERE u.userId = :userId " +
		   "ORDER BY r.registrationDateTime DESC")
	List<Review> findByUser_UserId(@Param("userId") String userId);
	
	/**
	 * 예약 ID와 사용자 ID로 리뷰 조회 (권한 체크용)
	 */
	@Query("SELECT r FROM Review r " +
		   "JOIN r.reservation res " +
		   "JOIN res.user u " +
		   "WHERE res.reservationId = :reservationId " +
		   "AND u.userId = :userId")
	List<Review> findByReservationIdAndUserId(
			@Param("reservationId") Long reservationId,
			@Param("userId") String userId);
}

