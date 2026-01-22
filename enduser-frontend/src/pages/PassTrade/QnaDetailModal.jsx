import React from 'react';
import './PassTradeFaq.css';

const QnaDetailModal = ({ qna, onClose }) => {
    if (!qna) return null;

    return (
        <div className="qna-modal-backdrop">
            <div className="qna-modal">
                {/* 헤더 */}
                <div className="qna-modal-header">
                    <h3>{qna.title}</h3>
                    <button className="qna-modal-close" onClick={onClose}>
                        ×
                    </button>
                </div>

                {/* 메타 정보 */}
                <div className="qna-modal-meta">
                    <span>작성자: {qna.isMine ? '나' : qna.writer}</span>
                    <span>작성일: {qna.createdAt}</span>
                </div>

                {/* 질문 내용 */}
                <div className="qna-modal-section">
                    <h4>문의 내용</h4>
                    <p>{qna.content}</p>
                </div>

                {/* 답변 영역 */}
                <div className="qna-modal-section">
                    <h4>답변</h4>
                    {qna.answer ? (
                        <p>{qna.answer}</p>
                    ) : (
                        <p className="qna-waiting-text">답변 대기중입니다.</p>
                    )}
                </div>

                {/* 하단 버튼 */}
                <div className="qna-modal-footer">
                    {/* 왼쪽: 수정 / 삭제 */}
                    <div className="qna-modal-actions">
                        {qna.isMine && (
                            <>
                                <button className="btn btn-outline-secondary">
                                    수정
                                </button>
                                <button className="btn btn-outline-danger">
                                    삭제
                                </button>
                            </>
                        )}
                    </div>

                    {/* 오른쪽: 닫기 */}
                    <div className="qna-modal-close-area">
                        <button className="btn btn-primary" onClick={onClose}>
                            닫기
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default QnaDetailModal;
