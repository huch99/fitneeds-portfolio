import React, { useState, useEffect } from 'react';
import { updateReview } from '../../api/review';

function ReviewEditModal({ isOpen, onClose, reviewId, writtenReviews, onRefresh }) {
  const review = writtenReviews.find(r => r.id === reviewId || r.reviewId === reviewId);
  const [rating, setRating] = useState(review?.rating || 0);
  const [reviewText, setReviewText] = useState(review?.reviewText || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    
    if (!rating || !reviewText.trim()) {
      alert('평점과 리뷰 내용을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      await updateReview(review.reviewId || review.id, {
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

export default ReviewEditModal;

