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
            {frequentReservationsLoading ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <p>로딩 중...</p>
              </div>
            ) : (
              <div style={{ marginTop: '2rem', marginBottom: '2rem' }}>
                {frequentReservations.map((item, index) => (
                  <div key={index} style={{ marginBottom: '1rem' }}>
                    {/* 텍스트 (카드 위) */}
                    <div style={{ 
                      fontSize: '1.5625rem', 
                      color: '#6c757d',
                      marginBottom: '0.5rem'
                    }}>
                      자주 이용하는 프로그램 {item.count}
                    </div>
                    
                    {/* 카드 */}
                    <div style={{
                      backgroundColor: '#fff',
                      border: '1px solid #e9ecef',
                      borderRadius: '12px',
                      padding: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem'
                    }}>
                      {/* 이미지 */}
                      <div style={{ position: 'relative', flexShrink: 0 }}>
                        <div style={{
                          width: '80px',
                          height: '80px',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          backgroundColor: '#f8f9fa'
                        }}>
                          {item.image && (
                            <img 
                              src={item.image} 
                              alt={item.programName}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          )}
                        </div>
                        {/* 카운트 배지 */}
                        <div style={{
                          position: 'absolute',
                          bottom: '4px',
                          right: '4px',
                          backgroundColor: 'rgba(0, 0, 0, 0.6)',
                          color: '#fff',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          padding: '2px 6px',
                          borderRadius: '4px'
                        }}>
                          x{item.count}
                        </div>
                      </div>
                      <div style={{ marginLeft: 'auto' }}>
                        <div style={{ fontSize: '0.875rem', color: '#6c757d' }}>
                          전체보기 &gt;
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
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
          <div className="usage-history-list">
            {usageHistoryData.length > 0 ? (
              (() => {
                // 날짜별로 그룹화
                const groupedByDate = {};
                [...usageHistoryData]
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .forEach((history) => {
                    const dateKey = history.date;
                    if (!groupedByDate[dateKey]) {
                      groupedByDate[dateKey] = [];
                    }
                    groupedByDate[dateKey].push(history);
                  });

                // 날짜 포맷 변환 함수
                const formatDate = (dateStr) => {
                  const parts = dateStr.split('-');
                  if (parts.length === 3) {
                    return `${parts[0]}. ${parseInt(parts[1])}. ${parseInt(parts[2])}`;
                  }
                  return dateStr.replace(/-/g, '. ');
                };

                return Object.entries(groupedByDate).map(([date, histories]) => (
                  <div key={date} style={{ marginBottom: '2rem' }}>
                    {/* 날짜 헤더 */}
                    <div style={{ 
                      fontSize: '1.25rem', 
                      fontWeight: '700', 
                      color: '#212529',
                      marginBottom: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      {formatDate(date)}
                      <span style={{ fontSize: '1rem', color: '#6c757d' }}>&gt;</span>
                    </div>

                    {/* 해당 날짜의 이용내역 목록 */}
                    {histories.map((history) => (
                      <div key={history.id || history.historyId} style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '1rem',
                        padding: '1rem 0',
                        borderBottom: '1px solid #e9ecef'
                      }}>
                        {/* 이미지 영역 */}
                        <div style={{ 
                          flexShrink: 0
                        }}>
                          {/* 이미지 */}
                          <div style={{ 
                            width: '120px', 
                            height: '120px', 
                            borderRadius: '8px',
                            overflow: 'hidden',
                            backgroundColor: '#f8f9fa'
                          }}>
                            {history.image && (
                              <img 
                                src={history.image} 
                                alt={history.programName}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              />
                            )}
                          </div>
                        </div>

                        {/* 정보 영역 */}
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem', paddingTop: '1.5rem' }}>
                          {/* 지점명 */}
                          <div style={{ 
                            fontSize: '1.125rem', 
                            color: '#212529',
                            fontWeight: '500',
                            marginBottom: '0.25rem'
                          }}>
                            {history.branchName}
                          </div>
                          
                          {/* 프로그램명 | 강사명 */}
                          <div style={{ 
                            fontSize: '1rem', 
                            color: '#6c757d',
                            lineHeight: '1.5'
                          }}>
                            {history.programName} | {history.trainerName || '-'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ));
              })()
            ) : (
              <div className="text-center" style={{ padding: '3rem', color: '#6c757d' }}>
                이용내역이 없습니다.
              </div>
            )}
          </div>
        )}
      </section>
    </>
  );
}

export default UsageHistorySection;