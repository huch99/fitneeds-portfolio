// passtrade
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import api from '../../api';
import './PassTradeFavorite.css'; // CSS 파일 생성 필요

const PassTradeFavorite = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [favorites, setFavorites] = useState([]);

  const fetchFavorites = async () => {
    if (!isAuthenticated) return;
    try {
      const response = await api.get('/api/pass-trade-favorite');
      setFavorites(response.data);
    } catch (error) {
      console.error('즐겨찾기 목록 조회 실패:', error);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [isAuthenticated]);

  return (
    <div className="pass-trade-favorite">
      <h1>즐겨찾기</h1>
      <div className="favorite-list">
        {favorites.length > 0 ? (
          favorites.map((fav) => (
            <div key={fav.id} className="favorite-item">
              <h3>{fav.post.type}</h3>
              <p>잔여 횟수: {fav.post.remaining}</p>
              <p>가격: {fav.post.price}원</p>
              <p>판매자: {fav.post.seller}</p>
            </div>
          ))
        ) : (
          <p>즐겨찾기한 게시글이 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default PassTradeFavorite;