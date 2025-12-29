package com.project.app.schedule.dto;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

import com.project.app.schedule.entity.Schedule;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Slf4j
public class GroupedScheduleResponseDto {

	private Long schdId;
	private String userId;
	private String userName;
	private Long progId;
	private String progNm;
	private String brchNm;
	private String sttsCd;
	
	private LocalTime strtTm;
	private LocalTime endTm;

	private LocalDate groupedStrtDt;
	private LocalDate groupedEndDt;
	
	private List<LocalDate> scheduledDates;

 	public GroupedScheduleResponseDto(Long schdId, String userId, String userName, Long progId, String progNm, String brchNm, LocalTime strtTm,
			LocalTime endTm, LocalDate groupedStrtDt, LocalDate groupedEndDt) {
		this.schdId = schdId;
		this.userId = userId;
		this.userName = userName;
		this.progId = progId;
		this.progNm = progNm;
		this.brchNm = brchNm;
		this.strtTm = strtTm;
		this.endTm = endTm;
		this.groupedStrtDt = groupedStrtDt; 
		this.groupedEndDt = groupedEndDt; 
		this.scheduledDates = new ArrayList<>();
	}

	public static GroupedScheduleResponseDto from(Schedule schedule) {
		// null 체크를 통해 NullPointerException 방지 및 디버깅 힌트 얻기
	    if (schedule.getUserAdmin() == null) {
	        log.error("Schedule (schdId={}) has null UserAdmin.", schedule.getSchdId());
	        // 적절한 기본값 또는 예외 처리
	    }
	    if (schedule.getProgram() == null) {
	        log.error("Schedule (schdId={}) has null Program.", schedule.getSchdId());
	        // 적절한 기본값 또는 예외 처리
	    }
	    
		return GroupedScheduleResponseDto.builder().schdId(schedule.getSchdId()).userId(schedule.getUserAdmin().getUserId())
				.userName(schedule.getUserAdmin().getUserName()).progId(schedule.getProgram().getProgId()).progNm(schedule.getProgram().getProgNm())
				.brchNm(schedule.getUserAdmin().getBranch().getBrchNm()).strtTm(schedule.getStrtTm()) // LocalTime
				.sttsCd(schedule.getSttsCd().name())																									// ->
																													// String
				.endTm(schedule.getEndTm()) 
				.groupedStrtDt(schedule.getStrtDt()) 
				.groupedEndDt(schedule.getEndDt()) 
				.scheduledDates(new ArrayList<>())
				.build();
	}
}
