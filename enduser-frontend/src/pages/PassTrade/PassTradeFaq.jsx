// PassTradeFaq.jsx
import React, { useEffect, useState } from 'react';
import { mockFaqs } from './mockFaqs';
import './PassTradeFaq.css';
import PassTradeQna from './PassTradeQna';

const PassTradeFaq = () => {
  const [faqs, setFaqs] = useState([]);
  const [filteredFaqs, setFilteredFaqs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const fetchFaqs = async () => {
    const data = mockFaqs;
    setFaqs(data);
    setFilteredFaqs(data);

    const cats = [...new Set(data.map((faq) => faq.category))];
    setCategories(cats);
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredFaqs(faqs);
    } else {
      setFilteredFaqs(faqs.filter((faq) => faq.category === selectedCategory));
    }
  }, [selectedCategory, faqs]);

  return (
    <div className="pass-trade-faq">
      {/* =========================
          FAQ 영역 (mockFaqs 유지)
         ========================= */}
      <div className="faq-section">
        <h1>이용권 FAQ</h1>

        <div className="category-filter">
          <button
            className={selectedCategory === 'all' ? 'active' : ''}
            onClick={() => setSelectedCategory('all')}
          >
            전체
          </button>

          {categories.map((cat) => (
            <button
              key={cat}
              className={selectedCategory === cat ? 'active' : ''}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="accordion" id="faqAccordion">
        {filteredFaqs.map((faq, index) => (
          <div key={faq.id} className="accordion-item">
            <h2 className="accordion-header" id={`heading${index}`}>
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target={`#collapse${index}`}
              >
                {faq.question}
              </button>
            </h2>

            <div
              id={`collapse${index}`}
              className="accordion-collapse collapse"
              data-bs-parent="#faqAccordion"
            >
              <div className="accordion-body">{faq.answer}</div>
            </div>
          </div>
        ))}
      </div>

      {/* =========================
          ✅ FAQ 밑에 QnA 붙이기
         ========================= */}
      <PassTradeQna />
    </div>
  );
};

export default PassTradeFaq;
