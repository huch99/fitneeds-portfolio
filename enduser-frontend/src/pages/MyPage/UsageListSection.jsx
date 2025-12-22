import React, { useState, useEffect } from 'react';
import { getMyCompletedReservations } from '../../api/reservation';

function UsageListSection({ setSelectedHistoryId, setIsReviewModalOpen, onRefresh }) {
  const [usageHistoryData, setUsageHistoryData] = useState([]);
  const [usageHistoryLoading, setUsageHistoryLoading] = useState(false);

  // 이용내역 데이터 가져오기
  useEffect(() => {
    const fetchUsageHistory = async () => {
      try {
        setUsageHistoryLoading(true);
        const data = await getMyCompletedReservations();

        // 백엔드 데이터를 화면에 맞게 변환
        const transformed = data.map((reservation) => ({
          id: reservation.reservationId,
          reservationId: reservation.reservationId,
          date: reservation.reservedDate
            ? new Date(reservation.reservedDate).toISOString().split('T')[0]
            : (reservation.exerciseDate ? new Date(reservation.exerciseDate).toISOString().split('T')[0] : ''),
          service: reservation.programName || reservation.exerciseName || '프로그램',
          facility: reservation.branchName || reservation.exerciseLocation || '지점',
          amount: reservation.paymentAmount ? Number(reservation.paymentAmount) : 0,
          status: '이용완료',
          paymentStatus: '결제완료',
          reservationStatus: '예약완료',
          image: '/images/pilates.png',
          option: reservation.trainerName ? '개인 레슨' : '그룹 레슨'
        }));

        setUsageHistoryData(transformed);
      } catch (error) {
        console.error('이용내역 조회 실패:', error);
        setUsageHistoryData([]);
      } finally {
        setUsageHistoryLoading(false);
      }
    };

    fetchUsageHistory();
  }, [onRefresh]);
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

