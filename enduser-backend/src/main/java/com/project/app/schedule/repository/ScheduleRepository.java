package com.project.app.schedule.repository;

import java.time.LocalDate;
import java.time.LocalTime;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.project.app.schedule.dto.GroupedScheduleResponseDto;
import com.project.app.schedule.entity.Schedule;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {

	// --- 종목 ID를 통한 스케줄 조회 (날짜/시간 필터링, 검색어 필터링 포함) ---
	@Query("SELECT new com.project.app.schedule.dto.GroupedScheduleResponseDto(" +
	           " MAX(s.schdId), ua.userName, p.progNm, b.brchNm, s.strtTm, s.endTm, MIN(s.strtDt), MAX(s.endDt)) " +
	           "FROM Schedule s " +
	           "JOIN s.program p " +
	           "JOIN p.sportType st " +
	           "JOIN s.userAdmin ua " +
	           "JOIN ua.branch b " +
	           "WHERE st.sportId = :sportId " +
	           "AND (" +
	           "   s.strtDt > :currentDate OR " +
	           "   (s.strtDt = :currentDate AND s.strtTm > :currentTime)" +
	           ") " +
	           "AND (" +
	           "   :searchKeyword IS NULL OR :searchKeyword = '' OR " +
	           "   LOWER(p.progNm) LIKE LOWER(CONCAT('%', :searchKeyword, '%')) OR " +
	           "   LOWER(ua.userName) LIKE LOWER(CONCAT('%', :searchKeyword, '%'))" +
	           ") " +
	           "GROUP BY ua.userName, p.progNm, b.brchNm, s.strtTm, s.endTm " + // 그룹핑 기준
	           "ORDER BY MAX(s.schdId) DESC") // 정렬 기준 (Pageable의 sort와 충돌하지 않도록 직접 지정)
	           // Pageable의 sort 인자가 필요 없어질 수 있습니다.
	    Page<GroupedScheduleResponseDto> findGroupedSchedulesBySportId(
	            @Param("sportId") Long sportId,
	            @Param("currentDate") LocalDate currentDate,
	            @Param("currentTime") LocalTime currentTime,
	            @Param("searchKeyword") String searchKeyword,
	            Pageable pageable
	    );

    // --- 지점 ID를 통한 스케줄 조회 (날짜/시간 필터링, 검색어 필터링 포함) ---
	@Query("SELECT new com.project.app.schedule.dto.GroupedScheduleResponseDto(" +
	           " MAX(s.schdId), ua.userName, p.progNm, b.brchNm, s.strtTm, s.endTm, MIN(s.strtDt), MAX(s.endDt)) " +
	           "FROM Schedule s " +
	           "JOIN s.program p " +
	           "JOIN p.sportType st " +
	           "JOIN s.userAdmin ua " +
	           "JOIN ua.branch b " +
	           "WHERE b.brchId = :brchId " +
	           "AND (" +
	           "   s.strtDt > :currentDate OR " +
	           "   (s.strtDt = :currentDate AND s.strtTm > :currentTime)" +
	           ") " +
	           "AND (" +
	           "   :searchKeyword IS NULL OR :searchKeyword = '' OR " +
	           "   LOWER(p.progNm) LIKE LOWER(CONCAT('%', :searchKeyword, '%')) OR " +
	           "   LOWER(ua.userName) LIKE LOWER(CONCAT('%', :searchKeyword, '%'))" +
	           ") " +
	           "GROUP BY ua.userName, p.progNm, b.brchNm, s.strtTm, s.endTm " +
	           "ORDER BY MAX(s.schdId) DESC")
	    Page<GroupedScheduleResponseDto> findGroupedSchedulesByBrchId(
	            @Param("brchId") Long brchId,
	            @Param("currentDate") LocalDate currentDate,
	            @Param("currentTime") LocalTime currentTime,
	            @Param("searchKeyword") String searchKeyword,
	            Pageable pageable
	    );
}
