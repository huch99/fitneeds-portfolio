package com.project.app.passfaq.dto;

import lombok.Data;

import java.time.LocalDateTime;

/**
 * 이용권 FAQ 조회 응답 DTO
 * 
 * 사용 목적:
 * - 사용자 화면에 FAQ 정보를 표시하기 위한 데이터 전송 객체
 * - FAQ 목록 및 상세 페이지에서 공통으로 사용
 * - Entity 직접 노출을 방지하여 API 안정성 보장
 * 
 * 데이터 구성:
 * - 이용권 관련 질문과 답변 내용
 * - 카테고리별 분류 지원 (구매, 사용, 거래 등)
 * - 사용자 참고를 위한 조회수 및 등록일 정보
 */
@Data
public class PassFaqResponse {
    
    /** FAQ 고유 식별자 */
    private Long faqId;
    
    /** FAQ 제목 (사용자가 보는 질문 요약) */
    private String title;
    
    /** FAQ 내용 (상세한 답변 내용, HTML 태그 포함 가능) */
    private String content;
    
    /** 카테고리 (예: "PURCHASE", "USAGE", "TRADE", "GENERAL") */
    private String category;
    
    /** 조회수 (사용자의 관심도 파악 및 인기 FAQ 판단용) */
    private Integer viewCount;
    
    /** 등록일시 (최신 FAQ 순서 정렬용) */
    private LocalDateTime regDt;
    
    /** 수정일시 (내용 업데이트 이력 추적용) */
    private LocalDateTime updDt;
}