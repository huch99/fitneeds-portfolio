package com.project.app.schedule.dto;

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
	private String progNm;
	private String brchNm;

	private String strtTm;
	private String endTm;

	private String groupedStrtDt;
	private String groupedEndDt;
	
	 public static GroupedScheduleResponseDto from(Schedule schedule) {
	        return GroupedScheduleResponseDto.builder()
	                .schdId(schedule.getSchdId())
	                .userName(schedule.getUserAdmin().getUserName())
	                .progNm(schedule.getProgram().getProgNm())
	                .brchNm(schedule.getUserAdmin().getBranch().getBrchNm())
	                .strtTm(schedule.getStrtTm().toString()) // LocalTime -> String
	                .endTm(schedule.getEndTm().toString())   // LocalTime -> String
	                .groupedStrtDt(schedule.getStrtDt().toString()) // LocalDate -> String
	                .groupedEndDt(schedule.getEndDt().toString())   // LocalDate -> String
	                .build();
	    }
}
