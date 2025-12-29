package com.project.app.schedule.service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.TreeSet;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project.app.schedule.dto.GroupedScheduleResponseDto;
import com.project.app.schedule.dto.ScheduleResponseDto;
import com.project.app.schedule.entity.Schedule;
import com.project.app.schedule.entity.ScheduleSttsCd;
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
	public Optional<ScheduleResponseDto> getScheduleBySchdIdForR(Long schdId) {
		try {
			return scheduleRepository.findById(schdId).map(ScheduleResponseDto::from);
		} catch (Exception e) {
			log.error("스케줄 ID {} 조회 중 오류 발생: {}", schdId, e.getMessage(), e);
			return Optional.empty();
		}
	}

	private Page<GroupedScheduleResponseDto> applyGroupingAndPaging(List<Schedule> allSchedules, Pageable pageable) {
		if (allSchedules == null || allSchedules.isEmpty()) {
			return Page.empty(pageable);
		}

		Map<String, GroupedScheduleResponseDto> groupedSchedulesMap = new LinkedHashMap<>();
		Map<String, Set<LocalDate>> activeDatesMap = new LinkedHashMap<>();

		// --- 모든 스케줄 엔티티 (allSchedules)를 순회하며 그룹핑 및 activeDatesMap 채우기 ---
		allSchedules.forEach(schedule -> {
			log.debug("Processing schedule: schdId={}, userId={}, progId={}, strtDt={}, strtTm={}, endTm={}, sttsCd={}",
					schedule.getSchdId(),
					schedule.getUserAdmin() != null ? schedule.getUserAdmin().getUserId() : "NULL_USER",
					schedule.getProgram() != null ? schedule.getProgram().getProgId() : "NULL_PROGRAM",
					schedule.getStrtDt(), schedule.getStrtTm(), schedule.getEndTm(), schedule.getSttsCd());

			// Key 생성 (null-safe하게 String으로 변환)
			String key = String.format("%s-%s-%s-%s",
					schedule.getUserAdmin() != null ? schedule.getUserAdmin().getUserId() : "NULL_USER_ID_KEY",
					schedule.getProgram() != null ? schedule.getProgram().getProgId() : "NULL_PROG_ID_KEY",
					schedule.getStrtTm() != null ? schedule.getStrtTm().toString() : "NULL_STRT_TM_KEY",
					schedule.getEndTm() != null ? schedule.getEndTm().toString() : "NULL_END_TM_KEY");

			log.debug("Generated key from schedule entity: {}", key);

			if (!groupedSchedulesMap.containsKey(key)) {
				GroupedScheduleResponseDto newGroup = GroupedScheduleResponseDto.from(schedule);
				groupedSchedulesMap.put(key, newGroup);
				activeDatesMap.put(key, new TreeSet<>()); // TreeSet으로 날짜 자동 정렬 및 중복 제거
				log.debug("New group created for key: {}", key);
			}
			activeDatesMap.get(key).add(schedule.getStrtDt());
			log.debug("Added date {} to activeDatesMap for key: {}", schedule.getStrtDt(), key);

			GroupedScheduleResponseDto existingGroup = groupedSchedulesMap.get(key);
			LocalDate currentStrtDt = schedule.getStrtDt();

			if (currentStrtDt.isBefore(existingGroup.getGroupedStrtDt())) {
				existingGroup.setGroupedStrtDt(currentStrtDt);
			}
		});

		// --- 그룹화된 DTO에 scheduledDates 채워 넣기 ---
		List<GroupedScheduleResponseDto> allGroupedList = new ArrayList<>(groupedSchedulesMap.values());
		for (GroupedScheduleResponseDto dto : allGroupedList) {
			String keyFromDto = String.format("%s-%s-%s-%s", dto.getUserId(), dto.getProgId(),
					dto.getStrtTm() != null ? dto.getStrtTm().toString() : "NULL_STRT_TM_KEY",
					dto.getEndTm() != null ? dto.getEndTm().toString() : "NULL_END_TM_KEY");

			log.debug("Generated key from DTO for final assignment: {}", keyFromDto);

			Set<LocalDate> datesInGroup = activeDatesMap.get(keyFromDto);
			if (datesInGroup != null) {
				dto.setScheduledDates(new ArrayList<>(datesInGroup));
			} else {
				log.error(
						"ERROR: Grouping key [{}] generated from DTO was NOT found in activeDatesMap. "
								+ "This indicates a severe inconsistency in key generation or data. "
								+ "DTO details: schdId={}, userId={}, progId={}, strtTm={}, endTm={}",
						keyFromDto, dto.getSchdId(), dto.getUserId(), dto.getProgId(), dto.getStrtTm(), dto.getEndTm());
				dto.setScheduledDates(new ArrayList<>());
			}
		}

		// --- 그룹화된 전체 리스트 (allGroupedList)를 수동으로 페이징 처리 ---
		// Pageable 정보(페이지 번호, 페이지 크기)를 사용하여 현재 페이지의 내용만 추출
		int start = (int) pageable.getOffset();
		int end = Math.min((start + pageable.getPageSize()), allGroupedList.size());

		// 요청된 페이지 시작점이 전체 목록 크기보다 크면 빈 목록 반환
		if (start > allGroupedList.size()) {
			return new PageImpl<>(new ArrayList<>(), pageable, allGroupedList.size());
		}

		List<GroupedScheduleResponseDto> pageContent = allGroupedList.subList(start, end);

		// 최종 Page 객체 생성: 현재 페이지 내용, Pageable, 전체 목록 크기
		return new PageImpl<>(pageContent, pageable, allGroupedList.size());
	}

	@Transactional(readOnly = true)
	public Page<GroupedScheduleResponseDto> getSchedulesBySportIdForR(Long sportId, String searchKeyword,
			LocalDate currentDate, LocalTime currentTime, Pageable pageable) {
		try {
			// Repository에서 모든 예약 가능 스케줄 리스트를 가져옴 (List<Schedule> 반환)
			List<Schedule> allSchedules = scheduleRepository.findAvailableSchedulesBySportId(sportId, currentDate,
					currentTime, searchKeyword, ScheduleSttsCd.AVAILABLE // Pageable 파라미터 없음
			);
			// 가져온 전체 스케줄 리스트를 그룹핑하고 수동 페이징 처리하는 메서드 호출
			return applyGroupingAndPaging(allSchedules, pageable);

		} catch (Exception e) {
			log.error("스포츠 ID {} 로 스케줄 조회 중 오류 발생: {}", sportId, e.getMessage(), e);
			return Page.empty(pageable);
		}
	}

	@Transactional(readOnly = true)
	public Page<GroupedScheduleResponseDto> getSchedulesByBrchIdForR(Long brchId, String searchKeyword,
			LocalDate currentDate, LocalTime currentTime, Pageable pageable) {
		try {
			// Repository에서 모든 예약 가능 스케줄 리스트를 가져옴 (List<Schedule> 반환)
			List<Schedule> allSchedules = scheduleRepository.findAvailableSchedulesByBrchId(brchId, currentDate,
					currentTime, searchKeyword, ScheduleSttsCd.AVAILABLE // Pageable 파라미터 없음
			);
			// 가져온 전체 스케줄 리스트를 그룹핑하고 수동 페이징 처리하는 메서드 호출
			return applyGroupingAndPaging(allSchedules, pageable);
		} catch (Exception e) {
			log.error("지점 ID {} 로 스케줄 조회 중 오류 발생: {}", brchId, e.getMessage(), e);
			return Page.empty(pageable);
		}
	}
	
	 /**
     * 스케줄러가 호출하여 지난 날짜의 스케줄 (AVAILABLE 상태)을 CLOSED 상태로 업데이트합니다.
     * @param batchUser 업데이터 사용자 ID (예: "SYSTEM" 또는 "SCHEDULER")
     * @return 업데이트된 스케줄의 수
     */
    public int updatePastSchedulesToClosed(String batchUser) {
        LocalDate today = LocalDate.now(); // 오늘 날짜

        // strtDt가 오늘 날짜 이전이고, sttsCd가 AVAILABLE인 스케줄을 찾습니다.
        // Huch의 ScheduleSttsCd에는 AVAILABLE, CLOSED만 있으므로, AVAILABLE인 것만 종료 처리
        Collection<ScheduleSttsCd> activeSttsCds = List.of(ScheduleSttsCd.AVAILABLE); // <-- Huch의 Enum 값에 맞춰 AVAILABLE만
        List<Schedule> activePastSchedules = scheduleRepository.findByStrtDtBeforeAndSttsCdIn(today, activeSttsCds);
            
        int updatedCount = 0;
        for (Schedule schedule : activePastSchedules) {
            schedule.setSttsCd(ScheduleSttsCd.CLOSED); // <-- Huch의 Enum 값에 맞춰 CLOSED로 변경
            // schedule.setUpdID(batchUser); // Schedule 엔티티에 updID가 있다면 기록
            // schedule.setUpdDt(LocalDateTime.now()); // Schedule 엔티티에 updDt가 있다면 기록
            scheduleRepository.save(schedule);
            updatedCount++;
        }
        return updatedCount;
    }
}
