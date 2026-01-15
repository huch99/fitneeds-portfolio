import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import '../styles/Admin.css';
import LoginButtonAndModal from './auth/LoginButtonAndModal';

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState({});

  // ✅ 변경점: 2depth 메뉴 구조
  const menus = [
    { name: '대시보드', path: '/dashboard' },
    { name: '회원 관리', path: '/users' },
    { name: '관리자 관리', path: '/usersAdmin' },
    { name: '예약 관리', path: '/reservations' },
    { name: '출결 관리', path: '/attendance' },
    { 
      name: '이용권 거래', 
      children: [
        { name: '이용권 거래 통계', path: '/marketstats' },
        { name: '이용권 거래 관리', path: '/trades' },
        { name: '이용권 거래 게시판 관리', path: '/markets' },
      ]
    },
    { 
      name: '이용권', 
      children: [
        { name: '이용권 관리', path: '/tickets' },
        { name: '이용권 상품 관리', path: '/products' },
      ]
    },
    { name: '지점 관리', path: '/branches' },
    { name: '강사 관리', path: '/teachers' },
    { name: '스케줄 관리', path: '/schedules' },
    { name: '결제 관리', path: '/payment' },
    { name: '커뮤니티 관리', path: '/community' },
    { name: 'FAQ 관리', path: '/AdminFaqPage' },
    { name: '공지사항 관리', path: '/notice' },
  ];

  const toggleMenu = (menuName) => {
    setOpenMenus(prev => ({
      ...prev,
      [menuName]: !prev[menuName]
    }));
  };

  const isActiveMenu = (menu) => {
    if (menu.path) {
      return location.pathname === menu.path;
    }
    if (menu.children) {
      return menu.children.some(child => location.pathname === child.path);
    }
    return false;
  };

  return (
    <div className="admin-layout">
      <div className="sidebar">
        <h3>관리자 시스템</h3>

        {/* 오른쪽: 로그인/로그아웃 버튼 */}
        <div style={{ flex: 1, textAlign: 'right' }}>
          <LoginButtonAndModal />
        </div>

        <ul>
          {menus.map((menu) => (
            <li key={menu.name}>
              {menu.children ? (
                <>
                  <div
                    className={`menu-item ${isActiveMenu(menu) ? 'active' : ''}`}
                    onClick={() => toggleMenu(menu.name)}
                    style={{ cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    {menu.name} {openMenus[menu.name] ? '▼' : '▶'}
                  </div>
                  {openMenus[menu.name] && (
                    <ul style={{ paddingLeft: '20px', marginTop: '5px' }}>
                      {menu.children.map((child) => (
                        <li
                          key={child.path}
                          className={location.pathname === child.path ? 'active' : ''}
                          onClick={() => navigate(child.path)}
                          style={{ cursor: 'pointer', padding: '8px 0' }}
                        >
                          {child.name}
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <div
                  className={location.pathname === menu.path ? 'active' : ''}
                  onClick={() => navigate(menu.path)}
                  style={{ cursor: 'pointer' }}
                >
                  {menu.name}
                </div>
              )}
            </li>
          ))}
        </ul>

        {/* <div style={{ marginTop: '50px', textAlign: 'center' }}>
          <button onClick={() => navigate('/')} style={{ background: 'transparent', color: '#ccc', border: '1px solid #ccc' }}>
            로그아웃
          </button>
        </div> */}

      </div>
      <div className="main">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;