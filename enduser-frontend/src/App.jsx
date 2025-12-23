import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './styles/common.css';


// Components
import Layout from './components/Layout';

// Pages
import Home from './pages/Home/Home';
import About from './pages/About/About';
import Contact from './pages/Contact/Contact';
import Pricing from './pages/Pricing/Pricing';
import FAQ from './pages/FAQ/FAQ';
import BlogHome from './pages/BlogHome/BlogHome';
import BlogPost from './pages/BlogPost/BlogPost';
import PortfolioOverview from './pages/PortfolioOverview/PortfolioOverview';
import PortfolioItem from './pages/PortfolioItem/PortfolioItem';
import MyPage from './pages/MyPage/MyPage';
import UsageStatus from './pages/UsageStatus/UsageStatus';
import CommunityUser from './pages/Community/CommunityUser';
import CommunityUserDetail from './pages/Community/CommunityUserDetail';
import CommunityUserWrite from './pages/Community/CommunityUserWrite';
import CommunityMyRecruitList from './pages/Community/CommunityMyRecruitList';
import CommunityMyPostList from './pages/Community/CommunityMyPostList';

import NoticeUserPage from "./pages/Notice/NoticeUserPage";
import TypeSelect from './pages/ToReservation/TypeSelect';
import ScheduleListPage from './pages/ToReservation/ScheduleListPage';


function App() {
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

  return (
    <HelmetProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/blog" element={<BlogHome />} />
            <Route path="/blog/post" element={<BlogPost />} />
            <Route path="/portfolio" element={<PortfolioOverview />} />
            <Route path="/portfolio/item" element={<PortfolioItem />} />
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/mypage/usage-status" element={<UsageStatus />} />
            <Route path="*" element={<div>404 Not Found</div>} />

            <Route path="/community" element={<CommunityUser />} />
            <Route path="/community/:postId" element={<CommunityUserDetail />} />
            <Route path="/community/write" element={<CommunityUserWrite />} />
            <Route path="/community/my-recruits" element={<CommunityMyRecruitList />}/>
            <Route path="/community/my-posts" element={<CommunityMyPostList />} />

            <Route path="/notice" element={<NoticeUserPage />} />

            {/* 예약하기 */}
            <Route path="/type-select" element={<TypeSelect />} />
            <Route path="/type-sport" element={<ScheduleListPage />} />


          </Routes>
        </Layout>
      </Router>
    </HelmetProvider>
  );
}

export default App;

