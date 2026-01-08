package com.project.app.pass_trade_transaction.controller;

import com.project.app.pass_trade.dto.response.PassTradeTransactionResponse;
import com.project.app.pass_trade_transaction.service.PassTradeTransactionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "거래 내역 조회 API", description = "이용권 거래 완료 내역 조회 API")
@RestController
@RequestMapping("/api/pass-trade-transactions")
@RequiredArgsConstructor
public class PassTradeTransactionController {

    private final PassTradeTransactionService transactionService;

    // 내 거래 전체 조회
    @Operation(summary = "내 거래 내역 조회")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "거래 내역 조회 성공")
    })
    @GetMapping
    public ResponseEntity<List<PassTradeTransactionResponse>> getAllTransactions(
            @RequestParam String userId) {

        return ResponseEntity.ok(transactionService.getAllTransactions(userId));
    }

    // 거래 단건 조회
    @Operation(summary = "거래 상세 조회")
    @GetMapping("/{transactionId}")
    public ResponseEntity<PassTradeTransactionResponse> getTransaction(
            @PathVariable Long transactionId) {

        return transactionService.getTransaction(transactionId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 내가 판매한 거래
    @Operation(summary = "판매 거래 내역 조회")
    @GetMapping("/sell")
    public ResponseEntity<List<PassTradeTransactionResponse>> getSellTransactions(
            @RequestParam String userId) {

        return ResponseEntity.ok(transactionService.getSellTransactions(userId));
    }

    // 내가 구매한 거래
    @Operation(summary = "구매 거래 내역 조회")
    @GetMapping("/buy")
    public ResponseEntity<List<PassTradeTransactionResponse>> getBuyTransactions(
            @RequestParam String userId) {

        return ResponseEntity.ok(transactionService.getBuyTransactions(userId));
    }
}
