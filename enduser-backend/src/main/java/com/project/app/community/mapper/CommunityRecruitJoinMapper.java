package com.project.app.community.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface CommunityRecruitJoinMapper {

    int countByPostIdAndUserId(@Param("postId") Long postId,
                               @Param("userId") String userId);

    int insertRecruitJoin(@Param("postId") Long postId,
                          @Param("userId") String userId);

    List<String> selectJoinUsersByPostId(@Param("postId") Long postId);
}
