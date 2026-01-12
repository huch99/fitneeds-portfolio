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
    public ResponseEntity<PaymentResponseDto> processPayment(@Valid @RequestBody PaymentRequestDto requestDto) {
        Payment processedPayment = paymentService.createAndProcessPayment(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(PaymentResponseDto.from(processedPayment));
    }
    
 // 서비스 계층에서 발생할 수 있는 예외 처리 핸들러
    @ExceptionHandler({IllegalArgumentException.class, NoSuchElementException.class, IllegalStateException.class})
    public ResponseEntity<String> handlePaymentExceptions(RuntimeException e) {
        return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST); // 400 Bad Request
    }
}