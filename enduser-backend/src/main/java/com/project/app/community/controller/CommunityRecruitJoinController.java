package com.project.app.community.controller;

import com.project.app.community.service.CommunityRecruitJoinService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user/community")
public class CommunityRecruitJoinController {

    private final CommunityRecruitJoinService recruitJoinService;

    public CommunityRecruitJoinController(CommunityRecruitJoinService recruitJoinService) {
        this.recruitJoinService = recruitJoinService;
    }

    /**
     * =========================
     * 모집 글 참여 신청
     * =========================
     *
     * POST /api/user/community/{postId}/join
     *
     * Request Body:
     * {
     *   "userId": "user1"
     * }
     */
    @PostMapping("/{postId}/join")
    public ResponseEntity<?> applyRecruit(
            @PathVariable("postId") Long postId,
            @RequestBody Map<String, String> body
    ) {
        String userId = body.get("userId");

        if (userId == null || userId.isBlank()) {
            return ResponseEntity.badRequest()
                    .body("userId는 필수입니다.");
        }

        try {
            recruitJoinService.applyRecruit(postId, userId);
            return ResponseEntity.ok("참여 신청이 완료되었습니다.");
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * =========================
     * 🔥 이미 참여한 모집인지 여부 체크
     * =========================
     *
     * GET /api/user/community/{postId}/join/check?userId=user1
     *
     * Response:
     * {
     *   "joined": true
     * }
     */
    @GetMapping("/{postId}/join/check")
    public ResponseEntity<?> checkAlreadyJoined(
            @PathVariable("postId") Long postId,
            @RequestParam("userId") String userId
    ) {
        boolean joined =
                recruitJoinService.isAlreadyJoined(postId, userId);

        return ResponseEntity.ok(
                Map.of("joined", joined)
        );
    }

    /**
     * =========================
     * 🔥 참여 신청자 목록 조회 (작성자용)
     * =========================
     *
     * GET /api/user/community/{postId}/join/users
     *
     * Response:
     * ["user1", "user2", "user3"]
     */
    @GetMapping("/{postId}/join/users")
    public ResponseEntity<List<String>> getJoinUsers(
            @PathVariable("postId") Long postId
    ) {
        List<String> users =
                recruitJoinService.getJoinUsersByPostId(postId);

        return ResponseEntity.ok(users);
    }
}
