import React, { useState, useEffect } from "react";
import axios from "axios";

function AdminNoticePage() {
  const [notices, setNotices] = useState([]);
  const [openId, setOpenId] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  /* =========================
     지점명 매핑 (Mock)
  ========================= */
  const branchName = (id) => {
    if (id === null) return "전체";
    if (id === 1) return "강남점";
    if (id === 2) return "부산점";
    if (id === 3) return "평택점";
    return `지점#${id}`;
  };

  /* =========================
     공지 목록 조회
  ========================= */
  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    const res = await axios.get("/api/admin/notice");

    const converted = res.data.map((n) => ({
      id: n.postId,
      title: n.title,
      content: n.content,
      visible: n.isVisible,
      pinned: false,          // 상단고정은 UI 전용
      endDate: "-",           // 아직 DB 연동 안 함
      createdAt: n.createdAt?.split("T")[0],
      branch_id: n.branchId,
    }));

    setNotices(converted);
  };

  /* =========================
     UI 핸들러
  ========================= */
  const toggleOpen = (id) => {
    setOpenId(openId === id ? null : id);
  };

  const editNotice = (n) => {
    setEditingId(n.id);
    setTitle(n.title);
    setContent(n.content);
  };

  /* =========================
     등록 / 수정
  ========================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      title,
      content,
      branchId: null,
    };

    if (editingId) {
      await axios.put(`/api/admin/notice/${editingId}`, payload);
    } else {
      await axios.post("/api/admin/notice", payload);
    }

    setEditingId(null);
    setTitle("");
    setContent("");

    fetchNotices();
  };

  /* =========================
     삭제 (실제 DELETE)
  ========================= */
  const deleteNotice = async (id) => {
    if (!window.confirm("공지사항을 삭제하시겠습니까?")) return;

    await axios.delete(`/api/admin/notice/${id}`);
    fetchNotices();
  };

  /* =========================
     숨김 / 보이기
  ========================= */
  const toggleVisible = async (n) => {
  if (!window.confirm("노출 상태를 변경하시겠습니까?")) return;

  await axios.put(
    `/api/admin/notice/${n.id}/visible`,
    null,
    { params: { visible: !n.visible } }
  );

  fetchNotices();
};


  /* =========================
     상단 고정 (UI 전용)
  ========================= */
  const togglePinned = (notice) => {
    if (notice.branch_id !== null) {
      alert("상단 고정은 전체 공지만 가능합니다.");
      return;
    }

    setNotices(
      notices.map((n) =>
        n.id === notice.id ? { ...n, pinned: !n.pinned } : n
      )
    );
  };

  /* =========================
     검색 & 정렬
  ========================= */
  const filteredNotices = notices.filter((n) =>
    n.title.includes(searchKeyword)
  );

  const sortedNotices = [...filteredNotices].sort((a, b) => {
    if (a.pinned === b.pinned) return b.id - a.id;
    return a.pinned ? -1 : 1;
  });

  return (
    <>
      <h1>공지사항 관리</h1>

      {/* 검색 */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="제목 검색"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          style={{ width: "250px", padding: "6px" }}
        />
      </div>

      {/* 공지 목록 */}
      <table className="admin-table">
        <thead>
          <tr>
            <th>번호</th>
            <th>지점</th>
            <th>제목</th>
            <th>종료일</th>
            <th>노출</th>
            <th>상단</th>
            <th>관리</th>
          </tr>
        </thead>

        <tbody>
          {sortedNotices.map((n) => {
            const rowStyle = {
              background: n.pinned
                ? "#eaf3ff"
                : !n.visible
                ? "#f1f1f1"
                : "white",
              color: !n.visible ? "#999" : "#000",
              opacity: !n.visible ? 0.4 : 1,
            };

            return (
              <React.Fragment key={n.id}>
                <tr style={rowStyle}>
                  <td>{n.id}</td>
                  <td>{branchName(n.branch_id)}</td>

                  <td
                    onClick={() => n.visible && toggleOpen(n.id)}
                    style={{
                      cursor: n.visible ? "pointer" : "default",
                      fontWeight: "600",
                    }}
                  >
                    {n.pinned && "📌 "} {n.title}
                  </td>

                  <td>{n.endDate}</td>
                  <td>{n.visible ? "노출" : "숨김"}</td>
                  <td>{n.pinned ? "고정" : "-"}</td>

                  <td>
                    <button onClick={() => editNotice(n)}>수정</button>

                    <button onClick={() => toggleVisible(n)}>
                      {n.visible ? "숨기기" : "보이기"}
                    </button>

                    {n.branch_id === null ? (
                      <button onClick={() => togglePinned(n)}>
                        {n.pinned ? "해제" : "상단고정"}
                      </button>
                    ) : (
                      <button disabled style={{ opacity: 0.5 }}>
                        상단고정 불가
                      </button>
                    )}

                    <button
                      onClick={() => deleteNotice(n.id)}
                      style={{ color: "red" }}
                    >
                      삭제
                    </button>
                  </td>
                </tr>

                {openId === n.id && (
                  <tr>
                    <td colSpan="7" style={{ background: "#fafafa", padding: "15px" }}>
                      <strong>내용</strong>
                      <div style={{ marginTop: "10px", whiteSpace: "pre-line", }}>{n.content}</div>
                      <div style={{ marginTop: "15px", fontSize: "13px", color: "#777" }}>
                        작성일: {n.createdAt}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>

      {/* 등록 / 수정 */}
      <h2 style={{ marginTop: "30px" }}>
        {editingId ? "공지 수정" : "공지 등록"}
      </h2>

      <form
        onSubmit={handleSubmit}
        style={{
          marginTop: "20px",
          padding: "20px",
          background: "#fafafa",
          width: "650px",
          borderRadius: "8px",
        }}
      >
        <div style={{ marginBottom: "15px" }}>
          <label>제목</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: "500px", padding: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>내용</label>
          <textarea
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{
              width: "500px",
              height: "200px",
              padding: "8px",
              resize: "none",
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            padding: "10px 20px",
            background: "#333",
            color: "#fff",
            borderRadius: "4px",
          }}
        >
          {editingId ? "수정 완료" : "등록하기"}
        </button>
      </form>
    </>
  );
}

export default AdminNoticePage;
