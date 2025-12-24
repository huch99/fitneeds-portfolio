package com.project.app.reservation.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.project.app.reservation.entity.Reservation;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
	
	@Query("SELECT r FROM Reservation r " +
		   "LEFT JOIN FETCH r.user " +
		   "LEFT JOIN FETCH r.schedule s " +
		   "LEFT JOIN FETCH s.program " +
		   "LEFT JOIN FETCH s.userAdmin ua " +
		   "LEFT JOIN FETCH ua.branch " +
		   "WHERE r.user.userId = :userId ORDER BY r.rsvDt DESC, r.rsvTime DESC")
	List<Reservation> findByUserId(@Param("userId") String userId);
}

