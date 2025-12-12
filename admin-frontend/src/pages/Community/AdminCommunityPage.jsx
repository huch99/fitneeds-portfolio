import React, { useState } from 'react';

function AdminCommunityPage() {
  const [posts, setPosts] = useState([
    { id: 125, category: '모집', title: '주말 풋살 팀원 추가 모집합니다', writer: '송민수', date: '2024-03-19', views: 214, commentCount: 5, visible: true },
    { id: 124, category: '정보공유', title: 'PT 할인 프로모션 정보 공유합니다', writer: '임상우', date: '2024-03-18', views: 156, commentCount: 2, visible: true },
    { id: 123, category: '후기', title: '새로 생긴 수영 강좌 후기입니다', writer: '이재규', date: '2024-03-17', views: 98, commentCount: 8, visible: false },
    { id: 122, category: '모집', title: '평일 오전 요가 같이 하실 분', writer: '박다솜', date: '2024-03-15', views: 61, commentCount: 1, visible: true },
    // 페이지네이션 테스트용 더미 데이터 (최소 20개 이상 있어야 실제 느낌남)
    ...Array.from({ length: 30 }, (_, i) => ({
      id: 121 - i,
      category: ['모집', '정보공유', '후기'][i % 3],
      title: `더미 게시글 ${i + 1}`,
      writer: `작성자${i + 1}`,
      date: '2024-03-10',
      views: Math.floor(Math.random() * 300),
      commentCount: Math.floor(Math.random() * 15),
      visible: true
    }))
  ]);

  // 필터 상태
  const [categoryFilter, setCategoryFilter] = useState('전체');
  const [visibleFilter, setVisibleFilter] = useState('전체');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [sortOption, setSortOption] = useState('latest');

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  // ------------ 필터 적용 ------------
  let filteredPosts = posts.filter((post) => {
    const categoryPass =
      categoryFilter === '전체' ? true : post.category === categoryFilter;

    const visiblePass =
      visibleFilter === '전체'
        ? true
        : visibleFilter === '노출'
          ? post.visible
          : !post.visible;

    const searchPass =
      post.title.includes(searchKeyword) ||
      post.writer.includes(searchKeyword);

    return categoryPass && visiblePass && searchPass;
  });

  // ------------ 정렬 적용 ------------
  filteredPosts = filteredPosts.sort((a, b) => {
    switch (sortOption) {
      case 'views':
        return b.views - a.views;
      case 'comments':
        return b.commentCount - a.commentCount;
      default:
        return b.id - a.id; // 최신순
    }
  });

  // ------------ 페이지네이션 로직 ------------
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const indexOfLast = currentPage * postsPerPage;
  const indexOfFirst = indexOfLast - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirst, indexOfLast);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // ------------ 숨김/보이기 토글 ------------
  const toggleVisible = (id) => {
    setPosts(
      posts.map((p) =>
        p.id === id ? { ...p, visible: !p.visible } : p
      )
    );
  };

  // ------------ 삭제 기능 ------------
  const deletePost = (id) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    setPosts(posts.filter((p) => p.id !== id));
  };

  return (
    <>
      <h1>커뮤니티 관리</h1>

      {/* 필터 영역 */}
      <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '20px' }}>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="전체">카테고리 전체</option>
          <option value="모집">모집</option>
          <option value="정보공유">정보공유</option>
          <option value="후기">후기</option>
        </select>

        <select value={visibleFilter} onChange={(e) => setVisibleFilter(e.target.value)}>
          <option value="전체">전체</option>
          <option value="노출">노출</option>
          <option value="숨김">숨김</option>
        </select>

        <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
          <option value="latest">최신순</option>
          <option value="views">조회수 높은 순</option>
          <option value="comments">댓글 많은 순</option>
        </select>

        <input
          type="text"
          placeholder="제목 또는 작성자 검색"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          style={{ width: '200px', padding: '5px' }}
        />
      </div>

      {/* 게시글 목록 */}
      <table className="admin-table">
        <thead>
          <tr>
            <th>번호</th>
            <th>카테고리</th>
            <th>제목</th>
            <th>작성자</th>
            <th>작성일</th>
            <th>조회</th>
            <th>댓글</th>
            <th>노출</th>
            <th>관리</th>
          </tr>
        </thead>

        <tbody>
          {currentPosts.map((p) => (
            <tr key={p.id} style={{ opacity: p.visible ? 1 : 0.4 }}>
              <td>{p.id}</td>
              <td>{p.category}</td>
              <td>
                <a href={`/community/detail/${p.id}`} style={{ color: p.visible ? 'black' : 'gray' }}>
                  {p.title}
                </a>
              </td>
              <td>{p.writer}</td>
              <td>{p.date}</td>
              <td>{p.views}</td>
              <td>{p.commentCount}</td>

              <td>
                <button onClick={() => toggleVisible(p.id)}>
                  {p.visible ? '숨김' : '보이기'}
                </button>
              </td>

              <td>
                <button style={{ color: 'red' }} onClick={() => deletePost(p.id)}>
                  삭제
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 페이지네이션 UI */}
      <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <button onClick={() => goToPage(currentPage - 1)}>이전</button>

        {[...Array(totalPages)].map((_, idx) => {
          const pageNum = idx + 1;
          return (
            <button
              key={pageNum}
              onClick={() => goToPage(pageNum)}
              style={{
                fontWeight: currentPage === pageNum ? 'bold' : 'normal',
                textDecoration: currentPage === pageNum ? 'underline' : 'none'
              }}
            >
              {pageNum}
            </button>
          );
        })}

        <button onClick={() => goToPage(currentPage + 1)}>다음</button>
      </div>
    </>
  );
}

export default AdminCommunityPage;
