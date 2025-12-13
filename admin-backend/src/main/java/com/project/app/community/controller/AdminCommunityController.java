package com.project.app.community.controller;

import com.project.app.community.dto.CommunityPostDto;
import com.project.app.community.service.AdminCommunityService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/community")
public class AdminCommunityController {

    private final AdminCommunityService adminCommunityService;

    public AdminCommunityController(AdminCommunityService adminCommunityService) {
        this.adminCommunityService = adminCommunityService;
    }

    /**
     * ADMIN 커뮤니티 글 목록 조회
     */
    @GetMapping
    public List<CommunityPostDto> getCommunityPostList() {
        return adminCommunityService.getCommunityPostList();
    }

    /**
     * ADMIN 커뮤니티 글 숨김 / 보이기
     *
     * PUT /api/admin/community/{postId}/visible?postVisible=true|false
     */
    @PutMapping("/{postId}/visible")
    public void updatePostVisible(@PathVariable("postId") Long postId,
                                  @RequestParam("postVisible") Boolean postVisible) {
        adminCommunityService.updatePostVisible(postId, postVisible);
    }
    
 // ✅ ADMIN 삭제 API
    @DeleteMapping("/{postId}")
    public void deleteCommunityPost(@PathVariable("postId") Long postId) {
        adminCommunityService.deleteCommunityPost(postId);
    }
}
