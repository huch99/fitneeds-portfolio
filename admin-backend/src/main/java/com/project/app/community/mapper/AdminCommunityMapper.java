package com.project.app.community.mapper;

import com.project.app.community.dto.CommunityPostDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface AdminCommunityMapper {

    /**
     * ADMIN 커뮤니티 목록 조회
     * - 검색
     * - 카테고리
     * - 노출 여부
     * - 정렬
     * - 페이징
     * - 댓글 수 포함
     */
    List<CommunityPostDto> selectCommunityPostList(
            @Param("category") String category,
            @Param("keyword") String keyword,
            @Param("visible") Integer visible,
            @Param("orderType") String orderType,
            @Param("limit") int limit,
            @Param("offset") int offset
    );

    /**
     * ADMIN 커뮤니티 전체 건수 (페이징용)
     */
    int selectCommunityPostCount(
            @Param("category") String category,
            @Param("keyword") String keyword,
            @Param("visible") Integer visible
    );

    /**
     * ADMIN 커뮤니티 게시글 상세 조회
     */
    CommunityPostDto selectCommunityPostDetail(
            @Param("postId") Long postId
    );

    /**
     * ADMIN 커뮤니티 글 숨김 / 보이기
     */
    void updatePostVisible(
            @Param("postId") Long postId,
            @Param("postVisible") Boolean postVisible
    );

    /**
     * ADMIN 커뮤니티 글 삭제
     */
    void deleteCommunityPost(@Param("postId") Long postId);
}
