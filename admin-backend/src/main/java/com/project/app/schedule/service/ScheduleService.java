package com.project.app.schedule.service;

import com.project.app.schedule.domain.Schedule;
import java.util.List;

public interface ScheduleService {
    List<Schedule> findAll();
    Schedule findById(Long schdId);
    Schedule create(Schedule schedule);
    Schedule update(Schedule schedule);
    void delete(Long schdId);
}
