package com.project.app.notice.service;

import com.project.app.notice.dto.NoticeDto;
import com.project.app.notice.mapper.AdminNoticeMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AdminNoticeService {

    private final AdminNoticeMapper adminNoticeMapper;

    public AdminNoticeService(AdminNoticeMapper adminNoticeMapper) {
        this.adminNoticeMapper = adminNoticeMapper;
    }

    /**
     * ADMIN 공지사항 목록 조회
     * - 숨김 여부 무관
     * - post_type = NOTICE
     */
    public List<NoticeDto> getNoticeList() {
        return adminNoticeMapper.selectNoticeList();
    }

    /**
     * ADMIN 공지사항 상세 조회
     */
    public NoticeDto getNoticeDetail(Long postId) {
        return adminNoticeMapper.selectNoticeDetail(postId);
    }

    /**
     * ADMIN 공지사항 등록
     */
    @Transactional
    public void createNotice(NoticeDto dto) {

        // 공지사항 고정 정책
        dto.setPostType("NOTICE");
        dto.setWriterType("STAFF");
        dto.setViews(0);
        dto.setIsVisible(true);   // notice에서는 이것만 사용
     // 🔥 반드시 필요 (ADMIN 공지 작성자)
        dto.setWriterType("STAFF");
     // 🔥 임시 관리자 ID (팀 merge 전까지)
        dto.setWriterId("1L");
        // 필수값 검증
        if (dto.getTitle() == null || dto.getTitle().trim().isEmpty()
                || dto.getContent() == null || dto.getContent().trim().isEmpty()) {
            throw new IllegalArgumentException("필수값 누락 (title, content)");
        }

        adminNoticeMapper.insertNotice(dto);
    }

    /**
     * ADMIN 공지사항 수정
     */
    @Transactional
    public void updateNotice(NoticeDto dto) {
        dto.setPostType("NOTICE");
        adminNoticeMapper.updateNotice(dto);
    }

    /**
     * ADMIN 공지사항 숨김 / 보이기
     * - is_visible 컬럼만 사용
     */
    @Transactional
    public void updateVisible(Long postId, boolean visible) {
        adminNoticeMapper.updateVisible(postId, visible);
    }

    /**
     * ADMIN 공지사항 삭제 (논리 삭제)
     * - 실제 DELETE 아님
     * - is_visible = false 처리
     */
    @Transactional
    public void deleteNotice(Long postId) {
        adminNoticeMapper.deleteNotice(postId);
    }
}
