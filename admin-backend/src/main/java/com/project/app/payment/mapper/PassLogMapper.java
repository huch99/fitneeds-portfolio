package com.project.app.payment.mapper;

import com.project.app.payment.domain.PassLog;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface PassLogMapper {
    List<PassLog> findAll();
    PassLog findById(@Param("passLogId") Long passLogId);
    int insert(PassLog passlog);
    int update(PassLog passlog);
    int delete(@Param("passLogId") Long passLogId);
}

