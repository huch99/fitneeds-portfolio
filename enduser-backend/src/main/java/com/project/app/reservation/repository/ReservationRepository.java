package com.project.app.reservation.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.project.app.reservation.entity.Reservation;
import com.project.app.reservation.entity.RsvSttsCd;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {

	List<Reservation> findByRsvDtBeforeAndSttsCd(LocalDate rsvDt, RsvSttsCd sttsCd);
}
