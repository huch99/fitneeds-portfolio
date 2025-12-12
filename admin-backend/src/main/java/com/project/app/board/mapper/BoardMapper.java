package com.project.app.board.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import com.project.app.board.dto.BoardDto;

@Mapper
public interface BoardMapper {
    List<BoardDto> selectAllBoards();
    List<BoardDto> selectBoardById(Long id);
    //List<BoardDto> selectBoardByIdAndAuthor(Long id, String author);
    
    @Select("ID,TITLE,CONTENT,AUTHOR WHERE AUTHOR = #{author}")
    List<BoardDto> selectBoardByAuthor(String author);
    
    void insertBoard(BoardDto boardDto);
    /*
    @Insert("INSERT INTO API_BOARD(TITLE, CONTENT, AUTHOR, CREATE_DATE, UPDATE_DATE)\r\n"
    		+ "    	VALUES (#{title}, #{content}, #{author}, SYSDATE, SYSDATE)")
    void createBoardList(BoardDto boardDto);
    */
    
    int updateBoard(BoardDto boardDto);
    int deleteBoardById(Long id);
//    List<BoardDto> selectBoardsByCategory(String category);
//    void increaseViewCount(Long id);
}