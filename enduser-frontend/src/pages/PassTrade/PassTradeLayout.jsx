import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import './PassTradeLayout.css';
import './PassTradeSidebar.css';

const PassTradeLayout = () => {
  const menuItems = [
    { path: '/pass-trade', label: '거래 게시글 목록' },
    { path: '/pass-trade/transactions', label: '거래 내역' },
    { path: '/pass-trade/faq', label: '이용권 FAQ' },
    { path: '/pass-trade/favorite', label: '즐겨찾기' },
  ];

  return (
    <div className="pass-trade-layout">
      <aside className="pass-trade-sidebar">
        <nav>
          <ul className="sidebar-menu">
            {menuItems.map((item) => (
              <li key={item.path} className="sidebar-menu-item">
                <NavLink
                  to={item.path}
                  end
                  className={({ isActive }) =>
                    `sidebar-menu-button ${isActive ? 'active' : ''}`
                  }
                >
                  {item.label}
                </NavLink>
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
