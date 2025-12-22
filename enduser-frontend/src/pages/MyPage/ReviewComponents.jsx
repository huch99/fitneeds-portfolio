import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import { USER_ID_KEY } from '../../store/authSlice';

/* =========================
   API 함수들
========================= */
// 결제완료된 예약 목록 조회
const getMyCompletedReservations = async () => {
  try {
    const response = await api.get('/reservation/my/completed');
    return response.data;
  } catch (error) {
    console.error('결제완료 예약 목록 조회 실패:', error);
    throw error;
  }
};

// 리뷰 생성
const createReview = async (reviewData) => {
  try {
    const response = await api.post('/api/reviews', reviewData);
    return response.data;
  } catch (error) {
    console.error('리뷰 생성 실패:', error);
    throw error;
  }
};

// 리뷰 수정
const updateReview = async (reviewId, reviewData) => {
  try {
    const response = await api.put(`/api/reviews/${reviewId}`, reviewData);
    return response.data;
  } catch (error) {
    console.error('리뷰 수정 실패:', error);
    throw error;
  }
};

// 리뷰 삭제
const deleteReview = async (reviewId) => {
  try {
    const response = await api.delete(`/api/reviews/${reviewId}`);
    return response.data;
  } catch (error) {
    console.error('리뷰 삭제 실패:', error);
    throw error;
  }
};

// 리뷰 작성 모달
export function ReviewModal({ isOpen, onClose, historyId, onRefresh }) {
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reservation, setReservation] = useState(null);

  // localStorage에서 userId 가져오기
  const loginUserId = localStorage.getItem(USER_ID_KEY);

  // 예약 정보 가져오기
  useEffect(() => {
    if (isOpen && historyId) {
      if (!loginUserId) {
        alert('로그인이 필요합니다.');
        onClose();
        navigate('/mypage');
        return;
      }

      const fetchReservation = async () => {
        try {
          // 이용내역에서 예약 정보 찾기
          const data = await getMyCompletedReservations();
          const found = data.find(r => r.reservationId === historyId);
          if (found) {
            setReservation({
              id: found.reservationId,
              reservationId: found.reservationId,
              trainerName: found.trainerName || ''
            });
          }
        } catch (error) {
          console.error('예약 정보 조회 실패:', error);
        }
      };
      fetchReservation();
    }
  }, [isOpen, historyId, loginUserId, navigate, onClose]);

  // 모달이 열릴 때마다 초기화
  useEffect(() => {
    if (isOpen) {
      setRating(0);
      setReviewText('');
      setReservation(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!loginUserId) {
      alert('로그인이 필요합니다.');
      onClose();
      navigate('/mypage');
      return;
    }

    if (!rating || !reviewText.trim()) {
      alert('평점과 리뷰 내용을 입력해주세요.');
      return;
    }

    if (!reservation) {
      alert('예약 정보를 찾을 수 없습니다.');
      return;
    }

    setIsSubmitting(true);
    try {
      await createReview({
        reservationId: reservation.reservationId || reservation.id,
        rating: rating,
        content: reviewText,
        instructorId: null // 강사 ID는 선택사항 (개인 레슨인 경우에만 필요)
      });
      alert('리뷰가 작성되었습니다.');
      setRating(0);
      setReviewText('');
      onClose();
      onRefresh(); // 새로고침
    } catch (error) {
      alert('리뷰 작성에 실패했습니다.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal-content review-modal-content">
        <button onClick={onClose} className="modal-close-button">×</button>
        <h2 style={{ marginBottom: '20px', color: '#212529' }}>리뷰 작성</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#212529', fontWeight: '600' }}>
              평점
            </label>
            <div style={{ display: 'flex', gap: '5px' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '2rem',
                    cursor: 'pointer',
                    color: star <= rating ? '#FFC107' : '#ddd',
                    padding: 0
                  }}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#212529', fontWeight: '600' }}>
              리뷰 내용
            </label>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="리뷰를 작성해주세요"
              style={{
                width: '100%',
                minHeight: '150px',
                padding: '10px',
                border: '1px solid #ced4da',
                borderRadius: '4px',
                fontSize: '14px',
                fontFamily: 'inherit',
                resize: 'vertical',
                boxSizing: 'border-box'
              }}
              required
            />
          </div>
          <button 
            type="submit" 
            className="btn-submit"
            style={{ marginTop: '10px' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? '등록 중...' : '리뷰 등록'}
          </button>
        </form>
      </div>
    </>
  );
}

// 리뷰 수정 모달
export function ReviewEditModal({ isOpen, onClose, reviewId, writtenReviews, onRefresh }) {
  const navigate = useNavigate();
  // reviewId로 리뷰 찾기 (reviewId는 실제 리뷰 ID)
  const review = writtenReviews.find(r => r.reviewId === reviewId);
  const [rating, setRating] = useState(review?.rating || 0);
  const [reviewText, setReviewText] = useState(review?.reviewText || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // localStorage에서 userId 가져오기
  const loginUserId = localStorage.getItem(USER_ID_KEY);

  // review가 변경될 때 rating과 reviewText 업데이트
  useEffect(() => {
    if (review) {
      setRating(review.rating);
      setReviewText(review.reviewText);
    }
  }, [review]);

  if (!isOpen || !review) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!loginUserId) {
      alert('로그인이 필요합니다.');
      onClose();
      navigate('/mypage');
      return;
    }

    if (!rating || !reviewText.trim()) {
      alert('평점과 리뷰 내용을 입력해주세요.');
      return;
    }

    if (!review.reviewId) {
      alert('리뷰 ID를 찾을 수 없습니다.');
      return;
    }

    setIsSubmitting(true);
    try {
      await updateReview(review.reviewId, {
        rating: rating,
        content: reviewText
      });
      alert('리뷰가 수정되었습니다.');
      onClose();
      onRefresh(); // 새로고침
    } catch (error) {
      alert('리뷰 수정에 실패했습니다.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal-content review-modal-content">
        <button onClick={onClose} className="modal-close-button">×</button>
        <h2 style={{ marginBottom: '20px', color: '#212529' }}>리뷰 수정</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#212529', fontWeight: '600' }}>
              평점
            </label>
            <div style={{ display: 'flex', gap: '5px' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '2rem',
                    cursor: 'pointer',
                    color: star <= rating ? '#FFC107' : '#ddd',
                    padding: 0
                  }}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#212529', fontWeight: '600' }}>
              리뷰 내용
            </label>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="리뷰를 작성해주세요"
              style={{
                width: '100%',
                minHeight: '150px',
                padding: '10px',
                border: '1px solid #ced4da',
                borderRadius: '4px',
                fontSize: '14px',
                fontFamily: 'inherit',
                resize: 'vertical',
                boxSizing: 'border-box'
              }}
              required
            />
          </div>
          <button 
            type="submit" 
            className="btn-submit"
            style={{ marginTop: '10px' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? '수정 중...' : '수정 완료'}
          </button>
        </form>
      </div>
    </>
  );
}

// 리뷰 메뉴 버튼 (삭제 기능)
export function ReviewMenuButton({ reviewId, onDelete }) {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // localStorage에서 userId 가져오기
  const loginUserId = localStorage.getItem(USER_ID_KEY);

  const handleDelete = async () => {
    if (!loginUserId) {
      alert('로그인이 필요합니다.');
      navigate('/mypage');
      return;
    }

    if (window.confirm('정말 삭제하시겠습니까?')) {
      try {
        await deleteReview(reviewId);
        alert('리뷰가 삭제되었습니다.');
        setIsMenuOpen(false);
        onDelete(); // 새로고침
      } catch (error) {
        alert('리뷰 삭제에 실패했습니다.');
        console.error(error);
      }
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <button 
        className="review-written-menu-btn"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <i className="bi bi-three-dots"></i>
      </button>
      {isMenuOpen && (
        <>
          <div 
            style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              backgroundColor: 'white',
              border: '1px solid #e9ecef',
              borderRadius: '4px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              zIndex: 1000,
              minWidth: '100px'
            }}
          >
            <button
              onClick={handleDelete}
              style={{
                width: '100%',
                padding: '0.5rem 1rem',
                border: 'none',
                background: 'none',
                textAlign: 'left',
                cursor: 'pointer',
                color: '#dc3545'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
            >
              삭제
            </button>
          </div>
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 999
            }}
            onClick={() => setIsMenuOpen(false)}
          />
        </>
      )}
    </div>
  );
}

