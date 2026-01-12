// passtrade
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import api from '../../api';
import './PassTradePost.css'; // CSS 파일 생성 필요

const PassTradePost = () => {
  const { isAuthenticated, userId } = useSelector((state) => state.auth); //로그인 여부
  const [posts, setPosts] = useState([]);      //거래 게시글 목록
  const [favorites, setFavorites] = useState(new Set());    //즐겨찾기한 게시글 ID 집합, (Set을 쓴 이유: 포함 여부 체크 빠름)

  const [showRegisterModal, setShowRegisterModal] = useState(false);   //등록 / 구매 / 수정 모달 열림 여부
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);     //구매 모달용 선택된 게시글
  const [editPost, setEditPost] = useState(null);         //수정 모달용 선택된 게시글
  const [loading, setLoading] = useState(false);           //API 중복 요청 방지 + 버튼 비활성화용


  // ===============================
  // 1. 게시글 목록 조회 기능
  // ===============================
  const fetchPosts = async () => {
    try {
      const response = await api.get('/api/pass-trade/posts');
      setPosts(response.data);
    } catch (error) {
      console.error('게시글 목록 조회 실패:', error);
    }
  };

  // ===============================
  // 2. 즐겨찾기 목록 조회 기능
  // ===============================
  const fetchFavorites = async () => {
    if (!isAuthenticated) return;
    try {
      const response = await api.get('/api/pass-trade-favorite');
      const favIds = new Set(response.data.map(fav => fav.postId));
      setFavorites(favIds);
    } catch (error) {
      console.error('즐겨찾기 목록 조회 실패:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchFavorites();
  }, [isAuthenticated]);

 

  // ===============================
  // 5. 게시글 삭제 기능
  // ===============================
  const handleDelete = async (postId) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    try {
      await api.delete(`/api/pass-trade/posts/${postId}`);
      alert('삭제 완료');
      fetchPosts(); // 게시글 목록 즉시 갱신
    } catch (error) {
      console.error('게시글 삭제 실패:', error);
      alert('삭제 실패');
    }
  };

  // ===============================
  // 6. 게시글 수정 기능
  // ===============================
  const handleEdit = (post) => {
    setEditPost(post);
    setShowEditModal(true);
  };

  // ===============================
// 7. 등록/수정 모달 컴포넌트 (RegisterModal 패턴 재사용)
// ===============================
const RegisterModal = ({ isEdit = false }) => {
  // ===============================
  // 상태 정의 영역 (JS 로직)
  // ===============================
  const [title, setTitle] = useState(isEdit ? editPost?.title || '' : '');
  const [content, setContent] = useState(isEdit ? editPost?.content || '' : '');
  const [sellCount, setSellCount] = useState(isEdit ? editPost?.sellCount || '' : '');
  const [saleAmount, setSaleAmount] = useState(isEdit ? editPost?.saleAmount || '' : '');

  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ===============================
    // 수정 모드
    // ===============================
    if (isEdit) {
      if (!title || !content || sellCount <= 0 || saleAmount <= 0) {
        alert('유효한 제목, 내용, 판매 수량, 판매 금액을 입력하세요.');
        return;
      }

      setLoading(true);
      try {
        await api.patch(`/api/pass-trade/posts/${editPost.id}`, {
          title,
          content,
          sellCount: Number(sellCount),
          saleAmount: Number(saleAmount),
        });

        alert('수정 완료');
        setShowEditModal(false);
        setEditPost(null);
        fetchPosts();
      } catch (error) {
        console.error('게시글 수정 실패:', error);
        alert('수정 실패');
      } finally {
        setLoading(false);
      }
      return;
    }

    // ===============================
    // 등록 모드
    // ===============================
    if (!quantity || !price || quantity <= 0 || price <= 0) {
      alert('유효한 수량과 가격을 입력하세요.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/api/pass-trade/posts', {
        sellerId: userId,
        quantity: Number(quantity),
        price: Number(price),
      });

      alert('등록 완료');
      setShowRegisterModal(false);
      setQuantity('');
      setPrice('');
      fetchPosts();
    } catch (error) {
      console.error('게시글 등록 실패:', error);
      alert('등록 실패');
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    if (isEdit) {
      setShowEditModal(false);
      setEditPost(null);
    } else {
      setShowRegisterModal(false);
    }
  };

  // ===============================
  // JSX 렌더링 영역 (화면)
  // ===============================
  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{isEdit ? '거래 게시글 수정' : '거래 게시글 등록'}</h2>

        {/* ===== 보유 이용권 정보 표시 영역 (등록 시만 노출) ===== */}
        {!isEdit && (
          <div className="user-pass-summary">
            <p>종목: 헬스</p>
            <p>이용권명: 헬스 이용권</p>
            <p>지점: 강남점</p>
            <p>유효기간: 2026.05.30</p>
            <p>잔여 횟수: 5회</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {isEdit ? (
            <>
              <div>
                <label>제목:</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div>
                <label>내용:</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                />
              </div>

              <div>
                <label>판매 수량:</label>
                <input
                  type="number"
                  value={sellCount}
                  onChange={(e) => setSellCount(e.target.value)}
                  min="1"
                  required
                />
              </div>

              <div>
                <label>판매 금액:</label>
                <input
                  type="number"
                  value={saleAmount}
                  onChange={(e) => setSaleAmount(e.target.value)}
                  min="1"
                  required
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label>수량:</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  min="1"
                  required
                />
              </div>

              <div>
                <label>가격:</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  min="1"
                  required
                />
              </div>
            </>
          )}

          <button type="submit" disabled={loading}>
            {isEdit ? '수정' : '등록'}
          </button>
        </form>
      </div>
    </div>
  );
};


  // ===============================
  // 9. 메인 렌더링
  // ===============================

  return (
    <div className="pass-trade-post">
      <h1>거래 게시글 목록</h1>
      {isAuthenticated && (
        <button onClick={() => setShowRegisterModal(true)}>게시글 등록</button>
      )}
      <div className="post-list">
        {posts.map((post) => (
          <div key={post.id} className="post-card" onClick={() => handleCardClick(post)}>
            <h3>{post.type}</h3>
            <p>잔여 횟수: {post.remaining}</p>
            <p>가격: {post.price}원</p>
            <p>판매자: {post.seller}</p>
            {isAuthenticated && (
              <button
                className={`favorite-btn ${favorites.has(post.id) ? 'active' : ''}`}
                onClick={(e) => { e.stopPropagation(); toggleFavorite(post.id); }}
              >
                ♥
              </button>
            )}
            {post.sellerId === userId && (
              <>
                <button onClick={(e) => { e.stopPropagation(); handleEdit(post); }}>수정</button>
                <button onClick={(e) => { e.stopPropagation(); handleDelete(post.id); }}>삭제</button>
              </>
            )}
          </div>
        ))}
      </div>
      {showRegisterModal && <RegisterModal />}
      {showEditModal && <RegisterModal isEdit={true} />}
      {showBuyModal && <BuyModal />}
    </div>
  );
};

export default PassTradePost;