// 결제 API 호출 함수
import api from './index';

/**
 * 나의 결제내역 조회
 * GET /api/payment/my
 */
export const getMyPayments = async () => {
  try {
    const response = await api.get('/api/payment/my');
    return response.data;
  } catch (error) {
    console.error('결제내역 조회 실패:', error);
    throw error;
  }
};

