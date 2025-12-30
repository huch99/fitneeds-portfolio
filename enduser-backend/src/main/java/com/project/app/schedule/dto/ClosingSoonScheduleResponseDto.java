package com.project.app.schedule.dto;

import java.time.LocalDate;
import java.time.LocalTime;

import com.project.app.schedule.entity.Schedule;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClosingSoonScheduleResponseDto {

	private Long scheduleId;
	private String brchNm;
	private String sportName;
	private String trainerName;
	private Integer maxCapacity;
	private Integer reservedCount;
	private Integer remainingSeats;
	private LocalDate endDt;
	private LocalTime endTm;

	/**
	 * Schedule 엔티티를 ClosingSoonScheduleResponseDto로 변환하는 정적 팩토리 메서드
	 * 
	 * @param schedule 스케줄 엔티티
	 * @return ClosingSoonScheduleResponseDto
	 */
	public static ClosingSoonScheduleResponseDto from(Schedule schedule) {
		if (schedule == null) {
			return null;
		}

		return ClosingSoonScheduleResponseDto.builder()
				.scheduleId(schedule.getSchdId())
				.brchNm(
						schedule.getUserAdmin() != null
								&& schedule.getUserAdmin().getBranch() != null
										? schedule.getUserAdmin().getBranch().getBrchNm()
										: null)
				.sportName(
						schedule.getProgram() != null
								&& schedule.getProgram().getSportType() != null
										? schedule.getProgram().getSportType().getSportNm()
										: null)
				.trainerName(
						schedule.getUserAdmin() != null
								? schedule.getUserAdmin().getUserName()
								: null)
				.maxCapacity(schedule.getMaxNopCnt())
				.reservedCount(schedule.getRsvCnt())
				.remainingSeats(schedule.getMaxNopCnt() - schedule.getRsvCnt())
				.endDt(schedule.getEndDt())
				.endTm(schedule.getEndTm())
				.build();
	}
}
