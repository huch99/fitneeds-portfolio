package com.project.app.community.controller;

import com.project.app.community.dto.CommunityPostDto;
import com.project.app.community.service.CommunityPostService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user/community")
public class CommunityPostController {

    private final CommunityPostService communityPostService;

    public CommunityPostController(CommunityPostService communityPostService) {
        this.communityPostService = communityPostService;
    }

    /**
     * USER 커뮤니티 글 등록
     */
    @PostMapping
    public ResponseEntity<Void> createCommunityPost(
            @RequestBody CommunityPostDto communityPostDto
    ) {
        communityPostService.createCommunityPost(communityPostDto);
        return ResponseEntity.ok().build();
    }

    /**
     * USER 커뮤니티 글 목록 조회
     * - COMMUNITY 타입만
     * - 노출(is_visible = true)인 글만
     * - 최신순
     */
    @GetMapping
    public ResponseEntity<List<CommunityPostDto>> getCommunityPostList() {
        List<CommunityPostDto> list = communityPostService.getVisibleCommunityPostList();
        return ResponseEntity.ok(list);
    }
}
