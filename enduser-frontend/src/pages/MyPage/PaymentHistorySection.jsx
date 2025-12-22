import React from 'react';
  
function PaymentHistorySection({ paymentHistoryData, paymentHistoryLoading }) {

  return (
    <section className="mypage-content-section">
      <h2 className="content-title">결제내역</h2>
      {paymentHistoryLoading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>로딩 중...</p>
        </div>
      ) : (
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
                {paymentHistoryData.length > 0 ? (
                  [...paymentHistoryData]
                    .sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate))
                    .map((payment) => (
                      <tr key={payment.id}>
                        <td>{payment.paymentDate}</td>
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
                    ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">결제 내역이 없습니다.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}



export default PaymentHistorySection;
