import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/AdminTeachers.css";
import { getTeacherList, retireTeacher } from "../../api/teachers";
import { ACCESS_TOKEN_KEY } from "../../store/authSlice";
import { branchApi, sportTypeApi } from "../../api"; // 필요 시 "../../api/index"로 변경

/**
 * 백엔드: GET /api/teachers?branchId&sportId&status
 * - status: ACTIVE | LEAVE | RESIGNED (null이면 ACTIVE로 정규화됨)
 * - "전체(ALL)"는 백엔드에서 단일 호출로 지원하지 않아서, 프론트에서 3번 호출해서 합친다.
 *
 * ✅ 현재 구조에서는 서버사이드 페이징을 붙이기 어렵기 때문에
 *    1차는 "클라이언트 페이징"으로 구현한다.
 */

const STATUS_OPTIONS = [
    { value: "ALL", label: "전체" },
    { value: "ACTIVE", label: "재직" },
    { value: "LEAVE", label: "휴직" },
    { value: "RESIGNED", label: "퇴사" },
];

const PAGE_SIZE = 25; // 원하는 페이지 당 건수로 조절

function statusLabel(sttsCd) {
    switch (sttsCd) {
        case "ACTIVE":
            return "재직";
        case "LEAVE":
            return "휴직";
        case "RESIGNED":
            return "퇴사";
        default:
            return sttsCd || "-";
    }
}

function safeArr(v) {
    return Array.isArray(v) ? v : [];
}

function normalizeRow(t) {
    const sports = safeArr(t?.sports)
        .slice()
        .sort((a, b) => (a?.sortNo ?? 999) - (b?.sortNo ?? 999))
        .map((s) => s?.sportNm)
        .filter(Boolean)
        .join(", ");

    return {
        userId: t?.userId,
        userName: t?.userName,
        brchNm: t?.brchNm,
        sportsText: sports,
        sttsCd: t?.sttsCd,
        phoneNumber: t?.phoneNumber,
        raw: t,
    };
}

function base64UrlDecode(str) {
    try {
        const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
        const pad = "=".repeat((4 - (base64.length % 4)) % 4);
        return atob(base64 + pad);
    } catch {
        return "";
    }
}

function getCurrentUserIdFromToken() {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (!token) return "";
    const parts = token.split(".");
    if (parts.length !== 3) return "";
    try {
        const payloadJson = base64UrlDecode(parts[1]);
        const payload = JSON.parse(payloadJson);
        return payload?.sub || payload?.userId || payload?.username || "";
    } catch {
        return "";
    }
}

/** 페이지 번호 묶음 생성 (현재페이지 기준 앞뒤로 n개) */
function buildPageNumbers(current, total, windowSize = 2) {
    if (total <= 1) return [1];
    const start = Math.max(1, current - windowSize);
    const end = Math.min(total, current + windowSize);
    const pages = [];
    for (let p = start; p <= end; p++) pages.push(p);
    return pages;
}

export default function AdminTeachersListPage() {
    const navigate = useNavigate();

    const [status, setStatus] = useState("ALL");
    const [branchId, setBranchId] = useState("");
    const [sportId, setSportId] = useState("");
    const [keyword, setKeyword] = useState("");

    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errMsg, setErrMsg] = useState("");

    // ✅ 페이징 상태
    const [page, setPage] = useState(1);

    // 지점/종목 옵션: 공용 API로 로딩
    const [branchOptions, setBranchOptions] = useState([{ value: "", label: "전체 지점" }]);
    const [sportOptions, setSportOptions] = useState([{ value: "", label: "전체 종목" }]);

    useEffect(() => {
        const loadFilters = async () => {
            // Branch
            try {
                const branches = await branchApi.getAll(); // 기대: [{ brchId, brchNm, ... }]
                const opts = [
                    { value: "", label: "전체 지점" },
                    ...safeArr(branches)
                        .map((b) => ({
                            value: String(b.brchId ?? b.brch_id ?? ""),
                            label: b.brchNm ?? b.brch_nm ?? "-",
                        }))
                        .filter((x) => x.value),
                ];
                setBranchOptions(opts);
            } catch {
                setBranchOptions([{ value: "", label: "전체 지점" }]);
            }

            // SportType
            try {
                const sports = await sportTypeApi.getAll(); // 기대: [{ sportId, sportNm, ... }]
                const opts = [
                    { value: "", label: "전체 종목" },
                    ...safeArr(sports)
                        .map((s) => ({
                            value: String(s.sportId ?? s.sport_id ?? ""),
                            label: s.sportNm ?? s.sport_nm ?? "-",
                        }))
                        .filter((x) => x.value),
                ];
                setSportOptions(opts);
            } catch {
                setSportOptions([{ value: "", label: "전체 종목" }]);
            }
        };

        loadFilters();
    }, []);

    const fetchByStatus = async (stts) => {
        const params = {
            status: stts,
            branchId: branchId ? Number(branchId) : undefined,
            sportId: sportId ? Number(sportId) : undefined,
        };
        const data = await getTeacherList(params);
        return safeArr(data).map(normalizeRow);
    };

    const fetchList = async () => {
        setLoading(true);
        setErrMsg("");
        try {
            if (status === "ALL") {
                const [a, l, r] = await Promise.all([
                    fetchByStatus("ACTIVE"),
                    fetchByStatus("LEAVE"),
                    fetchByStatus("RESIGNED"),
                ]);
                const map = new Map();
                [...a, ...l, ...r].forEach((x) => {
                    if (x?.userId && !map.has(x.userId)) map.set(x.userId, x);
                });
                setRows(Array.from(map.values()));
            } else {
                const one = await fetchByStatus(status);
                setRows(one);
            }
            // ✅ 검색(fetchList) 새로 하면 1페이지로
            setPage(1);
        } catch (e) {
            setErrMsg(e?.response?.data?.message || e?.message || "목록 조회 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const filteredRows = useMemo(() => {
        const kw = keyword.trim().toLowerCase();
        if (!kw) return rows;
        return rows.filter((r) => {
            const name = (r.userName || "").toLowerCase();
            const phone = (r.phoneNumber || "").toLowerCase();
            return name.includes(kw) || phone.includes(kw);
        });
    }, [rows, keyword]);

    // ✅ 페이징 계산 (클라이언트)
    const totalCount = filteredRows.length;
    const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

    useEffect(() => {
        // 필터링 결과가 줄어들면 page가 범위를 벗어날 수 있으니 보정
        if (page > totalPages) setPage(totalPages);
        if (page < 1) setPage(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [totalPages]);

    const pagedRows = useMemo(() => {
        const start = (page - 1) * PAGE_SIZE;
        return filteredRows.slice(start, start + PAGE_SIZE);
    }, [filteredRows, page]);

    const pageNumbers = useMemo(() => buildPageNumbers(page, totalPages, 2), [page, totalPages]);

    const onClickRetire = async (userId) => {
        if (!userId) return;

        const ok = window.confirm("퇴사(삭제) 처리 하시겠습니까?");
        if (!ok) return;

        const leaveDt = window.prompt("퇴사일을 입력하세요 (YYYY-MM-DD)", new Date().toISOString().slice(0, 10));
        if (!leaveDt) return;

        const leaveRsn = window.prompt("퇴사 사유를 입력하세요 (필수)", "");
        if (!leaveRsn || !leaveRsn.trim()) {
            alert("퇴사 사유는 필수입니다.");
            return;
        }

        let updaterId = getCurrentUserIdFromToken();
        if (!updaterId) {
            updaterId = window.prompt("업데이터 ID(updaterId)를 입력하세요 (필수)", "");
            if (!updaterId || !updaterId.trim()) {
                alert("updaterId는 필수입니다.");
                return;
            }
        }

        try {
            await retireTeacher(userId, { leaveDt, leaveRsn, updaterId });
            await fetchList();
            alert("퇴사 처리되었습니다.");
        } catch (e) {
            alert(e?.response?.data?.message || e?.message || "퇴사 처리 중 오류가 발생했습니다.");
        }
    };

    return (
        <div className="teachers-page">
            <div className="teachers-header">
                <div>
                    <div className="teachers-breadcrumb">SYS - 강사 목록</div>
                    <h2 className="teachers-title">강사 목록</h2>
                </div>

                <button className="btn-primary" onClick={() => navigate("/teachers/new")}>
                    강사 등록
                </button>
            </div>

            <div className="teachers-content">
                <div className="teachers-filter">
                    <div className="filter-row">
                        <div className="filter-item">
                            <label>지점</label>
                            <select
                                value={branchId}
                                onChange={(e) => {
                                    setBranchId(e.target.value);
                                    setPage(1);
                                }}
                            >
                                {branchOptions.map((o) => (
                                    <option key={o.value} value={o.value}>
                                        {o.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="filter-item">
                            <label>종목</label>
                            <select
                                value={sportId}
                                onChange={(e) => {
                                    setSportId(e.target.value);
                                    setPage(1);
                                }}
                            >
                                {sportOptions.map((o) => (
                                    <option key={o.value} value={o.value}>
                                        {o.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="filter-item">
                            <label>상태</label>
                            <select
                                value={status}
                                onChange={(e) => {
                                    setStatus(e.target.value);
                                    setPage(1);
                                }}
                            >
                                {STATUS_OPTIONS.map((o) => (
                                    <option key={o.value} value={o.value}>
                                        {o.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="filter-item filter-search">
                            <label>강사명/연락처 검색</label>
                            <input
                                value={keyword}
                                onChange={(e) => {
                                    setKeyword(e.target.value);
                                    setPage(1);
                                }}
                                placeholder="강사명 또는 연락처"
                            />
                        </div>

                        <div className="filter-item filter-btn">
                            <button className="btn-primary" onClick={fetchList} disabled={loading}>
                                검색
                            </button>
                        </div>
                    </div>

                    {errMsg && <div className="teachers-error">{errMsg}</div>}
                </div>

                <div className="teachers-table-head">
                    <div className="teachers-total">
                        총 {totalCount}명 (페이지 {page} / {totalPages})
                    </div>
                </div>

                <div className="teachers-table-wrap">
                    <table>
                        <thead>
                        <tr>
                            <th>강사명</th>
                            <th>소속 지점</th>
                            <th>주요 종목</th>
                            <th>상태</th>
                            <th>연락처</th>
                            <th>액션</th>
                        </tr>
                        </thead>
                        <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={6} style={{ padding: 20 }}>
                                    로딩 중...
                                </td>
                            </tr>
                        ) : pagedRows.length === 0 ? (
                            <tr>
                                <td colSpan={6} style={{ padding: 20 }}>
                                    조회 결과가 없습니다.
                                </td>
                            </tr>
                        ) : (
                            pagedRows.map((r) => (
                                <tr key={r.userId}>
                                    <td>{r.userName || "-"}</td>
                                    <td>{r.brchNm || "-"}</td>
                                    <td>{r.sportsText || "-"}</td>
                                    <td>{statusLabel(r.sttsCd)}</td>
                                    <td>{r.phoneNumber || "-"}</td>
                                    <td className="teachers-actions">
                                        <button className="link-btn" onClick={() => navigate(`/teachers/${r.userId}`)}>
                                            상세보기
                                        </button>
                                        <button className="link-btn" onClick={() => navigate(`/teachers/${r.userId}/edit`)}>
                                            수정
                                        </button>
                                        <button className="danger-btn" onClick={() => onClickRetire(r.userId)}>
                                            삭제
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>

                    {/* ✅ 페이징 UI */}
                    <div className="teachers-pagination">
                        <button
                            className="page-btn"
                            onClick={() => setPage(1)}
                            disabled={page === 1 || loading}
                            title="처음"
                        >
                            {"<<"}
                        </button>
                        <button
                            className="page-btn"
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1 || loading}
                            title="이전"
                        >
                            {"<"}
                        </button>

                        {/* 앞쪽 생략 표시 */}
                        {pageNumbers[0] > 1 && (
                            <>
                                <button className="page-btn" onClick={() => setPage(1)} disabled={loading}>
                                    1
                                </button>
                                {pageNumbers[0] > 2 && <span className="page-ellipsis">...</span>}
                            </>
                        )}

                        {pageNumbers.map((p) => (
                            <button
                                key={p}
                                className={`page-btn ${p === page ? "active" : ""}`}
                                onClick={() => setPage(p)}
                                disabled={loading}
                            >
                                {p}
                            </button>
                        ))}

                        {/* 뒤쪽 생략 표시 */}
                        {pageNumbers[pageNumbers.length - 1] < totalPages && (
                            <>
                                {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && <span className="page-ellipsis">...</span>}
                                <button className="page-btn" onClick={() => setPage(totalPages)} disabled={loading}>
                                    {totalPages}
                                </button>
                            </>
                        )}

                        <button
                            className="page-btn"
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages || loading}
                            title="다음"
                        >
                            {">"}
                        </button>
                        <button
                            className="page-btn"
                            onClick={() => setPage(totalPages)}
                            disabled={page === totalPages || loading}
                            title="마지막"
                        >
                            {">>"}
                        </button>
                    </div>

                    <div className="teachers-paging-hint">페이징은 추후 서버 연동 가능</div>
                </div>
            </div>
        </div>
    );
}
