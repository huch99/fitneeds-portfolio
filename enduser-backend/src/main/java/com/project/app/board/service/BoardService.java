package com.project.app.board.service;

import java.util.List;

import com.project.app.board.dto.BoardDto;

public interface BoardService {
    List<BoardDto> getAllBoards();
    List<BoardDto> getBoardById(Long id);
    List<BoardDto> getBoardByAuthor(String author);
    //List<BoardDto> getBoardByIdAndAuthor(Long id, String author);
    void createBoard(BoardDto boardDto);
    // void createBoardList(BoardDto boardDto);
    BoardDto updateBoard(BoardDto boardDto);
	void deleteBoardById(Long id);
    
    /*
    List<BoardDto> getBoardsByCategory(String category);
	*/
}