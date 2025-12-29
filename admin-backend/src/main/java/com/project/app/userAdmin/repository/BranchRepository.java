package com.project.app.userAdmin.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.project.app.userAdmin.entity.Branch;

@Repository
public interface BranchRepository extends JpaRepository<Branch, Long> {

}