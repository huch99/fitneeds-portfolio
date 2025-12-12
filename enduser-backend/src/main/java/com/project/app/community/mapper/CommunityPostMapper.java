package com.project.app.community.mapper;

import com.project.app.community.dto.CommunityPostDto;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface CommunityPostMapper {

    /**
     * USER 커뮤니티 글 등록
     */
    int insertCommunityPost(CommunityPostDto communityPostDto);
}
