import React, { useState, useEffect } from 'react';
import api from '../../api';

/* =========================
   API 함수들
========================= */
// 나의 결제내역 조회
const getMyPayments = async (userId) => {
  if (!userId) return [];
  try {
    const token = localStorage.getItem('accessToken');
    const response = await api.get('/payment/my', {
      params: { userId },
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data || [];
  } catch (error) {
    console.error('결제내역 조회 실패:', error);
    return [];
  }
};

function PaymentHistorySection() {
  const [paymentHistoryData, setPaymentHistoryData] = useState([]);
  const [paymentHistoryLoading, setPaymentHistoryLoading] = useState(false);

  const loginUserId = localStorage.getItem('userId');


  // 결제내역 데이터 가져오기
  useEffect(() => {
    const fetchPaymentHistory = async () => {
      if (!loginUserId) {
        setPaymentHistoryLoading(false);
        return;
      }

      try {
        setPaymentHistoryLoading(true);
        const data = await getMyPayments(loginUserId);

        // 백엔드 데이터를 화면에 맞게 변환
        const transformed = data.map((payment) => ({
          id: payment.paymentId || payment.id,
          paymentId: payment.paymentId || payment.id,
          date: payment.paymentDate
            ? new Date(payment.paymentDate).toISOString().split('T')[0]
            : (payment.date ? new Date(payment.date).toISOString().split('T')[0] : ''),
          paymentDate: payment.paymentDate || payment.date,
          productName: payment.programName || payment.productName || '프로그램',
          option: payment.option || '그룹 레슨',
          price: payment.paymentAmount ? Number(payment.paymentAmount) : (payment.price || 0),
          isCompleted: payment.paymentStatus === 'BANK_TRANSFER_COMPLETED' || payment.paymentStatus === 'COMPLETED',
          cancelRefundStatus: payment.cancelRefundStatus
        }));

        setPaymentHistoryData(transformed);
      } catch (error) {
        console.error('결제내역 조회 실패:', error);
        setPaymentHistoryData([]);
      } finally {
        setPaymentHistoryLoading(false);
      }
    };

    fetchPaymentHistory();
  }, [loginUserId]);
  
  if (paymentHistoryLoading) {
    return (
      <section className="mypage-content-section">
        <h2 className="content-title">결제내역</h2>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>로딩 중...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mypage-content-section">
      <h2 className="content-title">결제내역</h2>
      {paymentHistoryData.length > 0 ? (
      <>
        <div className="reservation-summary">
          결제내역 총 {paymentHistoryData.length}건
        </div>

        <div className="reservation-table-container">
          <table className="reservation-table">
            <thead>
              <tr>
                <th>결제일자</th>
                <th>상품명/옵션</th>
                <th>상품금액</th>
                <th>결제완료여부</th>
                <th>취소/환불</th>
              </tr>
            </thead>
            <tbody>
              {[...paymentHistoryData]
                .sort((a, b) => new Date(b.date || b.paymentDate) - new Date(a.date || a.paymentDate))
                .map((payment) => (
                  <tr key={payment.id}>
                    <td>{payment.date || payment.paymentDate}</td>
                    <td>
                      <div>{payment.productName}</div>
                      <div className="text-muted">{payment.option}</div>
                    </td>
                    <td>{payment.price > 0 ? payment.price.toLocaleString() + '원' : '-'}</td>
                    <td>
                      <span className={payment.isCompleted ? 'status-badge status-success' : 'status-badge status-warning'}>
                        {payment.isCompleted ? '결제완료' : '결제대기'}
                      </span>
                    </td>
                    <td>
                      {payment.cancelRefundStatus ? (
                        <span className="status-badge status-success">
                          {payment.cancelRefundStatus}
                        </span>
                      ) : (
                        <span className="text-muted">-</span>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </>
      ) : (
        <div className="reservation-table-container">
          <table className="reservation-table">
            <thead>
              <tr>
                <th>결제일자</th>
                <th>상품명/옵션</th>
                <th>상품금액</th>
                <th>결제완료여부</th>
                <th>취소/환불</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="5" className="text-center">결제 내역이 없습니다.</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}



export default PaymentHistorySection;
