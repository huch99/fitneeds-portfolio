import React, { useEffect, useState } from "react";
import api from "../../api";

function AdminFAQPage() {
  const [faqs, setFaqs] = useState([]);
  const [openId, setOpenId] = useState(null);

  const [category, setCategory] = useState("이용안내");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [editingId, setEditingId] = useState(null);

  const categoryList = ["이용안내", "결제/환불", "시설이용", "기타"];

  /* =========================
     FAQ 목록 조회
  ========================= */
  const fetchFaqs = async () => {
    const res = await api.get("/admin/faq", {
      params: { page: 1 },
    });
    setFaqs(res.data.list);
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  /* =========================
     UI 핸들러
  ========================= */
  const toggleOpen = (postId) => {
    setOpenId(openId === postId ? null : postId);
  };

  const editFaq = (f) => {
    setEditingId(f.postId);
    setCategory(f.category);
    setQuestion(f.title);
    setAnswer(f.content);
    setOpenId(null);
  };

  /* =========================
     등록 / 수정
  ========================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      category,
      title: question,
      content: answer,
      writerId: localStorage.getItem("userName"), // 임시 writer_id
    };

    if (editingId) {
      await api.put(`/admin/faq/${editingId}`, payload);
    } else {
      await api.post("/admin/faq", payload);
    }

    setEditingId(null);
    setCategory("이용안내");
    setQuestion("");
    setAnswer("");

    fetchFaqs();
  };

  /* =========================
     삭제
  ========================= */
  const deleteFaq = async (postId) => {
    if (!window.confirm("삭제하시겠습니까?")) return;
    await api.delete(`/admin/faq/${postId}`);
    fetchFaqs();
  };

  /* =========================
     숨김 / 보이기 (PUT 방식)
  ========================= */
  const toggleVisible = async (f) => {
    if (!window.confirm("노출 상태를 변경하시겠습니까?")) return;

    await api.put(`/admin/faq/${f.postId}/visible`, null, {
      params: { visible: !f.isVisible },
    });

    fetchFaqs();
  };

  return (
    <>
      <h1>FAQ 관리</h1>

      <table className="admin-table">
        <thead>
          <tr>
            <th>번호</th>
            <th>카테고리</th>
            <th>질문</th>
            <th>노출</th>
            <th>관리</th>
          </tr>
        </thead>

        <tbody>
          {faqs.map((f) => (
            <React.Fragment key={f.postId}>
              <tr
                style={{
                  background: !f.isVisible ? "#f1f1f1" : "white",
                  color: !f.isVisible ? "#999" : "#000",
                  opacity: !f.isVisible ? 0.5 : 1,
                }}
              >
                <td>{f.postId}</td>
                <td>{f.category}</td>
                <td
                  onClick={() => f.isVisible && toggleOpen(f.postId)}
                  style={{ cursor: "pointer", fontWeight: "600" }}
                >
                  {f.title}
                </td>
                <td>{f.isVisible ? "노출" : "숨김"}</td>
                <td>
                  <button onClick={() => editFaq(f)}>수정</button>
                  <button onClick={() => toggleVisible(f)}>
                    {f.isVisible ? "숨기기" : "보이기"}
                  </button>
                  <button
                    onClick={() => deleteFaq(f.postId)}
                    style={{ color: "red" }}
                  >
                    삭제
                  </button>
                </td>
              </tr>

              {openId === f.postId && (
                <tr>
                  <td colSpan="5" style={{ background: "#fafafa", padding: "15px" }}>
                    <strong>답변</strong>
                    <div style={{ marginTop: "10px", whiteSpace: "pre-line" }}>
                      {f.content}
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      <h2 style={{ marginTop: "30px" }}>
        {editingId ? "FAQ 수정" : "FAQ 등록"}
      </h2>

      <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
        <div>
          <label>카테고리</label><br />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{ width: "200px" }}
          >
            {categoryList.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>질문</label><br />
          <input
            type="text"
            required
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            style={{ width: "500px" }}
          />
        </div>

        <div>
          <label>답변</label><br />
          <textarea
            required
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            style={{ width: "500px", height: "150px" }}
          />
        </div>

        <button type="submit" style={{ marginTop: "15px" }}>
          {editingId ? "수정 완료" : "등록"}
        </button>
      </form>
    </>
  );
}

export default AdminFAQPage;
