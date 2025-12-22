import React, { useState, useEffect } from 'react';
import { getMyCompletedReservations } from '../../api/reservation';
import { getMyReviews } from '../../api/review';
import { ReviewEditModal, ReviewMenuButton } from './ReviewComponents';

function ReviewWriteSection({ reviewTab, setReviewTab, setIsReviewModalOpen, setSelectedHistoryId }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [writtenReviews, setWrittenReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0); // 리뷰 작성/수정/삭제 후 새로고침용

  // 예약 목록과 작성한 리뷰 목록 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // 결제완료된 예약 목록 가져오기
        const completedReservations = await getMyCompletedReservations();
        
        // 예약 데이터를 화면에 맞게 변환
        const transformedReservations = completedReservations.map((reservation, index) => ({
          id: reservation.reservationId,
          reservationId: reservation.reservationId,
          date: reservation.exerciseDate ? new Date(reservation.exerciseDate).toISOString().split('T')[0] : '',
          productName: reservation.exerciseName || '운동',
          option: reservation.trainerName ? `개인 레슨` : '그룹 레슨',
          price: 0, // 백엔드에서 가격 정보가 없으면 0
          status: reservation.paymentStatus === 'BANK_TRANSFER_COMPLETED' ? '예약완료' : '예약대기',
          facility: reservation.exerciseLocation || '지점',
          trainerName: reservation.trainerName || '',
          image: '/images/pilates.png' // 기본 이미지 (실제로는 예약 데이터에서 가져와야 함)
        }));
        
        setReservations(transformedReservations);

        // 작성한 리뷰 목록 가져오기
        const reviews = await getMyReviews();
        
        // 리뷰 데이터를 화면에 맞게 변환
        const transformedReviews = await Promise.all(reviews.map(async (review) => {
          // 예약 정보 가져오기 (리뷰에 예약 정보가 포함되어 있지 않을 수 있음)
          const reservation = transformedReservations.find(r => r.reservationId === review.reservationId);
          
          return {
            id: review.reviewId,
            reviewId: review.reviewId,
            reservationId: review.reservationId,
            date: reservation?.date || '',
            productName: reservation?.productName || '운동',
            option: reservation?.option || '',
            facility: reservation?.facility || '지점',
            rating: review.rating,
            reviewText: review.content || '',
            writtenDate: review.registrationDateTime 
              ? new Date(review.registrationDateTime).toISOString().split('T')[0].replace(/-/g, '.')
              : '',
            image: reservation?.image || '/images/pilates.png'
          };
        }));
        
        setWrittenReviews(transformedReviews);
      } catch (error) {
        console.error('데이터 로딩 실패:', error);
        // 에러 발생 시 빈 배열로 설정
        setReservations([]);
        setWrittenReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refreshKey]);

  // 예약한 수업의 다음날 수업 목록 (리뷰 작성 가능)
  const getReviewableClasses = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return reservations.filter(reservation => {
      // 이미 리뷰가 작성된 예약은 제외
      const hasReview = writtenReviews.some(review => review.reservationId === reservation.reservationId);
      if (hasReview) return false;

      const reservationDate = new Date(reservation.date);
      const nextDay = new Date(reservationDate);
      nextDay.setDate(nextDay.getDate() + 1);
      nextDay.setHours(0, 0, 0, 0);
      
      // 다음날이 오늘 이전이거나 오늘인 경우 리뷰 작성 가능
      return nextDay <= today && reservation.status === '예약완료';
    });
  };

  const reviewableClasses = getReviewableClasses();

  // 리뷰 작성/수정/삭제 후 새로고침
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
          리뷰 쓰기 {reviewableClasses.length}
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
          {reviewableClasses.length > 0 ? (
            <>
              <div className="review-section-header">
                <h3>리뷰 작성 가능한 수업 {reviewableClasses.length}개</h3>
              </div>
              {reviewableClasses.map((reservation) => {
                const reservationDate = new Date(reservation.date);
                const nextDay = new Date(reservationDate);
                nextDay.setDate(nextDay.getDate() + 1);
                
                return (
                  <div key={reservation.id} className="review-item">
                    <div className="review-item-content">
                      <div className="review-item-image">
                        <img src={reservation.image} alt={reservation.productName} />
                      </div>
                      <div className="review-item-info">
                        <div className="review-item-title">{reservation.productName}</div>
                        <div className="review-item-detail">{reservation.facility}</div>
                        <div className="review-item-date">수업일: {reservation.date}</div>
                      </div>
                      <button
                        className="btn-action"
                        onClick={() => {
                          setSelectedHistoryId(reservation.id);
                          setIsReviewModalOpen(true);
                        }}
                      >
                        리뷰쓰기
                      </button>
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            <div className="review-empty">
              <p>리뷰 작성 가능한 수업이 없습니다.</p>
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
                        onDelete={handleRefresh}
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
          onRefresh={handleRefresh}
        />
      )}
    </section>
  );
}

export default ReviewWriteSection;