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
const getMyReservations = async (userId) => {
  try {
    const token = localStorage.getItem('accessToken');
    const response = await api.get('/reservation/my', {
      params: { userId: userId },
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('예약 목록 조회 실패:', error);
    throw error;
  }
};

// 예약일자 변경
const updateReservationDate = async (reservationId, reservedDate, reservedTime = null, userId) => {
  try {
    const token = localStorage.getItem('accessToken');
    const requestBody = {
      reservedDate: reservedDate,
      ...(reservedTime && { reservedTime: reservedTime })
    };
    const response = await axios.patch(
      `/api/reservation/${reservationId}/date`,
      requestBody,
      {
        params: { userId: userId },
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('예약일자 변경 실패:', error);
    throw error;
  }
};

function MyReservationList() {
  const loginUserId = localStorage.getItem('userId');
  const [isReservationEditModalOpen, setIsReservationEditModalOpen] = useState(false);
  const [selectedReservationId, setSelectedReservationId] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  // 예약 목록 가져오기
  useEffect(() => {
    const fetchReservations = async () => {
      if (!loginUserId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getMyReservations(loginUserId);
        
        // 백엔드 데이터를 화면에 맞게 변환
        const transformedReservations = data.map((reservation) => ({
          id: reservation.reservationId,
          reservationId: reservation.reservationId,
          date: reservation.reservedDate 
            ? new Date(reservation.reservedDate).toISOString().split('T')[0] 
            : (reservation.exerciseDate ? new Date(reservation.exerciseDate).toISOString().split('T')[0] : ''),
          time: reservation.reservedTime 
            ? reservation.reservedTime 
            : (reservation.exerciseDate ? new Date(reservation.exerciseDate).toTimeString().split(' ')[0].substring(0, 5) : ''),
          productName: reservation.programName || reservation.exerciseName || '프로그램',
          option: reservation.trainerName ? '개인 레슨' : '그룹 레슨',
          price: reservation.paymentAmount ? Number(reservation.paymentAmount) : 0,
          status: reservation.paymentStatus === 'BANK_TRANSFER_COMPLETED' ? '예약완료' : '결제대기',
          programId: reservation.programId,
          branchName: reservation.branchName || reservation.exerciseLocation || '지점'
        }));
        
        setReservations(transformedReservations);
      } catch (error) {
        console.error('예약 목록 조회 실패:', error);
        setReservations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [refreshKey, loginUserId]);

  // 상태별 카운트 계산
  const paymentCompletedCount = reservations.filter(r => r.status === '결제완료' || r.status === '예약완료').length;
  const reservationCompletedCount = reservations.filter(r => r.status === '예약완료').length;
  const cancelledRefundedCount = reservations.filter(r => r.status === '취소완료' || r.status === '환불완료').length;
  
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

  // 마감임박 수업 예약하기 데이터
  const urgentClasses = [
    {
      id: 1,
      name: '필라테스 개인레슨',
      branch: '강남점',
      image: '/images/pilates.png',
      rating: 5,
      date: '2024-02-10',
      time: '10:00'
    },
    {
      id: 2,
      name: '요가 그룹레슨',
      branch: '홍대점',
      image: '/images/yoga.png',
      rating: 4,
      date: '2024-02-10',
      time: '14:00'
    },
    {
      id: 3,
      name: '헬스 PT',
      branch: '잠실점',
      image: '/images/pt.png',
      rating: 5,
      date: '2024-02-11',
      time: '16:00'
    },
    {
      id: 4,
      name: '크로스핏 클래스',
      branch: '신촌점',
      image: '/images/crossfit.png',
      rating: 4,
      date: '2024-02-11',
      time: '18:00'
    }
  ];

  // 핫 pick 수업 예약하기 데이터
  const hotPickClasses = [
    {
      id: 1,
      name: '필라테스 그룹레슨',
      branch: '강남점',
      image: '/images/pilates.png',
      rating: 5,
      date: '2024-02-15',
      time: '10:00'
    },
    {
      id: 2,
      name: '요가 명상',
      branch: '홍대점',
      image: '/images/yoga.png',
      rating: 5,
      date: '2024-02-15',
      time: '14:00'
    },
    {
      id: 3,
      name: '헬스 웨이트',
      branch: '잠실점',
      image: '/images/pt.png',
      rating: 4,
      date: '2024-02-16',
      time: '16:00'
    },
    {
      id: 4,
      name: '크로스핏 클래스',
      branch: '신촌점',
      image: '/images/crossfit.png',
      rating: 5,
      date: '2024-02-16',
      time: '18:00'
    }
  ];

  // 예약 수정 모달 열기
  const handleEditReservation = (reservationId) => {
    setSelectedReservationId(reservationId);
    setIsReservationEditModalOpen(true);
  };

  // 예약 수정 모달 닫기
  const handleCloseEditModal = () => {
    setIsReservationEditModalOpen(false);
    setSelectedReservationId(null);
  };

  // 예약일자 변경 후 새로고침
  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  // 예약 수정 모달 컴포넌트
  const ReservationEditModal = ({ isOpen, onClose, reservationId, reservations, onRefresh }) => {
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const reservation = reservations.find(r => r.id === reservationId || r.reservationId === reservationId);
    
    // 모달이 열릴 때 초기값 설정
    useEffect(() => {
      if (isOpen && reservation) {
        setSelectedDate(reservation.date || '');
        setSelectedTime(reservation.time || '');
      }
    }, [isOpen, reservation]);

    if (!isOpen || !reservation) return null;

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!selectedDate) {
        alert('예약일자를 선택해주세요.');
        return;
      }

      if (!reservation) {
        alert('예약 정보를 찾을 수 없습니다.');
        return;
      }

      setIsSubmitting(true);
      try {
        // 예약일자 변경 API 호출
        await updateReservationDate(
          reservation.reservationId || reservation.id,
          selectedDate,
          selectedTime || null,
          loginUserId
        );
        alert('예약일자가 변경되었습니다.');
        onClose();
        handleRefresh(); // 목록 새로고침
      } catch (error) {
        alert('예약일자 변경에 실패했습니다.');
        console.error(error);
      } finally {
        setIsSubmitting(false);
      }
    };

    // 오늘부터 30일 후까지의 날짜 생성
    const getAvailableDates = () => {
      const dates = [];
      const today = new Date();
      for (let i = 0; i < 30; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() + i);
        dates.push(date);
      }
      return dates;
    };

    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content reservation-edit-modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>예약변경하기</h2>
            <button className="modal-close-button" onClick={onClose}>×</button>
          </div>
          <div className="modal-body">
            {reservation && (
              <div style={{ marginBottom: '1.5rem' }}>
                <p style={{ marginBottom: '0.5rem' }}><strong>상품명:</strong> {reservation.productName}</p>
                <p style={{ marginBottom: '0.5rem' }}><strong>옵션:</strong> {reservation.option}</p>
                <p><strong>현재 예약일:</strong> {reservation.date}</p>
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="reservation-date">새 예약일 선택</label>
                <input
                  type="date"
                  id="reservation-date"
                  className="form-control"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="reservation-time">새 예약시간 선택 (선택사항)</label>
                <input
                  type="time"
                  id="reservation-time"
                  className="form-control"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={onClose} disabled={isSubmitting}>
                  취소
                </button>
                <button type="submit" className="btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? '변경 중...' : '수정하기'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
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
                <div className="status-count-label">취소/환불</div>
                <div className="status-count-number">{cancelledRefundedCount}</div>
              </div>
            </section>

            <div className="reservation-summary">
              예약목록 총 {reservations.length}건
            </div>

            <div className="reservation-table-container">
              <table className="reservation-table">
                <thead>
                  <tr>
                    <th>날짜</th>
                    <th>상품명/옵션</th>
                    <th>상품금액</th>
                    <th>예약변경하기</th>
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
                          <td>
                            <div>{reservation.productName}</div>
                            <div className="text-muted">{reservation.option}</div>
                          </td>
                          <td>{reservation.price > 0 ? reservation.price.toLocaleString() + '원' : '-'}</td>
                          <td>
                            <button 
                              className="btn-action"
                              onClick={() => handleEditReservation(reservation.reservationId || reservation.id)}
                            >
                              예약변경
                            </button>
                          </td>
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center">예약 내역이 없습니다.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* 마감임박 수업 예약하기 */}
          <section className="mypage-content-section">
            <h2 className="content-title">마감임박 수업 예약하기</h2>
            <div className="class-cards-container">
              {urgentClasses.map((classItem) => (
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
          </section>

          {/* 핫 pick 수업 예약하기 */}
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
          </section>
        </main>
      </div>

          {/* 예약 수정 모달 */}
          {isReservationEditModalOpen && (
            <ReservationEditModal
              isOpen={isReservationEditModalOpen}
              onClose={handleCloseEditModal}
              reservationId={selectedReservationId}
              reservations={reservations}
              onRefresh={handleRefresh}
            />
          )}
    </>
  );
}

export default MyReservationList;

