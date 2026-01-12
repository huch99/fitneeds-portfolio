package com.project.app.passfaq.service;

import com.project.app.passfaq.dto.PassFaqResponse;
import com.project.app.passfaq.repository.PassFaqRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

// 이용권 FAQ 비즈니스 로직 서비스
// FAQ 조회 비즈니스 로직 처리, 조회 전용으로 트랜잭션 없이 동작
@Service
@RequiredArgsConstructor
public class PassFaqService {

    private final PassFaqRepository passFaqRepository;

    // 전체 FAQ 목록 조회
    // 사용자가 FAQ 페이지 초기 진입 시 호출
    public List<PassFaqResponse> getAllFaqs() {
        return passFaqRepository.findAll();
    }

    // 특정 FAQ 상세 조회
    // 사용자가 FAQ 목록에서 특정 항목 선택 시 호출
    public Optional<PassFaqResponse> getFaq(Long faqId) {
        return passFaqRepository.findById(faqId);
    }

    // 카테고리별 FAQ 목록 조회
    // 사용자가 특정 주제의 FAQ만 필터링하여 보기 원할 때 호출
    public List<PassFaqResponse> getFaqsByCategory(String category) {
        return passFaqRepository.findByCategory(category);
    }
}