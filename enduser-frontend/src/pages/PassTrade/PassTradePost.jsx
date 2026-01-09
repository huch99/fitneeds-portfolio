// passtrade
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import api from '../../api';
import './PassTradePost.css'; // CSS 파일 생성 필요

const PassTradePost = () => {
  const { isAuthenticated, userId } = useSelector((state) => state.auth);
  const [posts, setPosts] = useState([]);
  const [favorites, setFavorites] = useState(new Set());
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [loading, setLoading] = useState(false);

  // 게시글 목록 조회
  const fetchPosts = async () => {
    try {
      const response = await api.get('/api/pass-trade/posts');
      setPosts(response.data);
    } catch (error) {
      console.error('게시글 목록 조회 실패:', error);
    }
  };

  // 즐겨찾기 목록 조회
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

  // 즐겨찾기 토글
  const toggleFavorite = async (postId) => {
    if (!isAuthenticated) return;
    try {
      if (favorites.has(postId)) {
        await api.delete(`/api/pass-trade-favorite/${postId}`);
        setFavorites(prev => new Set([...prev].filter(id => id !== postId)));
      } else {
        await api.post('/api/pass-trade-favorite', { postId });
        setFavorites(prev => new Set([...prev, postId]));
      }
    } catch (error) {
      console.error('즐겨찾기 토글 실패:', error);
    }
  };

  // 카드 클릭 시 구매 모달 오픈
  const handleCardClick = (post) => {
    if (!isAuthenticated) return;
    setSelectedPost(post);
    setShowBuyModal(true);
  };

  // 등록 모달 컴포넌트
  const RegisterModal = () => {
    const [quantity, setQuantity] = useState('');
    const [price, setPrice] = useState('');

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!quantity || !price || quantity <= 0 || price <= 0) {
        alert('유효한 수량과 가격을 입력하세요.');
        return;
      }
      setLoading(true);
      try {
        await api.post('/api/pass-trade/posts', {
          sellerId: userId,
          quantity: parseInt(quantity),
          price: parseInt(price),
        });
        setShowRegisterModal(false);
        setQuantity('');
        setPrice('');
        fetchPosts(); // 목록 갱신
      } catch (error) {
        console.error('게시글 등록 실패:', error);
        alert('등록 실패');
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="modal-overlay" onClick={() => setShowRegisterModal(false)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <h2>거래 게시글 등록</h2>
          <form onSubmit={handleSubmit}>
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
            <button type="submit" disabled={loading}>등록</button>
          </form>
        </div>
      </div>
    );
  };

  // 구매 모달 컴포넌트
  const BuyModal = () => {
    const [quantity, setQuantity] = useState(1);
    const totalPrice = selectedPost ? selectedPost.price * quantity : 0;

    const handleBuy = async () => {
      if (quantity > selectedPost.remaining) {
        alert('수량이 부족합니다.');
        return;
      }
      setLoading(true);
      try {
        await api.post(`/api/pass-trade/posts/${selectedPost.id}/buy`, {
          buyerId: userId,
          quantity: parseInt(quantity),
        });
        alert('구매 완료');
        setShowBuyModal(false);
        fetchPosts(); // 목록 갱신
      } catch (error) {
        console.error('구매 실패:', error);
        alert('구매 실패');
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="modal-overlay" onClick={() => setShowBuyModal(false)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <h2>구매 확인</h2>
          <p>이용권: {selectedPost?.type}</p>
          <p>가격: {selectedPost?.price}원</p>
          <div>
            <label>수량:</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))}
              min="1"
              max={selectedPost?.remaining}
            />
          </div>
          <p>총 금액: {totalPrice}원</p>
          <button onClick={handleBuy} disabled={loading}>구매</button>
        </div>
      </div>
    );
  };

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
          </div>
        ))}
      </div>
      {showRegisterModal && <RegisterModal />}
      {showBuyModal && <BuyModal />}
    </div>
  );
};

export default PassTradePost;