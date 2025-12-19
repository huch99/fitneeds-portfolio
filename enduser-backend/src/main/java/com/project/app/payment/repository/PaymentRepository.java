package com.project.app.payment.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.project.app.payment.entity.Payment;
import com.project.app.reservation.entity.Reservation;

/**
 * 결제 Repository (조회용)
 */
@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
	
	/**
	 * 예약으로 결제 정보 조회
	 */
	Optional<Payment> findByReservation(Reservation reservation);
	
	/**
	 * 예약 ID로 결제 정보 조회
	 */
	Optional<Payment> findByReservation_ReservationId(Long reservationId);
	
	/**
	 * 사용자 ID와 결제 상태로 결제 목록 조회 (이용내역용)
	 */
	List<Payment> findByUser_UserIdAndPaymentStatus(String userId, String paymentStatus);
	
	/**
	 * 사용자 ID로 결제 목록 조회
	 */
	List<Payment> findByUser_UserId(String userId);
}

