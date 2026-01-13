// file: src/main/java/com/project/app/teachers/repository/TeacherSportRepository.java
package com.project.app.teachers.repository;

import com.project.app.teachers.entity.TeacherSport;
import com.project.app.teachers.entity.TeacherSportId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TeacherSportRepository extends JpaRepository<TeacherSport, TeacherSportId> {

    List<TeacherSport> findByUserId(String userId);

    void deleteByUserId(String userId);

    @Query("SELECT DISTINCT ts.userId FROM TeacherSport ts WHERE ts.sportId = :sportId")
    List<String> findUserIdsBySportId(@Param("sportId") Long sportId);
}
