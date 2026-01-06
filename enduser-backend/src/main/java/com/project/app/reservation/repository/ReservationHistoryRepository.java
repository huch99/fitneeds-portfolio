package com.project.app.reservation.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.project.app.reservation.entity.ReservationHistory;

@Repository
public interface ReservationHistoryRepository extends JpaRepository<ReservationHistory, Long> {

	/**
	 * 사용자 ID로 과거 이용내역을 조회합니다.
	 * 
	 * @param userId 사용자 ID
	 * @param startDate 조회 시작 날짜 (선택사항)
	 * @param endDate 조회 종료 날짜 (선택사항)
	 * @param branchId 지점 ID (선택사항)
	 * @return 과거 이용내역 목록
	 */
	@Query("SELECT h FROM ReservationHistory h " +
			"JOIN FETCH h.branch " +
			"WHERE h.userId = :userId " +
			"AND (:startDate IS NULL OR h.rsvDt >= :startDate) " +
			"AND (:endDate IS NULL OR h.rsvDt <= :endDate) " +
			"AND (:branchId IS NULL OR h.branch.brchId = :branchId) " +
			"AND (:reviewWritten IS NULL OR h.reviewWritten = :reviewWritten) " +
			"ORDER BY h.rsvDt DESC, h.rsvTime DESC")
	List<ReservationHistory> findByUserIdAndDateRange(
			@Param("userId") String userId,
			@Param("startDate") LocalDate startDate,
			@Param("endDate") LocalDate endDate,
			@Param("branchId") Long branchId,
			@Param("reviewWritten") String reviewWritten);

	/**
	 * 예약 ID로 이용내역을 조회합니다.
	 * 
	 * @param reservationId 예약 ID
	 * @return 이용내역 (Optional)
	 */
	Optional<ReservationHistory> findByReservationId(Long reservationId);

	/**
	 * 이용내역 ID로 이용내역의 리뷰 작성 여부를 업데이트합니다.
	 * 
	 * @param historyId 이용내역 ID
	 * @param reviewWritten 리뷰 작성 여부 (Y 또는 N)
	 */
	@Modifying
	@Query("UPDATE ReservationHistory h SET h.reviewWritten = :reviewWritten WHERE h.historyId = :historyId")
	void updateReviewWrittenByHistoryId(@Param("historyId") Long historyId, @Param("reviewWritten") String reviewWritten);

	/**
	 * 예약 ID로 이용내역의 리뷰 작성 여부를 업데이트합니다.
	 * (하위 호환성을 위해 유지)
	 * 
	 * @param reservationId 예약 ID
	 * @param reviewWritten 리뷰 작성 여부 (Y 또는 N)
	 */
	@Modifying
	@Query("UPDATE ReservationHistory h SET h.reviewWritten = :reviewWritten WHERE h.reservationId = :reservationId")
	void updateReviewWritten(@Param("reservationId") Long reservationId, @Param("reviewWritten") String reviewWritten);

	/**
	 * 이용내역 ID로 이용내역을 조회합니다.
	 * 
	 * @param historyId 이용내역 ID
	 * @return 이용내역 (Optional)
	 */
	Optional<ReservationHistory> findByHistoryId(Long historyId);
}
