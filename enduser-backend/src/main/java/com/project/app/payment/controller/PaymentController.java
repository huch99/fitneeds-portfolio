package com.project.app.payment.controller;

import java.util.NoSuchElementException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.app.payment.dto.PaymentRequestDto;
import com.project.app.payment.dto.PaymentResponseDto;
import com.project.app.payment.entity.Payment;
import com.project.app.payment.service.PaymentService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    /**
     * 클라이언트로부터 결제 요청을 받아 결제를 처리합니다.
     *
     * @param requestDto 결제 요청 상세 정보를 담은 DTO
     * @return 처리된 결제 정보를 담은 응답 DTO
     */
    @PostMapping("/process") // 결제 처리 엔드포인트
    public ResponseEntity<ApiResponse<PaymentResponseDto>> processPayment(@Valid @RequestBody PaymentRequestDto requestDto) {
        try {
        	// 1. 결제 서비스 호출 (결제 생성 및 검증 로직 포함)
            Payment processedPayment = paymentService.createAndProcessPayment(requestDto);
		
            // 2. 응답 DTO 변환 및 성공 반환
            PaymentResponseDto result = PaymentResponseDto.from(processedPayment);
            log.info("결제 처리 성공 - 사용자: {}, 스케줄ID: {}, 금액: {}, 결제수단: {}", 
                    requestDto.getUserId(), 
                    requestDto.getSchdId(), 
                    requestDto.getAmount(),
                    requestDto.getPayMethod());
            
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success(result, "결제가 정상적으로 완료되었습니다."));
        } catch (Exception e) {
        	log.error("결제 처리 중 서버 오류 발생 - 사용자: {}, 스케줄ID: {}", 
                    requestDto.getUserId(), requestDto.getSchdId(), e);
          return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                  .body(ApiResponse.error(e.getMessage()));
		}
     }
    
 // 서비스 계층에서 발생할 수 있는 예외 처리 핸들러
    @ExceptionHandler({IllegalArgumentException.class, NoSuchElementException.class, IllegalStateException.class})
    public ResponseEntity<String> handlePaymentExceptions(RuntimeException e) {
        return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST); // 400 Bad Request
    }
}