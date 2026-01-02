import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import '../../components/auth/modalStyles.css';

/* =========================
   API 함수들
========================= */
// 이용내역 조회 (리뷰와 연결된 이용내역 정보 가져오기)
const getPastHistory = async (reviewWritten = null) => {
  try {
    const params = {};
    if (reviewWritten) params.reviewWritten = reviewWritten;
    
    const response = await api.get('/reservations/pastHistory', { params });
    
    // 백엔드 응답 구조: { status, message, data }
    if (response.data.status === 'SUCCESS' && response.data.data) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || '이용내역 조회 실패');
    }
  } catch (error) {
    console.error('이용내역 조회 실패:', error);
    throw error;
  }
};

// 리뷰 작성
const createReview = async (reviewData) => {
  try {
    const response = await api.post('/reviews', reviewData);
    
    // 백엔드 응답 구조: { status, message, data }
    if (response.data.status === 'SUCCESS') {
      return response.data;
    } else {
      throw new Error(response.data.message || '리뷰 작성 실패');
    }
  } catch (error) {
    console.error('리뷰 작성 실패:', error);
    throw error;
  }
};

// 내가 쓴 리뷰 목록 조회
const getMyReviews = async () => {
  try {
    const response = await api.get('/reviews/my');
    
    // 백엔드 응답 구조: { status, message, data }
    if (response.data.status === 'SUCCESS' && response.data.data) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || '리뷰 목록 조회 실패');
    }
  } catch (error) {
    console.error('리뷰 목록 조회 실패:', error);
    throw error;
  }
};

// 리뷰 수정
const updateReview = async (reviewId, reviewData) => {
  try {
    const response = await api.put(`/reviews/${reviewId}`, reviewData);
    
    // 백엔드 응답 구조: { status, message, data }
    if (response.data.status === 'SUCCESS') {
      return response.data;
    } else {
      throw new Error(response.data.message || '리뷰 수정 실패');
    }
  } catch (error) {
    console.error('리뷰 수정 실패:', error);
    throw error;
  }
};

// 리뷰 삭제
const deleteReview = async (reviewId) => {
  try {
    const response = await api.delete(`/reviews/${reviewId}`);
    
    // 백엔드 응답 구조: { status, message, data }
    if (response.data.status === 'SUCCESS') {
      return response.data;
    } else {
      throw new Error(response.data.message || '리뷰 삭제 실패');
    }
  } catch (error) {
    console.error('리뷰 삭제 실패:', error);
    throw error;
  }
};

// 리뷰 상세 조회
const getReviewDetail = async (reviewId) => {
  try {
    // 리뷰 목록에서 해당 리뷰를 찾거나, 별도 API가 있다면 사용
    // 현재는 리뷰 목록에서 찾는 방식으로 구현
    const response = await api.get('/reviews/my');
    
    if (response.data.status === 'SUCCESS' && response.data.data) {
      const review = response.data.data.find(r => r.reviewId === reviewId);
      return review;
    } else {
      throw new Error(response.data.message || '리뷰 상세 조회 실패');
    }
  } catch (error) {
    console.error('리뷰 상세 조회 실패:', error);
    throw error;
  }
};

/* =========================
   리뷰 작성 모달 컴포넌트
========================= */
function ReviewWriteModal({ isOpen, onClose, history, onRefresh }) {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const loginUserId = localStorage.getItem('userId');

  useEffect(() => {
    if (isOpen) {
      setRating(0);
      setReviewText('');
    }
  }, [isOpen]);

  if (!isOpen || !history) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!rating || rating === 0) {
      alert('평점을 선택해주세요.');
      return;
    }

    if (!reviewText.trim()) {
      alert('리뷰 내용을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      await createReview({
        historyId: history.historyId || history.id,
        reservationId: history.reservationId,
        rating: rating,
        content: reviewText.trim(),
        userId: loginUserId
      });
      alert('리뷰가 작성되었습니다.');
      onClose();
      onRefresh(); // 목록 새로고침
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || '리뷰 작성에 실패했습니다.';
      alert(errorMessage);
      console.error('[ReviewWriteSection] 리뷰 작성 실패:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content reservation-edit-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>리뷰 작성</h2>
          <button className="modal-close-button" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          {history && (
            <div style={{ marginBottom: '1.5rem' }}>
              <p style={{ marginBottom: '0.5rem' }}><strong>프로그램명:</strong> {history.programName}</p>
              <p style={{ marginBottom: '0.5rem' }}><strong>지점명:</strong> {history.branchName}</p>
              <p><strong>강사명:</strong> {history.trainerName || '-'}</p>
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="review-rating">평점</label>
              <div style={{ display: 'flex', gap: '5px', marginTop: '0.5rem' }}>
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
            <div className="form-group">
              <label htmlFor="review-content">리뷰 내용</label>
              <textarea
                id="review-content"
                className="form-control"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="리뷰를 작성해주세요"
                rows="5"
                required
              />
            </div>
            <div className="modal-footer">
              <button type="button" className="btn-secondary" onClick={onClose} disabled={isSubmitting}>
                취소
              </button>
              <button type="submit" className="btn-primary" disabled={isSubmitting}>
                {isSubmitting ? '작성 중...' : '리뷰 작성'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

/* =========================
   리뷰 수정 모달 컴포넌트
========================= */
function ReviewEditModal({ isOpen, onClose, reviewId, writtenReviews, onRefresh }) {
  const navigate = useNavigate();
  const review = writtenReviews.find(r => r.reviewId === reviewId);
  const [rating, setRating] = useState(review?.rating || 0);
  const [reviewText, setReviewText] = useState(review?.content || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const loginUserId = localStorage.getItem('userId');

  useEffect(() => {
    if (review) {
      setRating(review.rating);
      setReviewText(review.content);
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
      await updateReview(review.reviewId, { 
        rating, 
        content: reviewText.trim(),
        userId: loginUserId 
      });
      alert('리뷰가 수정되었습니다.');
      onClose();
      onRefresh();
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || '리뷰 수정에 실패했습니다.';
      alert(errorMessage);
      console.error('[ReviewWriteSection] 리뷰 수정 실패:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content reservation-edit-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>리뷰 수정</h2>
          <button className="modal-close-button" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          {review && (
            <div style={{ marginBottom: '1.5rem' }}>
              <p style={{ marginBottom: '0.5rem' }}><strong>프로그램명:</strong> {review.programName || review.productName || '-'}</p>
              <p style={{ marginBottom: '0.5rem' }}><strong>지점명:</strong> {review.branchName || review.facility || '-'}</p>
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="review-rating">평점</label>
              <div style={{ display: 'flex', gap: '5px', marginTop: '0.5rem' }}>
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
            <div className="form-group">
              <label htmlFor="review-content">리뷰 내용</label>
              <textarea
                id="review-content"
                className="form-control"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="리뷰를 작성해주세요"
                rows="5"
                required
              />
            </div>
            <div className="modal-footer">
              <button type="button" className="btn-secondary" onClick={onClose} disabled={isSubmitting}>
                취소
              </button>
              <button type="submit" className="btn-primary" disabled={isSubmitting}>
                {isSubmitting ? '수정 중...' : '수정 완료'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

/* =========================
   리뷰 상세 모달 컴포넌트
========================= */
function ReviewDetailModal({ isOpen, onClose, review }) {
  if (!isOpen || !review) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content reservation-edit-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>리뷰 상세</h2>
          <button className="modal-close-button" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div style={{ marginBottom: '1.5rem' }}>
            <p style={{ marginBottom: '0.5rem' }}><strong>프로그램명:</strong> {review.programName || review.productName || '-'}</p>
            <p style={{ marginBottom: '0.5rem' }}><strong>지점명:</strong> {review.branchName || review.facility || '-'}</p>
            <p style={{ marginBottom: '0.5rem' }}><strong>강사명:</strong> {review.trainerName || '-'}</p>
            <p style={{ marginBottom: '0.5rem' }}><strong>작성일:</strong> {review.writtenDate || '-'}</p>
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label><strong>평점</strong></label>
            <div style={{ display: 'flex', gap: '5px', marginTop: '0.5rem' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  style={{
                    fontSize: '1.5rem',
                    color: star <= (review.rating || 0) ? '#FFC107' : '#ddd'
                  }}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label><strong>리뷰 내용</strong></label>
            <div style={{ 
              marginTop: '0.5rem', 
              padding: '1rem', 
              backgroundColor: '#f8f9fa', 
              borderRadius: '4px',
              minHeight: '100px',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word'
            }}>
              {review.content || review.reviewText || '-'}
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-primary" onClick={onClose} style={{ width: '100%' }}>
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================
   리뷰 쓰기 섹션 메인 컴포넌트
========================= */
function ReviewWriteSection({ reviewTab, setReviewTab }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState(null);
  const [selectedReview, setSelectedReview] = useState(null);
  const [selectedHistory, setSelectedHistory] = useState(null);
  const [writtenReviews, setWrittenReviews] = useState([]);
  const [unwrittenHistories, setUnwrittenHistories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [writeLoading, setWriteLoading] = useState(false);
  const loginUserId = localStorage.getItem('userId');

  // 내가 쓴 리뷰 목록 조회 (이용내역 정보와 결합)
  const fetchMyReviews = async () => {
    if (!loginUserId) {
      setWrittenReviews([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // 리뷰 목록과 이용내역 목록을 병렬로 조회
      const [reviewsData, historiesData] = await Promise.all([
        getMyReviews(),
        getPastHistory().catch(() => []) // 실패해도 계속 진행
      ]);
      
      console.log('[ReviewWriteSection] 리뷰 목록 API 응답 데이터:', reviewsData);
      console.log('[ReviewWriteSection] 이용내역 API 응답 데이터:', historiesData);
      
      // 이용내역을 historyId 또는 reservationId로 매핑
      const historyMap = new Map();
      historiesData.forEach(history => {
        if (history.refId) {
          historyMap.set(history.refId, history);
        }
        if (history.reservationId) {
          historyMap.set(history.reservationId, history);
        }
      });
      
      // 백엔드 데이터를 화면에 맞게 변환
      // 백엔드 응답 필드: reviewId, title, content, rating, createdAt, updatedAt, reservationId, historyId 등
      const transformedReviews = reviewsData.map((review) => {
        // 이용내역 정보 찾기
        const history = historyMap.get(review.historyId) || historyMap.get(review.reservationId);
        
        // 날짜 변환
        let writtenDate = '';
        if (review.createdAt) {
          const date = new Date(review.createdAt);
          writtenDate = date.toISOString().split('T')[0].replace(/-/g, '.');
        }
        
        return {
          id: review.reviewId,
          reviewId: review.reviewId,
          reservationId: review.reservationId,
          historyId: review.historyId,
          programName: history?.sportName || review.title || '프로그램',
          branchName: history?.brchNm || '',
          facility: history?.brchNm || '',
          trainerName: history?.trainerName || '',
          rating: review.rating || 0,
          content: review.content || '',
          reviewText: review.content || '',
          writtenDate: writtenDate,
          image: history?.sportName ? getSportImage(history.sportName) : '/images/pt.png'
        };
      });

      console.log('[ReviewWriteSection] 변환된 리뷰 데이터:', transformedReviews);
      
      setWrittenReviews(transformedReviews);
    } catch (error) {
      console.error('[ReviewWriteSection] 리뷰 목록 조회 실패:', error);
      
    } finally {
      setLoading(false);
    }
  };

  // 운동 종목명에 따른 이미지 매핑 함수
  const getSportImage = (sportName) => {
    if (!sportName) return '/images/pt.png';
    const sportLower = sportName.toLowerCase();
    if (sportLower.includes('필라테스') || sportLower.includes('pilates')) {
      return '/images/pilates.png';
    } else if (sportLower.includes('요가') || sportLower.includes('yoga')) {
      return '/images/yoga.png';
    } else if (sportLower.includes('크로스핏') || sportLower.includes('crossfit')) {
      return '/images/crossfit.png';
    } else {
      return '/images/pt.png';
    }
  };

  // 리뷰 미작성 이용내역 조회
  const fetchUnwrittenHistories = async () => {
    if (!loginUserId) {
      setUnwrittenHistories([]);
      setWriteLoading(false);
      return;
    }

    try {
      setWriteLoading(true);
      const data = await getPastHistory('N'); // reviewWritten='N'인 이용내역만 조회
      console.log('[ReviewWriteSection] 리뷰 미작성 이용내역 API 응답 데이터:', data);
      
      // 백엔드 데이터를 화면에 맞게 변환
      const transformed = (data || []).map((history) => {
        // 날짜 변환
        let dateStr = '';
        if (history.rsvDt) {
          if (typeof history.rsvDt === 'string') {
            dateStr = history.rsvDt.split('T')[0];
          } else {
            dateStr = history.rsvDt;
          }
        }
        
        // 시간 변환
        let timeStr = '';
        if (history.rsvTime) {
          if (typeof history.rsvTime === 'string') {
            timeStr = history.rsvTime.substring(0, 5);
          } else {
            timeStr = String(history.rsvTime).substring(0, 5);
          }
        }
        
        return {
          id: history.refId || history.reservationId,
          reservationId: history.reservationId,
          historyId: history.refId,
          date: dateStr,
          time: timeStr,
          branchName: history.brchNm || '지점',
          programName: history.sportName || '프로그램',
          trainerName: history.trainerName || '',
          reviewWritten: history.reviewWritten === true || history.reviewWritten === 'Y',
          image: getSportImage(history.sportName)
        };
      });
      
      console.log('[ReviewWriteSection] 변환된 리뷰 미작성 이용내역 데이터:', transformed);
      
      setUnwrittenHistories(transformed);
    } catch (error) {
      console.error('[ReviewWriteSection] 리뷰 미작성 이용내역 조회 실패:', error);
    } finally {
      setWriteLoading(false);
    }
  };

  useEffect(() => {
    fetchMyReviews();
    if (reviewTab === 'write') {
      fetchUnwrittenHistories();
    }
  }, [loginUserId, reviewTab]);

  if (loading && reviewTab === 'written') {
    return (
      <section className="mypage-content-section">
        <h2 className="content-title">리뷰쓰기</h2>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>로딩 중...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mypage-content-section">
      <h2 className="content-title">리뷰쓰기</h2>

      {/* 탭 */}
      <div className="review-tabs">
        <button
          className={`review-tab ${reviewTab === 'write' ? 'active' : ''}`}
          onClick={() => setReviewTab('write')}
        >
          리뷰 작성하기 {unwrittenHistories.length}
        </button>
        <button
          className={`review-tab ${reviewTab === 'written' ? 'active' : ''}`}
          onClick={() => setReviewTab('written')}
        >
          작성한 리뷰 보기 {writtenReviews.length}
        </button>
      </div>

      {/* 리뷰 작성하기 탭 내용 */}
      {reviewTab === 'write' && (
        <div className="review-written-list">
          {writeLoading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <p>로딩 중...</p>
            </div>
          ) : unwrittenHistories.length > 0 ? (
            unwrittenHistories.map((history) => (
              <div key={history.id} className="review-written-item">
                <div className="review-written-content">
                  <div className="review-written-left">
                    <div className="review-written-image">
                      <img src={history.image || '/images/pt.png'} alt={history.programName} />
                    </div>
                    <div className="review-written-divider"></div>
                    <div className="review-written-review-section">
                      <div className="review-written-date">
                        {history.date} {history.time}
                      </div>
                    </div>
                  </div>
                  <div className="review-written-main">
                    <div className="review-written-header">
                      <div className="review-written-info">
                        <div className="review-written-title">{history.programName}</div>
                        <div className="review-written-detail">{history.branchName}</div>
                        {history.trainerName && (
                          <div className="review-written-detail">강사: {history.trainerName}</div>
                        )}
                      </div>
                    </div>
                    <div className="review-written-footer" style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button
                        className="btn-action"
                        onClick={() => {
                          setSelectedHistory(history);
                          setIsWriteModalOpen(true);
                        }}
                        style={{ backgroundColor: 'transparent', color: '#333', padding: '0.5rem 1rem', borderRadius: '4px', border: '1px solid #ddd', cursor: 'pointer' }}
                      >
                        리뷰 작성하기
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="review-empty">
              <p>리뷰를 작성할 이용내역이 없습니다.</p>
            </div>
          )}
        </div>
      )}

      {/* 작성한 리뷰 탭 내용 */}
      {reviewTab === 'written' && (
        <div className="review-written-list">
          {writtenReviews.length > 0 ? (
            writtenReviews.map((review) => (
              <div key={review.id} className="review-written-item">
                <div className="review-written-content">
                  <div className="review-written-left">
                    <div className="review-written-image">
                      <img src={review.image} alt={review.productName} />
                    </div>
                    <div className="review-written-divider"></div>
                    <div className="review-written-review-section">
                      <div className="review-written-date">작성일 {review.writtenDate}</div>
                    </div>
                  </div>
                  <div className="review-written-main">
                    <div className="review-written-header">
                      <div className="review-written-info">
                        <div className="review-written-title">{review.productName}</div>
                        <div className="review-written-detail">{review.facility || review.branchName || ''}</div>
                        {review.trainerName && (
                          <div className="review-written-detail">강사: {review.trainerName}</div>
                        )}
                      </div>
                    </div>
                    <div className="review-written-footer" style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button
                        className="btn-action"
                        onClick={() => {
                          setSelectedReview(review);
                          setIsDetailModalOpen(true);
                        }}
                        style={{ backgroundColor: 'transparent', color: '#333', padding: '0.5rem 1rem', borderRadius: '4px', border: '1px solid #ddd', cursor: 'pointer' }}
                      >
                        상세보기
                      </button>
                      <button
                        className="btn-action"
                        onClick={() => {
                          setSelectedReviewId(review.reviewId);
                          setIsEditModalOpen(true);
                        }}
                        style={{ backgroundColor: 'transparent', color: '#333', padding: '0.5rem 1rem', borderRadius: '4px', border: '1px solid #ddd', cursor: 'pointer' }}
                      >
                        수정하기
                      </button>
                      <button
                        className="btn-action"
                        onClick={async () => {
                          if (!window.confirm('정말 삭제하시겠습니까?')) return;
                          try {
                            await deleteReview(review.reviewId);
                            alert('리뷰가 삭제되었습니다.');
                            fetchMyReviews();
                          } catch (error) {
                            const errorMessage = error.response?.data?.message || error.message || '리뷰 삭제에 실패했습니다.';
                            alert(errorMessage);
                            console.error('[ReviewWriteSection] 리뷰 삭제 실패:', error);
                          }
                        }}
                        style={{ backgroundColor: 'transparent', color: '#333', padding: '0.5rem 1rem', borderRadius: '4px', border: '1px solid #ddd', cursor: 'pointer' }}
                      >
                        삭제하기
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="review-empty">
              <p>작성한 리뷰가 없습니다.</p>
            </div>
          )}
        </div>
      )}

      {/* 리뷰 작성 모달 */}
      {isWriteModalOpen && (
        <ReviewWriteModal
          isOpen={isWriteModalOpen}
          onClose={() => {
            setIsWriteModalOpen(false);
            setSelectedHistory(null);
          }}
          history={selectedHistory}
          onRefresh={() => {
            fetchUnwrittenHistories();
            fetchMyReviews();
          }}
        />
      )}

      {/* 리뷰 상세 모달 */}
      {isDetailModalOpen && (
        <ReviewDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedReview(null);
          }}
          review={selectedReview}
        />
      )}

      {/* 리뷰 수정 모달 */}
      {isEditModalOpen && (
        <ReviewEditModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedReviewId(null);
          }}
          reviewId={selectedReviewId}
          writtenReviews={writtenReviews}
          onRefresh={fetchMyReviews}
        />
      )}
    </section>
  );
}

export default ReviewWriteSection;
