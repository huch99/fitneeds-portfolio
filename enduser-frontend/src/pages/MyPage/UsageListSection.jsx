import React from 'react';

function UsageListSection({ usageHistoryData, usageHistoryLoading, setSelectedHistoryId, setIsReviewModalOpen }) {
  return (
    <section className="mypage-content-section">
      <h2 className="content-title">이용목록</h2>
      {usageHistoryLoading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>로딩 중...</p>
        </div>
      ) : (
        <>
          <div className="reservation-summary">
            이용목록 내역 총 {usageHistoryData.length}건
          </div>

          <div className="reservation-table-container">
            <table className="reservation-table">
              <thead>
                <tr>
                  <th>날짜</th>
                  <th>상품명/옵션</th>
                  <th>상품금액</th>
                  <th>리뷰작성</th>
                </tr>
              </thead>
              <tbody>
                {usageHistoryData.length > 0 ? (
                  usageHistoryData.map((history) => (
                    <tr key={history.id}>
                      <td>{history.date}</td>
                      <td>
                        <div>{history.service}</div>
                        <div className="text-muted">{history.option}</div>
                      </td>
                      <td>{history.amount > 0 ? history.amount.toLocaleString() + '원' : '-'}</td>
                      <td>
                        <button 
                          className="btn-action"
                          onClick={() => {
                            setSelectedHistoryId(history.reservationId || history.id);
                            setIsReviewModalOpen(true);
                          }}
                        >
                          리뷰쓰기
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">이용 내역이 없습니다.</td>
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

export default UsageListSection;

