package com.project.app.userpass.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.project.app.userpass.entity.UserPass;

@Repository
public interface UserPassRepository extends JpaRepository<UserPass, Long> {

	List<UserPass> findByUser_UserId(String UserId);
}
