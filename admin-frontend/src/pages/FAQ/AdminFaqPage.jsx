import React, { useState } from "react";

function AdminFaqPage() {
  const [faqs, setFaqs] = useState([
    { id: 1, category: "이용안내", question: "운영시간이 어떻게 되나요?", answer: "평일 09~22시 운영합니다.", visible: true },
    { id: 2, category: "결제/환불", question: "환불 규정이 어떻게 되나요?", answer: "환불은 이용 시작 전까지만 가능합니다.", visible: true },
    { id: 3, category: "시설이용", question: "락커는 유료인가요?", answer: "회원은 무료로 이용할 수 있습니다.", visible: true },
  ]);

  const [openId, setOpenId] = useState(null); // 펼침 상태 ID
  const [category, setCategory] = useState("이용안내");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [editingId, setEditingId] = useState(null);

  const categoryList = ["이용안내", "결제/환불", "시설이용", "기타"];

  const toggleOpen = (id) => {
    setOpenId(openId === id ? null : id);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newFaq = {
      id: editingId || Date.now(),
      category,
      question,
      answer,
      visible: true,
    };

    if (editingId) {
      setFaqs(faqs.map((f) => (f.id === editingId ? newFaq : f)));
      setEditingId(null);
    } else {
      setFaqs([...faqs, newFaq]);
    }

    setCategory("이용안내");
    setQuestion("");
    setAnswer("");
  };

  const editFaq = (faq) => {
    setEditingId(faq.id);
    setCategory(faq.category);
    setQuestion(faq.question);
    setAnswer(faq.answer);
    setOpenId(null); // 수정 시 펼침 닫기
  };

  const deleteFaq = (id) => {
    if (window.confirm("삭제하시겠습니까?")) {
      setFaqs(faqs.filter((f) => f.id !== id));
    }
  };

  const toggleVisible = (id) => {
    setFaqs(
      faqs.map((f) =>
        f.id === id ? { ...f, visible: !f.visible } : f
      )
    );
  };

  return (
    <>
      <h1>FAQ 관리</h1>

      {/* FAQ 목록 */}
      <table className="admin-table">
        <thead>
          <tr>
            <th>번호</th>
            <th>카테고리</th>
            <th>질문</th>
            <th>노출 여부</th>
            <th>관리</th>
          </tr>
        </thead>

        <tbody>
          {faqs.map((f) => (
            <React.Fragment key={f.id}>
              <tr>
                <td>{f.id}</td>
                <td>{f.category}</td>
                <td
                  onClick={() => toggleOpen(f.id)}
                  style={{ cursor: "pointer", fontWeight: "600" }}
                >
                  {f.question}
                </td>
                <td>{f.visible ? "노출" : "숨김"}</td>
                <td>
                  <button onClick={() => editFaq(f)}>수정</button>
                  <button onClick={() => toggleVisible(f.id)}>
                    {f.visible ? "숨기기" : "보이기"}
                  </button>
                  <button onClick={() => deleteFaq(f.id)} style={{ color: "red" }}>
                    삭제
                  </button>
                </td>
              </tr>

              {/* 펼침 답변 */}
              {openId === f.id && (
                <tr>
                  <td colSpan="5" style={{ background: "#f8f8f8", padding: "15px" }}>
                    <strong>답변:</strong>
                    <div style={{ marginTop: "10px" }}>{f.answer}</div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {/* 등록/수정 폼 */}
      <h2 style={{ marginTop: "30px" }}>
        {editingId ? "FAQ 수정" : "FAQ 등록"}
      </h2>

      <form
        onSubmit={handleSubmit}
        style={{
          marginTop: "20px",
          padding: "20px",
          background: "#fafafa",
          borderRadius: "8px",
          width: "650px"
        }}
      >
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            카테고리
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{ width: "200px", padding: "6px" }}
          >
            {categoryList.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            질문
          </label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
            style={{
              width: "500px",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc"
            }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            답변
          </label>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            required
            style={{
              width: "500px",
              height: "180px",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              resize: "none"
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            padding: "10px 20px",
            background: "#333",
            color: "white",
            borderRadius: "4px"
          }}
        >
          {editingId ? "수정완료" : "등록하기"}
        </button>
      </form>
    </>
  );
}

export default AdminFaqPage;
