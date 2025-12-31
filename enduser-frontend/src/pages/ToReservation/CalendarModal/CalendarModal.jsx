import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './CalendarModal.css';
import api from '../../../api';

const CalendarModal = ({ sportId, isOpen, onClose, strtDt, endDt, onSelectDate, selectedDate, onProceedToPayment }) => {
    if (!isOpen) return null;

    // 캘린더에 표시될 날짜 (prop selectedDate와 별개로, 캘린더 내부 상태)
    const [calendarValue, setCalendarValue] = useState(selectedDate || new Date());
    // 백엔드에서 가져온 활성화 날짜들을 저장할 Set
    const [allScheduledDates, setAllScheduledDates] = useState(new Set());
    const [loadingCalendarData, setLoadingCalendarData] = useState(false); // 캘린더 데이터 로딩 상태
    const [errorCalendarData, setErrorCalendarData] = useState(null);       // 캘린더 데이터 에러 상태

    const minDate = strtDt ? new Date(strtDt + 'T00:00:00') : null;
    const maxDate = endDt ? new Date(endDt + 'T00:00:00') : null;

    const fetchAllScheduledDates = async (currentPage = 0, fetchedDates = new Set()) => {
        try {
            let response;

            if (sportId) {
                response = await api.get(`/schedules/getSchedulesBySportIdForR/${sportId}`, {
                    params: {
                        page: currentPage,
                        size: 10,
                    }
                });
            } else {
                setErrorCalendarData('캘린더 데이터를 불러올 ID가 부족합니다.');
                setLoadingCalendarData(false);
                return fetchedDates;
            }

            response.data.content.forEach(group => {
                if (group.scheduledDates) {
                    group.scheduledDates.forEach(dateStr => {
                        // "YYYY-MM-DD" 문자열 형태로 저장
                        fetchedDates.add(dateStr);
                    });
                }
            });

            // 다음 페이지가 있고, 모든 데이터를 가져오지 않았다면 재귀 호출
            if (!response.data.last) {
                return await fetchAllScheduledDates(currentPage + 1, fetchedDates);
            }

            return fetchedDates;
        } catch (err) {
            setErrorCalendarData('캘린더 스케줄 데이터를 불러오는 데 실패했습니다.');
            console.error('Error fetching calendar schedule data:', err);
            return fetchedDates; // 에러 발생 시에도 현재까지 가져온 데이터 반환
        }
    }

    useEffect(() => {
        // sportId가 없으면 데이터를 로드할 필요 없음
        if (!sportId) {
            setErrorCalendarData('캘린더 데이터를 불러오기 위한 종목/지점 ID가 없습니다.');
            return;
        }

        setLoadingCalendarData(true); // 로딩 시작
        setErrorCalendarData(null); // 에러 초기화

        const loadDates = async () => {
            const dates = await fetchAllScheduledDates();
            setAllScheduledDates(dates);
            setLoadingCalendarData(false); // 로딩 완료
        };
        loadDates();
    }, [sportId]);

    // 특정 날짜에 스케줄이 있는지 확인하는 함수
    const isDateActive = (calendarDate) => {
        // toISOString() 대신 로컬 날짜 문자열 직접 생성
        const year = calendarDate.getFullYear();
        const month = String(calendarDate.getMonth() + 1).padStart(2, '0');
        const day = String(calendarDate.getDate()).padStart(2, '0');
        const dateString = `${year}-${month}-${day}`;

        return allScheduledDates.has(dateString);
    };

    // 각 날짜 타일에 적용할 CSS 클래스를 반환
    const tileClassName = ({ date: calendarDate, view }) => {
        if (view === 'month') {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const isToday = calendarDate.setHours(0, 0, 0, 0) === today.getTime();
            const isSelected = selectedDate && (calendarDate.toISOString().split('T')[0] === selectedDate.toISOString().split('T')[0]);

            let classNames = [];
            if (isDateActive(calendarDate)) {
                classNames.push('has-schedule'); // 스케줄 있는 날짜
            }
            if (isToday) {
                classNames.push('is-today'); // 오늘 날짜
            }
            if (isSelected) {
                classNames.push('is-selected'); // 선택된 날짜
            }
            return classNames.join(' ');
        }
        return null;
    };

    // 각 날짜 타일을 비활성화할지 여부 반환
    const tileDisabled = ({ date: calendarDate, view }) => {
        if (view === 'month') {
            const today = new Date();
            today.setHours(0, 0, 0, 0); // 오늘 날짜의 시/분/초를 0으로 초기화

            // 복사본을 만들어 비교 (원본 변조 방지)
            const checkDate = new Date(calendarDate);
            checkDate.setHours(0, 0, 0, 0);

            // 1. 오늘보다 이전 날짜만 비활성화 (오늘 포함)
            if (checkDate.getTime() < today.getTime()) {
                return true;
            }

            // 2. minDate/maxDate 범위 밖 비활성화
            // minDate와 maxDate도 위에서 T00:00:00을 붙여 생성했으므로 비교 가능합니다.
            if (minDate && checkDate < new Date(new Date(minDate).setHours(0, 0, 0, 0))) {
                return true;
            }
            if (maxDate && checkDate > new Date(new Date(maxDate).setHours(0, 0, 0, 0))) {
                return true;
            }

            // 3. 백엔드 예약 가능 여부 확인
            if (!isDateActive(calendarDate)) {
                return true;
            }
        }
        return false;
    };

    const handleDateChange = (value) => {
        setCalendarValue(value);
        onSelectDate(value); // 부모 컴포넌트로 선택된 날짜 전달
    };

    const customFormatShortWeekday = (locale, date) => {
        const days = ['일', '월', '화', '수', '목', '금', '토'];
        return days[date.getDay()];
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={e => e.stopPropagation()}>
                <h2>날짜 선택</h2>
                {loadingCalendarData ? (
                    <p>캘린더 데이터를 불러오는 중...</p>
                ) : errorCalendarData ? (
                    <p className="error-message">{errorCalendarData}</p> // 에러 메시지 표시
                ) : (
                    <Calendar
                        locale="ko-KR"
                        onChange={handleDateChange}
                        value={calendarValue} // 캘린더가 현재 표시할 날짜 (내부 상태로 관리)
                        minDate={minDate}
                        maxDate={maxDate}
                        className="react-calendar-custom"
                        formatDay={(locale, date) => date.getDate()}
                        formatShortWeekday={customFormatShortWeekday}
                        tileClassName={tileClassName} // 새로 추가된 클래스 적용
                        tileDisabled={tileDisabled}   // 새로 추가된 비활성화 로직 적용
                    />
                )}
                <div className="modal-footer">
                    <button
                        onClick={onProceedToPayment}
                        disabled={!selectedDate || loadingCalendarData} // 데이터 로딩 중이거나 날짜 미선택 시 비활성화
                    >
                        결제하기
                    </button>
                    <button onClick={onClose} className="close-button">
                        닫기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CalendarModal;