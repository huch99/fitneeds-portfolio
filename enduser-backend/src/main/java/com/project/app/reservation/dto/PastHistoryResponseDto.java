package com.project.app.reservation.dto;

import java.time.LocalDate;
import java.time.LocalTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PastHistoryResponseDto {

	private Long reservationId;
	private Long scheduleId; // 스케줄 ID (프로그램 상세 페이지 연동용)
	private String sportName;
	private String brchNm;
	private String trainerName;
	private LocalDate rsvDt;
	private LocalTime rsvTime;
	private Long refId;
	private Boolean reviewWritten;
}
