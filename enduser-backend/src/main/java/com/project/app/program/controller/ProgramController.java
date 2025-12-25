package com.project.app.program.controller;

import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.app.program.dto.ProgramResponseDto;
import com.project.app.program.entity.Program;
import com.project.app.program.service.ProgramService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/programs")
@RequiredArgsConstructor
public class ProgramController {

	private final ProgramService programService;
	
	@GetMapping("/getProgramByProgIdForR/{progId}")
	public ResponseEntity<ProgramResponseDto> getProgramByProgIdForR(@PathVariable("progId") Long progId) {
		 Optional<Program> programOptional = programService.getProgramByProgId(progId);

	        if (programOptional.isPresent()) {
	            ProgramResponseDto dto = ProgramResponseDto.from(programOptional.get());
	            return ResponseEntity.ok(dto);
	        } else {
	            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
	        }
	}

}
