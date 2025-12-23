import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ReviewEditModal, ReviewMenuButton } from './ReviewComponents';

function ReviewWriteSection({ reviewTab, setReviewTab, setIsReviewModalOpen, setSelectedHistoryId }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState(null);
  const [writtenReviews, setWrittenReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const loginUserId = localStorage.getItem('userId');

  /* =========================
     나의 리뷰 목록 조회
  ========================= */
  const fetchMyReviews = async () => {
    if (!loginUserId) {
      //console.warn('[ReviewWriteSection] loginUserId가 없습니다:', loginUserId);
      return;
    }
    setLoading(true);
    try {





      // const token = localStorage.getItem('accessToken');
      // const url = '/reviews/my';
      // const config = { 
      //   params: { userId: loginUserId },
      //   headers: {
      //     'Authorization': token ? `Bearer ${token}` : '',
      //     'Content-Type': 'application/json'
      //   }
      // };
      
      // console.log('[ReviewWriteSection] 요청 시작');
      // console.log('[ReviewWriteSection] URL:', url);
      // console.log('[ReviewWriteSection] loginUserId:', loginUserId);
      // console.log('[ReviewWriteSection] token:', token ? '있음' : '없음');
      // console.log('[ReviewWriteSection] config:', config);
      // console.log('[ReviewWriteSection] 실제 요청 URL:', `${url}?userId=${loginUserId}`);
      
      const res = await axios.get('/reviews/my',  {params: { userId: loginUserId }});
      
      // console.log('[ReviewWriteSection] 응답 성공:', res);
      console.log('[ReviewWriteSection] 응답 데이터:', res);

      // 리뷰 데이터를 화면에 맞게 변환
      const transformedReviews = res.data.map((review) => {
        return {
          id: review.reviewId,
          reviewId: review.reviewId,
          reservationId: review.reservationId,
          date: review.exerciseDate 
            ? new Date(review.exerciseDate).toISOString().split('T')[0] 
            : '',
          productName: review.exerciseName || review.programName || '운동',
          option: review.trainerName ? '개인 레슨' : '그룹 레슨',
          facility: review.exerciseLocation || review.branchName || '지점',
          rating: review.rating,
          reviewText: review.content || '',
          writtenDate: review.registrationDateTime 
            ? new Date(review.registrationDateTime).toISOString().split('T')[0].replace(/-/g, '.')
            : '',
          image: '/images/pilates.png' // 기본 이미지
        };
      });

      setWrittenReviews(transformedReviews);
    } catch (e) {
      // console.error('[ReviewWriteSection] 리뷰 목록 조회 실패');
      // console.error('[ReviewWriteSection] 에러 객체:', e);
      // console.error('[ReviewWriteSection] 에러 메시지:', e.message);
      // console.error('[ReviewWriteSection] 에러 응답:', e.response);
      // console.error('[ReviewWriteSection] 에러 상태:', e.response?.status);
      // console.error('[ReviewWriteSection] 에러 데이터:', e.response?.data);
      // console.error('[ReviewWriteSection] 에러 헤더:', e.response?.headers);
      // console.error('[ReviewWriteSection] 요청 URL:', e.config?.url);
      // console.error('[ReviewWriteSection] 요청 params:', e.config?.params);
      // console.error('[ReviewWriteSection] 요청 headers:', e.config?.headers);
      setWrittenReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyReviews();
  }, []);

  if (loading) {
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
          className={`review-tab ${reviewTab === 'written' ? 'active' : ''}`}
          onClick={() => setReviewTab('written')}
        >
          작성한 리뷰 {writtenReviews.length}
        </button>
      </div>

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
                      <div className="review-written-text">{review.reviewText}</div>
                      <div className="review-written-date">작성일 {review.writtenDate}</div>
                    </div>
                  </div>
                  <div className="review-written-main">
                    <div className="review-written-header">
                      <div className="review-written-info">
                        <div className="review-written-title">{review.productName}</div>
                        <div className="review-written-detail">{review.option} | {review.facility}</div>
                      </div>
                      <ReviewMenuButton 
                        reviewId={review.reviewId} 
                        onDelete={fetchMyReviews}
                      />
                    </div>
                    <div className="review-written-footer">
                      <button 
                        className="review-written-edit-btn"
                        onClick={() => {
                          setSelectedReviewId(review.reviewId);
                          setIsEditModalOpen(true);
                        }}
                      >
                        수정하기
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