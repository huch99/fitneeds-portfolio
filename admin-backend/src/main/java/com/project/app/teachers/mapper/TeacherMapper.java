package com.project.app.teachers.mapper;

import com.project.app.teachers.entity.TeacherProfile;
import com.project.app.teachers.entity.TeacherSport;
import com.project.app.teachers.entity.TeacherCertificate;
import com.project.app.teachers.entity.TeacherCareer;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface TeacherMapper {

    // TeacherProfile
    List<TeacherProfile> findAll();
    TeacherProfile findById(@Param("userId") String userId);
    List<TeacherProfile> findBySttsCd(@Param("sttsCd") String sttsCd);
    List<TeacherProfile> findByBrchIdAndSttsCd(@Param("brchId") Long brchId, @Param("sttsCd") String sttsCd);
    List<TeacherProfile> findByUserIdInAndFilters(@Param("userIds") List<String> userIds, @Param("brchId") Long brchId, @Param("sttsCd") String sttsCd);
    int insert(TeacherProfile profile);
    int update(TeacherProfile profile);
    int delete(@Param("userId") String userId);

    // TeacherSport
    List<TeacherSport> findSportsByUserId(@Param("userId") String userId);
    List<String> findUserIdsBySportId(@Param("sportId") Long sportId);
    int insertSport(TeacherSport sport);
    int deleteSportsByUserId(@Param("userId") String userId);

    // TeacherCertificate
    List<TeacherCertificate> findCertsByUserId(@Param("userId") String userId);
    int insertCert(TeacherCertificate cert);
    int deleteCertsByUserId(@Param("userId") String userId);

    // TeacherCareer
    List<TeacherCareer> findCareersByUserId(@Param("userId") String userId);
    int insertCareer(TeacherCareer career);
    int deleteCareersByUserId(@Param("userId") String userId);

    int updateTeacherStatus(@Param("userId") String userId,
                            @Param("sttsCd") String sttsCd,
                            @Param("updUserId") String updUserId);
}
