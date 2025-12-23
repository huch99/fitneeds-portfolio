package com.project.app.review.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.project.app.review.dto.ReviewResponse;

@Mapper
public interface ReviewMapper {

    boolean existsByReservationId(@Param("reservationId") Long reservationId);

    void insertReview(
        @Param("reservationId") Long reservationId,
        @Param("rating") Integer rating,
        @Param("content") String content,
        @Param("userId") String userId
    );

    List<ReviewResponse> selectReviewsByUserId(@Param("userId") String userId);

    ReviewResponse selectReviewById(@Param("reviewId") Long reviewId);

    void updateReview(
        @Param("reviewId") Long reviewId,
        @Param("rating") Integer rating,
        @Param("content") String content,
        @Param("userId") String userId
    );

    void deleteReview(
        @Param("reviewId") Long reviewId,
        @Param("userId") String userId
    );
}

