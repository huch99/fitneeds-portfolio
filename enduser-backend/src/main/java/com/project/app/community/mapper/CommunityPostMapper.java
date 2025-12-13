package com.project.app.community.mapper;

import com.project.app.community.dto.CommunityPostDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface CommunityPostMapper {

    /**
     * USER 커뮤니티 글 등록
     */
    int insertCommunityPost(CommunityPostDto communityPostDto);

    /**
     * USER 커뮤니티 글 목록 조회
     * - COMMUNITY 타입
     * - 관리자 숨김 제외 (post_visible = 1)
     * - 노출 글만 (is_visible = 1)
     */
    List<CommunityPostDto> selectVisibleCommunityPostList();

    /**
     * USER 커뮤니티 상세 조회
     * - 숨김 글 접근 차단
     */
    CommunityPostDto selectCommunityPostDetail(@Param("postId") Long postId);
}
