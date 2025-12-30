package com.project.app.review.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project.app.review.dto.HistoryReviewResponseDto;
import com.project.app.review.dto.ReviewDto;
import com.project.app.review.mapper.ReviewMapper;
import com.project.app.reservation.entity.ReservationHistory;
import com.project.app.reservation.repository.ReservationHistoryRepository;
import com.project.app.schedule.entity.Schedule;
import com.project.app.schedule.repository.ScheduleRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * 이용내역 리뷰 관련 서비스
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReviewHistoryService {

	private final ReviewMapper reviewMapper;
	private final ReservationHistoryRepository reservationHistoryRepository;
	private final ScheduleRepository scheduleRepository;

	/**
	 * 이용내역 ID로 리뷰를 조회합니다.
	 * 
	 * @param historyId 이용내역 ID
	 * @param userId 사용자 ID (권한 확인용)
	 * @return 리뷰 목록
	 */
	public List<HistoryReviewResponseDto> getReviewByHistoryId(Long historyId, String userId) {
		log.info("[ReviewHistoryService] 이용내역 리뷰 조회 시작 - historyId: {}, userId: {}", historyId, userId);

		// 이용내역 조회 및 권한 확인
		ReservationHistory history = reservationHistoryRepository.findByHistoryId(historyId)
				.orElseThrow(() -> new RuntimeException("이용내역을 찾을 수 없습니다."));

		if (!history.getUserId().equals(userId)) {
			throw new RuntimeException("권한이 없습니다. 본인의 이용내역만 조회 가능합니다.");
		}

		// 이용내역 ID로 리뷰 조회 (이용내역 ID 우선 사용)
		List<ReviewDto> reviews = reviewMapper.selectReviewByHistoryId(historyId, userId);
		
		// 이용내역 ID로 조회 결과가 없으면 예약 ID로 조회 (하위 호환성)
		if (reviews == null || reviews.isEmpty()) {
			reviews = reviewMapper.selectReviewByReservationId(history.getReservationId(), userId);
		}

		// Schedule에서 강사 ID 조회
		Schedule schedule = scheduleRepository.findById(history.getScheduleId()).orElse(null);
		if (schedule != null && schedule.getUserAdmin() != null) {
			schedule.getSchdId();
		}

		// DTO 변환
		List<HistoryReviewResponseDto> result = reviews.stream()
				.map(review -> {
					return HistoryReviewResponseDto.builder()
							.reviewId(review.getReviewId())
							.reservationId(review.getReservationId())
							.rating(review.getRating())
							.content(review.getContent())
							.registrationDateTime(review.getCreatedAt() != null 
									? review.getCreatedAt().toString() 
									: null)
							.build();
				})
				.collect(Collectors.toList());

		log.info("[ReviewHistoryService] 이용내역 리뷰 조회 완료 - 개수: {}", result.size());
		return result;
	}
}

