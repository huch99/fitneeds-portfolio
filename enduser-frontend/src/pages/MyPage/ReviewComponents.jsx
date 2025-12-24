import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';

/* =========================
   공통 함수
========================= */
const getUserId = () => localStorage.getItem('userId');
const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken');
  return {
    'Authorization': token ? `Bearer ${token}` : '',
    'Content-Type': 'application/json'
  };
};

/* =========================
   API 요청
========================= */
const getMyCompletedReservations = async () => {
  const userId = getUserId();
  if (!userId) return [];
  try {
    const res = await api.get('/reviews/my/completed-reservations', {
      params: { userId },
      headers: getAuthHeaders()
    });
    return res.data || [];
  } catch (error) {
    console.error('결제완료 예약 목록 조회 실패:', error);
    return [];
  }
};

const createReview = async (reviewData) => {
  const userId = getUserId();
  if (!userId) throw new Error('로그인이 필요합니다.');
  const res = await api.post('/reviews', reviewData, {
    params: { userId },
    headers: getAuthHeaders()
  });
  return res.data;
};

const updateReview = async (reviewId, reviewData) => {
  const userId = getUserId();
  if (!userId) throw new Error('로그인이 필요합니다.');
  const res = await api.put(`/reviews/${reviewId}`, reviewData, {
    params: { userId },
    headers: getAuthHeaders()
  });
  return res.data;
};

const deleteReview = async (reviewId) => {
  const userId = getUserId();
  if (!userId) throw new Error('로그인이 필요합니다.');
  const res = await api.delete(`/reviews/${reviewId}`, {
    params: { userId },
    headers: getAuthHeaders()
  });
  return res.data;
};

/* =========================
   리뷰 작성 모달
========================= */
export function ReviewModal({ isOpen, onClose, historyId, onRefresh }) {
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reservation, setReservation] = useState(null);

  const loginUserId = getUserId();

  useEffect(() => {
    if (isOpen) {
      setRating(0);
      setReviewText('');
      setReservation(null);
      if (!loginUserId) {
        alert('로그인이 필요합니다.');
        onClose();
        navigate('/mypage');
      }
    }
  }, [isOpen, loginUserId, navigate, onClose]);

  useEffect(() => {
    if (isOpen && historyId && loginUserId) {
      const fetchReservation = async () => {
        try {
          const data = await getMyCompletedReservations(); // 예약 API
          const found = data.find(r => r.reservationId === historyId);
          if (found) {
            setReservation({
              id: found.reservationId,
              reservationId: found.reservationId,
              trainerName: found.teacherName || ''
            });
          }
        } catch (error) {
          console.error('예약 정보 조회 실패:', error);
        }
      };
      fetchReservation();
    }
  }, [isOpen, historyId, loginUserId]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!loginUserId) return alert('로그인이 필요합니다.');

    if (!rating || !reviewText.trim()) {
      return alert('평점과 리뷰 내용을 입력해주세요.');
    }

    if (!reservation) return alert('예약 정보를 찾을 수 없습니다.');

    setIsSubmitting(true);
    try {
      await createReview({
        reservationId: reservation.reservationId || reservation.id,
        rating,
        content: reviewText,
        instructorId: null
      });
      alert('리뷰가 작성되었습니다.');
      onClose();
      onRefresh();
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
        <h2>리뷰 작성</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label>평점</label>
            <div style={{ display: 'flex', gap: '5px' }}>
              {[1,2,3,4,5].map(star => (
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
                >★</button>
              ))}
            </div>
          </div>
          <div>
            <label>리뷰 내용</label>
            <textarea
              value={reviewText}
              onChange={e => setReviewText(e.target.value)}
              placeholder="리뷰를 작성해주세요"
              style={{ width: '100%', minHeight: '150px', padding: '10px', border: '1px solid #ced4da', borderRadius: '4px', resize: 'vertical' }}
              required
            />
          </div>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? '등록 중...' : '리뷰 등록'}
          </button>
        </form>
      </div>
    </>
  );
}

/* =========================
   리뷰 수정 모달
========================= */
export function ReviewEditModal({ isOpen, onClose, reviewId, writtenReviews, onRefresh }) {
  const navigate = useNavigate();
  const review = writtenReviews.find(r => r.reviewId === reviewId);
  const [rating, setRating] = useState(review?.rating || 0);
  const [reviewText, setReviewText] = useState(review?.reviewText || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const loginUserId = getUserId();

  useEffect(() => {
    if (review) {
      setRating(review.rating);
      setReviewText(review.reviewText);
    }
  }, [review]);

  if (!isOpen || !review) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!loginUserId) return alert('로그인이 필요합니다.');
    if (!rating || !reviewText.trim()) return alert('평점과 리뷰 내용을 입력해주세요.');
    if (!review.reviewId) return alert('리뷰 ID를 찾을 수 없습니다.');

    setIsSubmitting(true);
    try {
      await updateReview(review.reviewId, { rating, content: reviewText });
      alert('리뷰가 수정되었습니다.');
      onClose();
      onRefresh();
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
        <h2>리뷰 수정</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label>평점</label>
            <div style={{ display: 'flex', gap: '5px' }}>
              {[1,2,3,4,5].map(star => (
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
                >★</button>
              ))}
            </div>
          </div>
          <div>
            <label>리뷰 내용</label>
            <textarea
              value={reviewText}
              onChange={e => setReviewText(e.target.value)}
              placeholder="리뷰를 작성해주세요"
              style={{ width: '100%', minHeight: '150px', padding: '10px', border: '1px solid #ced4da', borderRadius: '4px', resize: 'vertical' }}
              required
            />
          </div>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? '수정 중...' : '수정 완료'}
          </button>
        </form>
      </div>
    </>
  );
}

/* =========================
   리뷰 메뉴 버튼 (삭제)
========================= */
export function ReviewMenuButton({ reviewId, onDelete }) {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const loginUserId = getUserId();

  const handleDelete = async () => {
    if (!loginUserId) {
      alert('로그인이 필요합니다.');
      navigate('/mypage');
      return;
    }
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    try {
      await deleteReview(reviewId);
      alert('리뷰가 삭제되었습니다.');
      setIsMenuOpen(false);
      onDelete();
    } catch (error) {
      alert('리뷰 삭제에 실패했습니다.');
      console.error(error);
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <button className="review-written-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
        <i className="bi bi-three-dots"></i>
      </button>
      {isMenuOpen && (
        <>
          <div style={{ position: 'absolute', top: '100%', right: 0, backgroundColor: 'white', border: '1px solid #e9ecef', borderRadius: '4px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', zIndex: 1000, minWidth: '100px' }}>
            <button
              onClick={handleDelete}
              style={{ width: '100%', padding: '0.5rem 1rem', border: 'none', background: 'none', textAlign: 'left', cursor: 'pointer', color: '#dc3545' }}
              onMouseEnter={e => e.target.style.backgroundColor='#f8f9fa'}
              onMouseLeave={e => e.target.style.backgroundColor='white'}
            >삭제</button>
          </div>
          <div style={{ position: 'fixed', top:0,left:0,right:0,bottom:0,zIndex:999 }} onClick={() => setIsMenuOpen(false)} />
        </>
      )}
    </div>
  );
}

/* =========================
   리뷰 작성 섹션
========================= */
function ReviewWriteSection({ reviewTab, setReviewTab }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState(null);
  const [writtenReviews, setWrittenReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedHistoryId, setSelectedHistoryId] = useState(null);

  const loginUserId = getUserId();

  const fetchMyReviews = async () => {
    if (!loginUserId) return setWrittenReviews([]);
    setLoading(true);
    try {
      const res = await api.get('/reviews/my', {
        params: { userId: loginUserId },
        headers: getAuthHeaders()
      });
      const transformedReviews = res.data.map(review => ({
        id: review.reviewId,
        reviewId: review.reviewId,
        reservationId: review.reservationId,
        date: review.exerciseDate ? new Date(review.exerciseDate).toISOString().split('T')[0] : '',
        productName: review.productName,
        teacherId: review.teacherName,
        facility: review.facilityName, 
        rating: review.rating,
        reviewText: review.content || '',
        writtenDate: review.registrationDateTime ? new Date(review.registrationDateTime).toISOString().split('T')[0].replace(/-/g,'.') : '',
        image: '/images/pilates.png'
      }));
      setWrittenReviews(transformedReviews);
    } catch (e) {
      console.error('리뷰 목록 조회 실패:', e);
      setWrittenReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMyReviews(); }, [loginUserId]);

  if (loading) return (
    <section className="mypage-content-section">
      <h2 className="content-title">리뷰쓰기</h2>
      <div style={{ textAlign: 'center', padding: '2rem' }}><p>로딩 중...</p></div>
    </section>
  );

  return (
    <section className="mypage-content-section">
      <h2 className="content-title">리뷰쓰기</h2>

      {/* 탭 */}
      <div className="review-tabs">
        <button className={`review-tab ${reviewTab==='written'?'active':''}`} onClick={()=>setReviewTab('written')}>
          작성한 리뷰 {writtenReviews.length}
        </button>
      </div>

      {/* 작성 리뷰 */}
      {reviewTab==='written' && (
        <div className="review-written-list">
          {writtenReviews.length>0 ? writtenReviews.map(review => (
            <div key={review.id} className="review-written-item">
              <div className="review-written-content">
                <div className="review-written-left">
                  <div className="review-written-image">
                    <img src={review.image} alt={review.productName}/>
                  </div>
                  <div className="review-written-divider"></div>
                  <div className="review-written-review-section">
                    <div className="review-written-text">{review.reviewText}</div>
                    <div className="review-written-date">작성일 {review.writtenDate}</div>
                  </div>
                </div>
                <div className="review-written-main">
                  <div className="review-written-header">
                    <div className="review-written-info">
                      <div className="review-written-title">{review.productName}</div>
                      <div className="review-written-detail">{review.facility}</div>
                    </div>
                    <ReviewMenuButton reviewId={review.reviewId} onDelete={fetchMyReviews}/>
                  </div>
                  <div className="review-written-footer">
                    <button className="review-written-edit-btn" onClick={()=>{
                      setSelectedReviewId(review.reviewId);
                      setIsEditModalOpen(true);
                    }}>수정하기</button>
                  </div>
                </div>
              </div>
            </div>
          )) : (
            <div className="review-empty"><p>작성한 리뷰가 없습니다.</p></div>
          )}
        </div>
      )}

      {/* 리뷰 작성 모달 */}
      {isReviewModalOpen && (
        <ReviewModal
          isOpen={isReviewModalOpen}
          onClose={()=>{ setIsReviewModalOpen(false); setSelectedHistoryId(null); }}
          historyId={selectedHistoryId}
          onRefresh={fetchMyReviews}
        />
      )}

      {/* 리뷰 수정 모달 */}
      {isEditModalOpen && (
        <ReviewEditModal
          isOpen={isEditModalOpen}
          onClose={()=>{ setIsEditModalOpen(false); setSelectedReviewId(null); }}
          reviewId={selectedReviewId}
          writtenReviews={writtenReviews}
          onRefresh={fetchMyReviews}
        />
      )}
    </section>
  );
}

export default ReviewWriteSection;
