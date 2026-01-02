import React, { useState, useEffect } from 'react';

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
        
        // ===== 더미 데이터 (화면 확인용) =====
        // TODO: 백엔드 API 연결 후 제거
        setPopularCategories([{
          id: 1,
          name: '필라테스',
          image: '/images/pilates.png'
        }]);
        
        setPopularSearches([{
          id: 1,
          keyword: '요가',
          trend: 'up'
        }]);
        // ===== 더미 데이터 끝 =====
      } catch (error) {
        console.error('검색 데이터 로딩 실패:', error);
        
        // ===== 더미 데이터 (에러 시 화면 확인용) =====
        setPopularCategories([{
          id: 1,
          name: '필라테스',
          image: '/images/pilates.png'
        }]);
        
        setPopularSearches([{
          id: 1,
          keyword: '요가',
          trend: 'up'
        }]);
        // ===== 더미 데이터 끝 =====
      } finally {
        setSearchLoading(false);
      }
    };
    
    fetchSearchData();
  }, []);
  
  // 최근 검색어 더미 데이터 (화면 확인용)
  useEffect(() => {
    // 최근 검색어가 없으면 더미 데이터 추가
    if (recentSearches.length === 0) {
      setRecentSearches(['필라테스']);
    }
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

export default SearchSection;