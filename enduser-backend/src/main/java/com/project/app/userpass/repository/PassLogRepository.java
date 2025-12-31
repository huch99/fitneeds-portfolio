package com.project.app.userpass.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.project.app.userpass.entity.PassLog;

@Repository
public interface PassLogRepository extends JpaRepository<PassLog, Long> {

}
