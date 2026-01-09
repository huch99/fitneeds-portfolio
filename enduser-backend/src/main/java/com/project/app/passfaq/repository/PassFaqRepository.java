package com.project.app.passfaq.repository;

import com.project.app.passfaq.dto.PassFaqResponse;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 이용권 FAQ 데이터 접근 계층
 * 
 * 책임:
 * - FAQ 테이블에 대한 조회 전용 데이터 접근
 * - 사용자 화면에 필요한 FAQ 정보를 DTO 형태로 제공
 * - 조회 전용으로 설계되어 CUD 연산 없음
 * 
 * 데이터 소스:
 * - FAQ 테이블 (이용권 관련 질문과 답변 저장)
 * - 카테고리별 분류 지원 (이용권 구매, 사용, 거래 등)
 * 
 * 설계 원칙:
 * - Entity 직접 노출 금지, DTO 기반 응답
 * - 조회 성능 최적화를 위한 전용 쿼리 메서드
 */
@Repository
public class PassFaqRepository {

    /**
     * 전체 FAQ 목록 조회
     * 
     * 사용 시점:
     * - FAQ 페이지 초기 로드 시 전체 목록 표시
     * - 검색 없이 모든 FAQ 보기 요청 시
     * 
     * @return 전체 FAQ 목록 (DTO 형태)
     */
    public List<PassFaqResponse> findAll() {
        // TODO: FAQ 전체 목록 조회
        // SELECT * FROM faq ORDER BY reg_dt DESC
        return List.of();
    }

    /**
     * FAQ ID로 단건 조회
     * 
     * 사용 시점:
     * - 사용자가 FAQ 목록에서 특정 항목 클릭 시
     * - FAQ 상세 페이지 로드 시
     * 
     * @param faqId 조회할 FAQ의 고유 ID
     * @return FAQ 상세 정보 (Optional)
     */
    public Optional<PassFaqResponse> findById(Long faqId) {
        // TODO: FAQ 단건 조회
        // SELECT * FROM faq WHERE faq_id = ?
        return Optional.empty();
    }

    /**
     * 카테고리별 FAQ 목록 조회
     * 
     * 사용 시점:
     * - 사용자가 특정 주제의 FAQ만 필터링하여 보기 원할 때
     * - 이용권 구매, 사용, 거래 등 영역별 FAQ 분류 시
     * 
     * @param category 필터링할 카테고리 (예: "PURCHASE", "USAGE", "TRADE")
     * @return 해당 카테고리 FAQ 목록
     */
    public List<PassFaqResponse> findByCategory(String category) {
        // TODO: 카테고리별 FAQ 조회
        // SELECT * FROM faq WHERE category = ? ORDER BY reg_dt DESC
        return List.of();
    }

    // 관리자용 메서드 (설계만)
    // 향후 관리자 화면에서 FAQ 관리 기능 구현 시 사용
    // public PassFaqResponse save(PassFaqRequest request);
    // public PassFaqResponse update(Long faqId, PassFaqRequest request);
    // public void deleteById(Long faqId);
}