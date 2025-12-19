package com.project.app.attendance.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project.app.attendance.dto.AttendanceRequestDto;
import com.project.app.attendance.dto.AttendanceResponseDto;
import com.project.app.attendance.entity.Attendance;
import com.project.app.attendance.repository.AttendanceRepository;
import com.project.app.reservation.entity.Reservation;
import com.project.app.reservation.repository.ReservationRepository;
import com.project.app.schedule.entity.Schedule;
import com.project.app.ticket.entity.Ticket;
import com.project.app.ticket.repository.TicketRepository;
import com.project.app.user.entity.User;
import com.project.app.user.repository.UserRepository;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class AttendanceServiceImpl implements AttendanceService {
	
	private final AttendanceRepository attendanceRepository;
	private final ReservationRepository reservationRepository;
	private final UserRepository userRepository;
	private final TicketRepository ticketRepository;
	
	public AttendanceServiceImpl(
			AttendanceRepository attendanceRepository,
			ReservationRepository reservationRepository,
			UserRepository userRepository,
			TicketRepository ticketRepository) {
		this.attendanceRepository = attendanceRepository;
		this.reservationRepository = reservationRepository;
		this.userRepository = userRepository;
		this.ticketRepository = ticketRepository;
	}
	
	@Override
	@Transactional
	public AttendanceResponseDto createAttendance(AttendanceRequestDto requestDto) {
		// 사용자 조회
		User user = userRepository.findByUserId(requestDto.getUserId())
				.orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
		
		// 예약 조회 (선택적)
		Reservation reservation = null;
		if (requestDto.getReservationId() != null) {
			reservation = reservationRepository.findByReservationId(requestDto.getReservationId())
					.orElseThrow(() -> new RuntimeException("예약을 찾을 수 없습니다."));
		}
		
		// 이용권 조회 (필수)
		Ticket ticket = ticketRepository.findByTicketId(requestDto.getTicketId())
				.orElseThrow(() -> new RuntimeException("이용권을 찾을 수 없습니다."));
		
		// 출석 생성
		Attendance attendance = Attendance.builder()
				.user(user)
				.reservation(reservation)
				.ticket(ticket)
				.productId(requestDto.getProductId())
				.attendanceDate(requestDto.getAttendanceDate() != null 
						? requestDto.getAttendanceDate() 
						: LocalDate.now())
				.attendanceStatusCode(requestDto.getAttendanceStatusCode() != null 
						? requestDto.getAttendanceStatusCode() 
						: "ATTEND") // 기본값: 출석
				.build();
		
		Attendance savedAttendance = attendanceRepository.save(attendance);
		return convertToResponseDto(savedAttendance);
	}
	
	@Override
	public List<AttendanceResponseDto> getMyAttendances(String userId) {
		List<Attendance> attendances = attendanceRepository.findByUser_UserId(userId);
		return attendances.stream()
				.map(this::convertToResponseDto)
				.collect(Collectors.toList());
	}
	
	@Override
	@Transactional
	public void updateAttendanceStatus(Long attendanceId, String userId, String attendanceStatusCode) {
		Attendance attendance = attendanceRepository.findById(attendanceId)
				.orElseThrow(() -> new RuntimeException("출석 정보를 찾을 수 없습니다."));
		
		if (!attendance.getUser().getUserId().equals(userId)) {
			throw new RuntimeException("출석 정보를 수정할 권한이 없습니다.");
		}
		
		attendance.setAttendanceStatusCode(attendanceStatusCode);
		attendance.setModifyDateTime(LocalDateTime.now());
		attendance.setModifyUserId(userId);
		attendanceRepository.save(attendance);
	}
	
	@Override
	public AttendanceResponseDto getAttendanceByReservationId(Long reservationId, String userId) {
		Attendance attendance = attendanceRepository.findByReservation_ReservationId(reservationId)
				.orElseThrow(() -> new RuntimeException("예약에 대한 출석 정보를 찾을 수 없습니다."));
		
		// 본인의 출석만 조회 가능하도록 검증
		if (!attendance.getUser().getUserId().equals(userId)) {
			throw new RuntimeException("출석 조회 권한이 없습니다.");
		}
		
		return convertToResponseDto(attendance);
	}
	
	@Override
	@Transactional
	public AttendanceResponseDto checkAttendanceByUser(Long reservationId, String userId) {
		// 예약 조회
		Reservation reservation = reservationRepository.findByReservationId(reservationId)
				.orElseThrow(() -> new RuntimeException("예약을 찾을 수 없습니다."));
		
		// 본인 예약인지 확인
		if (!reservation.getUser().getUserId().equals(userId)) {
			throw new RuntimeException("본인의 예약만 출석체크할 수 있습니다.");
		}
		
		// 이용권 확인 (기간권인지 확인)
		if (reservation.getTicket() == null) {
			throw new RuntimeException("이용권이 없습니다.");
		}
		
		Ticket ticket = reservation.getTicket();
		// 기간권인지 확인 (ticketType이 "PERIOD"인 경우)
		if (!"PERIOD".equals(ticket.getTicketType())) {
			throw new RuntimeException("기간권만 사용자가 출석체크할 수 있습니다.");
		}
		
		// 이미 출석 기록이 있는지 확인
		Optional<Attendance> existingAttendance = attendanceRepository.findByReservation_ReservationId(reservationId);
		if (existingAttendance.isPresent()) {
			// 이미 출석 기록이 있으면 상태만 업데이트
			Attendance attendance = existingAttendance.get();
			attendance.setAttendanceStatusCode("ATTEND");
			attendance.setModifyDateTime(LocalDateTime.now());
			attendance.setModifyUserId(userId);
			attendance.setAttendanceDate(LocalDate.now());
			Attendance savedAttendance = attendanceRepository.save(attendance);
			return convertToResponseDto(savedAttendance);
		}
		
		// 출석 기록 생성
		Schedule schedule = reservation.getSchedule();
		Attendance attendance = Attendance.builder()
				.user(reservation.getUser())
				.reservation(reservation)
				.ticket(ticket)
				.productId(ticket.getTicketId()) // TODO: 실제 productId 필드 확인 필요
				.attendanceDate(LocalDate.now())
				.attendanceStatusCode("ATTEND")
				.modifyDateTime(LocalDateTime.now())
				.modifyUserId(userId)
				.build();
		
		Attendance savedAttendance = attendanceRepository.save(attendance);
		return convertToResponseDto(savedAttendance);
	}
	
	private AttendanceResponseDto convertToResponseDto(Attendance attendance) {
		Reservation reservation = attendance.getReservation();
		
		return AttendanceResponseDto.builder()
				.attendanceId(attendance.getAttendanceId())
				.reservationId(reservation != null ? reservation.getReservationId() : null)
				.ticketId(attendance.getTicket() != null ? attendance.getTicket().getTicketId() : null)
				.attendanceDate(attendance.getAttendanceDate())
				.attendanceStatusCode(attendance.getAttendanceStatusCode())
				.modifyDateTime(attendance.getModifyDateTime())
				.modifyUserId(attendance.getModifyUserId())
				.build();
	}
}

