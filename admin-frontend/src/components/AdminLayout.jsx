import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/Admin.css';
import LoginButtonAndModal from './auth/LoginButtonAndModal';

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ 변경점: 경로 간소화
  const menus = [
    { name: '대시보드', path: '/dashboard' },
    { name: '회원 관리', path: '/users' },
    { name: '관리자 관리', path: '/usersAdmin' },
    { name: '운동 종목 관리', path: '/sporttype' },
    { name: '예약 관리', path: '/reservations' },
    { name: '이용권 거래', path: '/trades' },
    { name: '이용권 관리', path: '/tickets' },
    { name: '센터 관리', path: '/centers' },
    { name: '커뮤니티 관리', path: '/community' },
    { name: 'FAQ 관리', path: '/AdminFaqPage' },
    { name: '공지사항 관리', path: '/notice' },
    
  ];

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
            <li key={menu.path}
              className={location.pathname === menu.path ? 'active' : ''}
              onClick={() => navigate(menu.path)}>
              {location.pathname === menu.path ? '▶ ' : ''} {menu.name}
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