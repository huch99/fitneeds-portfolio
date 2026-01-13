// file: src/main/java/com/project/app/teachers/repository/TeacherCertificateRepository.java
package com.project.app.teachers.repository;

import com.project.app.teachers.entity.TeacherCertificate;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TeacherCertificateRepository extends JpaRepository<TeacherCertificate, Long> {

    List<TeacherCertificate> findByUserIdOrderByCertIdAsc(String userId);

    void deleteByUserId(String userId);
}
