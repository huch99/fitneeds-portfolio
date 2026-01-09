package com.project.app.faq.service;

import com.project.app.faq.dto.FAQDto;
import com.project.app.faq.mapper.AdminFAQMapper;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AdminFAQService {

    private final AdminFAQMapper adminFAQMapper;

    public AdminFAQService(AdminFAQMapper adminFAQMapper) {
        this.adminFAQMapper = adminFAQMapper;
    }

    @Transactional(readOnly = true)
    public PagedResult<FAQDto> getFAQListPaged(String keyword, Boolean visible, int page) {
        int size = 10;
        int offset = (page - 1) * size;

        List<FAQDto> list =
                adminFAQMapper.selectFAQListPaged(keyword, visible, size, offset);

        int totalCount = adminFAQMapper.selectFAQCount(keyword, visible);
        int totalPages = (int) Math.ceil((double) totalCount / size);

        return new PagedResult<>(list, totalCount, page, totalPages);
    }

    @Transactional(readOnly = true)
    public FAQDto getFAQDetail(Long postId) {
        return adminFAQMapper.selectFAQDetail(postId);
    }

    @Transactional
    public Long createFAQ(FAQDto dto) {
        dto.setPostType("FAQ");
        dto.setWriterType("ADMIN");

        // 기본값 방어 (DB default가 있더라도 null 방지)
        if (dto.getIsVisible() == null) dto.setIsVisible(true);
        if (dto.getPostVisible() == null) dto.setPostVisible(true);

        adminFAQMapper.insertFAQ(dto);
        return dto.getPostId();
    }
    
//    @Transactional
//    public Long createFAQ(FAQDto dto) {
//        dto.setPostType("FAQ");
//        dto.setWriterType("ADMIN");
//
//        // ✅ 현재 로그인한 관리자 ID
//        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
//        String adminId = auth.getName();   // ← 이게 user_id
//        dto.setWriterId(adminId);
//
//        if (dto.getIsVisible() == null) dto.setIsVisible(true);
//        if (dto.getPostVisible() == null) dto.setPostVisible(true);
//
//        adminFAQMapper.insertFAQ(dto);
//        return dto.getPostId();
//    }
    
    @Transactional
    public void updateFAQ(FAQDto dto) {
        adminFAQMapper.updateFAQ(dto);
    }

    @Transactional
    public void updateFAQVisible(Long postId, boolean visible) {
        adminFAQMapper.updateFAQVisible(postId, visible);
    }

    @Transactional
    public void deleteFAQ(Long postId) {
        adminFAQMapper.deleteFAQ(postId);
    }

    public static class PagedResult<T> {
        private final List<T> list;
        private final int totalCount;
        private final int currentPage;
        private final int totalPages;

        public PagedResult(List<T> list, int totalCount, int currentPage, int totalPages) {
            this.list = list;
            this.totalCount = totalCount;
            this.currentPage = currentPage;
            this.totalPages = totalPages;
        }

        public List<T> getList() { return list; }
        public int getTotalCount() { return totalCount; }
        public int getCurrentPage() { return currentPage; }
        public int getTotalPages() { return totalPages; }
    }
}
