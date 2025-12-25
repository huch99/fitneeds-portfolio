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
public class GroupedScheduleResponseDto {

	private Long schdId;
	private String userName;
	private Long progId;
	private String progNm;
	private String brchNm;

	private String strtTm;
	private String endTm;

	private String groupedStrtDt;
	private String groupedEndDt;

	public GroupedScheduleResponseDto(Long schdId, String userName, Long progId, String progNm, String brchNm, LocalTime strtTm,
			LocalTime endTm, LocalDate groupedStrtDt, LocalDate groupedEndDt) {
		this.schdId = schdId;
		this.userName = userName;
		this.progId = progId;
		this.progNm = progNm;
		this.brchNm = brchNm;
		this.strtTm = strtTm != null ? strtTm.toString() : null; // LocalTime to String
		this.endTm = endTm != null ? endTm.toString() : null; // LocalTime to String
		this.groupedStrtDt = groupedStrtDt != null ? groupedStrtDt.toString() : null; // LocalDate to String
		this.groupedEndDt = groupedEndDt != null ? groupedEndDt.toString() : null; // LocalDate to String
	}

	public static GroupedScheduleResponseDto from(Schedule schedule) {
		return GroupedScheduleResponseDto.builder().schdId(schedule.getSchdId())
				.userName(schedule.getUserAdmin().getUserName()).progId(schedule.getProgram().getProgId()).progNm(schedule.getProgram().getProgNm())
				.brchNm(schedule.getUserAdmin().getBranch().getBrchNm()).strtTm(schedule.getStrtTm().toString()) // LocalTime
																													// ->
																													// String
				.endTm(schedule.getEndTm().toString()) // LocalTime -> String
				.groupedStrtDt(schedule.getStrtDt().toString()) // LocalDate -> String
				.groupedEndDt(schedule.getEndDt().toString()) // LocalDate -> String
				.build();
	}
}
