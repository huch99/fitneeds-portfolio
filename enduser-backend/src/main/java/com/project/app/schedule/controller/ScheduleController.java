package com.project.app.schedule.controller;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.format.annotation.DateTimeFormat.ISO;
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
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/schedules")
@RequiredArgsConstructor
@Slf4j
public class ScheduleController {

    private final ScheduleService scheduleService;

	// 종목 ID를 통한 조회
	@GetMapping("/getSchedulesBySportIdForR/{sportId}")
	public Page<GroupedScheduleResponseDto> getSchedulesBySportIdForR(@PathVariable("sportId") Long sportId,
			@RequestParam(value = "searchKeyword", required = false) String searchKeyword,
			@RequestParam(value = "selectedDate", required = false) @DateTimeFormat(iso = ISO.DATE) LocalDate selectedDate,
			@PageableDefault(size = 10 /* , sort = "schdId", direction = Sort.Direction.DESC */) Pageable pageable) {
		// JPQL 내에서 ORDER BY를 직접 지정했으므로, 여기서는 sort를 제거합니다.

		LocalDate currentDate = LocalDate.now();
		LocalTime currentTime = LocalTime.now();

		log.info("API 호출: /getSchedulesBySportIdForR/{}. sportId={}, searchKeyword={}, pageable={}", sportId,
				searchKeyword, pageable);
		return scheduleService.getSchedulesBySportIdForR(sportId, searchKeyword, currentDate, currentTime,selectedDate, pageable);
	}

	// 스케줄 ID를 통한 조회
	@GetMapping("/getScheduleBySchdIdForR/{schdId}")
	public Optional<ScheduleResponseDto> getScheduleBySchdIdForR(@PathVariable("schdId") Long schdId) {
		log.info("API 호출: /getScheduleBySchdIdForR/{}. schdId={}", schdId);
		return scheduleService.getScheduleBySchdIdForR(schdId);
	}

	// 지점 ID를 통한 조회
	@GetMapping("/getSchedulesByBrchIdForR/{brchId}")
	public Page<GroupedScheduleResponseDto> getSchedulesByBrchIdForR(@PathVariable("brchId") Long brchId,
			@RequestParam(value = "searchKeyword", required = false) String searchKeyword,
			@RequestParam(value = "selectedDate", required = false) @DateTimeFormat(iso = ISO.DATE) LocalDate selectedDate,
			@PageableDefault(size = 10 /* , sort = "schdId", direction = Sort.Direction.DESC */) Pageable pageable) {
		// JPQL 내에서 ORDER BY를 직접 지정했으므로, 여기서는 sort를 제거합니다.

		LocalDate currentDate = LocalDate.now();
		LocalTime currentTime = LocalTime.now();

		log.info("API 호출: /getSchedulesByBrchIdForR/{}. brchId={}, searchKeyword={}, pageable={}", brchId,
				searchKeyword, pageable);
		return scheduleService.getSchedulesByBrchIdForR(brchId, searchKeyword, currentDate, currentTime, selectedDate, pageable);
	}
}
