package com.project.app.user.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.project.app.user.entity.UserAdmin;

@Repository
public interface UserAdminRepository extends JpaRepository<UserAdmin, String> {
	boolean existsByUserId(String userId);
	boolean existsByEmail(String email);
    Optional<UserAdmin> findByUserId(String userId);
    Optional<UserAdmin> getUserByEmailAndRole(String email, String role);
    Optional<UserAdmin> getUserByEmail(String email);
}