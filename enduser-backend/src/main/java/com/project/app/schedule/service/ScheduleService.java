package com.project.app.schedule.service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project.app.schedule.dto.GroupedScheduleResponseDto;
import com.project.app.schedule.entity.Schedule;
import com.project.app.schedule.repository.ScheduleRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class ScheduleService {

	private final ScheduleRepository scheduleRepository;

	// 스케줄 ID를 통한 조회 메서드 (변경 없음)
	@Transactional(readOnly = true)
	public Optional<Schedule> getScheduleBySchdIdForR(Long schdId) {
		try {
			return scheduleRepository.findById(schdId);
		} catch (Exception e) {
			log.error("스케줄 ID {} 조회 중 오류 발생: {}", schdId, e.getMessage(), e);
			return Optional.empty(); 
		}		
	}
	
	// --- 그룹핑 로직을 서비스 메서드 안으로 이동 (기존과 동일) ---
    private Page<GroupedScheduleResponseDto> applyGrouping(Page<Schedule> schedulesPage, Pageable pageable) {
        if (schedulesPage == null || schedulesPage.isEmpty()) {
            return Page.empty(pageable);
        }

        Map<String, GroupedScheduleResponseDto> groupedSchedulesMap = new LinkedHashMap<>();
        
        schedulesPage.getContent().forEach(schedule -> {
            String key = String.format("%s-%s-%s-%s",
                    schedule.getUserAdmin().getUserId(),
                    schedule.getProgram().getProgId(),
                    schedule.getStrtTm().toString(),
                    schedule.getEndTm().toString());

            if (!groupedSchedulesMap.containsKey(key)) {
                groupedSchedulesMap.put(key, GroupedScheduleResponseDto.from(schedule));
            } else {
                GroupedScheduleResponseDto existingGroup = groupedSchedulesMap.get(key);
                LocalDate currentStrtDt = schedule.getStrtDt();
                LocalDate currentEndDt = schedule.getEndDt();

                if (currentStrtDt.isBefore(LocalDate.parse(existingGroup.getGroupedStrtDt()))) {
                    existingGroup.setGroupedStrtDt(currentStrtDt.toString());
                }
                if (currentEndDt.isAfter(LocalDate.parse(existingGroup.getGroupedEndDt()))) {
                    existingGroup.setGroupedEndDt(currentEndDt.toString());
                }
                groupedSchedulesMap.put(key, existingGroup);
            }
        });
        
        List<GroupedScheduleResponseDto> groupedList = new ArrayList<>(groupedSchedulesMap.values());
        
        // 중요: PageImpl 생성 시, 원본 스케줄 엔티티의 총 개수(schedulesPage.getTotalElements())를 그대로 전달하여
        // 전체 페이지 수를 백엔드 필터링 기준으로 유지합니다.
        return new PageImpl<>(groupedList, pageable, schedulesPage.getTotalElements());
    }
    
    @Transactional(readOnly = true)
	public Page<GroupedScheduleResponseDto> getSchedulesBySportIdForR(Long sportId, String searchKeyword, LocalDate currentDate, LocalTime currentTime, Pageable pageable) {
		try {
			// JPQL `@Query` 메서드 호출. searchKeyword가 null/empty여도 JPQL 내부에서 처리.
			Page<Schedule> schedulesPage = scheduleRepository.findSchedulesBySportIdAndDateAndTimeFiltered(
						sportId, currentDate, currentTime, searchKeyword, pageable
				);
			// 가져온 Page<Schedule>을 그룹핑하여 Page<GroupedScheduleResponseDto>로 변환
			return applyGrouping(schedulesPage, pageable);
		} catch (Exception e) {
			log.error("스포츠 ID {} 로 스케줄 조회 중 오류 발생: {}", sportId, e.getMessage(), e);
			return Page.empty(pageable);
		}
    	
    	
        
	}

    
    @Transactional(readOnly = true)
	public Page<GroupedScheduleResponseDto> getSchedulesByBrchIdForR(Long brchId, String searchKeyword, LocalDate currentDate, LocalTime currentTime, Pageable pageable) {
		try {
			// JPQL `@Query` 메서드 호출. searchKeyword가 null/empty여도 JPQL 내부에서 처리.
			Page<Schedule> schedulesPage = scheduleRepository.findSchedulesByBrchIdAndDateAndTimeFiltered(
						brchId, currentDate, currentTime, searchKeyword, pageable
				);
	        // 가져온 Page<Schedule>을 그룹핑하여 Page<GroupedScheduleResponseDto>로 변환
			return applyGrouping(schedulesPage, pageable);
		} catch (Exception e) {
			log.error("지점 ID {} 로 스케줄 조회 중 오류 발생: {}", brchId, e.getMessage(), e);
			return Page.empty(pageable);
		}
    	
	}
}
