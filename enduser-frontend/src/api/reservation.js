/**
 * 예약 API 호출 함수
 * 
 * 모든 API 호출은 api 인스턴스를 통해 이루어지며,
 * localStorage에 저장된 인증 토큰이 자동으로 헤더에 포함됩니다.
 * 별도로 토큰을 가져오거나 헤더에 추가할 필요가 없습니다.
 */
import api from './index';

/**
 * 나의 예약 목록 조회
 * GET /api/reservation/my
 */
export const getMyReservations = async () => {
  try {
    const response = await api.get('/api/reservation/my');
    return response.data;
  } catch (error) {
    console.error('예약 목록 조회 실패:', error);
    throw error;
  }
};

/**
 * 결제완료된 예약 목록 조회 (이용내역 화면)
 * GET /api/reservation/my/completed
 */
export const getMyCompletedReservations = async () => {
  try {
    const response = await api.get('/reservation/my/completed');
    return response.data;
  } catch (error) {
    console.error('결제완료 예약 목록 조회 실패:', error);
    throw error;
  }
};

/**
 * 예약 상세 조회
 * GET /api/reservation/{reservationId}
 */
export const getReservationById = async (reservationId) => {
  try {
    const response = await api.get(`/reservation/${reservationId}`);
    return response.data;
  } catch (error) {
    console.error('예약 조회 실패:', error);
    throw error;
  }
};

/**
 * 예약일자 변경
 * PATCH /api/reservation/{reservationId}/date
 * @param {Number} reservationId - 예약 ID
 * @param {String} reservedDate - 예약날짜 (YYYY-MM-DD)
 * @param {String} reservedTime - 예약시간 (HH:mm:ss, 선택적)
 */
export const updateReservationDate = async (reservationId, reservedDate, reservedTime = null) => {
  try {
    const requestBody = {
      reservedDate: reservedDate,
      ...(reservedTime && { reservedTime: reservedTime })
    };
    const response = await api.patch(`/api/reservation/${reservationId}/date`, requestBody);
    return response.data;
  } catch (error) {
    console.error('예약일자 변경 실패:', error);
    throw error;
  }
};

