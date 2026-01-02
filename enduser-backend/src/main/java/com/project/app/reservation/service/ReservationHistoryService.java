package com.project.app.reservation.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project.app.reservation.dto.PastHistoryResponseDto;
import com.project.app.reservation.entity.Reservation;
import com.project.app.reservation.entity.ReservationHistory;
import com.project.app.reservation.repository.ReservationHistoryRepository;
import com.project.app.reservation.repository.ReservationRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReservationHistoryService {

	private final ReservationRepository reservationRepository;
	private final ReservationHistoryRepository reservationHistoryRepository;
	/**
	 * 날짜가 지난 예약을 예약 테이블에서 제거하고 이용내역 테이블로 이동합니다.
	 * 
	 * @param targetDate 처리 기준 날짜 (null이면 오늘 날짜 사용)
	 * @return 처리된 예약 개수
	 */
	@Transactional
	public int completeReservations(LocalDate targetDate) {
		if (targetDate == null) {
			targetDate = LocalDate.now();
		}

		log.info("[ReservationHistoryService] 예약 완료 처리 시작 - 기준 날짜: {}", targetDate);

		// 날짜가 지난 예약 조회 (RESERVED 상태만)
		List<Reservation> pastReservations = reservationRepository.findPastReservations(targetDate);

		if (pastReservations.isEmpty()) {
			log.info("[ReservationHistoryService] 처리할 예약이 없습니다.");
			return 0;
		}

		log.info("[ReservationHistoryService] 처리 대상 예약 개수: {}", pastReservations.size());

		// 예약을 이용내역으로 변환하여 저장
		List<ReservationHistory> histories = pastReservations.stream()
				.map(this::convertToHistory)
				.collect(Collectors.toList());

		reservationHistoryRepository.saveAll(histories);
		log.info("[ReservationHistoryService] 이용내역 저장 완료 - 개수: {}", histories.size());

		// 예약 테이블에서 삭제
		reservationRepository.deleteAll(pastReservations);
		log.info("[ReservationHistoryService] 예약 삭제 완료 - 개수: {}", pastReservations.size());

		return pastReservations.size();
	}

	/**
	 * Reservation 엔티티를 ReservationHistory 엔티티로 변환합니다.
	 */
	private ReservationHistory convertToHistory(Reservation reservation) {
		// 스케줄 정보에서 필요한 데이터 추출
		String sportName = reservation.getSchedule().getProgram().getSportType().getSportNm();
		// Reservation 엔티티에 직접 연결된 Branch 사용
		String brchNm = reservation.getBranch() != null
				? reservation.getBranch().getBrchNm()
				: null;
		Long brchId = reservation.getBranch() != null
				? reservation.getBranch().getBrchId()
				: null;
		String trainerName = reservation.getSchedule().getUserAdmin().getUserName();
		Long scheduleId = reservation.getSchedule().getSchdId();

		return ReservationHistory.builder()
				.reservationId(reservation.getRsvId())
				.userId(reservation.getUser().getUserId())
				.scheduleId(scheduleId)
				.sportName(sportName)
				.brchId(brchId)
				.brchNm(brchNm)
				.trainerName(trainerName)
				.rsvDt(reservation.getRsvDt())
				.rsvTime(reservation.getRsvTime())
				.refId(scheduleId) // 스케줄 ID를 refId로 사용
				.reviewWritten("N") // 초기값: 리뷰 미작성
				.regDt(LocalDateTime.now())
				.build();
	}

	/**
	 * 사용자의 과거 이용내역을 조회합니다.
	 * 
	 * @param userId 사용자 ID
	 * @param startDate 조회 시작 날짜 (선택사항)
	 * @param endDate 조회 종료 날짜 (선택사항)
	 * @param branchId 지점 ID (선택사항)
	 * @param reviewWritten 리뷰 작성 여부 필터링 (Y: 작성됨, N: 미작성, null: 전체)
	 * @return 과거 이용내역 목록
	 */
	@Transactional(readOnly = true)
	public List<PastHistoryResponseDto> getPastHistory(
			String userId,
			LocalDate startDate,
			LocalDate endDate,
			Long branchId,
			String reviewWritten) {

		log.info("[ReservationHistoryService] 과거 이용내역 조회 시작 - userId: {}, startDate: {}, endDate: {}, branchId: {}, reviewWritten: {}",
				userId, startDate, endDate, branchId, reviewWritten);

		// 이용내역 조회 (리뷰 작성 여부 필터링 포함)
		List<ReservationHistory> histories = reservationHistoryRepository.findByUserIdAndDateRange(
				userId, startDate, endDate, branchId, reviewWritten);

		log.info("[ReservationHistoryService] 조회된 이용내역 개수: {}", histories.size());

		// DTO로 변환 (엔티티의 reviewWritten 필드 사용)
		List<PastHistoryResponseDto> result = histories.stream()
				.map(history -> {
					boolean reviewWrittenFlag = "Y".equals(history.getReviewWritten());
					return PastHistoryResponseDto.builder()
							.reservationId(history.getReservationId())
							.sportName(history.getSportName())
							.brchNm(history.getBrchNm())
							.trainerName(history.getTrainerName())
							.rsvDt(history.getRsvDt())
							.rsvTime(history.getRsvTime())
							.refId(history.getRefId())
							.reviewWritten(reviewWrittenFlag)
							.build();
				})
				.collect(Collectors.toList());

		return result;
	}

	/**
	 * 이용내역 ID로 이용내역의 리뷰 작성 여부를 업데이트합니다.
	 * 
	 * @param historyId 이용내역 ID
	 * @param reviewWritten 리뷰 작성 여부 (true: Y, false: N)
	 */
	@Transactional
	public void updateReviewWrittenByHistoryId(Long historyId, boolean reviewWritten) {
		log.info("[ReservationHistoryService] 리뷰 작성 여부 업데이트 - historyId: {}, reviewWritten: {}", 
				historyId, reviewWritten);
		
		String reviewWrittenStr = reviewWritten ? "Y" : "N";
		reservationHistoryRepository.updateReviewWrittenByHistoryId(historyId, reviewWrittenStr);
		
		log.info("[ReservationHistoryService] 리뷰 작성 여부 업데이트 완료");
	}

	/**
	 * 예약 ID로 이용내역의 리뷰 작성 여부를 업데이트합니다.
	 * (하위 호환성을 위해 유지)
	 * 
	 * @param reservationId 예약 ID
	 * @param reviewWritten 리뷰 작성 여부 (true: Y, false: N)
	 */
	@Transactional
	public void updateReviewWritten(Long reservationId, boolean reviewWritten) {
		log.info("[ReservationHistoryService] 리뷰 작성 여부 업데이트 - reservationId: {}, reviewWritten: {}", 
				reservationId, reviewWritten);
		
		String reviewWrittenStr = reviewWritten ? "Y" : "N";
		reservationHistoryRepository.updateReviewWritten(reservationId, reviewWrittenStr);
		
		log.info("[ReservationHistoryService] 리뷰 작성 여부 업데이트 완료");
	}
}
