package com.project.app.community.mapper;

import com.project.app.community.dto.CommunityCommentDto;
import com.project.app.community.dto.CommunityPostDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface CommunityPostDetailMapper {

    /**
     * 커뮤니티 게시글 상세 조회 (USER)
     * - 숨김 게시글 제외
     */
    CommunityPostDto selectVisiblePostDetail(
            @Param("postId") Long postId
    );

    /**
     * 커뮤니티 댓글 목록 조회 (USER)
     * - 숨김 댓글 제외
     */
    List<CommunityCommentDto> selectVisibleCommentsByPostId(
            @Param("postId") Long postId
    );

    /**
     * 커뮤니티 댓글 작성 (USER)
     */
    void insertComment(CommunityCommentDto commentDto);
}
