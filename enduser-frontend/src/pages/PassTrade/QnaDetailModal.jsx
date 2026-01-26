import { useEffect, useState } from 'react';
import api from '../../api';
import './QnaDetailModal.css';

const QnaDetailModal = ({ faqId, onClose, loginUserId, onSuccess }) => {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  // 답변
  const [showAnswerForm, setShowAnswerForm] = useState(false);
  const [answer, setAnswer] = useState('');

  // 수정
  const [isEditMode, setIsEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  /* =========================
     상세 조회
     ========================= */
  const fetchDetail = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/passfaq/${faqId}`);
      setDetail(res.data);

      const [t, c] = (res.data.question ?? '').split('\n', 2);
      setEditTitle((t ?? '').replace(/^\[|\]$/g, '').trim());
      setEditContent((c ?? '').trim());
    } catch {
      alert('문의 상세 조회 실패');
      onClose();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (faqId) fetchDetail();
  }, [faqId]);

  if (loading || !detail) return null;

  /* =========================
     파생 값
     ========================= */
  const [title, content] = detail.question.split('\n', 2);
  const isMine = detail.userId === loginUserId;
  const isAnswered = !!detail.answer;

  /* =========================
     답변 등록
     ========================= */
  const submitAnswer = async () => {
    if (!answer.trim()) {
      alert('답변 내용을 입력해주세요.');
      return;
    }

    try {
      await api.post(`/passfaq/${faqId}/answer`, { answer });

      setAnswer('');
      setShowAnswerForm(false);

      await fetchDetail();   // 🔥 모달 내부 최신화
      onSuccess?.();         // 🔥 목록 최신화
    } catch (e) {
      alert(e.response?.data?.message || '답변 등록 실패');
    }
  };

  /* =========================
     수정
     ========================= */
  const submitEdit = async () => {
    if (!editTitle.trim() || !editContent.trim()) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }

    const question = `[${editTitle.trim()}]\n${editContent.trim()}`;

    try {
      await api.put(`/passfaq/${faqId}`, { question });
      setIsEditMode(false);
      await fetchDetail();
      onSuccess?.();
    } catch (e) {
      alert(e.response?.data || '수정 실패');
    }
  };

  /* =========================
     삭제
     ========================= */
  const submitDelete = async () => {
    if (!window.confirm('정말 삭제할까요?')) return;

    await api.delete(`/passfaq/${faqId}`);
    onClose();
    onSuccess?.();
  };

  return (
    <div className="qna-modal-backdrop">
      <div className="qna-modal">

        <div className="qna-modal-header">
          <h3>{title}</h3>
        </div>

        <div className="qna-modal-meta">
          <span>작성자: {isMine ? '나' : detail.writerName}</span>
          <span>작성일: {detail.createdAt}</span>
        </div>

        <div className="qna-modal-section">
          <h4>문의 내용</h4>
          {!isEditMode ? (
            <p>{content}</p>
          ) : (
            <>
              <input
                className="qna-input"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />
              <textarea
                className="qna-textarea"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
              />
              <butto className="btn-save" onClick={submitEdit}>저장</butto>
            </>
          )}
        </div>

        <div className="qna-modal-section">
          <h4>답변</h4>
          {isAnswered ? <p>{detail.answer}</p> : <p>답변 대기중입니다.</p>}
        </div>

        {!isMine && !isAnswered && showAnswerForm && (
          <div className="qna-modal-section">
            <textarea
              className="qna-textarea"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />
            <button className='qna-ans-btn' onClick={submitAnswer}>답변 등록</button>
          </div>
        )}

        <div className="qna-modal-footer">

          {/* ⬅️ 왼쪽 버튼 영역 */}
          <div className="qna-footer-left">
            {isMine && (
              <>
                <button className="btn-edit" onClick={() => setIsEditMode(true)}>
                  수정
                </button>
                <button className="btn-delete" onClick={submitDelete}>
                  삭제
                </button>
              </>
            )}

            {!isMine && !isAnswered && !showAnswerForm && (
              <button className="btn-answer" onClick={() => setShowAnswerForm(true)}>
                답변 달기
              </button>
            )}
          </div>

          {/* ➡️ 오른쪽 버튼 영역 */}
          <div className="qna-footer-right">
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
