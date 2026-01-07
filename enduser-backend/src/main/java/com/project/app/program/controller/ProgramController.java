package com.project.app.program.controller;

import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.app.aspect.ApiResponse;
import com.project.app.program.dto.ProgramResponseDto;
import com.project.app.program.entity.Program;
import com.project.app.program.service.ProgramService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/programs")
@RequiredArgsConstructor
@Slf4j
public class ProgramController {

	private final ProgramService programService;
	
	/**
     * 특정 프로그램 ID에 해당하는 상세 정보를 조회합니다.
     * 프론트엔드에서 예약 페이지 구성 시 프로그램의 상세 정보(금액, 종목 등)를 
     * 불러오기 위해 사용됩니다.
     *
     * @param progId 조회할 프로그램의 고유 ID
     * @return 프로그램 정보를 담은 ApiResponse DTO (성공 시 200, 없을 시 404, 오류 시 500)
     */
	@GetMapping("/getProgramByProgIdForR/{progId}")
	public ResponseEntity<ApiResponse<ProgramResponseDto>> getProgramByProgIdForR(@PathVariable("progId") Long progId) {
		try {
			// 1. 서비스에서 Optional로 데이터 조회 
			Optional<Program> programOptional = programService.getProgramByProgId(progId);

			// 2. 비즈니스 로직 결과 확인
			if (programOptional.isPresent()) {
	            ProgramResponseDto dto = ProgramResponseDto.from(programOptional.get());
	            log.info("프로그램 상세 조회 성공 - progId: {}", progId);
	            return ResponseEntity.ok(ApiResponse.success(dto));
	        } else {
	        	// 데이터가 없는 경우 (404)
	        	log.warn("프로그램 상세 조회 실패 (데이터 없음) - progId: {}", progId);
	        	return ResponseEntity.status(HttpStatus.NOT_FOUND)
	                    .body(ApiResponse.error("요청하신 프로그램 정보가 존재하지 않습니다."));
	        }
		} catch (Exception e) {
			// 3. 예기치 못한 시스템 오류 발생 시 처리 (500)
	        log.error("프로그램 조회 중 서버 오류 발생 - progId: {}, error: {}", progId, e.getMessage());
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	                .body(ApiResponse.error("프로그램 정보를 불러오는 중 서버 내부 오류가 발생했습니다."));
		}
		
	        
	}

}
