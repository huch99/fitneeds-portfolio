package com.project.app.schedule.repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.project.app.schedule.dto.GroupedScheduleResponseDto;
import com.project.app.schedule.entity.Schedule;
import com.project.app.schedule.entity.ScheduleSttsCd;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {

	// --- 종목 ID를 통한 스케줄 조회 (날짜/시간 필터링, 검색어 필터링 포함) ---
	@Query("SELECT s FROM Schedule s " +
	           "JOIN s.program p " +
	           "JOIN p.sportType st " + // Program 엔티티의 sport 필드에 Sport 엔티티가 있다고 가정
	           "JOIN s.userAdmin ua " +
	           "JOIN ua.branch b " +
	           "WHERE st.sportId = :sportId " +
	           "AND s.sttsCd = :scheduleStatus " + // **[핵심] sttsCd 필터링 조건 추가**
	           "AND (" +
	           "   s.strtDt > :currentDate OR " +
	           "   (s.strtDt = :currentDate AND s.strtTm > :currentTime)" +
	           ") " +
	           "AND (" +
	           "   :searchKeyword IS NULL OR :searchKeyword = '' OR " +
	           "   LOWER(p.progNm) LIKE LOWER(CONCAT('%', :searchKeyword, '%')) OR " +
	           "   LOWER(ua.userName) LIKE LOWER(CONCAT('%', :searchKeyword, '%'))" +
	           ") " +
	           // **[핵심] GROUP BY 제거**: 그룹핑은 서비스 레이어에서 할 것
	           // 서비스 레이어에서 그룹핑을 효율적으로 하기 위한 정렬 조건
	           "ORDER BY s.userAdmin.userId ASC, s.program.progId ASC, s.strtTm ASC, s.endTm ASC, s.strtDt ASC")
	List<Schedule> findAvailableSchedulesBySportId(
	    		@Param("sportId") Long sportId,
	            @Param("currentDate") LocalDate currentDate,
	            @Param("currentTime") LocalTime currentTime,
	            @Param("searchKeyword") String searchKeyword,
	            @Param("scheduleStatus") ScheduleSttsCd scheduleStatus
	    );

    // --- 지점 ID를 통한 스케줄 조회 (날짜/시간 필터링, 검색어 필터링 포함) ---
	@Query("SELECT s FROM Schedule s " +
	           "JOIN s.program p " +
	           "JOIN s.userAdmin ua " +
	           "JOIN ua.branch b " +
	           "WHERE b.brchId = :brchId " +
	           "AND s.sttsCd = :scheduleStatus " + // **[핵심] sttsCd 필터링 조건 추가**
	           "AND (" +
	           "   s.strtDt > :currentDate OR " +
	           "   (s.strtDt = :currentDate AND s.strtTm > :currentTime)" +
	           ") " +
	           "AND (" +
	           "   :searchKeyword IS NULL OR :searchKeyword = '' OR " +
	           "   LOWER(p.progNm) LIKE LOWER(CONCAT('%', :searchKeyword, '%')) OR " +
	           "   LOWER(ua.userName) LIKE LOWER(CONCAT('%', :searchKeyword, '%'))" +
	           ") " +
	           // **[핵심] GROUP BY 제거**: 그룹핑은 서비스 레이어에서 할 것
	           // 서비스 레이어에서 그룹핑을 효율적으로 하기 위한 정렬 조건
	           "ORDER BY s.userAdmin.userId ASC, s.program.progId ASC, s.strtTm ASC, s.endTm ASC, s.strtDt ASC")
	    List<Schedule> findAvailableSchedulesByBrchId(
	    		@Param("brchId") Long brchId,
	            @Param("currentDate") LocalDate currentDate,
	            @Param("currentTime") LocalTime currentTime,
	            @Param("searchKeyword") String searchKeyword,
	            @Param("scheduleStatus") ScheduleSttsCd scheduleStatus
	    );
	

}
