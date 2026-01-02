import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
// import axios from 'axios';
import SideBar from "./SideBar";
import '../../components/auth/modalStyles.css';
import '../MyPage/MyPage.css';
import api from '../../api';

/* =========================
   API 함수들
========================= */
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

// 마감임박 수업 목록 조회
const getClosingSoonSchedules = async (date = null, branchId = null) => {
  try {
    const params = {};
    if (date) params.date = date;
    if (branchId) params.branchId = branchId;
    
    const response = await api.get('/schedules/closingSoon', { params });
    
    // 백엔드 응답 구조: { resultCode, message, data }
    if (response.data.resultCode === 'SUCCESS' && response.data.data) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || '마감임박 수업 조회 실패');
    }
  } catch (error) {
    console.error('마감임박 수업 조회 실패:', error);
    throw error;
  }
};

// 예약 취소
const cancelReservation = async (reservationId, cancelReason = null) => {
  try {
    const params = {};
    if (cancelReason) params.cancelReason = cancelReason;
    
    const response = await api.delete(`/reservations/${reservationId}`, { params });
    
    // 백엔드 응답 구조: { resultCode, message, data }
    if (response.data.resultCode === 'SUCCESS') {
      return response.data;
    } else {
      throw new Error(response.data.message || '예약 취소 실패');
    }
  } catch (error) {
    console.error('예약 취소 실패:', error);
    throw error;
  }
};

// 이용권 목록 조회
const getUserPasses = async (userId) => {
  try {
    if (!userId) throw new Error('userId가 없습니다.');

    const response = await api.post(
      '/userpasses/my',
      {
        userId: Number(userId)
      }
    );

    // 백엔드 응답 구조: UserPassResponseDto 배열
    if (Array.isArray(response.data)) {
      return response.data;
    } else {
      throw new Error('이용권 목록 조회 실패');
    }
  } catch (error) {
    console.error('이용권 목록 조회 실패:', error);
    throw error;
  }
};

function MyReservationList() {
  const [reservations, setReservations] = useState([]);
  const [urgentClasses, setUrgentClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [urgentClassesLoading, setUrgentClassesLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [totalPassCount, setTotalPassCount] = useState(0); // 이용권 총 횟수
  
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

  // 예약 목록 가져오기
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setLoading(true);
        const userId = localStorage.getItem('userId')
        const data = await getMyReservations();
        console.log('[MyReservationList] API 응답 데이터:', data);
        
        // 백엔드 데이터를 화면에 맞게 변환
        // 백엔드 응답 필드: reservationId, sportName, brchNm, trainerName, rsvDt, rsvTime
        const transformedReservations = (data || []).map((reservation) => {
          // 날짜 변환: LocalDate는 "YYYY-MM-DD" 형식의 문자열로 옴
          let dateStr = '';
          if (reservation.rsvDt) {
            if (typeof reservation.rsvDt === 'string') {
              dateStr = reservation.rsvDt.split('T')[0]; // "YYYY-MM-DD" 형식 유지
            } else {
              dateStr = reservation.rsvDt;
            }
          }
          
          // 시간 변환: LocalTime은 "HH:mm:ss" 또는 "HH:mm" 형식의 문자열로 옴
          let timeStr = '';
          if (reservation.rsvTime) {
            if (typeof reservation.rsvTime === 'string') {
              timeStr = reservation.rsvTime.substring(0, 5); // "HH:mm" 형식으로 변환
            } else {
              timeStr = String(reservation.rsvTime).substring(0, 5);
            }
          }
          
          return {
            id: reservation.reservationId,
            reservationId: reservation.reservationId,
            date: dateStr,
            time: timeStr,
            productName: reservation.sportName || '프로그램',
            option: reservation.trainerName ? '개인 레슨' : '그룹 레슨',
            status: '예약완료', // 기본값
            branchName: reservation.brchNm || '지점',
            trainerName: reservation.trainerName || ''
          };
        });
        
        console.log('[MyReservationList] 변환된 예약 데이터:', transformedReservations);
      
        
        setReservations(transformedReservations);
      } catch (error) {
        console.error('[MyReservationList] 예약 목록 조회 실패:', error);
        console.error('[MyReservationList] 에러 상세:', error.response?.data || error.message);
        
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [refreshKey]);

  // 마감임박 수업 목록 가져오기
  useEffect(() => {
    const fetchClosingSoonSchedules = async () => {
      try {
        setUrgentClassesLoading(true);
        const userId = localStorage.getItem('userId')
        const data = await getClosingSoonSchedules();
        console.log('[MyReservationList] 마감임박 수업 API 응답 데이터:', data);
        
        // 백엔드 데이터를 화면에 맞게 변환
        // 백엔드 응답 필드: scheduleId, brchNm, sportName, trainerName, maxCapacity, reservedCount, remainingSeats, endDt, endTm
        const transformedClasses = (data || []).map((schedule) => {
          // 날짜 변환
          let dateStr = '';
          if (schedule.endDt) {
            if (typeof schedule.endDt === 'string') {
              dateStr = schedule.endDt.split('T')[0];
            } else {
              dateStr = schedule.endDt;
            }
          }
          
          // 시간 변환
          let timeStr = '';
          if (schedule.endTm) {
            if (typeof schedule.endTm === 'string') {
              timeStr = schedule.endTm.substring(0, 5);
            } else {
              timeStr = String(schedule.endTm).substring(0, 5);
            }
          }
          
          // 운동 종목명에 따라 레슨 타입 결정
          const lessonType = schedule.trainerName ? '개인레슨' : '그룹레슨';
          const fullName = `${schedule.sportName || '프로그램'} ${lessonType}`;
          
          return {
            id: schedule.scheduleId,
            scheduleId: schedule.scheduleId,
            name: fullName,
            branch: schedule.brchNm || '지점',
            image: getSportImage(schedule.sportName),
            rating: 5, // 기본값 (백엔드에 평점 정보가 없음)
            date: dateStr,
            time: timeStr,
            maxCapacity: schedule.maxCapacity,
            reservedCount: schedule.reservedCount,
            remainingSeats: schedule.remainingSeats,
            trainerName: schedule.trainerName
          };
        });
        
        console.log('[MyReservationList] 변환된 마감임박 수업 데이터:', transformedClasses);
        
        setUrgentClasses(transformedClasses);
      } catch (error) {
        console.error('[MyReservationList] 마감임박 수업 조회 실패:', error);
        console.error('[MyReservationList] 에러 상세:', error.response?.data || error.message);
        
      } finally {
        setUrgentClassesLoading(false);
      }
    };

    fetchClosingSoonSchedules();
  }, []);

  // 이용권 목록 가져오기
  useEffect(() => {
    const fetchUserPasses = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          console.log('[MyReservationList] userId가 없어 이용권 조회를 건너뜁니다.');
          // 더미데이터 설정
          setTotalPassCount(10); // 결제 API 미구현 상태를 고려한 더미값
          return;
        }

        const userPasses = await getUserPasses(userId);
        console.log('[MyReservationList] 이용권 API 응답 데이터:', userPasses);
        
        // 이용권 총 횟수 계산 (initCnt 합계)
        const totalCount = userPasses.reduce((sum, userPass) => {
          return sum + (userPass.initCnt || 0);
        }, 0);
        
        console.log('[MyReservationList] 이용권 총 횟수:', totalCount);
        setTotalPassCount(totalCount);
      } catch (error) {
        console.error('[MyReservationList] 이용권 목록 조회 실패:', error);
        // 에러 시 더미데이터 설정 (결제 API 미구현 상태 고려)
        setTotalPassCount(10);
      }
    };

    fetchUserPasses();
  }, [refreshKey]);

  // 상태별 카운트 계산
  const paymentCount = totalPassCount; // 이용권 결제: 이용권 총 횟수 (initCnt 합계)
  const reservationCount = reservations.length; // 예약현황: 예약 목록 API에서 count
  const remainingCount = Math.max(0, totalPassCount - reservations.length); // 남은 횟수: 이용권 총 횟수 - 예약현황
  
  if (loading) {
    return (
      <div className="mypage-container">
        <SideBar />
        <main className="mypage-main">
          <section className="mypage-content-section">
            <h2 className="content-title">예약목록</h2>
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <p>로딩 중...</p>
            </div>
          </section>
        </main>
      </div>
    );
  }


  // 핫 pick 수업 예약하기 데이터
  // const hotPickClasses = [
  //   {
  //     id: 1,
  //     name: '필라테스 그룹레슨',
  //     branch: '강남점',
  //     image: '/images/pilates.png',
  //     rating: 5,
  //     date: '2024-02-15',
  //     time: '10:00'
  //   },
  //   {
  //     id: 2,
  //     name: '요가 명상',
  //     branch: '홍대점',
  //     image: '/images/yoga.png',
  //     rating: 5,
  //     date: '2024-02-15',
  //     time: '14:00'
  //   },
  //   {
  //     id: 3,
  //     name: '헬스 웨이트',
  //     branch: '잠실점',
  //     image: '/images/pt.png',
  //     rating: 4,
  //     date: '2024-02-16',
  //     time: '16:00'
  //   },
  //   {
  //     id: 4,
  //     name: '크로스핏 클래스',
  //     branch: '신촌점',
  //     image: '/images/crossfit.png',
  //     rating: 5,
  //     date: '2024-02-16',
  //     time: '18:00'
  //   }
  // ];

  // 예약 취소 핸들러
  const handleCancelReservation = async (reservationId) => {
    if (!window.confirm('정말 예약을 취소하시겠습니까?')) {
      return;
    }

    try {
      await cancelReservation(reservationId);
      alert('예약이 취소되었습니다.');
      // 목록 새로고침
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || '예약 취소에 실패했습니다.';
      alert(errorMessage);
      console.error('[MyReservationList] 예약 취소 실패:', error);
    }
  };

  return (
    <>
      <Helmet>
        <title>FITNEEDS - 예약목록</title>
        <meta name="description" content="FITNEEDS - 예약목록" />
      </Helmet>

      <div className="mypage-container">
        <SideBar />

        <main className="mypage-main">
          {/* 예약 목록 테이블 */}
          <section className="mypage-content-section">
            <h2 className="content-title">예약목록</h2>
            
            {/* 상태별 카운트 섹션 */}
            <section className="reservation-status-section">
              <div className="status-count-box">
                <div className="status-count-label">이용권 결제</div>
                <div className="status-count-number">{paymentCount}</div>
              </div>
              <div className="status-count-separator">|</div>
              <div className="status-count-box">
                <div className="status-count-label">예약현황</div>
                <div className="status-count-number">{reservationCount}</div>
              </div>
              <div className="status-count-separator">|</div>
              <div className="status-count-box">
                <div className="status-count-label">남은 횟수</div>
                <div className="status-count-number">{remainingCount}</div>
              </div>
            </section>

            <div className="reservation-summary">
              예약목록 총 {reservations.length}건
            </div>

            <div className="reservation-table-container">
              <table className="reservation-table">
                <thead>
                  <tr>
                    <th>예약날짜시간</th>
                    <th>지점명</th>
                    <th>프로그램명</th>
                    <th>강사명</th>
                    <th>취소</th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.length > 0 ? (
                    [...reservations]
                      .sort((a, b) => new Date(b.date) - new Date(a.date))
                      .map((reservation) => (
                        <tr key={reservation.id}>
                          <td>
                            {reservation.date}
                            {reservation.time && <div className="text-muted" style={{ fontSize: '0.875rem' }}>{reservation.time}</div>}
                          </td>
                          <td>{reservation.branchName || '-'}</td>
                          <td>{reservation.productName || '-'}</td>
                          <td>{reservation.trainerName || '-'}</td>
                          <td>
                            <button 
                              className="btn-action"
                              onClick={() => handleCancelReservation(reservation.reservationId || reservation.id)}
                              style={{ backgroundColor: '#dc3545', color: 'white' }}
                            >
                              취소
                            </button>
                          </td>
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center">예약 내역이 없습니다.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* 마감임박 수업 예약하기 */}
          <section className="mypage-content-section">
            <h2 className="content-title">마감임박 수업 예약하기</h2>
            {urgentClassesLoading ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <p>로딩 중...</p>
              </div>
            ) : urgentClasses.length > 0 ? (
              <div className="class-cards-container">
                {urgentClasses.map((classItem) => (
                  <div key={classItem.id || classItem.scheduleId} className="class-card">
                    <div className="class-card-image">
                      <img src={classItem.image} alt={classItem.name} />
                      <div className="class-card-rating">
                        <span className="rating-stars">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span key={star} style={{ color: star <= classItem.rating ? '#FFC107' : '#ddd' }}>
                              ★
                            </span>
                          ))}
                        </span>
                      </div>
                    </div>
                    <div className="class-card-info">
                      <h3 className="class-card-name">{classItem.name}</h3>
                      <div style={{ fontSize: '1.125rem', color: '#6c757d', marginBottom: '0.5rem' }}>{classItem.branch}</div>
                      <div style={{ fontSize: '1.125rem', color: '#6c757d', marginBottom: '0.5rem' }}>
                        {classItem.date} {classItem.time}
                      </div>
                      {classItem.remainingSeats !== undefined && (
                        <div style={{ fontSize: '0.875rem', color: '#dc3545', marginBottom: '1rem' }}>
                          남은 자리: {classItem.remainingSeats}석
                        </div>
                      )}
                      <button className="btn-submit">예약하기</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <p>마감임박 수업이 없습니다.</p>
              </div>
            )}
          </section>

          {/* 핫 pick 수업 예약하기
          <section className="mypage-content-section">
            <h2 className="content-title">핫 pick 수업 예약하기</h2>
            <div className="class-cards-container">
              {hotPickClasses.map((classItem) => (
                <div key={classItem.id} className="class-card">
                  <div className="class-card-image">
                    <img src={classItem.image} alt={classItem.name} />
                    <div className="class-card-rating">
                      <span className="rating-stars">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span key={star} style={{ color: star <= classItem.rating ? '#FFC107' : '#ddd' }}>
                            ★
                          </span>
                        ))}
                      </span>
                    </div>
                  </div>
                  <div className="class-card-info">
                    <h3 className="class-card-name">{classItem.name}</h3>
                    <div style={{ fontSize: '1.125rem', color: '#6c757d', marginBottom: '0.5rem' }}>{classItem.branch}</div>
                    <div style={{ fontSize: '1.125rem', color: '#6c757d', marginBottom: '1rem' }}>{classItem.date} {classItem.time}</div>
                    <button className="btn-submit">예약하기</button>
                  </div>
                </div>
              ))}
            </div>
          </section> */}
        </main>
      </div>
    </>
  );
}

export default MyReservationList;

