package com.project.app.program.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.project.app.program.entity.Program;

@Repository
public interface ProgramRepository extends JpaRepository<Program, Long> {
	Optional<Program> findByProgramId(Long programId);
	List<Program> findByProgramName(String programName);
}

