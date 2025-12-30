import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import './FAQ.css';

function FAQ() {
  const [expandedItems, setExpandedItems] = useState({});
  const [faqList, setFaqList] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =========================
     FAQ 펼침 / 접힘 (UI 전용)
     ========================= */
  const toggleItem = (postId) => {
    setExpandedItems((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  /* =========================
     USER FAQ 목록 조회
     ========================= */
  useEffect(() => {
    const fetchFaq = async () => {
      try {
        const res = await axios.get('/api/user/faq');
        setFaqList(res.data);
      } catch (e) {
        console.error('FAQ 조회 실패', e);
      } finally {
        setLoading(false);
      }
    };

    fetchFaq();
  }, []);

  return (
    <>
      <Helmet>
        <title>FAQ - FITNEEDS</title>
        <meta name="description" content="Frequently asked questions" />
      </Helmet>

      <header className="section-padding">
        <div className="section-container">
          <div className="page-header">
            <h1 className="page-title">FAQ</h1>
            <p className="page-subtitle">
              당신의 운동이 더 합리적일 수 있도록,<br />
              <span className="brand">FITNEEDS</span>가 자주 묻는 질문에 답합니다
            </p>
          </div>
        </div>
      </header>

      {/* <header className="section-padding">
        <div className="section-container">
          <div className="page-header">
            <h1 className="page-title">Frequently Asked Questions</h1>
            <p className="page-subtitle">
              How can we help you?
            </p>
          </div>
        </div>
      </header> */}


      <section className="section-padding section-light">
        <div className="section-container">
          <div className="faq-board">

            <div className="faq-header">
              <span>번호</span>
              <span>카테고리</span>
              <span>질문</span>
              <span>작성일</span>
            </div>

            {loading && (
              <div className="faq-empty">로딩 중...</div>
            )}

            {!loading && faqList.length === 0 && (
              <div className="faq-empty">
                등록된 FAQ가 없습니다.
              </div>
            )}

            {faqList.map((item, index) => {
              const isOpen = expandedItems[item.postId];

              return (
                <div
                  key={item.postId}
                  className={`faq-item ${isOpen ? 'open' : ''}`}
                >
                  <div
                    className="faq-question"
                    onClick={() => toggleItem(item.postId)}
                  >
                    <div className="faq-number">
                      {faqList.length - index}
                    </div>

                    <div className="faq-category">
                      <span className="category-badge">
                        {item.category}
                      </span>
                    </div>

                    <div className="faq-title">
                      <strong>Q.</strong> {item.title}
                    </div>

                    <div className="faq-date">
                      {item.createdAt?.substring(0, 10)}
                    </div>
                  </div>

                  {isOpen && (
                    <div className="faq-answer">
                      <strong>A.</strong>
                      <p>{item.content}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}

export default FAQ;
