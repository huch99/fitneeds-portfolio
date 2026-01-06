package com.project.app.userAdmin.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.project.app.userAdmin.entity.UserAdmin;

@Repository
public interface UserAdminRepository extends JpaRepository<UserAdmin, String> {
	boolean existsByUserId(String userId);
	boolean existsByEmail(String email);
	
//	@Query("SELECT ua FROM UserAdmin ua LEFT JOIN FETCH ua.brchId WHERE ua.userId = :userId")
    Optional<UserAdmin> findByUserId(String userId);

    Optional<UserAdmin> getUserByEmail(String email);
}