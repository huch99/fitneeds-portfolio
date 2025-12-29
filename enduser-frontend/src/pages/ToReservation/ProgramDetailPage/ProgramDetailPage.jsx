import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../../../api';
import CalendarModal from '../CalendarModal/CalendarModal';
import './ProgramDetailPage.css';
import LoginModal from '../../../components/auth/LoginModal';
import '../../../components/auth/modalStyles.css';
import { useSelector } from 'react-redux';

const ProgramDetailPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const progId = queryParams.get('progId');
    const userName = location.state?.userName;
    const brchNm = location.state?.brchNm;
    const strtDt = location.state?.strtDt;
    const endDt = location.state?.endDt;
    const strtTm = location.state?.strtTm;
    const endTm = location.state?.endTm;

    const [programDetails, setProgramDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [selectedDate, setSelectedDate] = useState(null); // 선택된 날짜 상태

    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);

    const handleCloseModal = () => {
        setIsReservationModalOpen(false);
        // 모달 닫을 때 선택된 날짜 초기화 필요하면 주석 해제
        // setSelectedDate(null);
    };

    const handleReservationModal = () => {
        if (isAuthenticated === true) {
            setIsReservationModalOpen(true);
        } else if (isAuthenticated === false) {
            setIsLoginModalOpen(true);
        }
    };

    const handleDateSelect = (date) => {
        setSelectedDate(date);
        // 모달에서 날짜 선택 후 바로 닫고 결제 페이지로 이동하는 로직이 필요하면 여기에 추가
    };

     // 결제 페이지로 이동하는 핸들러
    const handleProceedToPayment = () => {
        if (selectedDate && programDetails) {
            navigate('/payment-reservation', { 
                state: {
                    progId: progId, // 프로그램 ID
                    selectedDate: selectedDate.toISOString().split('T')[0], // 선택된 날짜 (YYYY-MM-DD 형식)
                    userName: userName, // 강사명
                    brchNm: brchNm,     // 지점명
                    progNm: programDetails.progNm, // 프로그램명
                    strtTm: strtTm,     // 시작 시간
                    endTm: endTm,       // 종료 시간
                    // 필요한 경우 programDetails의 다른 정보들도 추가
                    oneTimeAmt: programDetails.oneTimeAmt, // 프로그램 단일 금액
                    rwdGamePnt: programDetails.rwdGamePnt, // 보상 게임 포인트
                }
            });
            handleCloseModal();
        } else {
            alert("날짜를 선택해주세요.");
        }
    };

    useEffect(() => {
        // 프로그램 데이터 패치
        const fetchProgramDetails = async () => {
            try {
                const response = await api.get(`/programs/getProgramByProgIdForR/${progId}`);
                setProgramDetails(response.data);
            } catch (err) {
                setError('프로그램 데이터를 불러오는 중 오류가 발생했습니다.');
                console.error('Error fetching program data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProgramDetails();
    }, [progId])

    return (
        <div>
            {loading ? (
                <div>프로그램 데이터를 불러오는 중입니다.</div>
            ) : (
                error ? (
                    <div>{error}</div>
                ) : (
                    <div className="program-detail-container">
                        <p className="program-title">{programDetails.progNm}</p>
                        <p className="instructor-name">{userName} 강사</p>
                        <p className="branch-name">{brchNm}</p>
                        <p className="program-duration">기간 : {strtDt} ~ {endDt}</p>
                        <p className="program-time">진행 시간 : {strtTm} ~ {endTm}</p>

                        <p className="program-description">{programDetails.description}dsadsa</p>

                         {/* 예약하기 버튼 클릭 시 모달 열기 */}
                        <button className="reserve-button" onClick={handleReservationModal}>예약하기</button>
                        <Link to={`/payment-reservation`}>결제 페이지 이동</Link>

                        {/* LoginModal 렌더링 */}
                        {isLoginModalOpen && (
                            <LoginModal 
                            isOpen={isLoginModalOpen}
                            onClose={() => setIsLoginModalOpen(false)}/>
                        )}

                        {/* CalendarModal 렌더링 */}
                        {isReservationModalOpen && (
                            <CalendarModal
                                isOpen={isReservationModalOpen}
                                sportId={programDetails.sportId}
                                onClose={handleCloseModal}
                                strtDt={strtDt}
                                endDt={endDt}
                                onSelectDate={handleDateSelect}
                                selectedDate={selectedDate} // 현재 선택된 날짜를 전달
                                onProceedToPayment={handleProceedToPayment} // 결제 진행 핸들러 전달
                            />
                        )}
                    </div>


                )
            )}
        </div>
    );
};

export default ProgramDetailPage;