package com.project.app.reservation.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

import org.springframework.data.annotation.CreatedDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "RESERVATION_HISTORY")
public class ReservationHistory {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "history_id", nullable = false)
	private Long historyId;

	@Column(name = "reservation_id", nullable = false)
	private Long reservationId; // 원본 예약 ID (참조용)

	@Column(name = "user_id", nullable = false, length = 50)
	private String userId; // 사용자 ID

	@Column(name = "schedule_id", nullable = false)
	private Long scheduleId; // 스케줄 ID (참조용)

	@Column(name = "sport_name", nullable = false, length = 100)
	private String sportName; // 프로그램명 (스냅샷)
	
	@Column(name = "brch_id", nullable = false)
	private Long brchId;

	@Column(name = "brch_nm", nullable = true, length = 50)
	private String brchNm; // 지점명 (스냅샷)
	
	@Column(name = "trainer_id", nullable = false)
	private Long trainerId;

	@Column(name = "trainer_name", nullable = false, length = 100)
	private String trainerName; // 강사명 (스냅샷)

	@Column(name = "rsv_dt", nullable = false)
	private LocalDate rsvDt; // 예약 날짜

	@Column(name = "rsv_time", nullable = false)
	private LocalTime rsvTime; // 예약 시간

	@Column(name = "ref_id", nullable = true)
	private Long refId; // 참조 ID (결제 ID 등)

	@Column(name = "reg_dt", nullable = false)
	@CreatedDate
	private LocalDateTime regDt; // 등록 일시 (이용내역 이동 시점)

	@Column(name = "review_written", nullable = false, columnDefinition = "CHAR(1) DEFAULT 'N'")
	private String reviewWritten = "N"; // 리뷰 작성 여부 (Y: 작성됨, N: 미작성)
}

