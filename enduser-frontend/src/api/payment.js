/**
 * 결제 API 호출 함수
 * 
 * 모든 API 호출은 api 인스턴스를 통해 이루어지며,
 * localStorage에 저장된 인증 토큰이 자동으로 헤더에 포함됩니다.
 * 별도로 토큰을 가져오거나 헤더에 추가할 필요가 없습니다.
 */
import api from './index';

/**
 * 나의 결제내역 조회
 * GET /api/payment/my
 */
export const getMyPayments = async () => {
  try {
    const response = await api.get('/payment/my');
    return response.data;
  } catch (error) {
    console.error('결제내역 조회 실패:', error);
    throw error;
  }
};

