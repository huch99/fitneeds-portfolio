package com.project.app.payment.mapper;

import com.project.app.payment.domain.PassProduct;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface PassProductMapper {
    List<PassProduct> findAll();
    PassProduct findById(@Param("prodId") Long prodId);
    int insert(PassProduct passproduct);
    int update(PassProduct passproduct);
    int delete(@Param("prodId") Long prodId);
}

