package com.project.app.payment.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.project.app.payment.entity.Payment;

@Repository
public interface MyPaymentRepository extends JpaRepository<Payment, Long> {
	
	/**
	 * 사용자 ID로 결제 목록을 조회합니다.
	 * Reservation, Schedule, Program을 조인하여 프로그램 정보를 함께 가져옵니다.
	 */
	@Query("SELECT p FROM Payment p " +
		   "LEFT JOIN Reservation r ON p.refId = r.rsvId " +
		   "LEFT JOIN r.schedule s " +
		   "LEFT JOIN s.program prg " +
		   "WHERE p.user.userId = :userId " +
		   "ORDER BY p.regDt DESC")
	List<Payment> findByUserIdWithDetails(@Param("userId") String userId);
	
	/**
	 * 사용자 ID로 결제 목록을 조회합니다 (간단한 버전).
	 */
	@Query("SELECT p FROM Payment p " +
		   "WHERE p.user.userId = :userId " +
		   "ORDER BY p.regDt DESC")
	List<Payment> findByUserId(@Param("userId") String userId);
}

