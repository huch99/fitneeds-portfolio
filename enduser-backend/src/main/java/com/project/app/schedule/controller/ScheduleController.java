package com.project.app.schedule.controller;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.project.app.schedule.dto.GroupedScheduleResponseDto;
import com.project.app.schedule.dto.ScheduleResponseDto;
import com.project.app.schedule.entity.Schedule;
import com.project.app.schedule.service.ScheduleService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/schedules")
@RequiredArgsConstructor
public class ScheduleController {

	private final ScheduleService scheduleService;
	
	// 종목 ID를 통한 조회
	@GetMapping("/getSchedulesBySportIdForR/{sportId}")
	public Page<GroupedScheduleResponseDto> getSchedulesBySportIdForR(
			@PathVariable("sportId") Long sportId,
			@RequestParam(value = "searchKeyword", required = false) String searchKeyword,
			@PageableDefault(size = 10, sort = "schdId", direction = Sort.Direction.DESC) Pageable pageable) {
		
		// 현재 날짜와 시간을 서버에서 생성하여 Service로 전달
		LocalDate currentDate = LocalDate.now();
		LocalTime currentTime = LocalTime.now();
		
		return scheduleService.getSchedulesBySportIdForR(sportId, searchKeyword, currentDate, currentTime, pageable);
	}
	
	// 스케줄 ID를 통한 조회
	@GetMapping("/getScheduleBySchdIdForR/{schdId}")
	public ResponseEntity<ScheduleResponseDto> getScheduleBySchdIdForR(@PathVariable("schdId") Long schdId) {
		Optional<Schedule> scheduleOptional = scheduleService.getScheduleBySchdIdForR(schdId);
		
		return scheduleOptional.map(schedule -> ResponseEntity.ok(ScheduleResponseDto.from(schedule)))
					.orElseGet(() -> ResponseEntity.notFound().build());
	}
	
	// 지점 ID를 통한 조회
	@GetMapping("/getSchedulesByBrchIdForR/{brchId}")
	public Page<GroupedScheduleResponseDto> getSchedulesByBrchIdForR(
			@PathVariable("brchId") Long brchId,
			@RequestParam(value = "searchKeyword", required = false) String searchKeyword,
			@PageableDefault(size = 10, sort = "schdId", direction = Sort.Direction.DESC) Pageable pageable) {

		// 현재 날짜와 시간을 서버에서 생성하여 Service로 전달
        LocalDate currentDate = LocalDate.now();
        LocalTime currentTime = LocalTime.now();
        
        return scheduleService.getSchedulesByBrchIdForR(brchId, searchKeyword, currentDate, currentTime, pageable);
	}
}
