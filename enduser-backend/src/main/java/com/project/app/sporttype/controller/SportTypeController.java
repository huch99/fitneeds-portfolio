package com.project.app.sporttype.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.app.sporttype.dto.SportTypeResponseDto;
import com.project.app.sporttype.entity.SportType;
import com.project.app.sporttype.service.SportTypeService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/sporttypes")
@RequiredArgsConstructor
public class SportTypeController {

	private final SportTypeService sportTypeService;
	
	// 모든 종목 데이터
	@GetMapping("/getAllSportTypesForR")
	public List<SportTypeResponseDto> getAllSportTypesForR() {
		List<SportType> sportTypes = sportTypeService.getAllSportTypes();
		
		return sportTypes.stream()
				.map(SportTypeResponseDto::from)
				.collect(Collectors.toList());
	}
	
}
