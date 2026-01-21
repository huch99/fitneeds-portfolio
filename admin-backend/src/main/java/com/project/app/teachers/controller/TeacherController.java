// file: src/main/java/com/project/app/teachers/controller/TeacherController.java
package com.project.app.teachers.controller;

import com.project.app.teachers.dto.TeacherDto;
import com.project.app.teachers.dto.TeacherStatusUpdateReq;
import com.project.app.teachers.service.TeacherService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/teachers")
public class TeacherController {

    private final TeacherService teacherService;

    /**
     * GET /api/teachers
     * - filters: branchId, sportId, status (guide)
     * - alias: brchId, sttsCd (기존 컬럼 기반 호출도 허용)
     */
    @GetMapping
    public ResponseEntity<List<TeacherDto.Resp>> list(
            Authentication authentication,
            @RequestParam(required = false) Long branchId,
            @RequestParam(required = false) Long brchId,
            @RequestParam(required = false) Long sportId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String sttsCd
    ) {
        try {
            String requesterId = requireRequester(authentication);

            Long resolvedBranchId = (branchId != null) ? branchId : brchId;
            String resolvedStatus = (status != null) ? status : sttsCd;

            List<TeacherDto.Resp> result = teacherService.list(requesterId, resolvedBranchId, sportId, resolvedStatus);
            return ResponseEntity.ok(result);
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        } catch (Exception e) {
            log.error("Error retrieving teachers", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{userId}")
    public ResponseEntity<TeacherDto.Resp> detail(Authentication authentication, @PathVariable String userId) {
        try {
            String requesterId = requireRequester(authentication);
            return ResponseEntity.ok(teacherService.detail(requesterId, userId));
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Error retrieving teacher detail", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * POST /api/teachers/new
     * - ADMIN / MANAGER만 허용 (TEACHER 금지)
     */
    @PostMapping("/new")
    public ResponseEntity<TeacherDto.Resp> create(Authentication authentication, @RequestBody @Valid TeacherDto.CreateReq req) {
        try {
            String requesterId = requireRequester(authentication);
            TeacherDto.Resp result = teacherService.create(requesterId, req);
            return ResponseEntity.ok(result);
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        } catch (Exception e) {
            log.error("Error creating teacher", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * PUT /api/teachers/{userId}
     * - ADMIN: 전체
     * - MANAGER: 자기 지점 강사만
     * - TEACHER: 본인만 (단, brchId 변경 금지)
     */
    @PutMapping("/{userId}")
    public ResponseEntity<TeacherDto.Resp> update(
            Authentication authentication,
            @PathVariable String userId,
            @RequestBody @Valid TeacherDto.UpdateReq req
    ) {
        try {
            String requesterId = requireRequester(authentication);
            TeacherDto.Resp result = teacherService.update(requesterId, userId, req);
            return ResponseEntity.ok(result);
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Error updating teacher", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * PATCH /api/teachers/{userId}/retire
     * - ADMIN / MANAGER만 허용 (TEACHER 금지)
     * - stts_cd='RETIRED', leave_dt/leave_rsn, is_active=0 (guide)
     * - 퇴사 처리 전용 (다른 상태변경은 안됌)
     */
    @PatchMapping("/{userId}/retire")
    public ResponseEntity<Void> retire(
            Authentication authentication,
            @PathVariable String userId,
            @RequestBody @Valid TeacherDto.RetireReq req
    ) {
        try {
            String requesterId = requireRequester(authentication);
            teacherService.retire(requesterId, userId, req);
            return ResponseEntity.noContent().build();
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Error retiring teacher", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PatchMapping("/{userId}/status")
    public ResponseEntity<Void> updateStatus(
            Authentication authentication,
            @PathVariable String userId,
            @RequestBody @Valid TeacherStatusUpdateReq req
    ) {
        try {
            String requesterId = requireRequester(authentication);
            teacherService.updateStatus(requesterId, userId, req);
            return ResponseEntity.noContent().build();
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            log.error("Error updating teacher status", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


    private String requireRequester(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AccessDeniedException("Unauthenticated");
        }
        String name = authentication.getName(); // CustomUserDetailsService가 userId를 username으로 사용
        if (name == null || name.isBlank() || "anonymousUser".equals(name)) {
            throw new AccessDeniedException("Unauthenticated");
        }
        return name;
    }
}
