package com.project.app.passfaq.controller;

import com.project.app.passfaq.dto.PassFaqResponse;
import com.project.app.passfaq.service.PassFaqService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// 이용권 도메인 FAQ 조회 전용 컨트롤러
// 사용자 화면에서 이용권 관련 FAQ 목록/상세 조회 API 제공
// pass_trade, payment 등 다른 도메인과 독립적으로 운영
@Tag(name = "이용권 FAQ", description = "이용권 관련 FAQ 조회 API")
@RestController
@RequestMapping("/api/passfaq")
@RequiredArgsConstructor
public class PassFaqController {

    private final PassFaqService passFaqService;

    // 이용권 FAQ 목록 조회
    // 사용자가 FAQ 페이지 진입 시 또는 카테고리별 필터링 시 호출
    @Operation(summary = "FAQ 목록 조회", description = "이용권 관련 FAQ 목록을 조회합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "FAQ 목록 조회 성공"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    @GetMapping
    public ResponseEntity<List<PassFaqResponse>> getAllFaqs(
            @RequestParam(required = false) String category) {
        
        List<PassFaqResponse> faqs = category != null 
            ? passFaqService.getFaqsByCategory(category)
            : passFaqService.getAllFaqs();
        
        return ResponseEntity.ok(faqs);
    }

    // 이용권 FAQ 상세 조회
    // 사용자가 FAQ 목록에서 특정 항목 클릭 시 호출
    @Operation(summary = "FAQ 상세 조회", description = "특정 FAQ의 상세 내용을 조회합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "FAQ 상세 조회 성공"),
            @ApiResponse(responseCode = "404", description = "FAQ 조회 실패"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    @GetMapping("/{faqId}")
    public ResponseEntity<PassFaqResponse> getFaq(@PathVariable Long faqId) {
        return passFaqService.getFaq(faqId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}