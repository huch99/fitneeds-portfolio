import React, { useState, useEffect } from 'react';
import api from '../../api';
import '../../components/auth/modalStyles.css';

/* =========================
   API 함수들
========================= */
// 이용내역 조회
const getPastHistory = async (startDate = null, endDate = null, branchId = null, reviewWritten = null) => {
  try {
    const params = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    if (branchId) params.branchId = branchId;
    if (reviewWritten) params.reviewWritten = reviewWritten;
    
    const response = await api.get('/reservations/pastHistory', { params });
    
    // 백엔드 응답 구조: { status, message, data }
    if (response.data.status === 'SUCCESS' && response.data.data) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || '이용내역 조회 실패');
    }
  } catch (error) {
    console.error('이용내역 조회 실패:', error);
    throw error;
  }
};

// 나의 예약 목록 조회
const getMyReservations = async () => {
  try {
    const response = await api.get('/reservations/myReservations');
    
    // 백엔드 응답 구조: { resultCode, message, data }
    if (response.data.resultCode === 'SUCCESS' && response.data.data) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || '예약 목록 조회 실패');
    }
  } catch (error) {
    console.error('예약 목록 조회 실패:', error);
    throw error;
  }
};


function UsageHistorySection({ onRefresh }) {
  const [usageHistoryData, setUsageHistoryData] = useState([]);
  const [usageHistoryLoading, setUsageHistoryLoading] = useState(false);
  const [frequentReservations, setFrequentReservations] = useState([]);
  const [frequentReservationsLoading, setFrequentReservationsLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  
  // 운동 종목명에 따른 이미지 매핑 함수
  const getSportImage = (sportName) => {
    if (!sportName) return '/images/pt.png';
    const sportLower = sportName.toLowerCase();
    if (sportLower.includes('필라테스') || sportLower.includes('pilates')) {
      return '/images/pilates.png';
    } else if (sportLower.includes('요가') || sportLower.includes('yoga')) {
      return '/images/yoga.png';
    } else if (sportLower.includes('크로스핏') || sportLower.includes('crossfit')) {
      return '/images/crossfit.png';
    } else {
      return '/images/pt.png';
    }
  };

  // 이용내역 데이터 가져오기
  useEffect(() => {
    const fetchUsageHistory = async () => {
      try {
        setUsageHistoryLoading(true);
        const data = await getPastHistory();
        console.log('[UsageHistorySection] 이용내역 API 응답 데이터:', data);
        
        // 백엔드 데이터를 화면에 맞게 변환
        // 백엔드 응답 필드: reservationId, sportName, brchNm, trainerName, rsvDt, rsvTime, refId, reviewWritten
        const transformed = (data || []).map((history) => {
          // 날짜 변환
          let dateStr = '';
          if (history.rsvDt) {
            if (typeof history.rsvDt === 'string') {
              dateStr = history.rsvDt.split('T')[0];
            } else {
              dateStr = history.rsvDt;
            }
          }
          
          // 시간 변환
          let timeStr = '';
          if (history.rsvTime) {
            if (typeof history.rsvTime === 'string') {
              timeStr = history.rsvTime.substring(0, 5);
            } else {
              timeStr = String(history.rsvTime).substring(0, 5);
            }
          }
          
          return {
            id: history.refId || history.reservationId,
            reservationId: history.reservationId,
            historyId: history.refId,
            date: dateStr,
            time: timeStr,
            branchName: history.brchNm || '지점',
            programName: history.sportName || '프로그램',
            trainerName: history.trainerName || '',
            reviewWritten: history.reviewWritten === true || history.reviewWritten === 'Y',
            image: getSportImage(history.sportName)
          };
        });
        
        console.log('[UsageHistorySection] 변환된 이용내역 데이터:', transformed);
        
        // ===== 더미 데이터 (화면 확인용) =====
        // TODO: 백엔드 API 연결 후 제거
        if (transformed.length === 0) {
          transformed.push({
            id: 999,
            reservationId: 999,
            historyId: 999,
            date: '2024-12-20',
            time: '14:00',
            branchName: '강남점',
            programName: '필라테스',
            trainerName: '김강사',
            reviewWritten: false,
            image: '/images/pilates.png'
          });
          transformed.push({
            id: 998,
            reservationId: 998,
            historyId: 998,
            date: '2024-12-18',
            time: '16:00',
            branchName: '잠실점',
            programName: '요가',
            trainerName: '이강사',
            reviewWritten: true,
            image: '/images/yoga.png'
          });
        }
        // ===== 더미 데이터 끝 =====
        
        setUsageHistoryData(transformed);
      } catch (error) {
        console.error('[UsageHistorySection] 이용내역 조회 실패:', error);
        
        // ===== 더미 데이터 (에러 시 화면 확인용) =====
        // TODO: 백엔드 API 연결 후 제거
        setUsageHistoryData([{
          id: 999,
          reservationId: 999,
          historyId: 999,
          date: '2024-12-20',
          time: '14:00',
          branchName: '강남점',
          programName: '필라테스',
          trainerName: '김강사',
          reviewWritten: false,
          image: '/images/pilates.png'
        }, {
          id: 998,
          reservationId: 998,
          historyId: 998,
          date: '2024-12-18',
          time: '16:00',
          branchName: '잠실점',
          programName: '요가',
          trainerName: '이강사',
          reviewWritten: true,
          image: '/images/yoga.png'
        }]);
        // ===== 더미 데이터 끝 =====
      } finally {
        setUsageHistoryLoading(false);
      }
    };

    fetchUsageHistory();
  }, [refreshKey, onRefresh]);

  // 2회 이상 예약한 항목 조회
  useEffect(() => {
    const fetchFrequentReservations = async () => {
      try {
        setFrequentReservationsLoading(true);
        const reservations = await getMyReservations();
        console.log('[UsageHistorySection] 예약 목록 API 응답 데이터:', reservations);
        
        // 같은 프로그램/지점/강사 조합으로 그룹화
        const grouped = {};
        (reservations || []).forEach((reservation) => {
          const key = `${reservation.sportName || ''}_${reservation.brchNm || ''}_${reservation.trainerName || ''}`;
          if (!grouped[key]) {
            grouped[key] = {
              programName: reservation.sportName || '프로그램',
              branchName: reservation.brchNm || '지점',
              trainerName: reservation.trainerName || '',
              count: 0,
              image: getSportImage(reservation.sportName)
            };
          }
          grouped[key].count++;
        });
        
        // 2회 이상인 항목만 필터링
        const frequent = Object.values(grouped)
          .filter(item => item.count >= 2)
          .map(item => ({
            ...item,
            price: '-' // 가격 정보는 API에 없으므로 "-"로 표시
          }));
        
        console.log('[UsageHistorySection] 2회 이상 예약한 항목:', frequent);
        
        // ===== 더미 데이터 (화면 확인용) =====
        // TODO: 백엔드 API 연결 후 제거
        if (frequent.length === 0) {
          frequent.push({
            programName: '필라테스',
            branchName: '강남점',
            trainerName: '김강사',
            count: 3,
            image: '/images/pilates.png',
            price: '-'
          });
        }
        // ===== 더미 데이터 끝 =====
        
        setFrequentReservations(frequent);
      } catch (error) {
        console.error('[UsageHistorySection] 2회 이상 예약한 항목 조회 실패:', error);
        
        // ===== 더미 데이터 (에러 시 화면 확인용) =====
        // TODO: 백엔드 API 연결 후 제거
        setFrequentReservations([{
          programName: '필라테스',
          branchName: '강남점',
          trainerName: '김강사',
          count: 3,
          image: '/images/pilates.png',
          price: '-'
        }]);
        // ===== 더미 데이터 끝 =====
      } finally {
        setFrequentReservationsLoading(false);
      }
    };

    fetchFrequentReservations();
  }, [refreshKey, onRefresh]);

  // 상태별 카운트 계산
  const completedCount = usageHistoryData.length; // 이용완료: 전체 이용내역 개수
  const reviewWrittenCount = usageHistoryData.filter(history => history.reviewWritten === true).length; // 리뷰작성: 리뷰 작성 완료된 항목 개수

  return (
    <>
      <section className="mypage-content-section">
        <h2 className="content-title">이용내역</h2>

        {/* 상태별 카운트 섹션 */}
        <section className="reservation-status-section">
          <div className="status-count-box">
            <div className="status-count-label">이용완료</div>
            <div className="status-count-number">{completedCount}</div>
          </div>
          <div className="status-count-separator">|</div>
          <div className="status-count-box">
            <div className="status-count-label">리뷰작성</div>
            <div className="status-count-number">{reviewWrittenCount}</div>
          </div>
        </section>

        {/* 2회 이상 예약한 항목 섹션 */}
        {frequentReservations.length > 0 && (
          <>
            <div className="reservation-summary" style={{ marginTop: '2rem' }}>자주 이용하는 프로그램</div>
            {frequentReservationsLoading ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <p>로딩 중...</p>
              </div>
            ) : (
              <div className="reservation-table-container" style={{ marginBottom: '2rem' }}>
                <table className="reservation-table">
                  <thead>
                    <tr>
                      <th></th>
                      <th>지점명</th>
                      <th>프로그램명</th>
                      <th>강사명</th>
                      <th>가격</th>
                    </tr>
                  </thead>
                  <tbody>
                    {frequentReservations.map((item, index) => (
                      <tr key={index}>
                        <td>
                          {item.image && (
                            <img 
                              src={item.image} 
                              alt={item.programName} 
                              style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px' }}
                            />
                          )}
                        </td>
                        <td>{item.branchName}</td>
                        <td>{item.programName}</td>
                        <td>{item.trainerName || '-'}</td>
                        <td>{item.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        <div className="reservation-summary">
          이용내역 총 {usageHistoryData.length}건
        </div>

        {usageHistoryLoading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>로딩 중...</p>
          </div>
        ) : (
          <div className="reservation-table-container">
            <table className="reservation-table">
              <thead>
                <tr>
                  <th>이용날짜</th>
                  <th>지점명</th>
                  <th>프로그램명</th>
                  <th>강사이름</th>
                </tr>
              </thead>
              <tbody>
                {usageHistoryData.length > 0 ? (
                  [...usageHistoryData]
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .map((history) => (
                      <tr key={history.id || history.historyId}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            {history.image && (
                              <img 
                                src={history.image} 
                                alt={history.programName} 
                                style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px' }}
                              />
                            )}
                            <div>
                              {history.date}
                              {history.time && <div className="text-muted" style={{ fontSize: '0.875rem' }}>{history.time}</div>}
                            </div>
                          </div>
                        </td>
                        <td>{history.branchName}</td>
                        <td>{history.programName}</td>
                        <td>{history.trainerName || '-'}</td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">이용내역이 없습니다.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}

export default UsageHistorySection;