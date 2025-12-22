import React from 'react';

function UsageHistorySection({ usageHistoryData, usageHistoryLoading, setSelectedHistoryId, setIsReviewModalOpen }) {
  // 상태별 카운트 계산
  const paymentCompletedCount = usageHistoryData.filter(h => h.paymentStatus === '결제완료').length;
  const reservationCompletedCount = usageHistoryData.filter(h => h.reservationStatus === '예약완료').length;
  const usageCompletedCount = usageHistoryData.filter(h => h.status === '이용완료').length;

  return (
    <section className="mypage-content-section">
      <h2 className="content-title">이용내역</h2>
      
      {/* 상태별 카운트 섹션 */}
      <div className="usage-status-section">
        <div className="status-count-box">
          <div className="status-count-label">결제완료</div>
          <div className="status-count-number">{paymentCompletedCount}</div>
        </div>
        <div className="status-count-separator">|</div>
        <div className="status-count-box">
          <div className="status-count-label">예약완료</div>
          <div className="status-count-number">{reservationCompletedCount}</div>
        </div>
        <div className="status-count-separator">|</div>
        <div className="status-count-box">
          <div className="status-count-label">이용내역</div>
          <div className="status-count-number">{usageCompletedCount}</div>
        </div>
      </div>

      {/* 자주 예약한 수업 섹션 */}
      <div className="frequent-reservations-section">
        <div className="frequent-reservations-header">
          <h3 className="frequent-reservations-title">자주 예약한 수업 1건</h3>
        </div>
        <div className="frequent-reservations-grid">
          {usageHistoryData.slice(0, 1).map((history) => (
            <div key={`frequent-${history.id}`} className="frequent-reservation-card">
              <div className="frequent-reservation-image">
                <img src={history.image} alt={history.service} />
              </div>
              <div className="frequent-reservation-info">
                <div className="frequent-reservation-name">{history.service}</div>
                <div className="frequent-reservation-detail">{history.option} | {history.facility}</div>
              </div>
              <button className="frequent-reservations-view-all">전체보기 &gt;</button>
            </div>
          ))}
        </div>
      </div>

      <div className="usage-summary">
        이용내역 총 {usageHistoryData.length}건
      </div>

      {usageHistoryLoading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>로딩 중...</p>
        </div>
      ) : (
        <div className="usage-list-container">
          {usageHistoryData.length > 0 ? (
            usageHistoryData.map((history) => (
            <div key={history.id} className="usage-item">
              <div className="usage-item-header">
                <div className="usage-item-date-status">
                  <span className="usage-item-date">{history.date}</span>
                  <span className="usage-item-status">{history.status}</span>
                </div>
              </div>
              <div className="usage-item-content">
                <div className="usage-item-image">
                  <img src={history.image} alt={history.service} />
                </div>
                <div className="usage-item-info">
                  <div className="usage-item-service">{history.service}</div>
                  <div className="usage-item-price">{history.amount.toLocaleString()}원</div>
                  <div className="usage-item-option">{history.option} | {history.facility}</div>
                </div>
                <div className="usage-item-actions">
                  <button 
                    className="btn-action"
                    onClick={() => {
                      setSelectedHistoryId(history.id);
                      setIsReviewModalOpen(true);
                    }}
                  >
                    리뷰쓰기
                  </button>
                  <i className="bi bi-chevron-right usage-item-arrow"></i>
                </div>
              </div>
            </div>
          ))
          ) : (
            <div className="usage-empty">
              <p>이용 내역이 없습니다.</p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export default UsageHistorySection;