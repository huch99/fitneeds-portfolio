package com.project.app.community.mapper;

import com.project.app.community.dto.CommunityPostDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface CommunityPostMapper {

    int insertCommunityPost(CommunityPostDto communityPostDto);

    List<CommunityPostDto> selectVisibleCommunityPostList();

    CommunityPostDto selectCommunityPostDetail(@Param("postId") Long postId);
}
