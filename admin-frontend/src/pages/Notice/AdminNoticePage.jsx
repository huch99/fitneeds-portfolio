import React, { useState } from "react";

function AdminNoticePage() {
  const [notices, setNotices] = useState([
    {
      id: 1,
      title: "시스템 점검 안내",
      content: "3월 20일 새벽 2시~3시에 시스템 점검이 진행됩니다.",
      visible: true,
      pinned: true,
      endDate: "2025-12-31",
      createdAt: "2025-01-05",
      branch_id: null, // 전체 공지
    },
    {
      id: 2,
      title: "GX룸 공사 안내",
      content: "4월부터 GX룸 공사가 진행됩니다.",
      visible: true,
      pinned: false,
      endDate: "2025-06-30",
      createdAt: "2025-02-01",
      branch_id: 1, // 강남점 공지
    },
    {
      id: 3,
      title: "수영장 점검 안내",
      content: "수영장은 3월 15일 점검 예정입니다.",
      visible: false,
      pinned: false,
      endDate: "2025-03-15",
      createdAt: "2025-02-10",
      branch_id: 2, // 부산점 공지
    },
  ]);

  // 지점명 매핑 (Mock)
  const branchName = (id) => {
    if (id === null) return "전체";
    if (id === 1) return "강남점";
    if (id === 2) return "부산점";
    if (id === 3) return "평택점";
    return `지점#${id}`;
  };

  const [openId, setOpenId] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [endDate, setEndDate] = useState("");

  const toggleOpen = (id) => {
    setOpenId(openId === id ? null : id);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newNotice = {
      id: editingId || Date.now(),
      title,
      content,
      visible: true,
      pinned: false, // 새 공지는 기본적으로 고정 X
      endDate,
      createdAt: new Date().toISOString().split("T")[0],
      branch_id: null, // 지금은 전체공지로 기본 저장 (지점 선택 기능은 나중에 추가)
    };

    if (editingId) {
      setNotices(notices.map((n) => (n.id === editingId ? newNotice : n)));
      setEditingId(null);
    } else {
      setNotices([...notices, newNotice]);
    }

    setTitle("");
    setContent("");
    setEndDate("");
  };

  const editNotice = (n) => {
    setEditingId(n.id);
    setTitle(n.title);
    setContent(n.content);
    setEndDate(n.endDate);
  };

  const deleteNotice = (id) => {
    if (window.confirm("공지사항을 삭제하시겠습니까?")) {
      setNotices(notices.filter((n) => n.id !== id));
    }
  };

  const toggleVisible = (id) => {
    setNotices(
      notices.map((n) =>
        n.id === id ? { ...n, visible: !n.visible } : n
      )
    );
  };

  // 🔥 상단 고정 가능 여부: 전체 공지만 가능 (branch_id === null)
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

  const filteredNotices = notices.filter((n) =>
    n.title.includes(searchKeyword)
  );

  // 🔥 정렬: 상단 고정 → 최신순
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
            <th>지점</th> {/* 🔥 지점 컬럼 */}
            <th>제목</th>
            <th>종료일</th>
            <th>노출</th>
            <th>상단</th>
            <th>관리</th>
          </tr>
        </thead>

        <tbody>
          {sortedNotices.map((n) => (
            <React.Fragment key={n.id}>
              <tr style={{ background: n.pinned ? "#eaf3ff" : "white" }}>
                <td>{n.id}</td>
                <td>{branchName(n.branch_id)}</td>

                <td
                  onClick={() => toggleOpen(n.id)}
                  style={{ cursor: "pointer", fontWeight: "600" }}
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

                  {/* 🔥 상단 고정 버튼 — 전체 공지만 허용 */}
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

              {/* 펼침 내용 */}
              {openId === n.id && (
                <tr>
                  <td colSpan="7" style={{ background: "#f8f8f8", padding: "15px" }}>
                    <strong>내용</strong>
                    <div style={{ marginTop: "10px" }}>{n.content}</div>

                    <div style={{ marginTop: "15px", fontSize: "13px", color: "#777" }}>
                      작성일: {n.createdAt}
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {/* 등록/수정 폼 */}
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

        <div style={{ marginBottom: "20px" }}>
          <label>게시 종료일</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={{ padding: "6px" }}
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
