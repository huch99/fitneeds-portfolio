// 리뷰 API 호출 함수
import api from './index';

/**
 * 나의 리뷰 목록 조회
 * GET /api/reviews/my
 */
export const getMyReviews = async () => {
  try {
    const response = await api.get('/api/reviews/my');
    return response.data;
  } catch (error) {
    console.error('리뷰 목록 조회 실패:', error);
    throw error;
  }
};

/**
 * 예약 ID로 리뷰 조회
 * GET /api/reviews/reservation/{reservationId}
 */
export const getReviewByReservationId = async (reservationId) => {
  try {
    const response = await api.get(`/api/reviews/reservation/${reservationId}`);
    return response.data;
  } catch (error) {
    console.error('예약별 리뷰 조회 실패:', error);
    throw error;
  }
};

/**
 * 리뷰 생성
 * POST /api/reviews
 * @param {Object} reviewData - { reservationId, rating, content, instructorId }
 */
export const createReview = async (reviewData) => {
  try {
    const response = await api.post('/api/reviews', reviewData);
    return response.data;
  } catch (error) {
    console.error('리뷰 생성 실패:', error);
    throw error;
  }
};

/**
 * 리뷰 수정
 * PUT /api/reviews/{reviewId}
 * @param {Number} reviewId - 리뷰 ID
 * @param {Object} reviewData - { rating, content }
 */
export const updateReview = async (reviewId, reviewData) => {
  try {
    const response = await api.put(`/api/reviews/${reviewId}`, reviewData);
    return response.data;
  } catch (error) {
    console.error('리뷰 수정 실패:', error);
    throw error;
  }
};

/**
 * 리뷰 삭제
 * DELETE /api/reviews/{reviewId}
 * @param {Number} reviewId - 리뷰 ID
 */
export const deleteReview = async (reviewId) => {
  try {
    const response = await api.delete(`/api/reviews/${reviewId}`);
    return response.data;
  } catch (error) {
    console.error('리뷰 삭제 실패:', error);
    throw error;
  }
};

