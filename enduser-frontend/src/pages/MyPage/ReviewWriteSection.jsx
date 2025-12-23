import React, { useState, useEffect } from 'react';
import { ReviewEditModal, ReviewMenuButton } from './ReviewComponents';
import api from '../../api';

/* =========================
   API 함수들
========================= */
// 나의 리뷰 목록 조회
const getMyReviews = async () => {
  try {
    const response = await api.get('/reviews/my');
    return response.data;
  } catch (error) {
    console.error('리뷰 목록 조회 실패:', error);
    throw error;
  }
};

function ReviewWriteSection({ reviewTab, setReviewTab, setIsReviewModalOpen, setSelectedHistoryId }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState(null);
  const [writtenReviews, setWrittenReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0); // 리뷰 작성/수정/삭제 후 새로고침용

  // 리뷰 목록 가져오기
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const reviews = await getMyReviews();
        setWrittenReviews(
          reviews.map(review => ({
            id: review.reviewId,
            reviewId: review.reviewId,
            reviewText: review.content || '',
            writtenDate: review.registrationDateTime
              ? new Date(review.registrationDateTime).toISOString().split('T')[0].replace(/-/g, '.')
              : '',
          }))
        );
      } catch (error) {
        console.error('리뷰 로딩 실패:', error);
        setWrittenReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [refreshKey]);

  // 리뷰 새로고침
  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

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
          className={`review-tab ${reviewTab === 'write' ? 'active' : ''}`}
          onClick={() => setReviewTab('write')}
        >
          리뷰 쓰기
        </button>
        <button
          className={`review-tab ${reviewTab === 'written' ? 'active' : ''}`}
          onClick={() => setReviewTab('written')}
        >
          작성한 리뷰 {writtenReviews.length}
        </button>
      </div>

      {/* 리뷰 쓰기 탭 내용 */}
      {reviewTab === 'write' && (
        <div className="review-write-list">
          <div className="review-empty">
            <p>리뷰 작성은 리뷰 작성 버튼을 눌러 진행해주세요.</p>
          </div>
        </div>
      )}

      {/* 작성한 리뷰 탭 내용 */}
      {reviewTab === 'written' && (
        <div className="review-written-list">
          {writtenReviews.length > 0 ? (
            writtenReviews.map(review => (
              <div key={review.id} className="review-written-item">
                <div className="review-written-content">
                  <div className="review-written-review-section">
                    <div className="review-written-text">{review.reviewText}</div>
                    <div className="review-written-date">작성일 {review.writtenDate}</div>
                  </div>
                  <div className="review-written-header">
                    <ReviewMenuButton reviewId={review.reviewId} onDelete={handleRefresh} />
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
          onRefresh={handleRefresh}
        />
      )}
    </section>
  );
}

export default ReviewWriteSection;
