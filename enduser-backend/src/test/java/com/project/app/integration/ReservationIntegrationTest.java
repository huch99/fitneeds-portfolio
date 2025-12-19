package com.project.app.integration;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.app.config.security.JwtTokenProvider;
import com.project.app.payment.entity.Payment;
import com.project.app.payment.repository.PaymentRepository;
import com.project.app.reservation.entity.Reservation;
import com.project.app.reservation.repository.ReservationRepository;
import com.project.app.schedule.entity.Schedule;
import com.project.app.schedule.repository.ScheduleRepository;
import com.project.app.user.entity.User;
import com.project.app.user.repository.UserRepository;

@SpringBootTest(properties = {
	"mybatis.mapper-locations=",
	"mybatis.type-aliases-package="
})
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
@DisplayName("예약 통합 테스트 (JWT 인증 포함)")
class ReservationIntegrationTest {

	@Autowired
	private MockMvc mockMvc;
	
	@Autowired
	private ObjectMapper objectMapper;
	
	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private ReservationRepository reservationRepository;
	
	@Autowired
	private PaymentRepository paymentRepository;
	
	@Autowired
	private ScheduleRepository scheduleRepository;
	
	@Autowired
	private JwtTokenProvider jwtTokenProvider;
	
	@Autowired
	private PasswordEncoder passwordEncoder;
	
	private User testUser;
	private Schedule testSchedule1;
	private Schedule testSchedule2;
	private String jwtToken;
	
	@BeforeEach
	void setUp() {
		// 테스트 사용자 생성
		testUser = User.builder()
				.userId("testuser")
				.userName("테스트 사용자")
				.password(passwordEncoder.encode("password123"))
				.auth("USER")
				.build();
		userRepository.save(testUser);
		
		// JWT 토큰 생성
		List<String> roles = new ArrayList<>();
		roles.add(testUser.getAuth());
		jwtToken = jwtTokenProvider.createToken(testUser.getUserId(), roles);
		
		// 테스트 스케줄 데이터 생성
		testSchedule1 = Schedule.builder()
				.exerciseName("요가 클래스")
				.exerciseDate(LocalDateTime.now().plusDays(1))
				.exerciseLocation("강남점")
				.trainerName("김트레이너")
				.capacity(10)
				.currentCount(0)
				.build();
		scheduleRepository.save(testSchedule1);
		
		testSchedule2 = Schedule.builder()
				.exerciseName("필라테스")
				.exerciseDate(LocalDateTime.now().plusDays(3))
				.exerciseLocation("서초점")
				.trainerName("이트레이너")
				.capacity(15)
				.currentCount(0)
				.build();
		scheduleRepository.save(testSchedule2);
		
		// 테스트 예약 데이터 생성
		Reservation reservation1 = Reservation.builder()
				.user(testUser)
				.schedule(testSchedule1)
				.statusCode("RESERVED")
				.registrationDateTime(LocalDateTime.now())
				.reservedDate(LocalDateTime.now().plusDays(1))
				.build();
		reservationRepository.save(reservation1);
		
		Payment payment1 = Payment.builder()
				.reservation(reservation1)
				.user(testUser)
				.paymentStatus("BANK_TRANSFER_COMPLETED")
				.paymentAmount(java.math.BigDecimal.valueOf(50000))
				.paymentDate(LocalDateTime.now())
				.registrationDateTime(LocalDateTime.now())
				.build();
		paymentRepository.save(payment1);
		
		Reservation reservation2 = Reservation.builder()
				.user(testUser)
				.schedule(testSchedule2)
				.statusCode("RESERVED")
				.registrationDateTime(LocalDateTime.now())
				.reservedDate(LocalDateTime.now().plusDays(3))
				.build();
		reservationRepository.save(reservation2);
	}
	
	/**
	 * JWT 토큰을 Authorization 헤더에 포함하는 헬퍼 메서드
	 */
	private String getAuthorizationHeader() {
		return "Bearer " + jwtToken;
	}
	
	@Test
	@DisplayName("마이페이지 - 나의 운동 목록 조회 통합 테스트 (JWT 토큰 포함)")
	void testGetMyReservations_WithJwtToken() throws Exception {
		// when & then
		mockMvc.perform(get("/api/reservation/my")
				.header("Authorization", getAuthorizationHeader()))
				.andDo(result -> {
					// 디버깅: 실제 응답 상태와 내용 출력
					System.out.println("나의 운동 목록 조회 테스트");
					System.out.println("Status: " + result.getResponse().getStatus());
					System.out.println("Response: " + result.getResponse().getContentAsString());
				})
				.andExpect(status().isOk())
				.andExpect(jsonPath("$").isArray())
				.andExpect(jsonPath("$[0].exerciseName").value("요가 클래스"))
				.andExpect(jsonPath("$[0].exerciseLocation").value("강남점"))
				.andExpect(jsonPath("$[0].paymentStatus").value("BANK_TRANSFER_COMPLETED"))
				.andExpect(jsonPath("$[1].exerciseName").value("필라테스"));
	}
	
	@Test
	@DisplayName("JWT 토큰 없이 예약 목록 조회 시 401 에러")
	void testGetMyReservations_WithoutToken() throws Exception {
		// when & then
		mockMvc.perform(get("/api/reservation/my"))
				.andDo(result -> {
					// 디버깅: 실제 응답 상태와 내용 출력
					System.out.println("Status: " + result.getResponse().getStatus());
					System.out.println("Response: " + result.getResponse().getContentAsString());
				})
				.andExpect(status().isUnauthorized());
	}
	
	// 예약 생성 기능은 이 프로젝트에서 구현하지 않음 (조회 전용)
	
	@Test
	@DisplayName("예약 상세 조회 통합 테스트 (JWT 토큰 포함)")
	void testGetReservationById_WithJwtToken() throws Exception {
		// given
		List<Reservation> reservations = reservationRepository.findByUser_UserId("testuser");
		org.junit.jupiter.api.Assertions.assertFalse(reservations.isEmpty(), "예약 데이터가 없습니다.");
		Reservation savedReservation = reservations.get(0);
		Long reservationId = savedReservation.getReservationId();
		
		// when & then
		mockMvc.perform(get("/api/reservation/" + reservationId)
				.header("Authorization", getAuthorizationHeader()))
				.andDo(result -> {
					// 디버깅: 실제 응답 상태와 내용 출력
					System.out.println("예약 상세 조회 테스트");
					System.out.println("예약 ID: " + reservationId);
					System.out.println("Status: " + result.getResponse().getStatus());
					System.out.println("Response: " + result.getResponse().getContentAsString());
				})
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.reservationId").value(reservationId))
				.andExpect(jsonPath("$.exerciseName").exists());
	}
	
	@Test
	@DisplayName("예약 취소 통합 테스트 (JWT 토큰 포함)")
	void testCancelReservation_WithJwtToken() throws Exception {
		// given
		List<Reservation> reservations = reservationRepository.findByUser_UserId("testuser");
		org.junit.jupiter.api.Assertions.assertFalse(reservations.isEmpty(), "예약 데이터가 없습니다.");
		Reservation savedReservation = reservations.get(0);
		Long reservationId = savedReservation.getReservationId();
		
		// 취소 전 상태 확인
		org.junit.jupiter.api.Assertions.assertEquals("RESERVED", savedReservation.getStatusCode());
		
		// when & then
		mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch("/api/reservation/" + reservationId + "/cancel")
				.header("Authorization", getAuthorizationHeader()))
				.andDo(result -> {
					// 디버깅: 실제 응답 상태와 내용 출력
					System.out.println("예약 취소 테스트");
					System.out.println("예약 ID: " + reservationId);
					System.out.println("Status: " + result.getResponse().getStatus());
					System.out.println("Response: " + result.getResponse().getContentAsString());
				})
				.andExpect(status().isOk());
		
		// 취소 상태 확인 (트랜잭션 플러시를 위해 명시적으로 조회)
		Reservation cancelled = reservationRepository.findByReservationId(reservationId)
				.orElseThrow(() -> new RuntimeException("예약을 찾을 수 없습니다: " + reservationId));
		org.junit.jupiter.api.Assertions.assertEquals("CANCELLED", cancelled.getStatusCode(), 
				"예약 상태가 CANCELLED로 변경되지 않았습니다. 현재 상태: " + cancelled.getStatusCode());
	}
	
	@Test
	@DisplayName("결제완료된 예약 목록 조회 통합 테스트 (이용내역)")
	void testGetMyCompletedReservations_WithJwtToken() throws Exception {
		// when & then
		mockMvc.perform(get("/api/reservation/my/completed")
				.header("Authorization", getAuthorizationHeader()))
				.andDo(result -> {
					// 디버깅: 실제 응답 상태와 내용 출력
					System.out.println("결제완료된 예약 목록 조회 테스트");
					System.out.println("Status: " + result.getResponse().getStatus());
					System.out.println("Response: " + result.getResponse().getContentAsString());
				})
				.andExpect(status().isOk())
				.andExpect(jsonPath("$").isArray())
				.andExpect(jsonPath("$[0].exerciseName").value("요가 클래스"))
				.andExpect(jsonPath("$[0].paymentStatus").value("BANK_TRANSFER_COMPLETED"));
	}
}

