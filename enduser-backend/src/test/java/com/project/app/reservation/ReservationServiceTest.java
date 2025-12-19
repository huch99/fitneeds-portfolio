package com.project.app.reservation;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.project.app.payment.entity.Payment;
import com.project.app.payment.repository.PaymentRepository;
import com.project.app.reservation.dto.ReservationResponseDto;
import com.project.app.reservation.entity.Reservation;
import com.project.app.reservation.repository.ReservationRepository;
import com.project.app.reservation.service.ReservationService;
import com.project.app.reservation.service.ReservationServiceImpl;
import com.project.app.schedule.entity.Schedule;
import com.project.app.schedule.repository.ScheduleRepository;
import com.project.app.ticket.repository.TicketRepository;
import com.project.app.user.entity.User;
import com.project.app.user.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
@DisplayName("예약 서비스 테스트")
class ReservationServiceTest {

	@Mock
	private ReservationRepository reservationRepository;
	
	@Mock
	private UserRepository userRepository;
	
	@Mock
	private ScheduleRepository scheduleRepository;
	
	@Mock
	private TicketRepository ticketRepository;
	
	@Mock
	private PaymentRepository paymentRepository;
	
	@InjectMocks
	private ReservationServiceImpl reservationService;
	
	private User testUser;
	private Schedule testSchedule;
	private Reservation testReservation;
	private Payment testPayment;
	
	@BeforeEach
	void setUp() {
		testUser = User.builder()
				.userId("testuser")
				.userName("테스트 사용자")
				.password("password123")
				.build();
		
		testSchedule = Schedule.builder()
				.scheduleId(1L)
				.exerciseName("요가 클래스")
				.exerciseDate(LocalDateTime.now().plusDays(1))
				.exerciseLocation("강남점")
				.trainerName("김트레이너")
				.capacity(10)
				.currentCount(0)
				.build();
		
		testReservation = Reservation.builder()
				.reservationId(1L)
				.user(testUser)
				.schedule(testSchedule)
				.statusCode("RESERVED")
				.registrationDateTime(LocalDateTime.now())
				.reservedDate(LocalDateTime.now().plusDays(1))
				.build();
		
		testPayment = Payment.builder()
				.paymentId(1L)
				.reservation(testReservation)
				.user(testUser)
				.paymentStatus("BANK_TRANSFER_COMPLETED")
				.paymentAmount(java.math.BigDecimal.valueOf(50000))
				.paymentDate(LocalDateTime.now())
				.registrationDateTime(LocalDateTime.now())
				.build();
	}
	
	// 예약 생성 기능은 이 프로젝트에서 구현하지 않음 (조회 전용)
	
	@Test
	@DisplayName("나의 운동 목록 조회 성공")
	void testGetMyReservations_Success() {
		// given
		Schedule schedule2 = Schedule.builder()
				.scheduleId(2L)
				.exerciseName("필라테스")
				.exerciseDate(LocalDateTime.now().plusDays(3))
				.exerciseLocation("서초점")
				.trainerName("이트레이너")
				.capacity(15)
				.currentCount(0)
				.build();
		
		Reservation reservation1 = Reservation.builder()
				.reservationId(1L)
				.user(testUser)
				.schedule(testSchedule)
				.statusCode("RESERVED")
				.registrationDateTime(LocalDateTime.now())
				.reservedDate(LocalDateTime.now().plusDays(1))
				.build();
		
		Reservation reservation2 = Reservation.builder()
				.reservationId(2L)
				.user(testUser)
				.schedule(schedule2)
				.statusCode("RESERVED")
				.registrationDateTime(LocalDateTime.now())
				.reservedDate(LocalDateTime.now().plusDays(3))
				.build();
		
		when(reservationRepository.findByUser_UserId("testuser"))
				.thenReturn(Arrays.asList(reservation1, reservation2));
		when(paymentRepository.findByReservation(any(Reservation.class)))
				.thenReturn(Optional.empty());
		
		// when
		List<ReservationResponseDto> reservations = reservationService.getMyReservations("testuser");
		
		// then
		assertNotNull(reservations);
		assertEquals(2, reservations.size());
		assertEquals("요가 클래스", reservations.get(0).getExerciseName());
		assertEquals("필라테스", reservations.get(1).getExerciseName());
	}
	
	@Test
	@DisplayName("나의 운동 목록 조회 - 결제 정보 포함")
	void testGetMyReservations_WithPayment() {
		// given
		when(reservationRepository.findByUser_UserId("testuser"))
				.thenReturn(Arrays.asList(testReservation));
		when(paymentRepository.findByReservation(testReservation))
				.thenReturn(Optional.of(testPayment));
		
		// when
		List<ReservationResponseDto> reservations = reservationService.getMyReservations("testuser");
		
		// then
		assertNotNull(reservations);
		assertEquals(1, reservations.size());
		assertEquals("BANK_TRANSFER_COMPLETED", reservations.get(0).getPaymentStatus());
	}
	
	@Test
	@DisplayName("예약 ID로 조회 성공")
	void testGetReservationById_Success() {
		// given
		when(reservationRepository.findByReservationId(1L))
				.thenReturn(Optional.of(testReservation));
		when(paymentRepository.findByReservation(testReservation))
				.thenReturn(Optional.of(testPayment));
		
		// when
		ReservationResponseDto response = reservationService.getReservationById(1L);
		
		// then
		assertNotNull(response);
		assertEquals(1L, response.getReservationId());
		assertEquals("요가 클래스", response.getExerciseName());
	}
	
	@Test
	@DisplayName("예약 취소 성공")
	void testCancelReservation_Success() {
		// given
		when(reservationRepository.findByReservationId(1L))
				.thenReturn(Optional.of(testReservation));
		when(reservationRepository.save(any(Reservation.class))).thenReturn(testReservation);
		
		// when
		reservationService.cancelReservation(1L, "testuser");
		
		// then
		verify(reservationRepository, times(1)).save(any(Reservation.class));
		assertEquals("CANCELLED", testReservation.getStatusCode());
		assertEquals("testuser", testReservation.getModifyUserId());
	}
	
	@Test
	@DisplayName("예약 취소 실패 - 다른 사용자의 예약")
	void testCancelReservation_Unauthorized() {
		// given
		User otherUser = User.builder()
				.userId("otheruser")
				.userName("다른 사용자")
				.build();
		
		Reservation otherReservation = Reservation.builder()
				.reservationId(1L)
				.user(otherUser)
				.schedule(testSchedule)
				.statusCode("RESERVED")
				.registrationDateTime(LocalDateTime.now())
				.reservedDate(LocalDateTime.now().plusDays(1))
				.build();
		
		when(reservationRepository.findByReservationId(1L))
				.thenReturn(Optional.of(otherReservation));
		
		// when & then
		assertThrows(RuntimeException.class, () -> {
			reservationService.cancelReservation(1L, "testuser");
		});
	}
}

