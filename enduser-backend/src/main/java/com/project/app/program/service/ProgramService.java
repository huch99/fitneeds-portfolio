package com.project.app.program.service;

import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project.app.program.entity.Program;
import com.project.app.program.repository.ProgramRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProgramService {

	private final ProgramRepository programRepository;
	
	@Transactional
	public Optional<Program> getProgramByProgId(Long progId) {
		return programRepository.findById(progId);
	}

}
