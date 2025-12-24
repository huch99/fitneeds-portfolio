package com.project.app.schedule.controller;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
	public List<ScheduleResponseDto> getSchedulesBySportIdForR(@PathVariable("sportId") Long sportId) {
		List<Schedule> schedules = scheduleService.getSchedulesBySportIdForR(sportId);
		
		return schedules.stream()
				.map(ScheduleResponseDto::from)
				.collect(Collectors.toList());
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
	public List<ScheduleResponseDto> getSchedulesByBrchIdForR(@PathVariable("brchId") Long brchId) {
		List<Schedule> schedules = scheduleService.getSchedulesByBrchIdForR(brchId);
		
		return schedules.stream()
				.map(ScheduleResponseDto::from)
				.collect(Collectors.toList());
	}
}
