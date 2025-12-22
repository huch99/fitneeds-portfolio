import React, { useState } from 'react';
import { deleteReview } from '../../api/review';

function ReviewMenuButton({ reviewId, onDelete }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleDelete = async () => {
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

export default ReviewMenuButton;

