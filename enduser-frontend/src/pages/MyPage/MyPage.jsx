import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import SideBar from '../../components/SideBar/SideBar';
import '../../components/auth/modalStyles.css';
import './MyPage.css';
import { getMyReviews, createReview, updateReview, deleteReview } from '../../api/review';
import { getMyReservations, getMyCompletedReservations } from '../../api/reservation';
import { getMyPayments } from '../../api/payment';

function MyPage() {
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState(null); // null이면 메인페이지
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
          // TODO: 사용자 정보 API 호출
          // const userData = await getUserInfo();
          // setUserInfo({
          //   name: userData.name || userName || '',
          //   email: userData.email || '',
          //   phone: userData.phone || '',
          //   address: userData.address || ''
          // });
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

      case 'edit-info':
        return (
          <section className="mypage-content-section">
            <h2 className="content-title">나의 정보 수정</h2>
            {userInfoLoading ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <p>로딩 중...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="info-edit-form">
                <div className="form-group">
                  <label htmlFor="name">이름</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={userInfo.name}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">이메일</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={userInfo.email}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="이메일을 입력해주세요"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">전화번호</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={userInfo.phone}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="010-1234-5678"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="address">주소</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={userInfo.address}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="주소를 입력해주세요"
                  />
                </div>
                <button type="submit" className="btn-submit">수정하기</button>
              </form>
            )}
          </section>
        );

      case 'usage-history':
        // 상태별 카운트 계산
        const paymentCompletedCount = usageHistoryData.filter(h => h.paymentStatus === '결제완료').length;
        const reservationCompletedCount = usageHistoryData.filter(h => h.reservationStatus === '예약완료').length;
        const usageCompletedCount = usageHistoryData.filter(h => h.status === '이용완료').length;

        return (
          <section className="mypage-content-section">
            <h2 className="content-title">이용내역</h2>
            
            {/* 상태별 카운트 섹션 */}
            <div className="usage-status-section">
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
                <div className="status-count-label">이용내역</div>
                <div className="status-count-number">{usageCompletedCount}</div>
              </div>
            </div>

            {/* 자주 예약한 수업 섹션 */}
            <div className="frequent-reservations-section">
              <div className="frequent-reservations-header">
                <h3 className="frequent-reservations-title">자주 예약한 수업 1건</h3>
              </div>
              <div className="frequent-reservations-grid">
                {usageHistoryData.slice(0, 1).map((history) => (
                  <div key={`frequent-${history.id}`} className="frequent-reservation-card">
                    <div className="frequent-reservation-image">
                      <img src={history.image} alt={history.service} />
                    </div>
                    <div className="frequent-reservation-info">
                      <div className="frequent-reservation-name">{history.service}</div>
                      <div className="frequent-reservation-detail">{history.option} | {history.facility}</div>
                    </div>
                    <button className="frequent-reservations-view-all">전체보기 &gt;</button>
                  </div>
                ))}
              </div>
            </div>

            <div className="usage-summary">
              이용내역 총 {usageHistoryData.length}건
            </div>

            {usageHistoryLoading ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <p>로딩 중...</p>
              </div>
            ) : (
              <div className="usage-list-container">
                {usageHistoryData.length > 0 ? (
                  usageHistoryData.map((history) => (
                  <div key={history.id} className="usage-item">
                    <div className="usage-item-header">
                      <div className="usage-item-date-status">
                        <span className="usage-item-date">{history.date}</span>
                        <span className="usage-item-status">{history.status}</span>
                      </div>
                    </div>
                    <div className="usage-item-content">
                      <div className="usage-item-image">
                        <img src={history.image} alt={history.service} />
                      </div>
                      <div className="usage-item-info">
                        <div className="usage-item-service">{history.service}</div>
                        <div className="usage-item-price">{history.amount.toLocaleString()}원</div>
                        <div className="usage-item-option">{history.option} | {history.facility}</div>
                      </div>
                      <div className="usage-item-actions">
                        <button 
                          className="btn-action"
                          onClick={() => {
                            setSelectedHistoryId(history.id);
                            setIsReviewModalOpen(true);
                          }}
                        >
                          리뷰쓰기
                        </button>
                        <i className="bi bi-chevron-right usage-item-arrow"></i>
                      </div>
                    </div>
                  </div>
                ))
                ) : (
                  <div className="usage-empty">
                    <p>이용 내역이 없습니다.</p>
                  </div>
                )}
              </div>
            )}
          </section>
        );

      case 'review-write':
        return <ReviewWriteSection reviewTab={reviewTab} setReviewTab={setReviewTab} setIsReviewModalOpen={setIsReviewModalOpen} setSelectedHistoryId={setSelectedHistoryId} />;

      case 'inquiry':
        return (
          <section className="mypage-content-section">
            <h2 className="content-title">문의하기</h2>
            <p style={{ color: '#6c757d', fontSize: '1rem' }}>문의하기 기능은 준비 중입니다.</p>
          </section>
        );

      case 'payment-history':
        return (
          <section className="mypage-content-section">
            <h2 className="content-title">결제내역</h2>
            {paymentHistoryLoading ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <p>로딩 중...</p>
              </div>
            ) : (
              <>
                <div className="reservation-summary">
                  결제내역 총 {paymentHistoryData.length}건
                </div>

                <div className="reservation-table-container">
                  <table className="reservation-table">
                    <thead>
                      <tr>
                        <th>결제일자</th>
                        <th>상품명/옵션</th>
                        <th>상품금액</th>
                        <th>결제완료여부</th>
                        <th>취소/환불</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paymentHistoryData.length > 0 ? (
                        [...paymentHistoryData]
                          .sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate))
                          .map((payment) => (
                            <tr key={payment.id}>
                              <td>{payment.paymentDate}</td>
                              <td>
                                <div>{payment.productName}</div>
                                <div className="text-muted">{payment.option}</div>
                              </td>
                              <td>{payment.price > 0 ? payment.price.toLocaleString() + '원' : '-'}</td>
                              <td>
                                <span className={payment.isCompleted ? 'status-badge status-success' : 'status-badge status-warning'}>
                                  {payment.isCompleted ? '결제완료' : '결제대기'}
                                </span>
                              </td>
                              <td>
                                {payment.cancelRefundStatus ? (
                                  <span className="status-badge status-success">
                                    {payment.cancelRefundStatus}
                                  </span>
                                ) : (
                                  <span className="text-muted">-</span>
                                )}
                              </td>
                            </tr>
                          ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="text-center">결제 내역이 없습니다.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </section>
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
                  <div className="profile-name">{userName || userInfo.name || '사용자'} 님 Lv1</div>
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

// 리뷰쓰기 섹션 컴포넌트
function ReviewWriteSection({ reviewTab, setReviewTab, setIsReviewModalOpen, setSelectedHistoryId }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [writtenReviews, setWrittenReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0); // 리뷰 작성/수정/삭제 후 새로고침용

  // 예약 목록과 작성한 리뷰 목록 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // 결제완료된 예약 목록 가져오기
        const completedReservations = await getMyCompletedReservations();
        
        // 예약 데이터를 화면에 맞게 변환
        const transformedReservations = completedReservations.map((reservation, index) => ({
          id: reservation.reservationId,
          reservationId: reservation.reservationId,
          date: reservation.exerciseDate ? new Date(reservation.exerciseDate).toISOString().split('T')[0] : '',
          productName: reservation.exerciseName || '운동',
          option: reservation.trainerName ? `개인 레슨` : '그룹 레슨',
          price: 0, // 백엔드에서 가격 정보가 없으면 0
          status: reservation.paymentStatus === 'BANK_TRANSFER_COMPLETED' ? '예약완료' : '예약대기',
          facility: reservation.exerciseLocation || '지점',
          trainerName: reservation.trainerName || '',
          image: '/images/pilates.png' // 기본 이미지 (실제로는 예약 데이터에서 가져와야 함)
        }));
        
        setReservations(transformedReservations);

        // 작성한 리뷰 목록 가져오기
        const reviews = await getMyReviews();
        
        // 리뷰 데이터를 화면에 맞게 변환
        const transformedReviews = await Promise.all(reviews.map(async (review) => {
          // 예약 정보 가져오기 (리뷰에 예약 정보가 포함되어 있지 않을 수 있음)
          const reservation = transformedReservations.find(r => r.reservationId === review.reservationId);
          
          return {
            id: review.reviewId,
            reviewId: review.reviewId,
            reservationId: review.reservationId,
            date: reservation?.date || '',
            productName: reservation?.productName || '운동',
            option: reservation?.option || '',
            facility: reservation?.facility || '지점',
            rating: review.rating,
            reviewText: review.content || '',
            writtenDate: review.registrationDateTime 
              ? new Date(review.registrationDateTime).toISOString().split('T')[0].replace(/-/g, '.')
              : '',
            image: reservation?.image || '/images/pilates.png'
          };
        }));
        
        setWrittenReviews(transformedReviews);
      } catch (error) {
        console.error('데이터 로딩 실패:', error);
        // 에러 발생 시 빈 배열로 설정
        setReservations([]);
        setWrittenReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refreshKey]);

  // 예약한 수업의 다음날 수업 목록 (리뷰 작성 가능)
  const getReviewableClasses = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return reservations.filter(reservation => {
      // 이미 리뷰가 작성된 예약은 제외
      const hasReview = writtenReviews.some(review => review.reservationId === reservation.reservationId);
      if (hasReview) return false;

      const reservationDate = new Date(reservation.date);
      const nextDay = new Date(reservationDate);
      nextDay.setDate(nextDay.getDate() + 1);
      nextDay.setHours(0, 0, 0, 0);
      
      // 다음날이 오늘 이전이거나 오늘인 경우 리뷰 작성 가능
      return nextDay <= today && reservation.status === '예약완료';
    });
  };

  const reviewableClasses = getReviewableClasses();

  // 리뷰 작성/수정/삭제 후 새로고침
  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  if (loading) {
    return (
      <section className="mypage-content-section">
        <h2 className="content-title">리뷰쓰기</h2>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>로딩 중...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mypage-content-section">
      <h2 className="content-title">리뷰쓰기</h2>
      
      {/* 탭 */}
      <div className="review-tabs">
        <button
          className={`review-tab ${reviewTab === 'write' ? 'active' : ''}`}
          onClick={() => setReviewTab('write')}
        >
          리뷰 쓰기 {reviewableClasses.length}
        </button>
        <button
          className={`review-tab ${reviewTab === 'written' ? 'active' : ''}`}
          onClick={() => setReviewTab('written')}
        >
          작성한 리뷰 {writtenReviews.length}
        </button>
      </div>

      {/* 리뷰 쓰기 탭 내용 */}
      {reviewTab === 'write' && (
        <div className="review-write-list">
          {reviewableClasses.length > 0 ? (
            <>
              <div className="review-section-header">
                <h3>리뷰 작성 가능한 수업 {reviewableClasses.length}개</h3>
              </div>
              {reviewableClasses.map((reservation) => {
                const reservationDate = new Date(reservation.date);
                const nextDay = new Date(reservationDate);
                nextDay.setDate(nextDay.getDate() + 1);
                
                return (
                  <div key={reservation.id} className="review-item">
                    <div className="review-item-content">
                      <div className="review-item-image">
                        <img src={reservation.image} alt={reservation.productName} />
                      </div>
                      <div className="review-item-info">
                        <div className="review-item-title">{reservation.productName}</div>
                        <div className="review-item-detail">{reservation.facility}</div>
                        <div className="review-item-date">수업일: {reservation.date}</div>
                      </div>
                      <button
                        className="btn-action"
                        onClick={() => {
                          setSelectedHistoryId(reservation.id);
                          setIsReviewModalOpen(true);
                        }}
                      >
                        리뷰쓰기
                      </button>
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            <div className="review-empty">
              <p>리뷰 작성 가능한 수업이 없습니다.</p>
            </div>
          )}
        </div>
      )}

      {/* 작성한 리뷰 탭 내용 */}
      {reviewTab === 'written' && (
        <div className="review-written-list">
          {writtenReviews.length > 0 ? (
            writtenReviews.map((review) => (
              <div key={review.id} className="review-written-item">
                <div className="review-written-content">
                  <div className="review-written-left">
                    <div className="review-written-image">
                      <img src={review.image} alt={review.productName} />
                    </div>
                    <div className="review-written-divider"></div>
                    <div className="review-written-review-section">
                      <div className="review-written-text">{review.reviewText}</div>
                      <div className="review-written-date">작성일 {review.writtenDate}</div>
                    </div>
                  </div>
                  <div className="review-written-main">
                    <div className="review-written-header">
                      <div className="review-written-info">
                        <div className="review-written-title">{review.productName}</div>
                        <div className="review-written-detail">{review.option} | {review.facility}</div>
                      </div>
                      <ReviewMenuButton 
                        reviewId={review.reviewId} 
                        onDelete={handleRefresh}
                      />
                    </div>
                    <div className="review-written-footer">
                      <button 
                        className="review-written-edit-btn"
                        onClick={() => {
                          setSelectedReviewId(review.id);
                          setIsEditModalOpen(true);
                        }}
                      >
                        수정하기
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="review-empty">
              <p>작성한 리뷰가 없습니다.</p>
            </div>
          )}
        </div>
      )}

      {/* 리뷰 수정 모달 */}
      {isEditModalOpen && (
        <ReviewEditModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedReviewId(null);
          }}
          reviewId={selectedReviewId}
          writtenReviews={writtenReviews}
          onRefresh={handleRefresh}
        />
      )}
    </section>
  );
}

// 리뷰 수정 모달 컴포넌트
function ReviewEditModal({ isOpen, onClose, reviewId, writtenReviews, onRefresh }) {
  const review = writtenReviews.find(r => r.id === reviewId || r.reviewId === reviewId);
  const [rating, setRating] = useState(review?.rating || 0);
  const [reviewText, setReviewText] = useState(review?.reviewText || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // review가 변경될 때 rating과 reviewText 업데이트
  useEffect(() => {
    if (review) {
      setRating(review.rating);
      setReviewText(review.reviewText);
    }
  }, [review]);

  if (!isOpen || !review) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!rating || !reviewText.trim()) {
      alert('평점과 리뷰 내용을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      await updateReview(review.reviewId || review.id, {
        rating: rating,
        content: reviewText
      });
      alert('리뷰가 수정되었습니다.');
      onClose();
      onRefresh(); // 새로고침
    } catch (error) {
      alert('리뷰 수정에 실패했습니다.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal-content review-modal-content">
        <button onClick={onClose} className="modal-close-button">×</button>
        <h2 style={{ marginBottom: '20px', color: '#212529' }}>리뷰 수정</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#212529', fontWeight: '600' }}>
              평점
            </label>
            <div style={{ display: 'flex', gap: '5px' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '2rem',
                    cursor: 'pointer',
                    color: star <= rating ? '#FFC107' : '#ddd',
                    padding: 0
                  }}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#212529', fontWeight: '600' }}>
              리뷰 내용
            </label>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="리뷰를 작성해주세요"
              style={{
                width: '100%',
                minHeight: '150px',
                padding: '10px',
                border: '1px solid #ced4da',
                borderRadius: '4px',
                fontSize: '14px',
                fontFamily: 'inherit',
                resize: 'vertical',
                boxSizing: 'border-box'
              }}
              required
            />
          </div>
          <button 
            type="submit" 
            className="btn-submit"
            style={{ marginTop: '10px' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? '수정 중...' : '수정 완료'}
          </button>
        </form>
      </div>
    </>
  );
}

// 리뷰 메뉴 버튼 컴포넌트 (삭제 기능 포함)
function ReviewMenuButton({ reviewId, onDelete }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleDelete = async () => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      try {
        await deleteReview(reviewId);
        alert('리뷰가 삭제되었습니다.');
        setIsMenuOpen(false);
        onDelete(); // 새로고침
      } catch (error) {
        alert('리뷰 삭제에 실패했습니다.');
        console.error(error);
      }
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <button 
        className="review-written-menu-btn"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <i className="bi bi-three-dots"></i>
      </button>
      {isMenuOpen && (
        <>
          <div 
            style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              backgroundColor: 'white',
              border: '1px solid #e9ecef',
              borderRadius: '4px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              zIndex: 1000,
              minWidth: '100px'
            }}
          >
            <button
              onClick={handleDelete}
              style={{
                width: '100%',
                padding: '0.5rem 1rem',
                border: 'none',
                background: 'none',
                textAlign: 'left',
                cursor: 'pointer',
                color: '#dc3545'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
            >
              삭제
            </button>
          </div>
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 999
            }}
            onClick={() => setIsMenuOpen(false)}
          />
        </>
      )}
    </div>
  );
}

// 리뷰 작성 모달 컴포넌트
function ReviewModal({ isOpen, onClose, historyId, onRefresh }) {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reservation, setReservation] = useState(null);

  // 예약 정보 가져오기
  useEffect(() => {
    if (isOpen && historyId) {
      const fetchReservation = async () => {
        try {
          // 이용내역에서 예약 정보 찾기
          const data = await getMyCompletedReservations();
          const found = data.find(r => r.reservationId === historyId);
          if (found) {
            setReservation({
              id: found.reservationId,
              reservationId: found.reservationId,
              trainerName: found.trainerName || ''
            });
          }
        } catch (error) {
          console.error('예약 정보 조회 실패:', error);
        }
      };
      fetchReservation();
    }
  }, [isOpen, historyId]);

  // 모달이 열릴 때마다 초기화
  useEffect(() => {
    if (isOpen) {
      setRating(0);
      setReviewText('');
      setReservation(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!rating || !reviewText.trim()) {
      alert('평점과 리뷰 내용을 입력해주세요.');
      return;
    }

    if (!reservation) {
      alert('예약 정보를 찾을 수 없습니다.');
      return;
    }

    setIsSubmitting(true);
    try {
      await createReview({
        reservationId: reservation.reservationId || reservation.id,
        rating: rating,
        content: reviewText,
        instructorId: reservation.trainerName ? 1 : null // 실제로는 강사 ID를 가져와야 함
      });
      alert('리뷰가 작성되었습니다.');
      setRating(0);
      setReviewText('');
      onClose();
      onRefresh(); // 새로고침
    } catch (error) {
      alert('리뷰 작성에 실패했습니다.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal-content review-modal-content">
        <button onClick={onClose} className="modal-close-button">×</button>
        <h2 style={{ marginBottom: '20px', color: '#212529' }}>리뷰 작성</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#212529', fontWeight: '600' }}>
              평점
            </label>
            <div style={{ display: 'flex', gap: '5px' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '2rem',
                    cursor: 'pointer',
                    color: star <= rating ? '#FFC107' : '#ddd',
                    padding: 0
                  }}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#212529', fontWeight: '600' }}>
              리뷰 내용
            </label>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="리뷰를 작성해주세요"
              style={{
                width: '100%',
                minHeight: '150px',
                padding: '10px',
                border: '1px solid #ced4da',
                borderRadius: '4px',
                fontSize: '14px',
                fontFamily: 'inherit',
                resize: 'vertical',
                boxSizing: 'border-box'
              }}
              required
            />
          </div>
          <button 
            type="submit" 
            className="btn-submit"
            style={{ marginTop: '10px' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? '등록 중...' : '리뷰 등록'}
          </button>
        </form>
      </div>
    </>
  );
}

// 검색 섹션 컴포넌트
function SearchSection({ searchQuery, setSearchQuery, recentSearches, setRecentSearches }) {
  const [isEditing, setIsEditing] = useState(false);
  const [popularCategories, setPopularCategories] = useState([]); // 인기 운동 카테고리 (API에서 가져옴)
  const [popularSearches, setPopularSearches] = useState([]); // 인기 검색어 (API에서 가져옴)
  const [searchLoading, setSearchLoading] = useState(false);

  // 인기 운동 카테고리 및 인기 검색어 가져오기
  useEffect(() => {
    const fetchSearchData = async () => {
      try {
        setSearchLoading(true);
        // TODO: 검색 관련 API 호출
        // const categories = await getPopularCategories();
        // const searches = await getPopularSearches();
        // setPopularCategories(categories);
        // setPopularSearches(searches);
        
        // 임시로 빈 배열 설정 (API 준비되면 위 주석 해제)
        setPopularCategories([]);
        setPopularSearches([]);
      } catch (error) {
        console.error('검색 데이터 로딩 실패:', error);
        setPopularCategories([]);
        setPopularSearches([]);
      } finally {
        setSearchLoading(false);
      }
    };
    
    fetchSearchData();
  }, []);

  // 검색어 삭제
  const handleDeleteSearch = (index) => {
    setRecentSearches(recentSearches.filter((_, i) => i !== index));
  };

  // 검색어 선택
  const handleSelectSearch = (keyword) => {
    setSearchQuery(keyword);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // 최근 검색어에 추가 (중복 제거)
      if (!recentSearches.includes(searchQuery.trim())) {
        setRecentSearches([searchQuery.trim(), ...recentSearches].slice(0, 10));
      }
      // 실제 검색 로직은 여기에 구현
      console.log('검색:', searchQuery);
    }
  };

  const now = new Date();
  const dateStr = `${now.getMonth() + 1}.${now.getDate()} ${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')} 기준`;

  return (
    <section className="mypage-content-section search-section">
      {/* 검색 바 */}
      <div className="search-bar-container">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            className="search-input"
            placeholder="운동을 검색해보세요"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="search-button">
            <i className="bi bi-search"></i>
          </button>
        </form>
      </div>

      {/* 최근 검색어 */}
      <div className="search-section-block">
        <div className="search-section-header">
          <h3 className="search-section-title">최근 검색어</h3>
          <button 
            className="search-edit-button"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? '완료' : '편집'}
          </button>
        </div>
        <div className="recent-searches">
          {recentSearches.length > 0 ? (
            recentSearches.map((search, index) => (
              <div key={index} className="search-tag">
                <span onClick={() => !isEditing && handleSelectSearch(search)}>
                  {search}
                </span>
                {isEditing && (
                  <button 
                    className="search-tag-delete"
                    onClick={() => handleDeleteSearch(index)}
                  >
                    ×
                  </button>
                )}
              </div>
            ))
          ) : (
            <p className="search-empty">최근 검색어가 없습니다.</p>
          )}
        </div>
      </div>

      {/* 인기 운동 카테고리 */}
      <div className="search-section-block">
        <h3 className="search-section-title">인기 운동 카테고리</h3>
        {searchLoading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>로딩 중...</p>
          </div>
        ) : (
          <div className="category-grid">
            {popularCategories.length > 0 ? (
              popularCategories.map((category) => (
                <div key={category.id} className="category-item">
                  <div className="category-image">
                    <img src={category.image} alt={category.name} />
                  </div>
                  <div className="category-name">{category.name}</div>
                </div>
              ))
            ) : (
              <p className="search-empty">인기 운동 카테고리가 없습니다.</p>
            )}
          </div>
        )}
      </div>

      {/* 인기 검색어 */}
      <div className="search-section-block">
        <div className="search-section-header">
          <h3 className="search-section-title">인기 검색어</h3>
          <span className="search-date">{dateStr}</span>
        </div>
        {searchLoading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>로딩 중...</p>
          </div>
        ) : (
          <div className="popular-searches-list">
            {popularSearches.length > 0 ? (
              popularSearches.map((item, index) => (
                <div key={item.id} className="popular-search-item">
                  <span className="popular-search-rank">{index + 1}</span>
                  <span 
                    className="popular-search-keyword"
                    onClick={() => handleSelectSearch(item.keyword)}
                  >
                    {item.keyword}
                  </span>
                  <span className={`popular-search-trend ${item.trend === 'up' ? 'trend-up' : 'trend-down'}`}>
                    {item.trend === 'up' ? '▲' : '▼'}
                  </span>
                </div>
              ))
            ) : (
              <p className="search-empty">인기 검색어가 없습니다.</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default MyPage;
