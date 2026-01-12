// passtrade
import React, { useState, useEffect } from 'react';
import api from '../../api';
import './PassTradeFaq.css'; // CSS 파일 생성 필요

const PassTradeFaq = () => {
  const [faqs, setFaqs] = useState([]);
  const [filteredFaqs, setFilteredFaqs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const fetchFaqs = async () => {
    try {
      const response = await api.get('/api/passfaq');
      setFaqs(response.data);
      setFilteredFaqs(response.data);
      // 카테고리 추출
      const cats = [...new Set(response.data.map(faq => faq.category))];
      setCategories(cats);
    } catch (error) {
      console.error('FAQ 조회 실패:', error);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredFaqs(faqs);
    } else {
      setFilteredFaqs(faqs.filter(faq => faq.category === selectedCategory));
    }
  }, [selectedCategory, faqs]);

  return (
    <div className="pass-trade-faq">
      <h1>이용권 FAQ</h1>
      <div className="category-filter">
        <button className={selectedCategory === 'all' ? 'active' : ''} onClick={() => setSelectedCategory('all')}>전체</button>
        {categories.map(cat => (
          <button key={cat} className={selectedCategory === cat ? 'active' : ''} onClick={() => setSelectedCategory(cat)}>{cat}</button>
        ))}
      </div>
      <div className="accordion" id="faqAccordion">
        {filteredFaqs.map((faq, index) => (
          <div key={faq.id} className="accordion-item">
            <h2 className="accordion-header" id={`heading${index}`}>
              <button
                className="accordion-button"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target={`#collapse${index}`}
                aria-expanded="true"
                aria-controls={`collapse${index}`}
              >
                {faq.question}
              </button>
            </h2>
            <div
              id={`collapse${index}`}
              className="accordion-collapse collapse"
              aria-labelledby={`heading${index}`}
              data-bs-parent="#faqAccordion"
            >
              <div className="accordion-body">
                {faq.answer}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PassTradeFaq;