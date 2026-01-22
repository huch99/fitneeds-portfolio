// passtrade
import './PassTradeFaq.css';

const QnaWriteModal = ({ onClose }) => {
  return (
    <div className="qna-modal">
      {/* 헤더 */}
      <div className="qna-modal-header">
        <h3>문의 작성</h3>
        <button
          className="qna-modal-close"
          onClick={onClose}
        >
          ×
        </button>
      </div>

      {/* 내용 */}
      <div className="qna-modal-section">
        <h4>제목</h4>
        <input
          type="text"
          placeholder="문의 제목을 입력하세요"
          className="qna-input"
        />
      </div>

      <div className="qna-modal-section">
        <h4>문의 내용</h4>
        <textarea
          placeholder="문의 내용을 입력하세요"
          className="qna-textarea"
        />
      </div>

      {/* 하단 버튼 */}
      <div className="qna-modal-footer">
        <div />

        <div className="qna-modal-actions">
          <button
            className="qna-btn cancel"
            onClick={onClose}
          >
            취소
          </button>
          <button
            className="qna-btn submit"
            onClick={() => {
              alert('※ 가데이터 기준: 실제 등록은 아직 안 함');
              onClose();
            }}
          >
            등록
          </button>
        </div>
      </div>
    </div>
  );
};

export default QnaWriteModal;
