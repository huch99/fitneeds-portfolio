package com.project.app.payment.repository;

import java.util.List;
import java.util.Optional;

import org.apache.ibatis.annotations.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.project.app.payment.entity.Payment;
import com.project.app.reservation.entity.Reservation;

/**
 * 결제 Repository (조회용)
 */
@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
	
	/**
	 * 예약 ID로 결제 정보 조회 (ref_id 사용)
	 */
	Optional<Payment> findByRefId(Long refId);
	
	/**
	 * 사용자 ID와 결제 상태로 결제 목록 조회 (이용내역용)
	 * 실제 테이블의 stts_cd를 사용
	 */
	List<Payment> findByUser_UserIdAndStatusCode(String userId, String statusCode);
	
	/**
	 * 사용자 ID로 결제 목록 조회
	 */
	List<Payment> findByUser_UserId(String userId);
	
	/**
	 * 사용자 ID로 결제 목록 조회 (대안: 직접 usr_id 컬럼 사용)
	 * User 엔티티를 함께 로드하기 위해 JOIN FETCH 사용
	 */
	@Query("SELECT p FROM Payment p JOIN FETCH p.user WHERE p.user.userId = :userId")
	List<Payment> findByUserId(@Param("userId") String userId);
	
	/**
	 * 사용자 ID로 결제 목록 조회 (네이티브 쿼리 - 직접 usr_id 컬럼 사용)
	 * User 엔티티를 함께 로드하기 위해 JOIN 추가
	 */
	@Query(value = "SELECT p.* FROM payment p INNER JOIN users u ON p.usr_id = u.user_id WHERE p.usr_id = :userId", nativeQuery = true)
	List<Payment> findByUsrIdNative(@Param("userId") String userId);
	
	/**
	 * 전체 결제 데이터 조회 (User 엔티티 함께 로드)
	 * JOIN FETCH로 User 엔티티를 즉시 로드
	 */
	@Query("SELECT DISTINCT p FROM Payment p JOIN FETCH p.user")
	List<Payment> findAllWithUser();
}

