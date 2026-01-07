package com.project.app.notice.mapper;

import com.project.app.notice.dto.NoticeDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface AdminNoticeMapper {

    /**
     * =========================
     * ADMIN 공지사항 목록 조회 (기존, 페이징 없음)
     * =========================
     */
    List<NoticeDto> selectNoticeList();

    /**
     * =========================
     * ADMIN 공지사항 목록 조회 (페이징)
     * =========================
     */
    List<NoticeDto> selectNoticeListPaged(
            @Param("offset") int offset,
            @Param("size") int size
    );

    /**
     * =========================
     * ADMIN 공지사항 전체 건수 조회 (페이징용)
     * =========================
     */
    int selectNoticeCount();

    /**
     * =========================
     * ADMIN 공지사항 상세 조회
     * =========================
     */
    NoticeDto selectNoticeDetail(@Param("postId") Long postId);

    /**
     * =========================
     * ADMIN 공지사항 등록
     * =========================
     */
    int insertNotice(NoticeDto dto);

    /**
     * =========================
     * ADMIN 공지사항 수정
     * =========================
     */
    int updateNotice(NoticeDto dto);

    /**
     * =========================
     * ADMIN 공지사항 숨김 / 보이기
     * - is_visible 컬럼만 사용
     * =========================
     */
    int updateVisible(
            @Param("postId") Long postId,
            @Param("visible") boolean visible
    );

    /**
     * =========================
     * ADMIN 공지사항 삭제 (논리 삭제)
     * - is_visible = false
     * =========================
     */
    int deleteNotice(@Param("postId") Long postId);
}
