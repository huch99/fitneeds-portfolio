import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./Notice.css";

function formatDateYmd(dateStr) {
  if (!dateStr) return "";
  // "2025-12-18 16:20:00" or ISO 형태도 대응
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
  const [branchId, setBranchId] = useState(""); // "" = 전체 지점

  const [detail, setDetail] = useState(null);
  const [loadingList, setLoadingList] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // (선택) 페이지네이션이 아직 백엔드 없으면 UI만 남겨둠
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const params = useMemo(() => {
    const p = {};
    if (keyword?.trim()) p.keyword = keyword.trim();
    if (branchId) p.branchId = branchId;
    // 백엔드가 페이지 지원하면 사용:
    // p.page = page;
    // p.size = pageSize;
    return p;
  }, [keyword, branchId]);

  const fetchBranches = async () => {
    // 이미 존재하는 지점 API가 있다면 그대로 사용
    // 없다면 추후 연결
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
    } catch (e) {
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
    } catch (e) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSearch = () => {
    setPage(1);
    fetchNotices();
  };

  const branchLabel = (bId) => {
    if (bId === null || bId === undefined || bId === "") return "전체";
    const found = branches.find((b) => String(b.branchId) === String(bId));
    return found?.branchName || "전체";
  };

  return (
    <div className="notice-wrap">
      {/* =======================
          ✅ 섹션 1) 공지사항 목록
      ======================= */}
      <section className="notice-section">
        <div className="notice-section-head">
          <div className="notice-section-left">
            <span className="notice-dot" />
          </div>
        </div>

        <div className="notice-section-body">
          <h2 className="notice-h2">체육센터 공지사항</h2>
          <p className="notice-desc">
            센터 운영 관련 필수 안내 및 이벤트 소식을 확인할 수 있습니다. 지점을 선택하여 내가 다니는 센터의 공지만 볼 수 있습니다.
          </p>

          {/* 필터 바 (스크린샷 위치/형태 반영) */}
          <div className="notice-filter-row">
            <div className="notice-search-group">
              <span className="notice-filter-label">검색어</span>
              <input
                className="notice-input"
                type="text"
                placeholder="제목, 내용 검색"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onSearch()}
              />
            </div>

            <div className="notice-right-group">
              <select
                className="notice-select"
                value={branchId}
                onChange={(e) => setBranchId(e.target.value)}
              >
                <option value="">전체 지점</option>
                {branches.map((b) => (
                  <option key={b.branchId} value={b.branchId}>
                    {b.branchName}
                  </option>
                ))}
              </select>

              <button className="notice-search-btn" onClick={onSearch}>
                검색
              </button>
            </div>
          </div>

          <div className="notice-guide">
            지점을 선택하면 해당 센터에서 등록한 공지만 목록에 표시됩니다.
          </div>

          {/* 테이블 */}
          <div className="notice-table-wrap">
            <table className="notice-table">
              <thead>
                <tr>
                  <th className="col-num">번호</th>
                  <th className="col-branch">지점</th>
                  <th className="col-title">제목</th>
                  <th className="col-period">게시기간</th>
                  <th className="col-views">조회</th>
                </tr>
              </thead>
              <tbody>
                {loadingList ? (
                  <tr>
                    <td colSpan={5} className="notice-empty">
                      로딩 중...
                    </td>
                  </tr>
                ) : notices.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="notice-empty">
                      표시할 공지사항이 없습니다.
                    </td>
                  </tr>
                ) : (
                  notices.map((n, idx) => (
                    <tr
                      key={n.postId}
                      className="notice-row"
                      onClick={() => openNotice(n.postId)}
                    >
                      <td>{n.postId}</td>
                      <td>{n.branchName ?? branchLabel(n.branchId)}</td>
                      <td className="notice-td-title">
                        {/* (선택) pinned 같은 UI 전용 뱃지 예시 */}
                        {n.pinned ? <span className="notice-badge">상단고정</span> : null}
                        <span className="notice-title-text">{n.title}</span>
                      </td>
                      <td>
                        {n.displayStart && n.displayEnd
                          ? `${formatDateYmd(n.displayStart)} ~ ${formatDateYmd(n.displayEnd)}`
                          : "상시"}
                      </td>
                      <td className="notice-views">{n.views ?? 0}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* 하단 정보/페이지(스크린샷 느낌만) */}
          <div className="notice-bottom">
            <div className="notice-count">총 {notices.length}건</div>

            <div className="notice-pagination">
              <button className="page-btn" type="button" aria-label="prev">
                &lt;
              </button>
              <button className="page-num active" type="button">
                1
              </button>
              <button className="page-num" type="button">
                2
              </button>
              <button className="page-num" type="button">
                3
              </button>
              <button className="page-btn" type="button" aria-label="next">
                &gt;
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =======================
          ✅ 섹션 2) 팝업 (클릭 시 실제로 뜸)
          ※ 화면에는 “공백”만 있고, 팝업은 오버레이로 뜨는 구조
      ======================= */}
      <div className="notice-section-gap" />

      {/* 팝업 오버레이 (스크린샷 스타일) */}
      {detail && (
        <div className="notice-modal-overlay" onClick={closePopup}>
          <div className="notice-modal-stage" onClick={(e) => e.stopPropagation()}>
            <div className="notice-modal">
              <button className="notice-modal-close" onClick={closePopup} type="button">
                ×
              </button>

              <div className="notice-modal-title">
                {/* 예: [필독]은 UI/DB 어느 쪽이든 가능 */}
                {detail.required ? <span className="notice-required">[필독]</span> : null}
                <span>{detail.title}</span>
              </div>

              <div className="notice-modal-meta">
                <div className="meta-left">
                  <span>등록일 {formatDateYmdHm(detail.createdAt)}</span>
                  <span className="meta-sep">|</span>
                  <span>
                    게시기간{" "}
                    {detail.displayStart && detail.displayEnd
                      ? `${formatDateYmd(detail.displayStart)} ~ ${formatDateYmd(detail.displayEnd)}`
                      : "상시"}
                  </span>
                </div>
                <div className="meta-right">조회수 {detail.views ?? 0}</div>
              </div>

              <div className="notice-modal-content">
                <div className="notice-content-box">
                  {detail.content}
                </div>

                {/* 첨부파일 UI(스크린샷 형태) - 실제 필드 있으면 연결 */}
                {detail.attachmentName ? (
                  <div className="notice-attach-row">
                    <div className="attach-left">
                      <span className="attach-label">첨부파일</span>
                      <span className="attach-name">{detail.attachmentName}</span>
                      {detail.attachmentSize ? (
                        <span className="attach-size">({detail.attachmentSize})</span>
                      ) : null}
                    </div>
                    <button className="attach-btn" type="button">
                      다운로드
                    </button>
                  </div>
                ) : null}

                <div className="notice-modal-actions">
                  <button className="notice-ok-btn" type="button" onClick={closePopup}>
                    확인
                  </button>
                </div>
              </div>

              {loadingDetail ? <div className="notice-loading-mask">로딩 중...</div> : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NoticeUserPage;
