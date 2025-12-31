package com.project.app.branch.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project.app.branch.entity.Branch;
import com.project.app.branch.repository.BranchRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BranchService {

	private final BranchRepository branchRepository;
	
	@Transactional
	public List<Branch> getAllBranches() {
		return branchRepository.findAll();
	}
}
