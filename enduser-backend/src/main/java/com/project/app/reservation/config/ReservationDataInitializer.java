package com.project.app.reservation.config;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import com.project.app.reservation.entity.Reservation;
import com.project.app.reservation.entity.RsvSttsCd;
import com.project.app.reservation.repository.ReservationRepository;
import com.project.app.schedule.entity.Schedule;
import com.project.app.schedule.repository.ScheduleRepository;
import com.project.app.user.entity.User;
import com.project.app.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.Optional;

@Slf4j
@Configuration
@RequiredArgsConstructor
// @Profile("dev") // 주석 처리하여 항상 실행되도록 함
public class ReservationDataInitializer {

	private final ReservationRepository reservationRepository;
	private final UserRepository userRepository;
	private final ScheduleRepository scheduleRepository;

	@Bean
	public CommandLineRunner initReservationData() {
		return args -> {
			log.info("========== 예약 가데이터 초기화 시작 ==========");
			
			// 특정 userId로 사용자 조회 (프론트엔드에서 사용하는 userId)
			// ReviewController와 동일하게 userId를 받아서 해당 사용자에 대해서만 예약 생성
			String targetUserId = "a4b502adb0df4f7ca9f9ef2879ac1dab"; // 프론트엔드에서 사용하는 userId
			
			log.info("대상 userId: {}", targetUserId);
			
			// 해당 userId에 대한 예약이 이미 있는지 확인
			List<Reservation> existingReservations = reservationRepository.findByUserId(targetUserId);
			if (!existingReservations.isEmpty()) {
				log.info("사용자 {}에 대한 예약 데이터가 이미 존재합니다. ({}건) 초기화를 건너뜁니다.", 
						targetUserId, existingReservations.size());
				return;
			}
			
			log.info("사용자 {}에 대한 예약 데이터가 없습니다. 가데이터를 생성합니다.", targetUserId);
			
			User user = userRepository.findByUserId(targetUserId)
					.orElseGet(() -> {
						log.warn("지정된 userId '{}'를 가진 사용자가 없습니다. 첫 번째 사용자를 사용합니다.", targetUserId);
						return userRepository.findAll().stream()
								.findFirst()
								.orElseThrow(() -> {
									log.error("사용자 데이터가 없습니다. 먼저 사용자 데이터를 생성해주세요.");
									return new RuntimeException("사용자 데이터가 없습니다. 먼저 사용자 데이터를 생성해주세요.");
								});
					});

			log.info("사용자 조회 성공: {} (이름: {})", user.getUserId(), user.getUserName());

			// 스케줄 조회 (기존 스케줄이 있어야 함)
			List<Schedule> schedules = scheduleRepository.findAll();
			if (schedules.isEmpty()) {
				log.error("스케줄 데이터가 없습니다. 먼저 스케줄 데이터를 생성해주세요.");
				throw new RuntimeException("스케줄 데이터가 없습니다. 먼저 스케줄 데이터를 생성해주세요.");
			}
			
			Schedule schedule = schedules.get(0);
			log.info("스케줄 조회 성공: {} (총 {}개의 스케줄 존재)", schedule.getSchdId(), schedules.size());

			// 예약 가데이터 생성 (결제내역 표시를 위해 여러 건 생성)
			LocalDateTime now = LocalDateTime.now();
			int createdCount = 0;

			// 예약 1: RESERVED 상태 (5일 전)
			Reservation reservation1 = new Reservation();
			reservation1.setUser(user);
			reservation1.setSchedule(schedule);
			reservation1.setUserPass(null);
			reservation1.setSttsCd(RsvSttsCd.RESERVED);
			reservation1.setRsvDt(LocalDate.now().minusDays(5));
			reservation1.setRsvTime(LocalTime.of(10, 0));
			reservation1.setRegDt(now.minusDays(10));
			reservation1.setUpdDt(now.minusDays(5));
			reservation1.setCnclRsn(null);
			reservation1.setUpdID(null);

			// 예약 2: RESERVED 상태 (3일 전)
			Reservation reservation2 = new Reservation();
			reservation2.setUser(user);
			reservation2.setSchedule(schedule);
			reservation2.setUserPass(null);
			reservation2.setSttsCd(RsvSttsCd.RESERVED);
			reservation2.setRsvDt(LocalDate.now().minusDays(3));
			reservation2.setRsvTime(LocalTime.of(14, 0));
			reservation2.setRegDt(now.minusDays(8));
			reservation2.setUpdDt(now.minusDays(3));
			reservation2.setCnclRsn(null);
			reservation2.setUpdID(null);

			// 예약 3: RESERVED 상태 (1일 전) - 결제내역 표시용
			Reservation reservation3 = new Reservation();
			reservation3.setUser(user);
			reservation3.setSchedule(schedule);
			reservation3.setUserPass(null);
			reservation3.setSttsCd(RsvSttsCd.RESERVED);
			reservation3.setRsvDt(LocalDate.now().minusDays(1));
			reservation3.setRsvTime(LocalTime.of(16, 0));
			reservation3.setRegDt(now.minusDays(5));
			reservation3.setUpdDt(now.minusDays(1));
			reservation3.setCnclRsn(null);
			reservation3.setUpdID(null);

			// 예약 4: RESERVED 상태 (오늘) - 결제내역 표시용
			Reservation reservation4 = new Reservation();
			reservation4.setUser(user);
			reservation4.setSchedule(schedule);
			reservation4.setUserPass(null);
			reservation4.setSttsCd(RsvSttsCd.RESERVED);
			reservation4.setRsvDt(LocalDate.now());
			reservation4.setRsvTime(LocalTime.of(18, 0));
			reservation4.setRegDt(now.minusDays(2));
			reservation4.setUpdDt(now);
			reservation4.setCnclRsn(null);
			reservation4.setUpdID(null);

			// 저장
			try {
				reservationRepository.save(reservation1);
				log.info("예약 1 저장 완료: 예약일={}, 예약시간={}", reservation1.getRsvDt(), reservation1.getRsvTime());
				createdCount++;
				
				reservationRepository.save(reservation2);
				log.info("예약 2 저장 완료: 예약일={}, 예약시간={}", reservation2.getRsvDt(), reservation2.getRsvTime());
				createdCount++;
				
				reservationRepository.save(reservation3);
				log.info("예약 3 저장 완료: 예약일={}, 예약시간={}", reservation3.getRsvDt(), reservation3.getRsvTime());
				createdCount++;
				
				reservationRepository.save(reservation4);
				log.info("예약 4 저장 완료: 예약일={}, 예약시간={}", reservation4.getRsvDt(), reservation4.getRsvTime());
				createdCount++;
				
				log.info("========== 예약 가데이터 초기화 완료 ==========");
				log.info("사용자 {}에 대한 예약 {}건이 생성되었습니다. (결제내역 표시용)", user.getUserId(), createdCount);
			} catch (Exception e) {
				log.error("예약 저장 중 오류 발생: {}", e.getMessage(), e);
				throw e;
			}
		};
	}
}

