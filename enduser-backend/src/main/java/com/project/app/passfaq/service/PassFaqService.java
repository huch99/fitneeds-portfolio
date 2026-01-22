package com.project.app.passfaq.service;

import com.project.app.passfaq.dto.*;
import com.project.app.passfaq.entity.PassFaq;
import com.project.app.passfaq.repository.PassFaqRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PassFaqService {

    private final PassFaqRepository repository;

    // 목록 조회
    public List<PassFaqResponse> getFaqList(String category) {
        List<PassFaq> list = (category == null)
                ? repository.findAll()
                : repository.findByCategoryOrderByRegDtDesc(category);

        return list.stream().map(this::toResponse).toList();
    }

    // 단건 조회 (+ 조회수 증가)
    public PassFaqResponse getFaq(Long faqId) {
        PassFaq faq = repository.findById(faqId).orElseThrow();
        faq.setViewCnt(faq.getViewCnt() + 1);
        return toResponse(faq);
    }

    // 질문 등록
    public void createFaq(PassFaqCreateRequest req) {
        PassFaq faq = new PassFaq();
        faq.setTitle(req.getTitle());
        faq.setContent(req.getContent());
        faq.setCategory(req.getCategory());
        faq.setAnsStat("WAIT");
        repository.save(faq);
    }

    // 질문 수정 (답변 전만)
    public void updateFaq(Long faqId, PassFaqUpdateRequest req) {
        PassFaq faq = repository.findById(faqId).orElseThrow();

        if ("DONE".equals(faq.getAnsStat())) {
            throw new IllegalStateException("답변 완료된 문의는 수정할 수 없습니다.");
        }

        faq.setTitle(req.getTitle());
        faq.setContent(req.getContent());
    }

    // 질문 삭제
    public void deleteFaq(Long faqId) {
        repository.deleteById(faqId);
    }

    // Entity → Response
    private PassFaqResponse toResponse(PassFaq faq) {
        PassFaqResponse dto = new PassFaqResponse();
        dto.setId(faq.getFaqId());
        dto.setTitle(faq.getTitle());
        dto.setContent(faq.getContent());
        dto.setAnswer(faq.getAnsAt() != null ? faq.getContent() : null);
        dto.setStatus(faq.getAnsStat());
        dto.setCategory(faq.getCategory());
        dto.setCreatedAt(faq.getRegDt());
        return dto;
    }
}
