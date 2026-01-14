import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import './styles/Admin.css';

// Pages
import AdminLayout from './components/AdminLayout';
import AdminTicketPage from './pages/pass/AdminTicketPage';
import AdminReservationPage from './pages/AdminReservationPage';
import AdminTradePage from './pages/AdminTradePage';
import AdminFaqPage from './pages/FAQ/AdminFaqPage';
import AdminCommunityPage from './pages/Community/AdminCommunityPage';
import AdminCommunityDetailPage from './pages/Community/AdminCommunityDetail';
import AdminNoticePage from './pages/Notice/AdminNoticePage';
import UserPage from './pages/Users/UsersPage';
import UsersAdminPage from './pages/UsersAdmin/UsersAdminPage';
// Branch pages
import AdminBranchPage from './pages/AdminBranchPage';
import AdminBranchInfoPage from './pages/AdminBranchInfoPage';
import BranchList from './pages/branch/BranchList';
import BranchDetail from './pages/branch/BranchDetail';
import BranchRegister from './pages/branch/BranchRegister';
import BranchForm from './pages/branch/BranchForm';
// Schedule page
import AdminSchedulePage from './pages/AdminSchedulePage';
// Payment page
import PaymentManagement from './pages/payment/PaymentManagement';
// Center page
import CenterInfo from './pages/center/CenterInfo';
// Attendance page
import AdminAttendancePage from './pages/AdminAttendancePage';

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
          <Route path="/Usersadmin" element={<UsersAdminPage />} />
          <Route path="/users" element={<UserPage />} />
          <Route path="/centers" element={<CenterInfo />} />
          <Route path="/centers/:branchId" element={<CenterInfo />} />

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

          {/* 지점 관리 */}
          <Route path="/branches" element={<AdminBranchPage />} />
          <Route path="/branch-info" element={<AdminBranchInfoPage />} />
          <Route path="/branches/list" element={<BranchList />} />
          <Route path="/branches/new" element={<BranchRegister />} />
          <Route path="/branches/:branchId" element={<BranchDetail />} />
          <Route path="/branches/:branchId/edit" element={<BranchForm />} />

          {/* 스케줄 관리 */}
          <Route path="/schedules" element={<AdminSchedulePage />} />

          {/* 결제 관리 */}
          <Route path="/payment" element={<PaymentManagement />} />

          {/* 출결관리 */}
          <Route path="/attendance" element={<AdminAttendancePage />} />

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

