package com.project.app.community.service;

import com.project.app.community.dto.CommunityPostDto;
import com.project.app.community.mapper.CommunityPostMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class CommunityPostService {

    private final CommunityPostMapper communityPostMapper;

    public CommunityPostService(CommunityPostMapper communityPostMapper) {
        this.communityPostMapper = communityPostMapper;
    }

    /**
     * USER 커뮤니티 글 등록
     */
    @Transactional
    public void createCommunityPost(CommunityPostDto dto) {

        // ✅ 1. USER 임시 작성자 정보 세팅 (로그인 연동 전)
                   // 🔥 String으로 수정
        dto.setWriterType("MEMBER");
        dto.setPostType("COMMUNITY");
        dto.setIsVisible(true);
        dto.setPostVisible(true);
        dto.setViews(0);

        // ✅ 2. 필수값 검증
        if (dto.getTitle() == null || dto.getTitle().trim().isEmpty()
                || dto.getContent() == null || dto.getContent().trim().isEmpty()) {
            throw new IllegalArgumentException("필수값 누락 (title, content)");
        }

        int result = communityPostMapper.insertCommunityPost(dto);

        if (result != 1) {
            throw new IllegalStateException("커뮤니티 글 등록 실패");
        }
    }

    /**
     * USER 커뮤니티 글 목록 조회
     * - 모집 상태 자동 계산
     */
    @Transactional(readOnly = true)
    public List<CommunityPostDto> getVisibleCommunityPostList() {

        List<CommunityPostDto> list =
                communityPostMapper.selectVisibleCommunityPostList();

        LocalDate today = LocalDate.now();

        for (CommunityPostDto dto : list) {

            if (dto.getRecruitEndDate() != null) {
                if (dto.getRecruitEndDate().isBefore(today)) {
                    dto.setRecruitStatus("모집종료");
                } else {
                    dto.setRecruitStatus("모집중");
                }
            }
        }

        return list;
    }
}
