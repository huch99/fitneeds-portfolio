package com.project.app.schedule.entity;

import java.time.LocalDateTime;

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

/**
 * 스케줄 엔티티
 * 운동 클래스의 스케줄 정보를 담는 테이블
 */
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "SCHEDULE")
public class Schedule {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "schd_id")
	private Long scheduleId;
	
	@Column(name = "exercise_name")
	private String exerciseName; // 운동명
	
	@Column(name = "exercise_date")
	private LocalDateTime exerciseDate; // 운동 날짜/시간
	
	@Column(name = "exercise_location")
	private String exerciseLocation; // 운동 장소
	
	@Column(name = "trainer_name")
	private String trainerName; // 트레이너 이름
	
	@Column(name = "capacity")
	private Integer capacity; // 정원
	
	@Column(name = "current_count")
	private Integer currentCount; // 현재 예약 인원
	
	// 추가 필드들은 실제 스케줄 테이블 구조에 맞게 추가 필요
}

