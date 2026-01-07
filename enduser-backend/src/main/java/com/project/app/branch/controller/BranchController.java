package com.project.app.branch.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.app.branch.dto.BranchResponseDto;
import com.project.app.branch.entity.Branch;
import com.project.app.branch.service.BranchService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/branches")
@RequiredArgsConstructor
public class BranchController {

	private final BranchService branchService;
	
	@GetMapping("/getAllBranchesForR")
	public List<BranchResponseDto> getAllBranchesForR() {
		List<Branch> branches = branchService.getAllBranches();
		
		return branches.stream()
                .map(BranchResponseDto::from)
                .toList();
	}
}
