package com.project.app.reservation.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project.app.reservation.dto.MyReservationResponseDto;
import com.project.app.reservation.entity.Reservation;
import com.project.app.reservation.entity.RsvSttsCd;
import com.project.app.reservation.repository.ReservationRepository;
import com.project.app.schedule.entity.Schedule;
import com.project.app.schedule.repository.ScheduleRepository;
import com.project.app.userpass.service.UserPassService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReservationService {

	private final ReservationRepository reservationRepository;
	private final ScheduleRepository scheduleRepository;
	private final UserPassService userPassService;
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

	/**
	 * 예약을 취소합니다.
	 * 
	 * @param rsvId 예약 ID
	 * @param userId 사용자 ID
	 * @param cancelReason 취소 사유 (선택사항)
	 * @throws IllegalArgumentException 예약을 찾을 수 없는 경우
	 * @throws IllegalStateException 이미 취소된 예약이거나 권한이 없는 경우
	 */
	@Transactional
	public void cancelReservation(Long rsvId, String userId, String cancelReason) {
		log.info("[ReservationService] 예약 취소 시작 - rsvId: {}, userId: {}", rsvId, userId);

		// 1. 예약 조회 및 존재 여부 확인
		Reservation reservation = reservationRepository
				.findByRsvIdAndUserId(rsvId, userId)
				.orElseThrow(() -> {
					log.warn("[ReservationService] 예약을 찾을 수 없음 - rsvId: {}, userId: {}", rsvId, userId);
					return new IllegalArgumentException("예약을 찾을 수 없습니다.");
				});

		// 2. 상태 체크 (이미 취소된 예약인지)
		if (reservation.getSttsCd() == RsvSttsCd.CANCELED) {
			log.warn("[ReservationService] 이미 취소된 예약 - rsvId: {}", rsvId);
			throw new IllegalStateException("이미 취소된 예약입니다.");
		}

		// 3. 권한 체크 (본인 예약인지) - Repository에서 이미 필터링했지만 추가 확인
		if (!reservation.getUser().getUserId().equals(userId)) {
			log.warn("[ReservationService] 권한 없음 - rsvId: {}, userId: {}", rsvId, userId);
			throw new IllegalStateException("본인의 예약만 취소할 수 있습니다.");
		}

		// 4. 이용권 복원 (userPass가 있는 경우)
		if (reservation.getUserPass() != null) {
			Long userPassId = reservation.getUserPass().getUserPassId();
			log.info("[ReservationService] 이용권 복원 시작 - userPassId: {}", userPassId);
			try {
				userPassService.cancelReservationAndUpdateUserPassForR(userPassId);
				log.info("[ReservationService] 이용권 복원 완료 - userPassId: {}", userPassId);
			} catch (Exception e) {
				log.error("[ReservationService] 이용권 복원 실패 - userPassId: {}", userPassId, e);
				throw new IllegalStateException("이용권 복원 중 오류가 발생했습니다: " + e.getMessage());
			}
		}

		// 5. 스케줄 예약 인원 감소
		Schedule schedule = reservation.getSchedule();
		if (schedule.getRsvCnt() != null && schedule.getRsvCnt() > 0) {
			schedule.setRsvCnt(schedule.getRsvCnt() - 1);
			scheduleRepository.save(schedule);
			log.info("[ReservationService] 스케줄 예약 인원 감소 완료 - schdId: {}, rsvCnt: {}", 
					schedule.getSchdId(), schedule.getRsvCnt());
		}

		// 6. 예약 상태 변경 및 취소 정보 저장
		reservation.setSttsCd(RsvSttsCd.CANCELED);
		reservation.setCnclRsn(cancelReason);
		reservation.setUpdID(userId);
		reservationRepository.save(reservation);

		log.info("[ReservationService] 예약 취소 완료 - rsvId: {}", rsvId);
	}
}
