import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import SideBar from '../../components/SideBar/SideBar';
import '../../components/auth/modalStyles.css';
import './MyPage.css';
import { getMyCompletedReservations } from '../../api/reservation';
import { getMyPayments } from '../../api/payment';

import UsageListSection from './UsageListSection';
import EditInfoSection from './EditInfoSection';
import UsageHistorySection from './UsageHistorySection';
import ReviewWriteSection from './ReviewWriteSection';
import InquirySection from './InquirySection';
import PaymentHistorySection from './PaymentHistorySection';
import SearchSection from './SearchSection';
import ReviewModal from './ReviewModal';

const [activeMenu, setActiveMenu] = useLocalStorage('activeMenu', null);
const [recentSearches, setRecentSearches] = useLocalStorage('recentSearches', []);
const [storedUserName, setStoredUserName] = useLocalStorage('userName', null);

function MyPage() {
  const location = useLocation();
  // 기존
  // const [activeMenu, setActiveMenu] = useState(null);

  // localStorage 적용
  const [activeMenu, setActiveMenu] = useLocalStorage('activeMenu', null);

  // location.state에서 메뉴 정보를 받아서 activeMenu 설정
  useEffect(() => {
    if (location.pathname === '/mypage') {
      if (location.state?.menu !== undefined) {
        setActiveMenu(location.state.menu);
        // state를 사용한 후 제거하여 뒤로가기 시 문제가 없도록 함
        window.history.replaceState({}, document.title);
      }
      // else는 제거해도 됨. localStorage에 저장된 값이 이미 기본값으로 들어오기 때문
    }
  }, [location.state, location.pathname, setActiveMenu]);



  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false); // 리뷰 작성 모달 상태
  const [selectedHistoryId, setSelectedHistoryId] = useState(null); // 선택된 이용내역 ID
  const [reviewTab, setReviewTab] = useState('write'); // 'write' 또는 'written'
  const [searchQuery, setSearchQuery] = useState(''); // 검색어
  const [recentSearches, setRecentSearches] = useState([]); // 최근 검색어 (API에서 가져옴)
  const [usageHistoryData, setUsageHistoryData] = useState([]); // 이용내역 데이터 (API에서 가져옴)
  const [usageHistoryLoading, setUsageHistoryLoading] = useState(false); // 이용내역 로딩 상태
  const [paymentHistoryData, setPaymentHistoryData] = useState([]); // 결제내역 데이터 (API에서 가져옴)
  const [paymentHistoryLoading, setPaymentHistoryLoading] = useState(false); // 결제내역 로딩 상태
  const [userInfoLoading, setUserInfoLoading] = useState(false); // 사용자 정보 로딩 상태

  // location.state에서 menu 정보를 받아서 activeMenu 설정
  useEffect(() => {
    if (location.pathname === '/mypage') {
      if (location.state?.menu !== undefined) {
        setActiveMenu(location.state.menu);
        // state를 사용한 후 제거하여 뒤로가기 시 문제가 없도록 함
        window.history.replaceState({}, document.title);
      } else {
        // state가 없으면 메인 페이지(검색 페이지)로 설정
        setActiveMenu(null);
      }
    }
  }, [location.state, location.pathname]);

  // Redux에서 로그인한 사용자 정보 가져오기
  const userName = useSelector((state) => state.auth.userName);

  // 나의 정보 수정 상태
  const [userInfo, setUserInfo] = useState({
    name: userName || '',
    email: '',
    phone: '',
    address: ''
  });

  // userName이 변경될 때 userInfo 업데이트
  useEffect(() => {
    if (userName) {
      setUserInfo(prev => ({
        ...prev,
        name: userName
      }));
    }
  }, [userName]);

  // 사용자 정보 가져오기 (나의 정보 수정 화면 진입 시)
  useEffect(() => {
    if (activeMenu === 'edit-info') {
      const fetchUserInfo = async () => {
        try {
          setUserInfoLoading(true);
        } catch (error) {
          console.error('사용자 정보 조회 실패:', error);
        } finally {
          setUserInfoLoading(false);
        }
      };

      fetchUserInfo();
    }
  }, [activeMenu, userName]);


  // 이용내역 데이터 가져오기 (예약일자가 지난 예약들)
  useEffect(() => {
    if (activeMenu === 'usage-history') {
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
            image: '/images/pilates.png', // 기본 이미지
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
    }
  }, [activeMenu]);

  // 결제내역 데이터 가져오기
  useEffect(() => {
    if (activeMenu === 'payment-history') {
      const fetchPaymentHistory = async () => {
        try {
          setPaymentHistoryLoading(true);
          const data = await getMyPayments();

          // 백엔드 데이터를 화면에 맞게 변환
          const transformed = data.map((payment) => ({
            id: payment.paymentId,
            paymentId: payment.paymentId,
            paymentDate: payment.paymentDate
              ? new Date(payment.paymentDate).toISOString().split('T')[0]
              : '',
            productName: payment.programName || '프로그램',
            option: payment.option || '그룹 레슨',
            price: payment.paymentAmount ? Number(payment.paymentAmount) : 0,
            isCompleted: payment.paymentStatus === 'BANK_TRANSFER_COMPLETED',
            cancelRefundStatus: payment.cancelRefundStatus
          }));

          setPaymentHistoryData(transformed);
        } catch (error) {
          console.error('결제내역 조회 실패:', error);
          setPaymentHistoryData([]);
        } finally {
          setPaymentHistoryLoading(false);
        }
      };

      fetchPaymentHistory();
    }
  }, [activeMenu]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('정보가 수정되었습니다.');
    // 실제로는 API 호출로 정보 수정
  };

  const renderContent = () => {
    switch (activeMenu) {
      case 'usage-list':
        return (
          <UsageListSection
            usageHistoryData={usageHistoryData}
            usageHistoryLoading={usageHistoryLoading}
            setSelectedHistoryId={setSelectedHistoryId}
            setIsReviewModalOpen={setIsReviewModalOpen}
          />
        );

      case 'edit-info':
        return (
          <EditInfoSection
            userInfo={userInfo}
            setUserInfo={setUserInfo}
            userInfoLoading={userInfoLoading}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
          />
        );

      case 'usage-history':
        return (
          <UsageHistorySection
            usageHistoryData={usageHistoryData}
            usageHistoryLoading={usageHistoryLoading}
            setSelectedHistoryId={setSelectedHistoryId}
            setIsReviewModalOpen={setIsReviewModalOpen}
          />
        );

      case 'review-write':
        return (
          <ReviewWriteSection
            reviewTab={reviewTab}
            setReviewTab={setReviewTab}
            setIsReviewModalOpen={setIsReviewModalOpen}
            setSelectedHistoryId={setSelectedHistoryId}
          />
        );

      case 'inquiry':
        return <InquirySection />;

      case 'payment-history':
        return (
          <PaymentHistorySection
            paymentHistoryData={paymentHistoryData}
            paymentHistoryLoading={paymentHistoryLoading}
          />
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Helmet>
        <title>FITNEEDS - 마이페이지</title>
        <meta name="description" content="FITNEEDS - 마이페이지" />
      </Helmet>

      <div className="mypage-container">
        <SideBar activeMenu={activeMenu} onMenuClick={setActiveMenu} />

        {/* Main Content Area */}
        <main className="mypage-main">
          {/* User Profile Section - 나의 운동 메인 페이지에서만 표시 */}
          {activeMenu === null && (
            <section className="mypage-profile-section">
              <div className="profile-header">
                <div className="profile-avatar">
                  <div className="avatar-circle">
                    <span className="avatar-character">👤</span>
                  </div>
                </div>
                <div className="profile-info">
                  <div className="profile-name">{userName || userInfo.name || '사용자'} 님</div>
                  <div className="profile-email">{userInfo.email}</div>
                </div>
              </div>

              <div className="profile-quick-links">
                <Link
                  to="/mypage/reservations"
                  className="quick-link-item"
                >
                  <div className="quick-link-icon">
                    <i className="bi bi-calendar-check"></i>
                  </div>
                  <div className="quick-link-label">예약목록</div>
                </Link>
                <div
                  className="quick-link-item"
                  onClick={() => setActiveMenu('usage-history')}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="quick-link-icon">
                    <i className="bi bi-wallet2"></i>
                  </div>
                  <div className="quick-link-label">이용내역</div>
                </div>
                <Link to="#" className="quick-link-item">
                  <div className="quick-link-icon">
                    <i className="bi bi-pencil-square"></i>
                  </div>
                  <div className="quick-link-label">리뷰</div>
                </Link>
                <Link to="#" className="quick-link-item">
                  <div className="quick-link-icon">
                    <i className="bi bi-question-circle"></i>
                  </div>
                  <div className="quick-link-label">문의</div>
                </Link>
              </div>
            </section>
          )}

          {/* Content Section */}
          {activeMenu === null ? (
            <SearchSection
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              recentSearches={recentSearches}
              setRecentSearches={setRecentSearches}
            />
          ) : (
            renderContent()
          )}
        </main>
      </div>

      {/* 리뷰 작성 모달 */}
      {isReviewModalOpen && (
        <ReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => {
            setIsReviewModalOpen(false);
            setSelectedHistoryId(null);
          }}
          historyId={selectedHistoryId}
          onRefresh={() => {
            // 리뷰 작성 후 이용내역 새로고침
            if (activeMenu === 'usage-history') {
              // 이용내역 데이터 다시 가져오기
              const fetchUsageHistory = async () => {
                try {
                  const data = await getMyCompletedReservations();
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
                }
              };
              fetchUsageHistory();
            }
          }}
        />
      )}

    </>
  );
}






export default MyPage;
