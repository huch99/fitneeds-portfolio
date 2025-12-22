import React, { useState, useEffect } from 'react';
import { getMyCompletedReservations } from '../../api/reservation';
import { createReview } from '../../api/review';

function ReviewModal({ isOpen, onClose, historyId, onRefresh }) {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reservation, setReservation] = useState(null);

  // 예약 정보 가져오기
  useEffect(() => {
    if (isOpen && historyId) {
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
  }, [isOpen, historyId]);

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
        instructorId: reservation.trainerName ? 1 : null // 실제로는 강사 ID를 가져와야 함
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

export default ReviewModal;

