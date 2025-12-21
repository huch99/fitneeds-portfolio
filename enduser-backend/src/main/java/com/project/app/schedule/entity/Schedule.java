package com.project.app.schedule.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.project.app.program.entity.Program;
import com.project.app.user.entity.User;

/**
 * 스케줄 엔티티
 * 실제 테이블 구조: schd_id, prog_id, usr_id, strt_dt, end_dt, strt_tm, end_tm, 
 *                  max_nop_cnt, rsv_cnt, stts_cd, description, reg_dt, upd_dt
 */
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "schedule")
public class Schedule {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "schd_id")
	private Long scheduleId;
	
	@ManyToOne
	@JoinColumn(name = "prog_id", nullable = false)
	private Program program; // 프로그램
	
	@ManyToOne
	@JoinColumn(name = "usr_id", referencedColumnName = "user_id", nullable = false)
	private User user; // 강사/사용자
	
	@Column(name = "strt_dt", nullable = false)
	private LocalDate startDate; // 시작 날짜
	
	@Column(name = "end_dt", nullable = false)
	private LocalDate endDate; // 종료 날짜
	
	@Column(name = "strt_tm", nullable = false)
	private LocalTime startTime; // 시작 시간
	
	@Column(name = "end_tm", nullable = false)
	private LocalTime endTime; // 종료 시간
	
	@Column(name = "max_nop_cnt", nullable = false)
	private Integer maxNopCount; // 최대 인원수
	
	@Column(name = "rsv_cnt", nullable = false)
	private Integer reservationCount; // 예약 인원수
	
	@Column(name = "stts_cd", nullable = false, length = 20)
	private String statusCode; // 상태 코드 (ACTIVE, INACTIVE 등)
	
	@Column(name = "description", columnDefinition = "TEXT")
	private String description; // 설명
	
	@Column(name = "reg_dt", nullable = false)
	private LocalDateTime registrationDateTime; // 등록일시
	
	@Column(name = "upd_dt", nullable = false)
	private LocalDateTime updateDateTime; // 수정일시
	
	// 편의 메서드: exerciseName (프로그램 이름 사용)
	public String getExerciseName() {
		return program != null ? program.getProgramName() : null;
	}
	
	// 편의 메서드: exerciseDate (시작 날짜와 시간을 결합)
	public LocalDateTime getExerciseDate() {
		if (startDate != null && startTime != null) {
			return LocalDateTime.of(startDate, startTime);
		}
		return null;
	}
	
	// 편의 메서드: exerciseLocation (임시로 프로그램 이름 기반 반환, 실제로는 별도 테이블 필요)
	public String getExerciseLocation() {
		// TODO: 지점 정보를 별도 테이블에서 가져와야 함
		// 임시로 프로그램 이름 기반으로 반환
		return program != null ? program.getProgramName() + " 지점" : null;
	}
	
	// 편의 메서드: trainerName (사용자 이름 사용)
	public String getTrainerName() {
		return user != null ? user.getUserName() : null;
	}
	
	// 편의 메서드: capacity (max_nop_cnt 사용)
	public Integer getCapacity() {
		return maxNopCount;
	}
	
	// 편의 메서드: currentCount (rsv_cnt 사용)
	public Integer getCurrentCount() {
		return reservationCount;
	}
}

