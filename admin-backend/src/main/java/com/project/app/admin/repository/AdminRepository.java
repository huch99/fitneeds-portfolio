package com.project.app.admin.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdminRepository extends JpaRepository<Admin, String> {
	boolean existsByUserId(String userId);
	boolean existsByEmail(String email);
    Optional<Admin> findByUserId(String userId);
    Optional<Admin> getUserByEmailAndRole(String email, String role);
    Optional<Admin> getUserByEmail(String email);
}