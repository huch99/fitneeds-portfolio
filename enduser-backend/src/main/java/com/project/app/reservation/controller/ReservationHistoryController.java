package com.project.app.reservation.controller;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.project.app.reservation.dto.PastHistoryResponseDto;
import com.project.app.reservation.service.ReservationHistoryService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * 예약 이용내역 관련 API 컨트롤러
 */
@Slf4j
@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
public class ReservationHistoryController {

    private final ReservationHistoryService reservationHistoryService;

    /**
     * 예약 날짜가 지난 예약을 예약 테이블에서 제거하고, 이용내역 테이블로 이동합니다.
     *
     * POST /api/reservations/complete
     *
     * @param startDate 처리 기준 날짜 (YYYY-MM-DD 형식, 선택사항, 없으면 오늘 기준)
     * @return 처리 결과 응답
     */
    @PostMapping("/complete")
    public ResponseEntity<Map<String, Object>> completeReservations(
            @RequestParam(value = "startDate", required = false)
            @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate startDate) {
        try {
            log.info("[ReservationHistoryController] 예약 완료 처리 요청 - startDate: {}", startDate);

            // 예약 완료 처리
            int processedCount = reservationHistoryService.completeReservations(startDate);

            // 응답 데이터 구성
            Map<String, Object> response = new HashMap<>();
            response.put("status", "SUCCESS");
            response.put("message", "예약 완료 처리되었습니다.");

            Map<String, Object> data = new HashMap<>();
            data.put("processedCount", processedCount);
            response.put("data", data);

            log.info("[ReservationHistoryController] 예약 완료 처리 완료 - 처리 개수: {}", processedCount);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("[ReservationHistoryController] 예약 완료 처리 중 오류 발생", e);

            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("status", "ERROR");
            errorResponse.put("message", "예약 완료 처리 중 오류가 발생했습니다: " + e.getMessage());
            errorResponse.put("data", null);

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    /**
     * 사용자의 과거 이용내역을 조회합니다.
     *
     * GET /api/reservations/pastHistory
     *
     * @param startDate 조회 시작 날짜 (YYYY-MM-DD 형식, 선택사항)
     * @param endDate 조회 종료 날짜 (YYYY-MM-DD 형식, 선택사항)
     * @param branchId 특정 지점 필터링 (선택사항)
     * @param reviewWritten 리뷰 작성 여부 필터링 (Y: 작성됨, N: 미작성, null: 전체)
     * @return 과거 이용내역 목록 응답
     */
    @GetMapping("/pastHistory")
    public ResponseEntity<Map<String, Object>> getPastHistory(
            @RequestParam(value = "startDate", required = false)
            @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate startDate,
            @RequestParam(value = "endDate", required = false)
            @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate endDate,
            @RequestParam(value = "branchId", required = false) Long branchId,
            @RequestParam(value = "reviewWritten", required = false) String reviewWritten) {
        try {
            // JWT 토큰에서 사용자 ID 추출
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String userId = authentication.getName();

            log.info("[ReservationHistoryController] 과거 이용내역 조회 요청 - userId: {}, startDate: {}, endDate: {}, branchId: {}, reviewWritten: {}",
                    userId, startDate, endDate, branchId, reviewWritten);

            // 과거 이용내역 조회
            List<PastHistoryResponseDto> histories = reservationHistoryService.getPastHistory(
                    userId, startDate, endDate, branchId, reviewWritten);

            // 응답 데이터 구성
            Map<String, Object> response = new HashMap<>();
            response.put("status", "SUCCESS");
            response.put("message", "조회 성공");
            response.put("data", histories);

            log.info("[ReservationHistoryController] 과거 이용내역 조회 완료 - 개수: {}", histories.size());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("[ReservationHistoryController] 과거 이용내역 조회 중 오류 발생", e);

            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("status", "ERROR");
            errorResponse.put("message", "과거 이용내역 조회 중 오류가 발생했습니다: " + e.getMessage());
            errorResponse.put("data", null);

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}