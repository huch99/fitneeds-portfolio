package com.project.app.reservation.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project.app.branch.entity.Branch;
import com.project.app.payment.entity.Payment;
import com.project.app.reservation.dto.MyReservationResponseDto;
import com.project.app.reservation.entity.Reservation;
import com.project.app.reservation.entity.RsvSttsCd;
import com.project.app.reservation.repository.ReservationRepository;
import com.project.app.schedule.entity.Schedule;
import com.project.app.schedule.repository.ScheduleRepository;
import com.project.app.user.entity.User;
import com.project.app.userpass.entity.UserPass;
import com.project.app.userpass.service.UserPassService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class ReservationService {

	private final ReservationRepository reservationRepository;
	private final ScheduleRepository scheduleRepository;
	private final UserPassService userPassService;
	
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
                .regDt(LocalDateTime.now())
                .updDt(LocalDateTime.now())
                .build();

        return reservationRepository.save(reservation);
    }
    

    /**
     * 예약을 취소합니다.
     * Reservation 엔티티의 cancel() 메서드를 사용하여 상태 변경 로직을 캡슐화합니다.
     * 
     * @param rsvId 예약 ID
     * @param userId 사용자 ID (권한 확인 및 업데이트 ID로 사용)
     * @param cancelReason 취소 사유 (선택사항)
     * @throws NoSuchElementException 예약을 찾을 수 없는 경우
     * @throws IllegalStateException 예약 취소가 불가능한 상태인 경우
     */
    public void cancelReservation(Long rsvId, String userId, String cancelReason) {
        log.info("[ReservationService] 예약 취소 시작 - rsvId: {}, userId: {}", rsvId, userId);
        
        // 예약 조회
        Reservation reservation = reservationRepository.findById(rsvId)
                .orElseThrow(() -> new NoSuchElementException("예약을 찾을 수 없습니다. rsvId: " + rsvId));
        
        // 권한 확인: 예약한 사용자만 취소 가능
        if (!reservation.getUser().getUserId().equals(userId)) {
            throw new IllegalArgumentException("본인의 예약만 취소할 수 있습니다.");
        }
        
        // 엔티티의 cancel() 메서드를 사용하여 상태 변경 로직 캡슐화
        reservation.cancel(cancelReason, userId);
        
        // 저장
        reservationRepository.save(reservation);
        
        log.info("[ReservationService] 예약 취소 완료 - rsvId: {}", rsvId);
    }

    /**
     * 스케줄러가 호출하여 지난 날짜의 예약 (CONFIRMED 상태)을 COMPLETED 상태로 업데이트합니다.
     * Reservation 엔티티의 complete() 메서드를 사용하여 상태 변경 로직을 캡슐화합니다.
     * 
     * @param batchUser 업데이터 사용자 ID (예: "SYSTEM" 또는 "SCHEDULER")
     * @return 업데이트된 예약의 수
     */
    public int updatePastReservationsToCompleted(String batchUser) {
        LocalDate today = LocalDate.now(); // 오늘 날짜

        // rsvDt가 오늘 날짜 이전이고, sttsCd가 CONFIRMED인 예약들을 찾습니다.
        List<Reservation> pastConfirmedReservations = reservationRepository.findByRsvDtBeforeAndSttsCd(today, RsvSttsCd.CONFIRMED);

        int updatedCount = 0;
        for (Reservation reservation : pastConfirmedReservations) {
            // 엔티티의 complete() 메서드를 사용하여 상태 변경 로직 캡슐화
            reservation.complete();
            reservation.setUpdID(batchUser); // 스케줄러가 업데이트했음을 기록
            reservationRepository.save(reservation);
            updatedCount++;
        }
        return updatedCount;
    }

	
	/**
	 * 로그인한 사용자의 예약 목록을 조회합니다.
	 * 
	 * @param userId 사용자 ID
	 * @return 예약 목록 DTO 리스트
	 */
	@Transactional(readOnly = true)
	public List<MyReservationResponseDto> getMyReservations(String userId) {
		log.info("[ReservationService] 사용자 예약 목록 조회 시작 - userId: {}", userId);

		// Fetch Join을 사용하여 연관 엔티티를 한 번에 조회
		List<Reservation> reservations = reservationRepository.findByUserIdWithDetails(userId);

		log.info("[ReservationService] 조회된 예약 개수: {}", reservations.size());

		// Reservation 엔티티를 DTO로 변환
		List<MyReservationResponseDto> result = reservations.stream()
				.map(MyReservationResponseDto::from)
				.collect(Collectors.toList());

		return result;
	}

	
}
