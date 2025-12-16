package com.project.app.community.controller;

import com.project.app.community.dto.CommunityPostDto;
import com.project.app.community.service.AdminCommunityService;
import com.project.app.community.service.AdminCommunityService.AdminPagedResult;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/community")
public class AdminCommunityController {

    private final AdminCommunityService adminCommunityService;

    public AdminCommunityController(AdminCommunityService adminCommunityService) {
        this.adminCommunityService = adminCommunityService;
    }

    /**
     * ADMIN 커뮤니티 목록 조회
     * - 검색
     * - 필터
     * - 정렬
     * - 페이징
     */
    @GetMapping
    public Map<String, Object> getCommunityPostList(
            @RequestParam(name = "category", required = false) String category,
            @RequestParam(name = "keyword", required = false) String keyword,
            @RequestParam(name = "visible", required = false) Integer visible,
            @RequestParam(name = "orderType", required = false) String orderType,
            @RequestParam(name = "page", defaultValue = "1") int page
    ) {
        AdminPagedResult<CommunityPostDto> pagedResult =
                adminCommunityService.getCommunityPostPaged(
                        category,
                        keyword,
                        visible,
                        orderType,
                        page
                );

        Map<String, Object> result = new HashMap<>();
        result.put("list", pagedResult.getList());
        result.put("totalCount", pagedResult.getTotalCount());
        result.put("page", pagedResult.getCurrentPage());
        result.put("pageSize", 10);
        result.put("totalPages", pagedResult.getTotalPages());

        return result;
    }

    /**
     * ADMIN 커뮤니티 게시글 상세 조회
     */
    @GetMapping("/{postId}")
    public CommunityPostDto getCommunityPostDetail(
            @PathVariable("postId") Long postId
    ) {
        return adminCommunityService.getCommunityPostDetail(postId);
    }

    /**
     * ADMIN 커뮤니티 글 숨김 / 보이기
     */
    @PutMapping("/{postId}/visible")
    public void updatePostVisible(
            @PathVariable("postId") Long postId,
            @RequestParam("postVisible") Boolean postVisible
    ) {
        adminCommunityService.updatePostVisible(postId, postVisible);
    }

    /**
     * ADMIN 커뮤니티 글 삭제
     */
    @DeleteMapping("/{postId}")
    public void deleteCommunityPost(@PathVariable("postId") Long postId) {
        adminCommunityService.deleteCommunityPost(postId);
    }
}
