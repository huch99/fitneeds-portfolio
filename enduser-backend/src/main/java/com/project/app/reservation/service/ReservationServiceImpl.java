package com.project.app.reservation.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project.app.reservation.entity.Reservation;
import com.project.app.reservation.repository.ReservationRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReservationServiceImpl implements ReservationService {

	private final ReservationRepository reservationRepository;

	@Override
	public List<Map<String, Object>> getMyReservations(String userId) {
		log.info("[ReservationServiceImpl] getMyReservations 호출 - userId: {}", userId);
		
		List<Reservation> reservations = reservationRepository.findByUserId(userId);
		log.info("[ReservationServiceImpl] DB 조회 결과 개수: {}", reservations != null ? reservations.size() : 0);
		
		if (reservations == null || reservations.isEmpty()) {
			log.warn("[ReservationServiceImpl] 예약 데이터가 없습니다. userId: {}", userId);
			return List.of();
		}
		
		List<Map<String, Object>> result = reservations.stream()
				.map(this::convertToMap)
				.collect(Collectors.toList());
		
		log.info("[ReservationServiceImpl] 변환 완료. 결과 개수: {}", result.size());
		
		return result;
	}

	private Map<String, Object> convertToMap(Reservation reservation) {
		Map<String, Object> map = new HashMap<>();
		
		// 기본 예약 정보
		map.put("reservationId", reservation.getRsvId());
		map.put("rsvId", reservation.getRsvId());
		map.put("reservedDate", reservation.getRsvDt());
		map.put("exerciseDate", reservation.getRsvDt());
		map.put("reservedTime", reservation.getRsvTime() != null 
				? reservation.getRsvTime().toString() 
				: null);
		map.put("sttsCd", reservation.getSttsCd().name());
		
		// 사용자 정보
		if (reservation.getUser() != null) {
			map.put("userId", reservation.getUser().getUserId());
			map.put("userName", reservation.getUser().getUserName());
			map.put("email", reservation.getUser().getEmail());
		}
		
		// 스케줄 및 프로그램 정보
		if (reservation.getSchedule() != null) {
			map.put("schdId", reservation.getSchedule().getSchdId());
			map.put("schdNm", reservation.getSchedule().getDescription());
			
			if (reservation.getSchedule().getProgram() != null) {
				map.put("programId", reservation.getSchedule().getProgram().getProgId());
				map.put("programName", reservation.getSchedule().getProgram().getProgNm());
				map.put("exerciseName", reservation.getSchedule().getProgram().getProgNm());
				map.put("paymentAmount", reservation.getSchedule().getProgram().getOneTimeAmt());
			}
			
			if (reservation.getSchedule().getUserAdmin() != null) {
				map.put("trainerName", reservation.getSchedule().getUserAdmin().getUserName());
				map.put("instructorId", reservation.getSchedule().getUserAdmin().getUserId());
				
				if (reservation.getSchedule().getUserAdmin().getBranch() != null) {
					map.put("branchName", reservation.getSchedule().getUserAdmin().getBranch().getBrchNm());
					map.put("exerciseLocation", reservation.getSchedule().getUserAdmin().getBranch().getBrchNm());
				}
			}
		}
		
		// 결제 상태 (예약 상태로 대체)
		map.put("paymentStatus", reservation.getSttsCd().name());
		
		return map;
	}
}
