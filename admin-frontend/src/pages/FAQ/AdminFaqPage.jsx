import React, { useEffect, useState } from "react";
import api from "../../api";   // ⚠️ 실제 경로에 맞게 조정하세요

function AdminFaqPage() {
  const [faqs, setFaqs] = useState([]);
  const [openId, setOpenId] = useState(null);

  const [category, setCategory] = useState("이용안내");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const categoryList = ["이용안내", "결제/환불", "시설이용", "기타"];

  /* =========================
     FAQ 목록 조회
  ========================= */
  useEffect(() => {
    fetchFaqs();
  }, [page]);

  const fetchFaqs = async () => {
    const res = await api.get("/admin/faq", {
      params: { page }
    });

    setFaqs(res.data.list);
    setTotalPages(res.data.totalPages);
  };

  /* =========================
     FAQ 등록 / 수정
  ========================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      category,
      title: question,
      content: answer,
      visible: true,
      postVisible: true
    };



    if (editingId) {
      await api.put(`/admin/faq/${editingId}`, data);
    } else {
      await api.post("/admin/faq", data);
    }

    resetForm();
    fetchFaqs();
  };

  const resetForm = () => {
    setCategory("이용안내");
    setQuestion("");
    setAnswer("");
    setEditingId(null);
  };

  /* =========================
     수정
  ========================= */
  const editFaq = (f) => {
    setEditingId(f.postId);
    setCategory(f.category);
    setQuestion(f.title);
    setAnswer(f.content);
    setOpenId(null);
  };

  /* =========================
     삭제
  ========================= */
  const deleteFaq = async (id) => {
    if (!window.confirm("삭제하시겠습니까?")) return;
    await api.delete(`/admin/faq/${id}`);
    fetchFaqs();
  };

  /* =========================
     노출 / 숨김
  ========================= */
  const toggleVisible = async (f) => {
    await api.put(`/admin/faq/${f.postId}/visible`, null, {
      params: { visible: !f.isVisible }
    });
    fetchFaqs();
  };

  const toggleOpen = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <>
      <h1>FAQ 관리</h1>

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>카테고리</th>
            <th>질문</th>
            <th>노출</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          {faqs.map((f) => (
            <React.Fragment key={f.postId}>
              <tr>
                <td>{f.postId}</td>
                <td>{f.category}</td>
                <td
                  onClick={() => toggleOpen(f.postId)}
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
                  <button onClick={() => deleteFaq(f.postId)} style={{ color: "red" }}>
                    삭제
                  </button>
                </td>
              </tr>

              {openId === f.postId && (
                <tr>
                  <td colSpan="5" style={{ background: "#f8f8f8", padding: "15px" }}>
                    <strong>답변</strong>
                    <div style={{ marginTop: "10px" }}>{f.content}</div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {/* 페이지네이션 */}
      <div style={{ marginTop: "20px" }}>
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>
          ◀
        </button>
        <span style={{ margin: "0 10px" }}>
          {page} / {totalPages}
        </span>
        <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>
          ▶
        </button>
      </div>

      {/* 등록 / 수정 */}
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
          <label>카테고리</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {categoryList.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>질문</label>
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
            style={{ width: "500px" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>답변</label>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            required
            style={{ width: "500px", height: "180px" }}
          />
        </div>

        <button type="submit">
          {editingId ? "수정완료" : "등록"}
        </button>
      </form>
    </>
  );
}

export default AdminFaqPage;
