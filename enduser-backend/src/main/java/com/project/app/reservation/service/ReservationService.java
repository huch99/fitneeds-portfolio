package com.project.app.reservation.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project.app.branch.entity.Branch;
import com.project.app.payment.entity.Payment;
import com.project.app.reservation.entity.Reservation;
import com.project.app.reservation.entity.RsvSttsCd;
import com.project.app.reservation.repository.ReservationRepository;
import com.project.app.schedule.entity.Schedule;
import com.project.app.user.entity.User;
import com.project.app.userpass.entity.UserPass;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class ReservationService {

	private final ReservationRepository reservationRepository;
	
	/**
     * 새로운 예약을 생성하고 저장합니다.
     * @param user               예약하는 사용자 엔티티
     * @param schedule           예약 대상 스케줄 엔티티
     * @param branch             예약 대상 지점 엔티티
     * @param userPass           사용된 이용권 엔티티 (nullable)
     * @param rsvDt              예약 날짜 (LocalDate)
     * @param rsvTime            예약 시간 (LocalTime)
     * @return 생성된 예약 엔티티
     */
    public Reservation createReservation(User user, Schedule schedule, Branch branch, UserPass userPass, LocalDate rsvDt, LocalTime rsvTime) {
        // (선택 사항) 여기에 스케줄의 잔여 정원 확인 및 감소 로직 추가
        // schedule.decreaseCapacity(1); // 스케줄 정원 관리 로직이 Schedule 엔티티나 ScheduleService에 있다면

        Reservation reservation = Reservation.builder()
                .user(user)
                .schedule(schedule)
                .branch(branch) // Huch의 Reservation 엔티티에 직접 Branch를 연결
                .userPass(userPass) // Huch의 Reservation 엔티티에 UserPass를 연결 (nullable)
                .rsvDt(rsvDt)
                .rsvTime(rsvTime)
                .sttsCd(RsvSttsCd.CONFIRMED) // 결제 완료 후 확정 상태
                .updID(user.getUserId()) // (옵션) 처음 생성 시에는 예약한 사용자 ID로 업데이트 ID 설정
                .build();

        return reservationRepository.save(reservation);
    }
    
    /**
     * 예약을 취소합니다.
     * @param rsvId 취소할 예약 ID
     * @param reason 취소 사유
     * @param updId 취소 요청자 ID (관리자 또는 사용자)
     * @return 취소된 예약 엔티티
     */
    public Reservation cancelReservation(Long rsvId, String reason, String updId) {
        Reservation reservation = reservationRepository.findById(rsvId)
                .orElseThrow(() -> new NoSuchElementException("예약을 찾을 수 없습니다: " + rsvId));

        reservation.cancel(reason, updId); // Reservation 엔티티의 취소 로직 호출
        
        // (선택 사항) 취소에 따른 비즈니스 로직 추가:
        // 1. 스케줄 정원 복원 (scheduleService.increaseCapacity(reservation.getSchedule().getSchdId()))
        // 2. 이용권 복원 (userPassService.cancelReservationAndUpdateUserPassForR(reservation.getUserPass().getUserPassId(), reason))
        // 3. 결제 취소 (paymentService.cancelPayment(reservation.getPayment().getPaymentId(), reason)) - Payment 엔티티에 rsvId가 있다면 가능

        return reservationRepository.save(reservation);
    }
    
    /**
     * 스케줄러가 호출하여 지난 날짜의 예약 (CONFIRMED 상태)을 COMPLETED 상태로 업데이트합니다.
     * @param batchUser 업데이터 사용자 ID (예: "SYSTEM" 또는 "SCHEDULER")
     * @return 업데이트된 예약의 수
     */
    public int updatePastReservationsToCompleted(String batchUser) {
        LocalDate today = LocalDate.now(); // 오늘 날짜

        // rsvDt가 오늘 날짜 이전이고, sttsCd가 CONFIRMED인 예약들을 찾습니다.
        List<Reservation> pastConfirmedReservations = reservationRepository.findByRsvDtBeforeAndSttsCd(today, RsvSttsCd.CONFIRMED);

        int updatedCount = 0;
        for (Reservation reservation : pastConfirmedReservations) {
            reservation.setSttsCd(RsvSttsCd.COMPLETED); // 상태를 COMPLETED로 변경
            reservation.setUpdID(batchUser); // 스케줄러가 업데이트했음을 기록
            reservationRepository.save(reservation);
            updatedCount++;
        }
        return updatedCount;
    }
}
