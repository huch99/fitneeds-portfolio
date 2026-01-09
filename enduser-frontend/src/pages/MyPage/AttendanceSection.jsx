import React, { useState, useEffect } from 'react';
import api from '../../api';

// 예약 목록 조회 API
const getMyReservations = async () => {
  try {
    const response = await api.get('/reservations/myReservations');
    
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

function AttendanceSection() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());

  // 현재 월의 첫 날과 마지막 날
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  // 예약 목록 가져오기
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setLoading(true);
        const data = await getMyReservations();
        
        // 백엔드 데이터를 화면에 맞게 변환
        const transformedReservations = (data || []).map((reservation) => {
          let dateStr = '';
          if (reservation.rsvDt) {
            if (typeof reservation.rsvDt === 'string') {
              dateStr = reservation.rsvDt.split('T')[0];
            } else {
              dateStr = reservation.rsvDt;
            }
          }
          
          let timeStr = '';
          if (reservation.rsvTime) {
            if (typeof reservation.rsvTime === 'string') {
              timeStr = reservation.rsvTime.substring(0, 5);
            } else {
              timeStr = String(reservation.rsvTime).substring(0, 5);
            }
          }
          
          return {
            id: reservation.reservationId,
            reservationId: reservation.reservationId,
            date: dateStr,
            time: timeStr,
            sportName: reservation.sportName || '프로그램',
            branchName: reservation.brchNm || '지점',
            trainerName: reservation.trainerName || '',
            // 출석 정보는 백엔드에 필드가 없으므로 일단 null로 설정
            // 나중에 백엔드에 attendance 필드가 추가되면 reservation.attendance로 변경
            attendance: reservation.attendance || null // true: 출석, false: 미출석, null: 미확정
          };
        });
        
        setReservations(transformedReservations);
      } catch (error) {
        console.error('예약 목록 조회 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  // 특정 날짜의 예약 목록 가져오기
  const getReservationsByDate = (dateStr) => {
    return reservations.filter(reservation => reservation.date === dateStr);
  };

  // 날짜 포맷팅 (YYYY-MM-DD)
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 이전 달로 이동
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  // 다음 달로 이동
  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // 달력 날짜 렌더링
  const renderCalendarDays = () => {
    const days = [];
    
    // 빈 칸 (첫 주의 시작일 이전)
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(
        <div key={`empty-${i}`} className="calendar-day empty"></div>
      );
    }
    
    // 실제 날짜들
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = formatDate(new Date(year, month, day));
      const dayReservations = getReservationsByDate(dateStr);
      const hasReservations = dayReservations.length > 0;
      const isToday = dateStr === formatDate(new Date());
      
      // 출석 상태 확인 (해당 날짜의 예약 중 하나라도 출석 정보가 있으면 표시)
      let attendanceStatus = null;
      if (hasReservations) {
        const attendedReservations = dayReservations.filter(r => r.attendance === true);
        const absentReservations = dayReservations.filter(r => r.attendance === false);
        
        if (attendedReservations.length > 0) {
          attendanceStatus = 'attended';
        } else if (absentReservations.length > 0) {
          attendanceStatus = 'absent';
        }
      }
      
      days.push(
        <div
          key={day}
          className={`calendar-day ${hasReservations ? 'has-reservation' : ''} ${isToday ? 'today' : ''}`}
        >
          <div className="calendar-day-number">{day}</div>
          {hasReservations && (
            <>
              <div className="calendar-day-indicator">
                {attendanceStatus === 'attended' && (
                  <div className="attendance-check attended">✓</div>
                )}
                {attendanceStatus === 'absent' && (
                  <div className="attendance-check absent">✗</div>
                )}
                {attendanceStatus === null && (
                  <div className="attendance-dot"></div>
                )}
              </div>
              <div className="calendar-day-reservations">
                {dayReservations.slice(0, 3).map((reservation) => (
                  <div key={reservation.id} className="calendar-reservation-item">
                    <span className="calendar-reservation-time">{reservation.time}</span>
                    <span className="calendar-reservation-title">
                      {reservation.sportName}
                      {reservation.trainerName ? ` · ${reservation.trainerName}` : ''}
                    </span>
                    {reservation.attendance === true && (
                      <span className="calendar-reservation-status attended">✓</span>
                    )}
                    {reservation.attendance === false && (
                      <span className="calendar-reservation-status absent">✗</span>
                    )}
                    {reservation.attendance === null && (
                      <span className="calendar-reservation-status pending">·</span>
                    )}
                  </div>
                ))}
                {dayReservations.length > 3 && (
                  <div className="calendar-reservation-more">+{dayReservations.length - 3}건 더보기</div>
                )}
              </div>
            </>
          )}
        </div>
      );
    }
    
    return days;
  };

  if (loading) {
    return (
      <section className="mypage-content-section attendance-section">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>로딩 중...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mypage-content-section attendance-section">
      <h2 className="content-title">출석현황</h2>
      
      {/* 달력 헤더 */}
      <div className="calendar-header">
        <button className="calendar-nav-button" onClick={handlePrevMonth}>
          ‹
        </button>
        <h3 className="calendar-month-title">
          {year}년 {month + 1}월
        </h3>
        <button className="calendar-nav-button" onClick={handleNextMonth}>
          ›
        </button>
      </div>

      {/* 달력 */}
      <div className="calendar-container">
        <div className="calendar-weekdays">
          <div className="calendar-weekday">일</div>
          <div className="calendar-weekday">월</div>
          <div className="calendar-weekday">화</div>
          <div className="calendar-weekday">수</div>
          <div className="calendar-weekday">목</div>
          <div className="calendar-weekday">금</div>
          <div className="calendar-weekday">토</div>
        </div>
        <div className="calendar-days">
          {renderCalendarDays()}
        </div>
      </div>

      {/* 출석 상태 범례 */}
      <div className="attendance-legend">
        <div className="legend-item">
          <div className="attendance-check attended">✓</div>
          <span>출석</span>
        </div>
        <div className="legend-item">
          <div className="attendance-check absent">✗</div>
          <span>미출석</span>
        </div>
        <div className="legend-item">
          <div className="attendance-dot"></div>
          <span>미확정</span>
        </div>
      </div>

    </section>
  );
}

export default AttendanceSection;

