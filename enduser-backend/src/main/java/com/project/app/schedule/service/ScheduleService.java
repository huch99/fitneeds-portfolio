package com.project.app.schedule.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project.app.schedule.entity.Schedule;
import com.project.app.schedule.repository.ScheduleRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ScheduleService {

	private final ScheduleRepository scheduleRepository;
	
	// 종목 ID를 통한 조회 메서드
	@Transactional
	public List<Schedule> getSchedulesBySportIdForR(Long sportId) {
		return scheduleRepository.findByProgram_SportType_SportId(sportId);
	}
	
	// 스케줄 ID를 통한 조회 메서드
	@Transactional
	public Optional<Schedule> getScheduleBySchdIdForR(Long schdId) {
		return scheduleRepository.findById(schdId);
	}
	
	// 지점 ID를 통한 조회 메서드
	@Transactional
	public List<Schedule> getSchedulesByBrchIdForR(Long brchId) {
		return scheduleRepository.findByUserAdmin_Branch_BrchId(brchId);
	}
}
