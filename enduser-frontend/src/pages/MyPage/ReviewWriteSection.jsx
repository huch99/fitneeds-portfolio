import React, { useState, useEffect } from 'react';
import api from '../../api';
import { ReviewEditModal, ReviewMenuButton } from './ReviewComponents';

function ReviewWriteSection({ reviewTab, setReviewTab, setIsReviewModalOpen, setSelectedHistoryId }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState(null);
  const [writtenReviews, setWrittenReviews] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const loginUserId = localStorage.getItem('userId');

  /* =========================
     결제완료된 예약 목록 조회 (리뷰 작성 가능한 예약)
  ========================= */
  const getMyCompletedReservations = async () => {
    if (!loginUserId) return [];
    try {
      const token = localStorage.getItem('accessToken');
      const response = await api.get('/reservation/my/completed', {
        params: { userId: loginUserId },
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('결제완료 예약 목록 조회 실패:', error);
      return [];
    }
  };

  /* =========================
     나의 리뷰 목록 조회
  ========================= */
  const fetchMyReviews = async (reviewId) => {
    if (!loginUserId) {
      return;
    }

    try {
      console.log('[ReviewWriteSection] 요청 시작 - userId:', loginUserId);
      const res = await api.get('/reviews/my', {
        params: { userId: loginUserId },
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('[ReviewWriteSection] 응답 성공:', res.data);

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
      console.error('리뷰 목록 조회 실패:', e);
      setWrittenReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([
        fetchMyReviews(),
        getMyCompletedReservations().then(data => {
          const transformed = data.map((reservation) => ({
            id: reservation.reservationId,
            reservationId: reservation.reservationId,
            date: reservation.reservedDate
              ? new Date(reservation.reservedDate).toISOString().split('T')[0]
              : (reservation.exerciseDate ? new Date(reservation.exerciseDate).toISOString().split('T')[0] : ''),
            service: reservation.programName || reservation.exerciseName || '프로그램',
            facility: reservation.branchName || reservation.exerciseLocation || '지점',
            amount: reservation.paymentAmount ? Number(reservation.paymentAmount) : 0,
            option: reservation.trainerName ? '개인 레슨' : '그룹 레슨',
            image: '/images/pilates.png'
          }));
          setReservations(transformed);
        })
      ]);
      setLoading(false);
    };
    fetchData();
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
          className={`review-tab ${reviewTab === 'write' ? 'active' : ''}`}
          onClick={() => setReviewTab('write')}
        >
          리뷰작성하기 {reservations.length}
        </button>
        <button
          className={`review-tab ${reviewTab === 'written' ? 'active' : ''}`}
          onClick={() => setReviewTab('written')}
        >
          작성한 리뷰 {writtenReviews.length}
        </button>
      </div>

      {/* 리뷰작성하기 탭 내용 */}
      {reviewTab === 'write' && (
        <div className="reservation-table-container">
          <div className="reservation-summary">
            리뷰 작성 가능한 예약 {reservations.length}건
          </div>
          <table className="reservation-table">
            <thead>
              <tr>
                <th>날짜</th>
                <th>상품명/옵션</th>
                <th>상품금액</th>
                <th>리뷰작성</th>
              </tr>
            </thead>
            <tbody>
              {reservations.length > 0 ? (
                reservations.map((reservation) => (
                  <tr key={reservation.id}>
                    <td>{reservation.date}</td>
                    <td>
                      <div>{reservation.service}</div>
                      <div className="text-muted">{reservation.option}</div>
                    </td>
                    <td>{reservation.amount > 0 ? reservation.amount.toLocaleString() + '원' : '-'}</td>
                    <td>
                      <button 
                        className="btn-action"
                        onClick={() => {
                          setSelectedHistoryId(reservation.reservationId || reservation.id);
                          setIsReviewModalOpen(true);
                        }}
                      >
                        리뷰쓰기
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">리뷰 작성 가능한 예약이 없습니다.</td>
                </tr>
              )}
            </tbody>
          </table>
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