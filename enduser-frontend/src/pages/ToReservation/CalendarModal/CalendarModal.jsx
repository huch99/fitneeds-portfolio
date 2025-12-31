import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './CalendarModal.css';

const CalendarModal = ({ isOpen, onClose, strtDt, endDt, onSelectDate, selectedDate, onProceedToPayment }) => {
    if (!isOpen) return null;

    const minDate = new Date(strtDt + 'T00:00:00');
    const maxDate = new Date(endDt + 'T00:00:00');

    const initialCalendarDate = selectedDate || minDate;

    const handleDateChange = (value) => {
        onSelectDate(value); // 부모 컴포넌트로 선택된 날짜 전달
    };

    const customFormatShortWeekday = (locale, date) => {
        const days = ['일', '월', '화', '수', '목', '금', '토'];
        return days[date.getDay()];
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={e => e.stopPropagation()}> {/* 모달 바깥 클릭 시 닫히도록 */}
                <h2>날짜 선택</h2>
                <Calendar
                    locale="ko-KR"
                    onChange={handleDateChange}
                    value={selectedDate}
                    minDate={minDate}
                    maxDate={maxDate}
                    className="react-calendar-custom"
                    formatDay={(locale, date) => date.getDate()}
                    formatShortWeekday={customFormatShortWeekday}                    
                />
                <div className="modal-footer">
                    {/* 날짜가 선택되었을 때만 '결제하기' 버튼 활성화 */}
                    <button
                        onClick={onProceedToPayment}
                        disabled={!selectedDate} // selectedDate가 null이면 비활성화
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