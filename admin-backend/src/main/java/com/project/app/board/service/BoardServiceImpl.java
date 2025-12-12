package com.project.app.board.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project.app.board.dto.BoardDto;
import com.project.app.board.mapper.BoardMapper;

import lombok.extern.slf4j.Slf4j;

/**
 * 게시판 서비스 구현 클래스
 * BoardService 인터페이스의 실제 비즈니스 로직을 구현합니다
 */
@Slf4j
@Service
public class BoardServiceImpl implements BoardService {

	// MyBatis Mapper: 데이터베이스 작업을 수행하는 인터페이스
    private final BoardMapper boardMapper;

    // 생성자: BoardMapper를 주입받습니다
    public BoardServiceImpl(BoardMapper boardMapper) {
        this.boardMapper = boardMapper;
    }

    /**
     * 모든 게시글 조회
     * @return 게시글 목록
     */
    public List<BoardDto> getAllBoards() {
        return boardMapper.selectAllBoards();
    }

    /**
     * ID로 게시글 조회
     * @param id 게시글 ID
     * @return 게시글 목록
     */
	@Override
	public List<BoardDto> getBoardById(Long id) {
		return boardMapper.selectBoardById(id);
	}
	
	/**
	 * 작성자로 게시글 조회
	 * @param author 작성자
	 * @return 게시글 목록
	 */
	@Override
	public List<BoardDto> getBoardByAuthor(String author) {
		return boardMapper.selectBoardByAuthor(author);
	}

	/**
	 * 게시글 생성
	 * @Transactional: 데이터베이스 트랜잭션 관리
	 *                 - 성공하면 커밋(commit), 실패하면 롤백(rollback)
	 *                 - 데이터 일관성을 보장합니다
	 * 
	 * @param boardDto 생성할 게시글 정보
	 */
	@Override
	@Transactional
	public void createBoard(BoardDto boardDto) {
		boardMapper.insertBoard(boardDto);
	}
		
	/**
	 * 게시글 수정
	 * @Transactional: 수정 작업도 트랜잭션으로 관리
	 * 
	 * @param boardDto 수정할 게시글 정보
	 * @return 수정된 게시글 정보
	 */
	@Override
	@Transactional
	public BoardDto updateBoard(BoardDto boardDto) {
		boardMapper.updateBoard(boardDto);
		return boardDto;
	}
	
	/**
	 * 게시글 삭제
	 * @Transactional: 삭제 작업도 트랜잭션으로 관리
	 * 
	 * @param id 삭제할 게시글 ID
	 */
	@Override
	@Transactional
	public void deleteBoardById(Long id) {
		boardMapper.deleteBoardById(id);
	}
	
/*
    @Override
    public List<BoardDto> getBoardsByCategory(String category) {
        return boardMapper.selectBoardsByCategory(category);
    }
    */
    
}

/*
 * [초보자를 위한 설명]
 * 
 * 왜 BoardService(인터페이스)와 BoardServiceImpl(구현 클래스)로 나눠서 만들까요?
 * 
 * 1. 추상화 (Abstraction)
 *    - 인터페이스: "무엇을 할 수 있는가"를 정의 (기능 목록)
 *    - 구현 클래스: "어떻게 하는가"를 구현 (실제 코드)
 *    
 * 2. 유연성
 *    - 나중에 구현 방식을 바꿔도 (MyBatis → JPA)
 *    - 컨트롤러 코드는 수정할 필요가 없습니다
 *    
 * 3. 테스트 용이성
 *    - 가짜 객체(Mock)를 만들어 테스트하기 쉬움
 *    - 데이터베이스 없이도 테스트 가능
 *    
 * 4. Spring AOP 지원
 *    - @Transactional 같은 기능이 제대로 동작하려면
 *    - 인터페이스 기반으로 만드는 것이 좋습니다
 *    
 * 예시:
 * // 컨트롤러에서는 구현 클래스가 아닌 인터페이스를 사용
 * private final BoardService boardService; // BoardServiceImpl이 아님!
 * 
 * 이렇게 하면 나중에 BoardServiceImpl을 BoardServiceJpaImpl로 바꿔도
 * 컨트롤러 코드는 전혀 수정하지 않아도 됩니다!
 */
