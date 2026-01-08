import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navigation.css';
import LoginButtonAndModal from './auth/LoginButtonAndModal';

function Navigation() {
  const [blogDropdownOpen, setBlogDropdownOpen] = useState(false);
  const [portfolioDropdownOpen, setPortfolioDropdownOpen] = useState(false);

  // [ADD] 이용권 드롭다운 상태
  const [passDropdownOpen, setPassDropdownOpen] = useState(false);

  const [isScrolled, setIsScrolled] = useState(false);
  const blogDropdownRef = useRef(null);
  const portfolioDropdownRef = useRef(null);

  // [ADD] 이용권 드롭다운 ref
  const passDropdownRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();

  // Close dropdowns when route changes
  useEffect(() => {
    setBlogDropdownOpen(false);
    setPortfolioDropdownOpen(false);

    // [ADD] 이용권 드롭다운 닫기
    setPassDropdownOpen(false);
  }, [location]);

  // Handle scroll to change header style - only on home page
  useEffect(() => {
    if (location.pathname !== '/') {
      setIsScrolled(true);
      return;
    }

    setIsScrolled(false);

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [location.pathname]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (blogDropdownRef.current && !blogDropdownRef.current.contains(event.target)) {
        setBlogDropdownOpen(false);
      }
      if (portfolioDropdownRef.current && !portfolioDropdownRef.current.contains(event.target)) {
        setPortfolioDropdownOpen(false);
      }

      // [ADD] 이용권 드롭다운 바깥 클릭 처리
      if (passDropdownRef.current && !passDropdownRef.current.contains(event.target)) {
        setPassDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className={`nav-main ${isScrolled ? 'nav-scrolled' : ''}`}>
      <div className="nav-container">
        <Link className="nav-logo" to="/">FITNEEDS</Link>
        <button
          className="nav-toggle"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#nav-menu"
          aria-controls="nav-menu"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="nav-toggle-icon"></span>
        </button>
        <div className="nav-menu-collapse" id="nav-menu">
          <ul className="nav-menu-list">
            <li className="nav-menu-item">
              <Link className="nav-menu-link" to="/">홈</Link>
            </li>

            <li className="nav-menu-item">
              <Link className="nav-menu-link" to="/about">센터안내</Link>
            </li>
            <li className="nav-menu-item">
              <Link className="nav-menu-link" to="/pricing">수강안내</Link>
            </li>
            <li className="nav-menu-item">
              {/* <Link className="nav-menu-link" to="/contact">예약하기</Link> */}
              <Link className="nav-menu-link" to="/type-select">예약하기</Link>
            </li>
            <li className="nav-menu-item">
              <Link 
                className="nav-menu-link" 
                to="/mypage"
                onClick={(e) => {
                  if (location.pathname.startsWith('/mypage')) {
                    e.preventDefault();
                    navigate('/mypage', { 
                      replace: false,
                      state: { menu: null }
                    });
                  }
                }}
              >
                나의 운동
              </Link>
            </li>

            {/* ================= 이용권 드롭다운 [ADD] ================= */}
            <li
              className="nav-menu-item nav-dropdown"
              ref={passDropdownRef}
              onMouseEnter={() => setPassDropdownOpen(true)}
              onMouseLeave={() => setPassDropdownOpen(false)}
            >
              <Link className="nav-menu-link nav-dropdown-toggle" to="/pass-trade">
                이용권
              </Link>

              <ul className={`nav-dropdown-menu ${passDropdownOpen ? 'nav-dropdown-show' : ''}`}>
                <li>
                  <Link className="nav-dropdown-item" to="/pass-trade">
                    이용권 거래
                  </Link>
                </li>
                <li>
                  <Link className="nav-dropdown-item" to="/mypage">
                    이용권 관리
                  </Link>
                </li>
              </ul>
            </li>
            {/* ========================================================= */}

            <li
              className="nav-menu-item nav-dropdown"
              ref={portfolioDropdownRef}
              onMouseEnter={() => setPortfolioDropdownOpen(true)}
              onMouseLeave={() => setPortfolioDropdownOpen(false)}
            >
              <Link className="nav-menu-link nav-dropdown-toggle" to="/community">
                커뮤니티
              </Link>

              <ul className={`nav-dropdown-menu ${portfolioDropdownOpen ? 'nav-dropdown-show' : ''}`}>
                <li>
                  <Link className="nav-dropdown-item" to="/notice">
                    공지사항
                  </Link>
                </li>
                <li>
                  <Link className="nav-dropdown-item" to="/faq">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link className="nav-dropdown-item" to="/community">
                    커뮤니티 게시판
                  </Link>
                </li>
              </ul>
            </li>

            <li
              className="nav-menu-item nav-dropdown"
              ref={blogDropdownRef}
              onMouseEnter={() => setBlogDropdownOpen(true)}
              onMouseLeave={() => setBlogDropdownOpen(false)}
            >
              <Link className="nav-menu-link nav-dropdown-toggle" to="/blog">
                블로그
              </Link>
              <ul className={`nav-dropdown-menu ${blogDropdownOpen ? 'nav-dropdown-show' : ''}`}>
                <li>
                  <Link className="nav-dropdown-item" to="/blog">
                    블로그 목록
                  </Link>
                </li>
                <li>
                  <Link className="nav-dropdown-item" to="/blog/post">
                    블로그 상세
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
        </div>

        {/* 오른쪽: 로그인/로그아웃 버튼 */}
        <div style={{ flex: 1, textAlign: 'right' }}>
          <LoginButtonAndModal />
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
