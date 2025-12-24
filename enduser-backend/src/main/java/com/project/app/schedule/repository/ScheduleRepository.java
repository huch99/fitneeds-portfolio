package com.project.app.schedule.repository;

import java.util.List;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.project.app.schedule.entity.Schedule;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {

	@EntityGraph(attributePaths = {"program.sportType", "userAdmin.branch"})
	List<Schedule> findByProgram_SportType_SportId(Long sportId);
	
	List<Schedule> findByUserAdmin_Branch_BrchId(Long brchId);
}
