import React, { useState, useEffect } from "react";
import axios from "axios";

function AdminNoticePage() {
  const [notices, setNotices] = useState([]);
  const [openId, setOpenId] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // 🔥 종료 날짜 / 상시 게시
  const [displayEnd, setDisplayEnd] = useState("");
  const [alwaysDisplay, setAlwaysDisplay] = useState(true);

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
      pinned: false,
      endDate: n.displayEnd
        ? n.displayEnd.split("T")[0]
        : "상시",
      createdAt: n.createdAt?.split("T")[0],
      branch_id: n.branchId,
      rawDisplayEnd: n.displayEnd,
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

    if (n.rawDisplayEnd) {
      setAlwaysDisplay(false);
      setDisplayEnd(n.rawDisplayEnd.split("T")[0]);
    } else {
      setAlwaysDisplay(true);
      setDisplayEnd("");
    }
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
      displayEnd: alwaysDisplay ? null : `${displayEnd}T23:59:59`,
    };

    if (!alwaysDisplay && !displayEnd) {
      alert("종료 날짜를 선택하세요.");
      return;
    }

    if (editingId) {
      await axios.put(`/api/admin/notice/${editingId}`, payload);
    } else {
      await axios.post("/api/admin/notice", payload);
    }

    setEditingId(null);
    setTitle("");
    setContent("");
    setDisplayEnd("");
    setAlwaysDisplay(true);

    fetchNotices();
  };

  /* =========================
     삭제
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
     검색 & 정렬
  ========================= */
  const filteredNotices = notices.filter((n) =>
    n.title.includes(searchKeyword)
  );

  const sortedNotices = [...filteredNotices].sort((a, b) => b.id - a.id);

  return (
    <>
      <h1>공지사항 관리</h1>

      <input
        type="text"
        placeholder="제목 검색"
        value={searchKeyword}
        onChange={(e) => setSearchKeyword(e.target.value)}
        style={{ width: "250px", padding: "6px", marginBottom: "20px" }}
      />

      <table className="admin-table">
        <thead>
          <tr>
            <th>번호</th>
            <th>지점</th>
            <th>제목</th>
            <th>종료일</th>
            <th>노출</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          {sortedNotices.map((n) => (
            <React.Fragment key={n.id}>
              <tr style={{
                background: !n.visible ? "#f1f1f1" : "white",
                color: !n.visible ? "#999" : "#000",
                opacity: !n.visible ? 0.5 : 1,
              }}>
                <td>{n.id}</td>
                <td>{branchName(n.branch_id)}</td>
                <td
                  onClick={() => n.visible && toggleOpen(n.id)}
                  style={{ cursor: "pointer", fontWeight: "600" }}
                >
                  {n.title}
                </td>
                <td>{n.endDate}</td>
                <td>{n.visible ? "노출" : "숨김"}</td>
                <td>
                  <button onClick={() => editNotice(n)}>수정</button>
                  <button onClick={() => toggleVisible(n)}>
                    {n.visible ? "숨기기" : "보이기"}
                  </button>
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
                  <td colSpan="6" style={{ background: "#fafafa", padding: "15px" }}>
                    <strong>내용</strong>
                    <div style={{ marginTop: "10px", whiteSpace: "pre-line" }}>
                      {n.content}
                    </div>
                    <div style={{ marginTop: "10px", fontSize: "13px", color: "#777" }}>
                      작성일: {n.createdAt}
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      <h2 style={{ marginTop: "30px" }}>
        {editingId ? "공지 수정" : "공지 등록"}
      </h2>

      <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
        <div>
          <label>제목</label><br />
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: "500px" }}
          />
        </div>

        <div>
          <label>내용</label><br />
          <textarea
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{ width: "500px", height: "150px" }}
          />
        </div>

        <div style={{ marginTop: "10px" }}>
          <label>
            <input
              type="checkbox"
              checked={alwaysDisplay}
              onChange={(e) => setAlwaysDisplay(e.target.checked)}
            />{" "}
            상시 게시
          </label>
        </div>

        <div style={{ marginTop: "10px" }}>
          <label>종료 날짜</label><br />
          <input
            type="date"
            disabled={alwaysDisplay}
            value={displayEnd}
            onChange={(e) => setDisplayEnd(e.target.value)}
          />
        </div>

        <button type="submit" style={{ marginTop: "15px" }}>
          {editingId ? "수정 완료" : "등록"}
        </button>
      </form>
    </>
  );
}

export default AdminNoticePage;
