package com.project.app.schedule.mapper;

import com.project.app.schedule.domain.Schedule;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Mapper
public interface ScheduleMapper {
    List<Schedule> findAll();
    Schedule findById(@Param("schdId") Long schdId);
    int insert(Schedule schedule);
    int update(Schedule schedule);
    int delete(@Param("schdId") Long schdId);
    
    // 중복 체크: 같은 날짜, 시간, 프로그램, 강사
    int countDuplicate(@Param("progId") Long progId, 
                       @Param("userId") String userId,
                       @Param("strtDt") LocalDate strtDt,
                       @Param("strtTm") LocalTime strtTm,
                       @Param("endTm") LocalTime endTm,
                       @Param("excludeSchdId") Long excludeSchdId);
}
