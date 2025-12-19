package com.project.app.reservation.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.project.app.reservation.entity.Reservation;
import com.project.app.user.entity.User;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
	Optional<Reservation> findByReservationId(Long reservationId);
	
	/**
	 * 사용자로 예약 목록 조회
	 */
	List<Reservation> findByUser(User user);
	
	/**
	 * 사용자 ID로 예약 목록 조회 (마이페이지용)
	 */
	List<Reservation> findByUser_UserId(String userId);
}

