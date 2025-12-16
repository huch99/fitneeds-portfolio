import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Community.css';

function CommunityMyPostList() {
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // UI 상태
  const [category, setCategory] = useState('전체');
  const [keyword, setKeyword] = useState('');

  const loginUserId = localStorage.getItem('userId');

  /* =========================
     내가 쓴 글 목록 조회
  ========================= */
  const fetchMyPosts = async () => {
    if (!loginUserId) {
      alert('로그인이 필요합니다.');
      navigate('/community');
      return;
    }

    try {
      const res = await axios.get(
        '/api/user/community/my-posts',
        { params: { userId: loginUserId } }
      );
      setPosts(res.data);
      setFilteredPosts(res.data);
    } catch (e) {
      alert('내가 쓴 글 조회 실패');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyPosts();
  }, []);

  /* =========================
     검색 / 필터
  ========================= */
  const handleSearch = () => {
    let result = [...posts];

    if (category !== '전체') {
      result = result.filter((post) => post.category === category);
    }

    if (keyword.trim()) {
      const lowerKeyword = keyword.toLowerCase();
      result = result.filter(
        (post) =>
          post.title?.toLowerCase().includes(lowerKeyword) ||
          post.content?.toLowerCase().includes(lowerKeyword)
      );
    }

    setFilteredPosts(result);
  };

  const getCategoryClass = (category) => {
    switch (category) {
      case '모집':
        return 'category-badge category-recruit';
      case '정보공유':
        return 'category-badge category-info';
      case '후기':
        return 'category-badge category-review';
      case '자유':
        return 'category-badge category-free';
      default:
        return 'category-badge';
    }
  };

  const getRecruitStatusBadge = (post) => {
  if (post.category !== '모집') return null;
  if (!post.recruitStatus) return null;

  const isClosed = post.recruitStatus === '모집종료';

  return (
    <span
      className={`recruit-status-badge ${
        isClosed ? 'recruit-closed' : 'recruit-open'
      }`}
    >
      {post.recruitStatus}
    </span>
  );
};


  if (loading) {
    return <div className="community-container">로딩 중...</div>;
  }

  return (
    <div className="community-container">
      <h2 className="community-title">내가 쓴 글</h2>
      <p className="community-subtitle">
        내가 작성한 커뮤니티 글 목록입니다
      </p>

      <div className="community-top-buttons">
        <button onClick={() => navigate('/community')}>전체 목록</button>
        <button className="active">내가 쓴 글</button>
        <button onClick={() => navigate('/community/my-recruits')}>
          내가 참여한 모집
        </button>
      </div>

      <div className="community-filter">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="전체">전체</option>
          <option value="모집">모집</option>
          <option value="정보공유">정보공유</option>
          <option value="후기">후기</option>
          <option value="자유">자유</option>
        </select>

        <input
          type="text"
          placeholder="제목, 내용 검색"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />

        <button onClick={handleSearch}>검색</button>
      </div>

      <table className="community-table">
        <thead>
          <tr>
            <th>번호</th>
            <th>카테고리</th>
            <th>제목</th>
            <th>작성일</th>
            <th>조회</th>
          </tr>
        </thead>
        <tbody>
          {filteredPosts.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                작성한 글이 없습니다.
              </td>
            </tr>
          ) : (
            filteredPosts.map((post) => (
              <tr key={post.postId}>
                <td>{post.postId}</td>
                <td>
                  <span className={getCategoryClass(post.category)}>
                    {post.category}
                  </span>
                </td>
                <td
                  className="community-title-link"
                  onClick={() => navigate(`/community/${post.postId}`)}
                >
                  {post.title}
                  {getRecruitStatusBadge(post)}
                </td>
                <td>{post.createdAt?.substring(0, 10)}</td>
                <td>{post.views}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="community-bottom">
        <div className="community-count">
          총 {filteredPosts.length}건
        </div>

        <button
          className="community-write-btn"
          onClick={() => navigate('/community/write')}
        >
          글쓰기
        </button>
      </div>
    </div>
  );
}

export default CommunityMyPostList;
