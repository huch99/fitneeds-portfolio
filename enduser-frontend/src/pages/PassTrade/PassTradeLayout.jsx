import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import './PassTradeLayout.css';
import './PassTradeSidebar.css';

const PassTradeLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // ⭐ MyPage와 동일: active 메뉴를 state로 관리
  const [activeMenu, setActiveMenu] = useState('/pass-trade');

  const menuItems = [
    { path: '/pass-trade', label: '거래 게시글 목록' },
    { path: '/pass-trade/transactions', label: '거래 내역' },
    { path: '/pass-trade/faq', label: '이용권 FAQ' },
    { path: '/pass-trade/favorite', label: '즐겨찾기' },
  ];

  // ⭐ URL 직접 접근 / 새로고침 대응
  useEffect(() => {
    setActiveMenu(location.pathname);
  }, [location.pathname]);

  // ⭐ 클릭 즉시 active 변경 → 그 다음 라우팅
  const handleMenuClick = (path) => {
    setActiveMenu(path);   // 즉시 색 변경
    navigate(path);        // 화면 전환
  };

  return (
    <div className="pass-trade-layout">
      <aside className="pass-trade-sidebar">
        <nav>
          <ul className="sidebar-menu">
            {menuItems.map((item) => (
              <li key={item.path} className="sidebar-menu-item">
                <button
                  type="button"
                  className={`sidebar-menu-button ${
                    activeMenu === item.path ? 'active' : ''
                  }`}
                  onClick={() => handleMenuClick(item.path)}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <main className="pass-trade-main">
        <Outlet />
      </main>
    </div>
  );
};

export default PassTradeLayout;
