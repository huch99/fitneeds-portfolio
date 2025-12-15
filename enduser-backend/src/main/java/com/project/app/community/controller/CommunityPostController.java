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
     * USER 커뮤니티 글 작성
     */
    @PostMapping
    public ResponseEntity<Void> createCommunityPost(
            @RequestBody CommunityPostDto communityPostDto
    ) {
        // 🔒 서버에서 작성자 타입 고정
        communityPostDto.setWriterType("USER");

        // ⚠️ 로그인 연동 전 임시 처리
        if (communityPostDto.getWriterId() == null) {
            communityPostDto.setWriterId("1"); // 🔥 String으로 수정
        }

        // 커뮤니티 타입 고정
        communityPostDto.setPostType("COMMUNITY");

        // 기본 노출 상태
        communityPostDto.setPostVisible(true);

        communityPostService.createCommunityPost(communityPostDto);
        return ResponseEntity.ok().build();
    }

    /**
     * USER 커뮤니티 글 목록 조회 (보이는 글만)
     */
    @GetMapping
    public ResponseEntity<List<CommunityPostDto>> getCommunityPostList() {
        return ResponseEntity.ok(
                communityPostService.getVisibleCommunityPostList()
        );
    }
}
