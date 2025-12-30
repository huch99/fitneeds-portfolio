package com.project.app.schedule.service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Comparator;
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

	/**
	 * 스케줄 ID를 통해 단건 스케줄을 조회하여 ScheduleResponseDto로 반환합니다. Huch가 가진
	 * ScheduleResponseDto의 from(Schedule) 팩토리 메서드를 사용합니다.
	 */
	public Optional<ScheduleResponseDto> getScheduleBySchdIdForR(Long schdId) {
		log.info("서비스: 스케줄 ID로 단건 스케줄 조회 요청: schdId={}", schdId);
		return scheduleRepository.findById(schdId).map(ScheduleResponseDto::from);
	}

	/**
	 * 특정 스포츠 ID 기준으로 스케줄을 조회하고 그룹핑/페이징 처리합니다. 컨트롤러에서 currentDate와 currentTime을 받아
	 * 활용합니다.
	 */
	public Page<GroupedScheduleResponseDto> getSchedulesBySportIdForR(Long sportId, String searchKeyword,
			LocalDate currentDate, LocalTime currentTime, Pageable pageable) {
		try {
			log.info("서비스: 스포츠 ID로 스케줄 조회 요청: sportId={}, searchKeyword={}", sportId, searchKeyword);

			List<Schedule> allSchedules = scheduleRepository.findAvailableSchedulesBySportId(sportId, currentDate,
					currentTime, searchKeyword, ScheduleSttsCd.AVAILABLE);

			log.debug("서비스: 스포츠 ID {} 로 조회된 총 스케줄 수: {}", sportId, allSchedules.size());
			return applyGroupingAndPaging(allSchedules, pageable);

		} catch (Exception e) {
			log.error("서비스: 스포츠 ID {} 로 스케줄 조회 중 오류 발생: {}", sportId, e.getMessage(), e);
			throw new RuntimeException("스포츠 ID로 스케줄 조회 실패", e);
		}
	}

	/**
	 * 특정 스포츠 ID 또는 지점 ID 기준으로 스케줄을 조회하고 Huch의 applyGroupingAndPaging 메서드를 사용해
	 * 그룹핑/페이징 처리합니다. currentDate와 currentTime을 기준으로 과거 스케줄은 제외합니다.
	 *
	 * @param sportId       특정 스포츠 ID (null이면 brchId로 조회)
	 * @param brchId        특정 지점 ID (null이면 sportId로 조회)
	 * @param searchKeyword 검색어 (프로그램명, 강사이름)
	 * @param pageable      페이징 정보 (페이지 번호, 페이지 크기 등)
	 * @return 강사 ID, 프로그램 ID, 시작/종료 시간 기준으로 그룹핑된 스케줄 데이터의 페이징 결과
	 */
	public Page<GroupedScheduleResponseDto> getGroupedAndPagedSchedules(Long sportId, Long brchId, String searchKeyword,
			Pageable pageable) {
		LocalDate currentDate = LocalDate.now();
		LocalTime currentTime = LocalTime.now();

		// 조회 상태는 'AVAILABLE'로 고정 (스케줄러가 'CLOSED' 처리)
		ScheduleSttsCd scheduleStatus = ScheduleSttsCd.AVAILABLE;

		List<Schedule> allAvailableSchedules;

		if (sportId != null) {
			allAvailableSchedules = scheduleRepository.findAvailableSchedulesBySportId(sportId, currentDate,
					currentTime, searchKeyword, scheduleStatus);
		} else if (brchId != null) {
			allAvailableSchedules = scheduleRepository.findAvailableSchedulesByBrchId(brchId, currentDate, currentTime,
					searchKeyword, scheduleStatus);
		} else {
			throw new IllegalArgumentException("스포츠 ID 또는 지점 ID 중 하나는 필수입니다.");
		}

		return applyGroupingAndPaging(allAvailableSchedules, pageable);
	}

	/**
	 * 특정 지점 ID 기준으로 스케줄을 조회하고 그룹핑/페이징 처리합니다. 컨트롤러에서 currentDate와 currentTime을 받아
	 * 활용합니다.
	 */
	public Page<GroupedScheduleResponseDto> getSchedulesByBrchIdForR(Long brchId, String searchKeyword,
			LocalDate currentDate, LocalTime currentTime, Pageable pageable) {
		try {
			log.info("서비스: 지점 ID로 스케줄 조회 요청: brchId={}, searchKeyword={}", brchId, searchKeyword);

			List<Schedule> allSchedules = scheduleRepository.findAvailableSchedulesByBrchId(brchId, currentDate,
					currentTime, searchKeyword, ScheduleSttsCd.AVAILABLE);

			log.debug("서비스: 지점 ID {} 로 조회된 총 스케줄 수: {}", brchId, allSchedules.size());
			return applyGroupingAndPaging(allSchedules, pageable);
		} catch (Exception e) {
			log.error("서비스: 지점 ID {} 로 스케줄 조회 중 오류 발생: {}", brchId, e.getMessage(), e);
			throw new RuntimeException("지점 ID로 스케줄 조회 실패", e);
		}
	}

	private Page<GroupedScheduleResponseDto> applyGroupingAndPaging(List<Schedule> allSchedules, Pageable pageable) {
		if (allSchedules == null || allSchedules.isEmpty()) {
			return Page.empty(pageable);
		}

		// Key: userAdminId-progId-strtTm-endTm (String)
		// Value: 그룹화된 스케줄 정보를 담는 DTO
		Map<String, GroupedScheduleResponseDto> groupedSchedulesMap = new LinkedHashMap<>();

		// Key: userAdminId-progId-strtTm-endTm (String)
		// Value: 해당 그룹에 속하는 스케줄들의 strtDt 집합 (중복 제거 및 자동 정렬)
		Map<String, Set<LocalDate>> activeDatesMap = new LinkedHashMap<>();

		// --- 모든 스케줄 엔티티 (allSchedules)를 순회하며 그룹핑 및 activeDatesMap 채우기 ---
		allSchedules.forEach(schedule -> {
			log.debug("Processing schedule: schdId={}, userId={}, progId={}, strtDt={}, strtTm={}, endTm={}, sttsCd={}",
					schedule.getSchdId(),
					schedule.getUserAdmin() != null ? schedule.getUserAdmin().getUserId() : "NULL_USER",
					schedule.getProgram() != null ? schedule.getProgram().getProgId() : "NULL_PROGRAM",
					schedule.getStrtDt(), schedule.getStrtTm(), schedule.getEndTm(), schedule.getSttsCd());

			// Key 생성 (null-safe하게 String으로 변환)
			// Huch의 Key 생성 로직: (강사 ID - 프로그램 ID - 시작 시간 - 종료 시간)
			// userId는 String이므로 바로 사용
			// progId는 Long이므로 String으로 변환
			String key = String.format("%s-%s-%s-%s",
					schedule.getUserAdmin() != null ? schedule.getUserAdmin().getUserId() : "NULL_USER_ID_KEY",
					schedule.getProgram() != null ? schedule.getProgram().getProgId().toString() : "NULL_PROG_ID_KEY",
					schedule.getStrtTm() != null ? schedule.getStrtTm().toString() : "NULL_STRT_TM_KEY",
					schedule.getEndTm() != null ? schedule.getEndTm().toString() : "NULL_END_TM_KEY");

			log.debug("Generated key from schedule entity: {}", key);

			// 해당 키로 그룹이 아직 생성되지 않았다면 새로 생성
			if (!groupedSchedulesMap.containsKey(key)) {
				GroupedScheduleResponseDto newGroup = GroupedScheduleResponseDto.from(schedule);
				groupedSchedulesMap.put(key, newGroup);
				activeDatesMap.put(key, new TreeSet<>()); // TreeSet으로 날짜 자동 정렬 및 중복 제거
				log.debug("New group created for key: {}", key);
			}

			// 해당 그룹의 activeDatesMap에 현재 스케줄의 시작 날짜(strtDt) 추가
			activeDatesMap.get(key).add(schedule.getStrtDt());
			log.debug("Added date {} to activeDatesMap for key: {}", schedule.getStrtDt(), key);

			// 그룹의 groupedStrtDt (가장 이른 날짜) 업데이트
			GroupedScheduleResponseDto existingGroup = groupedSchedulesMap.get(key);
			LocalDate currentStrtDt = schedule.getStrtDt();

			// 현재 스케줄의 strtDt가 기존 그룹의 groupedStrtDt보다 이전이면 업데이트
			if (currentStrtDt.isBefore(existingGroup.getGroupedStrtDt())) {
				existingGroup.setGroupedStrtDt(currentStrtDt);
			}
		});

		// --- 그룹화된 DTO에 scheduledDates 채워 넣기 ---
		List<GroupedScheduleResponseDto> allGroupedList = new ArrayList<>(groupedSchedulesMap.values());
		for (GroupedScheduleResponseDto dto : allGroupedList) {
			// Huch의 DTO Key 생성 로직: dto.getUserId(), dto.getProgId(), dto.getStrtTm(),
			// dto.getEndTm()
			// 여기서 dto.getProgId()는 Long이므로 .toString() 필요
			String keyFromDto = String.format("%s-%s-%s-%s",
					dto.getUserId() != null ? dto.getUserId() : "NULL_USER_ID_KEY",
					dto.getProgId() != null ? dto.getProgId().toString() : "NULL_PROG_ID_KEY",
					dto.getStrtTm() != null ? dto.getStrtTm().toString() : "NULL_STRT_TM_KEY",
					dto.getEndTm() != null ? dto.getEndTm().toString() : "NULL_END_TM_KEY");

			log.debug("Generated key from DTO for final assignment: {}", keyFromDto);

			Set<LocalDate> datesInGroup = activeDatesMap.get(keyFromDto);
			if (datesInGroup != null && !datesInGroup.isEmpty()) {
				// TreeSet 덕분에 이미 정렬되어 있으므로 바로 List로 변환
				LocalDate startDt = ((TreeSet<LocalDate>) datesInGroup).first();
			    LocalDate endDt   = ((TreeSet<LocalDate>) datesInGroup).last();
			    
			    dto.setGroupedStrtDt(startDt);
			    dto.setGroupedEndDt(endDt);
			    
				dto.setScheduledDates(new ArrayList<>(datesInGroup));
			} else {
				log.error(
						"ERROR: Grouping key [{}] generated from DTO was NOT found in activeDatesMap. "
								+ "This indicates a severe inconsistency in key generation or data. "
								+ "DTO details: schdId={}, userId={}, progId={}, strtTm={}, endTm={}",
						dto.getSchdId(), dto.getUserId(), dto.getProgId(), dto.getStrtTm(), dto.getEndTm());
				dto.setScheduledDates(new ArrayList<>()); // 안전하게 빈 리스트 할당
			}
		}

		// --- 그룹화된 전체 리스트를 정렬 ---
		// (정렬 기준: 가장 빠른 시작 날짜 -> 강사 ID -> 프로그램 ID -> 시작 시간)
		allGroupedList.sort(Comparator.comparing(GroupedScheduleResponseDto::getGroupedStrtDt)
				.thenComparing(GroupedScheduleResponseDto::getUserId)
				.thenComparing(GroupedScheduleResponseDto::getProgId)
				.thenComparing(GroupedScheduleResponseDto::getStrtTm));

		// --- 그룹화된 전체 리스트 (allGroupedList)를 수동으로 페이징 처리 ---
		int start = (int) pageable.getOffset();
		int end = Math.min((start + pageable.getPageSize()), allGroupedList.size());

		// 요청된 페이지 시작점이 전체 목록 크기보다 크면 빈 목록 반환 (Huch의 코드 로직)
		if (start > allGroupedList.size()) {
			return new PageImpl<>(new ArrayList<>(), pageable, allGroupedList.size());
		}

		List<GroupedScheduleResponseDto> pageContent = allGroupedList.subList(start, end);

		// 최종 Page 객체 생성: 현재 페이지 내용, Pageable, 전체 목록 크기
		return new PageImpl<>(pageContent, pageable, allGroupedList.size());
	}

	/**
	 * 스케줄러가 호출하여 지난 날짜의 스케줄 (AVAILABLE 상태)을 CLOSED 상태로 업데이트합니다.
	 * 
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
