// file: src/main/java/com/project/app/teachers/repository/TeacherProfileRepository.java
package com.project.app.teachers.repository;

import com.project.app.teachers.entity.TeacherProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TeacherProfileRepository extends JpaRepository<TeacherProfile, String> {

    List<TeacherProfile> findBySttsCd(String sttsCd);

    List<TeacherProfile> findByBrchIdAndSttsCd(Long brchId, String sttsCd);

    @Query("""
        SELECT tp
          FROM TeacherProfile tp
         WHERE tp.userId IN :userIds
           AND (:brchId IS NULL OR tp.brchId = :brchId)
           AND (:sttsCd IS NULL OR tp.sttsCd = :sttsCd)
    """)
    List<TeacherProfile> findByUserIdInAndFilters(
            @Param("userIds") List<String> userIds,
            @Param("brchId") Long brchId,
            @Param("sttsCd") String sttsCd
    );
}
