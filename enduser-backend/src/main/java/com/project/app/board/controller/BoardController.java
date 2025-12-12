package com.project.app.board.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.app.board.dto.BoardDto;
import com.project.app.board.service.BoardService;

import lombok.extern.slf4j.Slf4j;

/**
 * 게시판 컨트롤러
 * 게시글 CRUD (Create, Read, Update, Delete) 기능을 제공하는 REST API
 */
@Slf4j
@RestController
@RequestMapping("/api/boards")
public class BoardController {

	// 게시판 비즈니스 로직을 처리하는 서비스
    private final BoardService boardService;

    // 생성자: BoardService를 주입받습니다
    public BoardController(BoardService boardService) {
        this.boardService = boardService;
    }

    /**
     * 모든 게시글 조회
     * GET /api/boards
     */
    @GetMapping
    public ResponseEntity<List<BoardDto>> getAllBoards() {
        return ResponseEntity.ok(boardService.getAllBoards());
    }

    /**
     * ID로 게시글 조회
     * GET /api/boards/id/1
     * 
     * 주의: @GetMapping("/{id}")로 하면 아래 author 경로와 충돌하므로
     *        /id/{id} 형태로 경로를 명확히 구분해야 합니다
     */
    @GetMapping("/id/{id}")
    public ResponseEntity<List<BoardDto>> getBoardById(@PathVariable Long id) {
    	List<BoardDto> board = boardService.getBoardById(id);
        if (board != null) {
            return ResponseEntity.ok(board); // 200 OK + 데이터
        } else {
            return ResponseEntity.notFound().build(); // 404 Not Found
        }
    }
    
    /**
     * 작성자로 게시글 조회
     * GET /api/boards/author/admin
     * 
     * URL 경로 설계 팁:
     * - @GetMapping("/{author}")로 하면 위의 /id/{id}와 경로가 충돌합니다
     * - /author/{author} 처럼 명시적인 경로를 사용하면 충돌을 피할 수 있습니다
     */
    @GetMapping("/author/{author}")
    public ResponseEntity<List<BoardDto>> getBoardByAuthor(@PathVariable String Author) {
    	List<BoardDto> board = boardService.getBoardByAuthor(Author);
        if (board != null) {
            return ResponseEntity.ok(board);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * 게시글 생성
     * POST /api/boards
     * 
     * 요청 본문 예시:
     * {
     *   "title": "제목",
     *   "content": "내용",
     *   "author": "작성자"
     * }
     */
    @PostMapping
    public ResponseEntity<BoardDto> createBoard(@RequestBody BoardDto boardDto){
    	boardService.createBoard(boardDto);
    	// 201 Created 상태 코드와 함께 생성된 데이터 반환
    	return ResponseEntity.status(HttpStatus.CREATED).body(boardDto);
    }

    /**
     * 게시글 수정
     * PUT /api/boards/1
     * 
     * 요청 본문 예시:
     * {
     *   "title": "수정된 제목",
     *   "content": "수정된 내용"
     * }
     */
    @PutMapping("/{id}")
    public ResponseEntity<BoardDto> updateBoard(@PathVariable Long id, @RequestBody BoardDto boardDto){
    	// URL의 id를 DTO에 설정 (어떤 게시글을 수정할지 명확히 하기 위해)
    	boardDto.setId(id);
    	boardService.updateBoard(boardDto);
    	return ResponseEntity.ok(boardDto); // 200 OK + 수정된 데이터
    }
    
    /**
     * 게시글 삭제
     * DELETE /api/boards/1
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBoardById(@PathVariable Long id){
        boardService.deleteBoardById(id);
        // 삭제 성공 시 본문 없이 200 OK만 반환
        return ResponseEntity.ok().build();
    }
}