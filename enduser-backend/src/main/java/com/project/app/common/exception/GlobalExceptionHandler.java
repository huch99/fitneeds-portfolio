package com.project.app.common.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * ✅ [Web 레이어] 전역 예외 처리기
 *
 * 목적:
 * - Service에서 터진 "비즈니스 예외"가 401(인증 오류)처럼 보이지 않게 막는다.
 * - 프론트가 400/409/500을 구분해서 처리할 수 있게 해준다.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * ✅ 사용자가 잘못 요청한 케이스 (수량 초과, buyCount <= 0 등)
     * -> 400 Bad Request
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleIllegalArgument(IllegalArgumentException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
    }

    /**
     * ✅ 상태가 맞지 않는 케이스 (SELLING 아닌데 구매, 본인 글 구매 등)
     * -> 409 Conflict 로 주는 게 UX상 더 좋음
     * (400으로 줘도 되는데, 충돌은 409가 더 의미가 정확함)
     */
    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<String> handleIllegalState(IllegalStateException e) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
    }

    /**
     * ✅ 나머지 예상 못한 오류는 500
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleException(Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("서버 오류: " + e.getMessage());
    }
}
