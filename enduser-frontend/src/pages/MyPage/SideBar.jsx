import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './SideBar.css';

function SideBar({ activeMenu, onMenuClick }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMyExerciseOpen, setIsMyExerciseOpen] = useState(true);
  const [isReservationOpen, setIsReservationOpen] = useState(true);

  // 현재 경로에 따라 active 상태 결정
  const isReservationListActive = location.pathname === '/mypage/reservations';
  const isMyPageActive = location.pathname === '/mypage';

  // /mypage/reservations일 때 예약목록 섹션 열기
  useEffect(() => {
    if (isReservationListActive) {
      setIsReservationOpen(true);
    }
  }, [isReservationListActive]);

  // 메뉴 클릭 핸들러
  const handleMenuClick = (menuId) => {
    // 현재 페이지가 /mypage/reservations인 경우 /mypage로 이동
    if (location.pathname === '/mypage/reservations') {
      navigate('/mypage', { state: { menu: menuId } });
    } else if (onMenuClick) {
      // MyPage 내부에서 메뉴 변경
      onMenuClick(menuId);
    }
  };

  return (
    <aside className="mypage-sidebar">
      {/* 나의 운동 섹션 */}
      <div className="sidebar-section">
        <ul className="sidebar-menu">
          <li className="sidebar-menu-item">
            <button 
              className="sidebar-menu-button"
              onClick={() => setIsMyExerciseOpen(!isMyExerciseOpen)}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <span>나의 운동</span>
              <span style={{ fontSize: '0.75rem' }}>{isMyExerciseOpen ? '▲' : '▼'}</span>
            </button>
            {isMyExerciseOpen && (
              <ul className="sidebar-submenu">
                <li 
                  className={`sidebar-submenu-item ${isMyPageActive && activeMenu === 'usage-history' ? 'active' : ''}`}
                  onClick={() => handleMenuClick('usage-history')}
                  style={{ cursor: 'pointer' }}
                >
                  이용내역
                </li>
                <li 
                  className={`sidebar-submenu-item ${isMyPageActive && activeMenu === 'review-write' ? 'active' : ''}`}
                  onClick={() => handleMenuClick('review-write')}
                  style={{ cursor: 'pointer' }}
                >
                  리뷰쓰기
                </li>
                <li 
                  className={`sidebar-submenu-item ${isMyPageActive && activeMenu === 'inquiry' ? 'active' : ''}`}
                  onClick={() => handleMenuClick('inquiry')}
                  style={{ cursor: 'pointer' }}
                >
                  이용권 거래
                </li>
              </ul>
            )}
          </li>
        </ul>
      </div>

      {/* 예약목록 섹션 */}
      <div className="sidebar-section">
        <ul className="sidebar-menu">
          <li className="sidebar-menu-item">
            <button 
              className="sidebar-menu-button"
              onClick={() => setIsReservationOpen(!isReservationOpen)}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <span>예약목록</span>
              <span style={{ fontSize: '0.75rem' }}>{isReservationOpen ? '▲' : '▼'}</span>
            </button>
            {isReservationOpen && (
              <ul className="sidebar-submenu">
                <li 
                  className={`sidebar-submenu-item ${isReservationListActive ? 'active' : ''}`}
                >
                  <Link 
                    to="/mypage/reservations" 
                    style={{ textDecoration: 'none', color: 'inherit', display: 'block', width: '100%' }}
                    onClick={(e) => {
                      // 예약목록 페이지에서 클릭 시 새로고침 방지
                      if (location.pathname === '/mypage/reservations') {
                        e.preventDefault();
                      }
                    }}
                  >
                    예약내역
                  </Link>
                </li>
                <li 
                  className={`sidebar-submenu-item ${isMyPageActive && activeMenu === 'payment-history' ? 'active' : ''}`}
                  onClick={() => handleMenuClick('payment-history')}
                  style={{ cursor: 'pointer' }}
                >
                  결제내역
                </li>
              </ul>
            )}
          </li>
        </ul>
      </div>
    </aside>
  );
}

export default SideBar;

