// PassTradeQna.jsx
import React, { useEffect, useState } from 'react';
import api from '../../api';               
import './PassTradeFaq.css';
import QnaDetailModal from './QnaDetailModal';
import QnaWriteModal from './QnaWriteModal';

const PassTradeQna = () => {
  // 🔥 가데이터 → API 데이터
  const [qnaList, setQnaList] = useState([]);

  const [activeModal, setActiveModal] = useState(null);
  const [selectedQna, setSelectedQna] = useState(null);

  /* =========================
     🔥 QnA 조회 API
     ========================= */
  const fetchQnaList = async () => {
    try {
      const res = await api.get('/passfaq'); 
      setQnaList(res.data);
    } catch (err) {
      console.error('문의 게시판 조회 실패', err);
    }
  };

  useEffect(() => {
    fetchQnaList(); // 🔥 최초 1회 호출
  }, []);

  const openDetail = (qna) => {
    setSelectedQna(qna);
    setActiveModal('detail');
  };

  const openWrite = () => {
    setSelectedQna(null);
    setActiveModal('write');
  };

  const closeModal = () => {
    setSelectedQna(null);
    setActiveModal(null);
  };

  return (
    <div className="pass-trade-qna">
      <hr className="qna-divider" />
      <h1>문의 게시판</h1>

      <div className="qna-header">
        <button className="qna-write-btn" onClick={openWrite}>
          문의하기
        </button>
      </div>

      <div className="qna-table-header">
        <span>상태</span>
        <span>제목</span>
        <span>작성자</span>
        <span>작성일</span>
      </div>

      <div className="qna-table-body">
        {qnaList.map((qna) => (
          <div
            key={qna.faqId}   // 🔥 id → faqId
            className="qna-row"
            onClick={() => openDetail(qna)}
          >
            <span
              className={`badge ${
                qna.ansStat === 'DONE' ? 'answered' : 'waiting'
              }`}
            >
              {qna.ansStat === 'DONE' ? '답변완료' : '미답변'}
            </span>
            <span>{qna.title}</span>
            <span>{qna.ansBy ?? '나'}</span>
            <span>{qna.regDt?.slice(0, 10)}</span>
          </div>
        ))}
      </div>

      {activeModal && (
        <div className="qna-modal-backdrop">
          {activeModal === 'detail' && selectedQna && (
            <QnaDetailModal qna={selectedQna} onClose={closeModal} />
          )}
          {activeModal === 'write' && (
            <QnaWriteModal onClose={closeModal} />
          )}
        </div>
      )}
    </div>
  );
};

export default PassTradeQna;
