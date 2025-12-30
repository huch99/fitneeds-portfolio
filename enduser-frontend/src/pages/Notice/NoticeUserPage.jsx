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
  const [keyword, setKeyword] = useState("");
  const [detail, setDetail] = useState(null);
  const [loadingList, setLoadingList] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // ✅ 프론트 페이징
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  const params = useMemo(() => {
    const p = {};
    if (keyword?.trim()) p.keyword = keyword.trim();
    return p;
  }, [keyword]);

  const fetchNotices = async () => {
    setLoadingList(true);
    try {
      const res = await axios.get("/api/user/notice", { params });
      setNotices(res.data || []);
      setPage(1);
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
    fetchNotices();
  }, []);

  // ✅ 페이징 계산
  const totalPages = Math.ceil(notices.length / PAGE_SIZE);
  const pagedNotices = notices.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="notice-wrap notice-faq-only">
      {/* =========================
          상단 타이틀 영역 (공지용)
         ========================= */}
      <div className="notice-page-header">
        <h1 className="page-title">공지사항</h1>

        <p className="page-subtitle">
          더 나은 운동 경험을 위해 준비한,
          <span className="brand-highlight"> FITNEEDS</span>의
          중요한 소식과 지점별 안내를 전해드립니다.
        </p>
      </div>



      {/* =========================
          FAQ 스타일 공지 리스트 (grid 기반)
         ========================= */}
      {/* <section className="notice-list-section">

        <div className="section-container">
          <div className="faq-board notice-faq-board">
            <div className="faq-header">
              <span>번호</span>
              <span>지점</span>
              <span>공지 제목</span>
              <span>게시일</span>
            </div>

            {loadingList && <div className="faq-empty">로딩 중...</div>}

            {!loadingList && pagedNotices.length === 0 && (
              <div className="faq-empty">등록된 공지사항이 없습니다.</div>
            )}

            {!loadingList &&
              pagedNotices.map((n, idx) => {
                const number = notices.length - ((page - 1) * PAGE_SIZE + idx);
                return (
                  <div key={n.postId} className="faq-item">
                    <div
                      className="faq-question"
                      onClick={() => openNotice(n.postId)}
                    >
                      <div className="faq-number">{number}</div>

                      <div className="faq-category">
                        <span className="category-badge">{n.branchName}</span>
                      </div>

                      <div className="faq-title">{n.title}</div>

                      <div className="faq-date">
                        {n.createdAt ? String(n.createdAt).substring(0, 10) : ""}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div> */}

      {/* =========================
            페이징 (기존 그대로)
           ========================= */}
      {/* <div className="community-pagination notice-pagination-faq">
          <button disabled={page === 1} onClick={() => setPage(page - 1)}>
            이전
          </button>

          {Array.from({ length: totalPages }, (_, i) => {
            const pageNum = i + 1;
            return (
              <button
                key={pageNum}
                className={page === pageNum ? "active" : ""}
                onClick={() => setPage(pageNum)}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            disabled={page === totalPages || totalPages === 0}
            onClick={() => setPage(page + 1)}
          >
            다음
          </button>
        </div>
      </section> */}

      {/* =========================
    공지사항 리스트 (USER)
    table / th / td 기반
   ========================= */}
      <section className="notice-list-section">

        <div className="section-container">

          {/* =====================================
        🔴 기존 FAQ(grid) 방식 - 임시 주석
       ===================================== */}
          {/*
    <div className="faq-board notice-faq-board">
      <div className="faq-header">
        <span>번호</span>
        <span>지점</span>
        <span>공지 제목</span>
        <span>게시일</span>
      </div>

      {loadingList && <div className="faq-empty">로딩 중...</div>}

      {!loadingList && pagedNotices.length === 0 && (
        <div className="faq-empty">등록된 공지사항이 없습니다.</div>
      )}

      {!loadingList &&
        pagedNotices.map((n, idx) => {
          const number =
            notices.length - ((page - 1) * PAGE_SIZE + idx);

          return (
            <div key={n.postId} className="faq-item">
              <div
                className="faq-question"
                onClick={() => openNotice(n.postId)}
              >
                <div className="faq-number">{number}</div>
                <div className="faq-category">
                  <span className="category-badge">{n.branchName}</span>
                </div>
                <div className="faq-title">{n.title}</div>
                <div className="faq-date">
                  {n.createdAt
                    ? String(n.createdAt).substring(0, 10)
                    : ""}
                </div>
              </div>
            </div>
          );
        })}
    </div>
    */}

          {/* =====================================
        ✅ table 기반 공지사항 리스트
       ===================================== */}

          {loadingList && (
            <div className="faq-empty">로딩 중...</div>
          )}

          {!loadingList && pagedNotices.length === 0 && (
            <div className="faq-empty">등록된 공지사항이 없습니다.</div>
          )}

          {!loadingList && pagedNotices.length > 0 && (
            <div className="notice-table-wrap">
              <table className="notice-table">
                <thead>
                  <tr>
                    <th>번호</th>
                    <th>지점</th>
                    <th>공지 제목</th>
                    <th>게시일</th>
                    <th>종료일</th>
                  </tr>
                </thead>

                <tbody>
                  {pagedNotices.map((n, idx) => {
                    const number =
                      notices.length - ((page - 1) * PAGE_SIZE + idx);

                    return (
                      <tr
                        key={n.postId}
                        className="notice-row"
                        onClick={() => openNotice(n.postId)}
                      >
                        <td>{number}</td>

                        <td>
                          <span className="category-badge">
                            {n.branchName}
                          </span>
                        </td>

                        <td className="notice-td-title">
                          {n.title}
                        </td>

                        <td>
                          {n.createdAt
                            ? String(n.createdAt).substring(0, 10)
                            : ""}
                        </td>

                        <td>
                          {n.displayEnd && n.displayEnd !== "" ? (
                            <span className="notice-end-date deadline">
                              {String(n.displayEnd).substring(0, 10)}
                            </span>
                          ) : (
                            <span className="notice-end-date always">
                              상시 게시글
                            </span>
                          )}
                        </td>


                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* =========================
      페이징 (기존 그대로)
     ========================= */}
        <div className="community-pagination notice-pagination-faq">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            이전
          </button>

          {Array.from({ length: totalPages }, (_, i) => {
            const pageNum = i + 1;
            return (
              <button
                key={pageNum}
                className={page === pageNum ? "active" : ""}
                onClick={() => setPage(pageNum)}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            disabled={page === totalPages || totalPages === 0}
            onClick={() => setPage(page + 1)}
          >
            다음
          </button>
        </div>
      </section>

      {/* =========================
          공지 상세 팝업 (기존 그대로 유지)
         ========================= */}
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

              <div className="notice-modal-content">
                <div className="notice-content-box">{detail.content}</div>
              </div>

              <div className="notice-modal-actions">
                <button className="notice-ok-btn" type="button" onClick={closePopup}>
                  확인
                </button>
              </div>

              {loadingDetail && <div className="notice-loading-mask">로딩 중...</div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NoticeUserPage;

// import React, { useEffect, useMemo, useState } from "react";
// import axios from "axios";
// import "./Notice.css";

// function formatDateYmd(dateStr) {
//   if (!dateStr) return "";
//   const d = new Date(dateStr.replace(" ", "T"));
//   if (Number.isNaN(d.getTime())) return String(dateStr).slice(0, 10);
//   const y = d.getFullYear();
//   const m = String(d.getMonth() + 1).padStart(2, "0");
//   const day = String(d.getDate()).padStart(2, "0");
//   return `${y}.${m}.${day}`;
// }

// function formatDateYmdHm(dateStr) {
//   if (!dateStr) return "";
//   const d = new Date(dateStr.replace(" ", "T"));
//   if (Number.isNaN(d.getTime())) return String(dateStr);
//   const ymd = formatDateYmd(dateStr);
//   const hh = String(d.getHours()).padStart(2, "0");
//   const mm = String(d.getMinutes()).padStart(2, "0");
//   return `${ymd} ${hh}:${mm}`;
// }

// function NoticeUserPage() {
//   const [notices, setNotices] = useState([]);
//   const [keyword, setKeyword] = useState("");
//   const [detail, setDetail] = useState(null);
//   const [loadingList, setLoadingList] = useState(false);
//   const [loadingDetail, setLoadingDetail] = useState(false);

//   // ✅ 프론트 페이징
//   const [page, setPage] = useState(1);
//   const PAGE_SIZE = 10;

//   const params = useMemo(() => {
//     const p = {};
//     if (keyword?.trim()) p.keyword = keyword.trim();
//     return p;
//   }, [keyword]);

//   const fetchNotices = async () => {
//     setLoadingList(true);
//     try {
//       const res = await axios.get("/api/user/notice", { params });
//       setNotices(res.data || []);
//       setPage(1);
//     } catch {
//       alert("공지사항 목록 조회 실패");
//       setNotices([]);
//     } finally {
//       setLoadingList(false);
//     }
//   };

//   const openNotice = async (postId) => {
//     setLoadingDetail(true);
//     try {
//       const res = await axios.get(`/api/user/notice/${postId}`);
//       setDetail(res.data);
//     } catch {
//       alert("공지 상세 조회 실패");
//       setDetail(null);
//     } finally {
//       setLoadingDetail(false);
//     }
//   };

//   const closePopup = () => setDetail(null);

//   useEffect(() => {
//     fetchNotices();
//   }, []);

//   // ✅ 페이징 계산
//   const totalPages = Math.ceil(notices.length / PAGE_SIZE);
//   const pagedNotices = notices.slice(
//     (page - 1) * PAGE_SIZE,
//     page * PAGE_SIZE
//   );

//   return (
//     <div className="notice-wrap">
//       {/* 공지 목록 */}
//       <section className="notice-section">
//         <div className="notice-section-body">
//           <h2 className="notice-h2">체육센터 공지사항</h2>
//           <p className="notice-desc">
//             센터 운영 관련 필수 안내 및 이벤트 소식을 확인할 수 있습니다.
//           </p>

//           {/* ✅ 기존 공지사항 테이블 유지 */}
//           <div className="notice-table-wrap">
//             <table className="notice-table">
//               <thead>
//                 <tr>
//                   <th>번호</th>
//                   <th>지점</th>
//                   <th>제목</th>
//                   <th>게시기간</th>
//                   <th>조회</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {pagedNotices.map((n) => (
//                   <tr
//                     key={n.postId}
//                     className="notice-row"
//                     onClick={() => openNotice(n.postId)}
//                   >
//                     <td>{n.postId}</td>
//                     <td>{n.branchName}</td>
//                     <td className="notice-td-title">
//                       <span className="notice-title-text">{n.title}</span>
//                     </td>
//                     <td>
//                       {n.displayEnd
//                         ? formatDateYmd(n.displayEnd)
//                         : "상시"}
//                     </td>
//                     <td>{n.views ?? 0}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* 페이징 */}
//           <div className="community-pagination" style={{ marginTop: "20px" }}>
//             <button
//               disabled={page === 1}
//               onClick={() => setPage(page - 1)}
//             >
//               이전
//             </button>

//             {Array.from({ length: totalPages }, (_, i) => {
//               const pageNum = i + 1;
//               return (
//                 <button
//                   key={pageNum}
//                   className={page === pageNum ? "active" : ""}
//                   onClick={() => setPage(pageNum)}
//                 >
//                   {pageNum}
//                 </button>
//               );
//             })}

//             <button
//               disabled={page === totalPages || totalPages === 0}
//               onClick={() => setPage(page + 1)}
//             >
//               다음
//             </button>
//           </div>
//         </div>
//       </section>

//       {/* 공지 상세 팝업 */}
//       {detail && (
//         <div className="notice-modal-overlay" onClick={closePopup}>
//           <div
//             className="notice-modal-stage"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="notice-modal">
//               <button
//                 className="notice-modal-close"
//                 onClick={closePopup}
//                 type="button"
//               >
//                 ×
//               </button>

//               <div className="notice-modal-title">{detail.title}</div>

//               <div className="notice-modal-meta">
//                 <span>등록일 {formatDateYmdHm(detail.createdAt)}</span>
//                 <span>조회수 {detail.views ?? 0}</span>
//               </div>

//               <div className="notice-modal-content">
//                 <div className="notice-content-box">
//                   {detail.content}
//                 </div>
//               </div>

//               <div className="notice-modal-actions">
//                 <button
//                   className="notice-ok-btn"
//                   type="button"
//                   onClick={closePopup}
//                 >
//                   확인
//                 </button>
//               </div>

//               {loadingDetail && (
//                 <div className="notice-loading-mask">로딩 중...</div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default NoticeUserPage;
