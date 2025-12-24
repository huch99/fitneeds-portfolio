package com.project.app.schedule.repository;

import java.time.LocalDate;
import java.time.LocalTime;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.project.app.schedule.entity.Schedule;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {

	// --- 종목 ID를 통한 스케줄 조회 (날짜/시간 필터링, 검색어 필터링 포함) ---
	@Query("SELECT s FROM Schedule s " +
	           "LEFT JOIN s.program p " +        // 일반 LEFT JOIN
	           "LEFT JOIN p.sportType st " +     // 일반 LEFT JOIN (별칭 st 사용)
	           "LEFT JOIN s.userAdmin ua " +     // 일반 LEFT JOIN
	           "LEFT JOIN ua.branch b " +        // 일반 LEFT JOIN (별칭 b 사용)
	           "WHERE st.sportId = :sportId " +  // <- s.program.sportType.sportId 대신 별칭 st.sportId 사용
	           "AND (" +
	           "   s.strtDt > :currentDate OR " +
	           "   (s.strtDt = :currentDate AND s.strtTm > :currentTime)" +
	           ") " +
	           "AND (" +
	           "   :searchKeyword IS NULL OR :searchKeyword = '' OR " +
	           "   LOWER(p.progNm) LIKE LOWER(CONCAT('%', :searchKeyword, '%')) OR " +
	           "   LOWER(ua.userName) LIKE LOWER(CONCAT('%', :searchKeyword, '%'))" +
	           ")")
    Page<Schedule> findSchedulesBySportIdAndDateAndTimeFiltered(
            @Param("sportId") Long sportId,
            @Param("currentDate") LocalDate currentDate,
            @Param("currentTime") LocalTime currentTime,
            @Param("searchKeyword") String searchKeyword,
            Pageable pageable
    );

    // --- 지점 ID를 통한 스케줄 조회 (날짜/시간 필터링, 검색어 필터링 포함) ---
	 @Query("SELECT s FROM Schedule s " +
	           "LEFT JOIN s.program p " +
	           "LEFT JOIN p.sportType st " +
	           "LEFT JOIN s.userAdmin ua " +
	           "LEFT JOIN ua.branch b " +
	           "WHERE b.brchId = :brchId " + // <- 별칭 b.brchId 사용
	           "AND (" +
	           "   s.strtDt > :currentDate OR " +
	           "   (s.strtDt = :currentDate AND s.strtTm > :currentTime)" +
	           ") " +
	           "AND (" +
	           "   :searchKeyword IS NULL OR :searchKeyword = '' OR " +
	           "   LOWER(p.progNm) LIKE LOWER(CONCAT('%', :searchKeyword, '%')) OR " +
	           "   LOWER(ua.userName) LIKE LOWER(CONCAT('%', :searchKeyword, '%'))" +
	           ")")      // 검색어 필터링 조건 끝
    Page<Schedule> findSchedulesByBrchIdAndDateAndTimeFiltered(
            @Param("brchId") Long brchId,
            @Param("currentDate") LocalDate currentDate,
            @Param("currentTime") LocalTime currentTime,
            @Param("searchKeyword") String searchKeyword,
            Pageable pageable
    );
}
