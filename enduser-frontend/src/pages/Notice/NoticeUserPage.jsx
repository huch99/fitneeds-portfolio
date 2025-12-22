import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./Notice.css";

function formatDateYmd(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr.replace(" ", "T"));
  if (Number.isNaN(d.getTime())) return String(dateStr).slice(0, 10);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}.${m}.${day}`;
}

function formatDateYmdHm(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr.replace(" ", "T"));
  if (Number.isNaN(d.getTime())) return String(dateStr);
  const ymd = formatDateYmd(dateStr);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${ymd} ${hh}:${mm}`;
}

function NoticeUserPage() {
  const [notices, setNotices] = useState([]);
  const [branches, setBranches] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [branchId, setBranchId] = useState("");
  const [detail, setDetail] = useState(null);
  const [loadingList, setLoadingList] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const params = useMemo(() => {
    const p = {};
    if (keyword?.trim()) p.keyword = keyword.trim();
    if (branchId) p.branchId = branchId;
    return p;
  }, [keyword, branchId]);

  const fetchBranches = async () => {
    try {
      const res = await axios.get("/api/user/branches");
      setBranches(res.data || []);
    } catch {
      setBranches([]);
    }
  };

  const fetchNotices = async () => {
    setLoadingList(true);
    try {
      const res = await axios.get("/api/user/notice", { params });
      setNotices(res.data || []);
    } catch {
      alert("공지사항 목록 조회 실패");
      setNotices([]);
    } finally {
      setLoadingList(false);
    }
  };

  const openNotice = async (postId) => {
    setLoadingDetail(true);
    try {
      const res = await axios.get(`/api/user/notice/${postId}`);
      setDetail(res.data);
    } catch {
      alert("공지 상세 조회 실패");
      setDetail(null);
    } finally {
      setLoadingDetail(false);
    }
  };

  const closePopup = () => setDetail(null);

  useEffect(() => {
    fetchBranches();
    fetchNotices();
  }, []);

  return (
    <div className="notice-wrap">
      {/* 공지 목록 */}
      <section className="notice-section">
        <div className="notice-section-body">
          <h2 className="notice-h2">체육센터 공지사항</h2>
          <p className="notice-desc">
            센터 운영 관련 필수 안내 및 이벤트 소식을 확인할 수 있습니다.
          </p>

          <div className="notice-table-wrap">
            <table className="notice-table">
              <thead>
                <tr>
                  <th>번호</th>
                  <th>지점</th>
                  <th>제목</th>
                  <th>게시기간</th>
                  <th>조회</th>
                </tr>
              </thead>
              <tbody>
                {notices.map((n) => (
                  <tr
                    key={n.postId}
                    className="notice-row"
                    onClick={() => openNotice(n.postId)}
                  >
                    <td>{n.postId}</td>
                    <td>{n.branchName}</td>
                    <td className="notice-td-title">
                      <span className="notice-title-text">{n.title}</span>
                    </td>
                    <td>
                      {n.displayEnd
                        ? formatDateYmd(n.displayEnd)
                        : "상시"}

                    </td>
                    <td>{n.views ?? 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 팝업 */}
      {detail && (
        <div className="notice-modal-overlay" onClick={closePopup}>
          <div className="notice-modal-stage" onClick={(e) => e.stopPropagation()}>
            <div className="notice-modal">
              <button
                className="notice-modal-close"
                onClick={closePopup}
                type="button"
              >
                ×
              </button>

              <div className="notice-modal-title">{detail.title}</div>

              <div className="notice-modal-meta">
                <span>등록일 {formatDateYmdHm(detail.createdAt)}</span>
                <span>조회수 {detail.views ?? 0}</span>
              </div>

              {/* ✅ 스크롤 영역 */}
              <div className="notice-modal-content">
                <div className="notice-content-box">
                  {detail.content}
                </div>
              </div>

              {/* ✅ 고정 버튼 영역 (content 밖!) */}
              <div className="notice-modal-actions">
                <button
                  className="notice-ok-btn"
                  type="button"
                  onClick={closePopup}
                >
                  확인
                </button>
              </div>

              {loadingDetail && (
                <div className="notice-loading-mask">로딩 중...</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NoticeUserPage;
