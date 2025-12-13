package com.project.app.community.mapper;

import com.project.app.community.dto.CommunityPostDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface AdminCommunityMapper {

    /**
     * ADMIN 커뮤니티 글 목록 조회
     * - post_visible 상관없이 전체 조회
     */
    List<CommunityPostDto> selectCommunityPostList();

    /**
     * ADMIN 커뮤니티 글 숨김 / 보이기
     *
     * @param postId 게시글 ID
     * @param postVisible true = 보이기, false = 숨기기
     */
    void updatePostVisible(@Param("postId") Long postId,
                           @Param("postVisible") Boolean postVisible);
    
    void deleteCommunityPost(@Param("postId") Long postId);
}
