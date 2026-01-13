// file: src/main/java/com/project/app/teachers/repository/TeacherCareerRepository.java
package com.project.app.teachers.repository;

import com.project.app.teachers.entity.TeacherCareer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TeacherCareerRepository extends JpaRepository<TeacherCareer, Long> {

    List<TeacherCareer> findByUserIdOrderByCareerIdAsc(String userId);

    void deleteByUserId(String userId);
}
