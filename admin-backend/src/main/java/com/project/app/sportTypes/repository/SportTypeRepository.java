package com.project.app.sportTypes.repository;

import com.project.app.sportTypes.entity.SportType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SportTypeRepository extends JpaRepository<SportType, Long> {
}
