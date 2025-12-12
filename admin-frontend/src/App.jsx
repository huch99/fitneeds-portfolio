import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import './styles/Admin.css';

// Pages
import AdminLayout from './components/AdminLayout';
import AdminTicketPage from './pages/AdminTicketPage';
import AdminReservationPage from './pages/AdminReservationPage';
import AdminTradePage from './pages/AdminTradePage';
import AdminFaqPage from './pages/FAQ/AdminFaqPage';
import AdminCommunityPage from './pages/Community/AdminCommunityPage';
import AdminCommunityDetailPage from './pages/Community/AdminCommunityDetail';
import AdminNoticePage from './pages/Notice/AdminNoticePage';

// 아직 없는 파일은 import 에러가 날 수 있으니 주석 처리하거나 빈 파일 생성 필요
// import AdminDashboardPage from './pages/AdminDashboardPage'; 
// import AdminMemberPage from './pages/AdminMemberPage';
// import AdminCenterPage from './pages/AdminCenterPage';

function App() {
  /*
  useEffect(() => {
    // Load Bootstrap JS
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);
  */

  return (
    <Router>
      <Routes>
        {/* 1. 로그인 페이지 (레이아웃 없음) */}
        <Route path="/" element={<AdminLayout />} />

        {/* 2. 관리자 레이아웃 적용 그룹 */}
        {/* AdminLayout을 공통 부모로 사용합니다. */}
        <Route element={<LayoutWrapper />}>
          <Route path="/dashboard" element={<div className="p-4">대시보드(준비중)</div>} />
          <Route path="/members" element={<div className="p-4">회원관리(준비중)</div>} />
          <Route path="/centers" element={<div className="p-4">센터관리(준비중)</div>} />

          {/* 이미 만드신 페이지들 */}
          <Route path="/trades" element={<AdminTradePage />} />
          <Route path="/reservations" element={<AdminReservationPage />} />
          <Route path="/tickets" element={<AdminTicketPage />} />

          {/* FAQ */}
          <Route path="/AdminFaqPage" element={<AdminFaqPage />} />
          {/*  커뮤니티 */}
          <Route path="/community" element={<AdminCommunityPage />} />
          <Route path="/community/detail/:id" element={<AdminCommunityDetailPage />} />
          {/* 공지사항 */}
          <Route path="/notice" element={<AdminNoticePage />} />

        </Route>
      </Routes>
    </Router>
  );
}

// [Tip] LayoutWrapper: AdminLayout 안에 <Outlet />을 넣어 자식 라우트를 렌더링하게 해줍니다.
function LayoutWrapper() {
  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
}

export default App;

