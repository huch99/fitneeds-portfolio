import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./css/AdminTeachers.css";
import { getTeacherDetail, retireTeacher , updateTeacherStatus } from "../../api/teachers";
import { ACCESS_TOKEN_KEY } from "../../store/authSlice";

/**
 * 백엔드 UpdateReq에는 sttsCd가 없어서 “상태 변경”은 현재 불가.
 * (퇴사는 RetireReq로 가능)
 */

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
        const payload = JSON.parse(base64UrlDecode(parts[1]));
        return payload?.sub || payload?.userId || payload?.username || "";
    } catch {
        return "";
    }
}

export default function AdminTeachersDetailPage() {
    const navigate = useNavigate();
    const { userId } = useParams();

    const [teacher, setTeacher] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errMsg, setErrMsg] = useState("");

    // 퇴사 처리 입력
    const [leaveDt, setLeaveDt] = useState(() => new Date().toISOString().slice(0, 10));
    const [leaveRsn, setLeaveRsn] = useState("");

    const [nextStatus, setNextStatus] = useState("ACTIVE");

    const loadDetail = async () => {
        setLoading(true);
        setErrMsg("");
        try {
            const data = await getTeacherDetail(userId);
            setTeacher(data || null);
            setNextStatus(data?.sttsCd || "ACTIVE");

            // 이미 퇴사 정보가 있으면 초기값 세팅
            const serverLeaveDt = data?.leaveDt;
            const serverLeaveRsn = data?.leaveRsn;
            if (serverLeaveDt) setLeaveDt(serverLeaveDt);
            if (serverLeaveRsn) setLeaveRsn(serverLeaveRsn);
        } catch (e) {
            setErrMsg(e?.response?.data?.message || e?.message || "상세 조회 중 오류가 발생했습니다.");
            setTeacher(null);
        } finally {
            setLoading(false);
        }
    };
    const onChangeStatus = async () => {
        if (!userId) return;

        const ok = window.confirm(`상태를 '${nextStatus}'로 변경할까요?`);
        if (!ok) return;

        try {
            await updateTeacherStatus(userId, { sttsCd: nextStatus });
            await loadDetail();
            alert("상태가 변경되었습니다.");
        } catch (e) {
            alert(e?.response?.data?.message || e?.message || "상태 변경 중 오류가 발생했습니다.");
        }
    };

    useEffect(() => {
        loadDetail();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId]);

    const vm = useMemo(() => {
        const t = teacher || {};
        const sportsText = safeArr(t?.sports)
            .slice()
            .sort((a, b) => (a?.sortNo ?? 999) - (b?.sortNo ?? 999))
            .map((s) => s?.sportNm)
            .filter(Boolean)
            .join(", ");

        return {
            userId: t?.userId,
            userName: t?.userName,
            brchNm: t?.brchNm,
            sportsText,
            phoneNumber: t?.phoneNumber,
            email: t?.email,
            hireDt: t?.hireDt,
            sttsCd: t?.sttsCd,
            intro: t?.intro,
            leaveDt: t?.leaveDt,
            leaveRsn: t?.leaveRsn,
        };
    }, [teacher]);

    const isResigned = vm.sttsCd === "RESIGNED";

    const onRetire = async () => {
        if (!userId) return;

        if (isResigned) {
            alert("이미 퇴사 처리된 강사입니다.");
            return;
        }

        const ok = window.confirm("퇴사 처리 하시겠습니까?");
        if (!ok) return;

        if (!leaveDt) {
            alert("퇴사일은 필수입니다.");
            return;
        }
        if (!leaveRsn.trim()) {
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
            await retireTeacher(userId, { leaveDt, leaveRsn: leaveRsn.trim(), updaterId });
            await loadDetail();
            alert("퇴사 처리되었습니다.");
        } catch (e) {
            alert(e?.response?.data?.message || e?.message || "퇴사 처리 중 오류가 발생했습니다.");
        }
    };

    return (
        <div className="teachers-page">
            <div className="teachers-header">
                <div>
                    <div className="teachers-breadcrumb">SYS - 강사 상세</div>
                    <h2 className="teachers-title">강사 상세</h2>
                </div>

                <div className="teachers-header-actions">
                    <button className="btn-sm" onClick={() => navigate(`/teachers/${userId}/edit`)} disabled={!userId}>
                        수정
                    </button>
                    <button className="btn-sm" onClick={() => navigate("/teachers")}>
                        목록으로
                    </button>
                </div>
            </div>

            <div className="teachers-content">
                {errMsg && <div className="teachers-error">{errMsg}</div>}

                {loading ? (
                    <div className="teachers-loading">로딩 중...</div>
                ) : !teacher ? (
                    <div className="teachers-empty">데이터가 없습니다.</div>
                ) : (
                    <>
                        <div className="detail-grid">
                            <div className="panel">
                                <div className="panel-title">기본 정보</div>
                                <div className="kv">
                                    <div className="kv-row">
                                        <div className="kv-k">강사명</div>
                                        <div className="kv-v">{vm.userName || "-"}</div>
                                    </div>
                                    <div className="kv-row">
                                        <div className="kv-k">소속 지점</div>
                                        <div className="kv-v">{vm.brchNm || "-"}</div>
                                    </div>
                                    <div className="kv-row">
                                        <div className="kv-k">주요 종목</div>
                                        <div className="kv-v">{vm.sportsText || "-"}</div>
                                    </div>
                                    <div className="kv-row">
                                        <div className="kv-k">연락처</div>
                                        <div className="kv-v">{vm.phoneNumber || "-"}</div>
                                    </div>
                                    <div className="kv-row">
                                        <div className="kv-k">이메일</div>
                                        <div className="kv-v">{vm.email || "-"}</div>
                                    </div>
                                    <div className="kv-row">
                                        <div className="kv-k">입사일</div>
                                        <div className="kv-v">{vm.hireDt || "-"}</div>
                                    </div>
                                    <div className="kv-row">
                                        <div className="kv-k">상태</div>
                                        <div className="kv-v">{statusLabel(vm.sttsCd)}</div>
                                    </div>
                                    <div className="kv-row">
                                        <div className="kv-k">한줄 소개</div>
                                        <div className="kv-v">{vm.intro || "-"}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="panel">
                                <div className="panel-title">상태 · 퇴사 관리</div>

                                <div className="sub-panel">
                                    <div className="sub-title">상태 변경</div>
                                    <div className="inline-controls">
                                        <select value={nextStatus} onChange={(e
                                        ) => setNextStatus(e.target.value)}>
                                        <option value="ACTIVE">재직</option>
                                            <option value="LEAVE">휴직</option>
                                            <option value="RESIGNED" disabled>퇴사(퇴사처리로만)</option>
                                        </select>

                                        <button className="btn-primary" onClick={onChangeStatus}>
                                            상태변경
                                        </button>
                                    </div>
                                    <div className="hint">퇴사는 아래 "퇴사 처리"를 사용하세요.</div>
                                </div>

                                <div className="sub-panel">
                                    <div className="sub-title">퇴사 처리</div>
                                    <div className="inline-controls">
                                        <input
                                            type="date"
                                            value={leaveDt}
                                            onChange={(e) => setLeaveDt(e.target.value)}
                                            disabled={isResigned}
                                        />
                                        <input
                                            value={leaveRsn}
                                            onChange={(e) => setLeaveRsn(e.target.value)}
                                            placeholder="퇴사 사유 (필수)"
                                            disabled={isResigned}
                                        />
                                        <button className="danger-btn" onClick={onRetire} disabled={isResigned}>
                                            퇴사처리
                                        </button>
                                    </div>
                                    <div className="hint">
                                        퇴사 처리 시 상태는 RESIGNED로 변경됩니다.
                                        {isResigned && (
                                            <>
                                                {" "}
                                                (퇴사일: {vm.leaveDt || "-"}, 사유: {vm.leaveRsn || "-"})
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="panel panel-wide">
                            <div className="panel-title">경력 · 자격증</div>

                            <div className="two-col">
                                <div className="sub-panel">
                                    <div className="sub-title">경력</div>
                                    <div className="simple-list">
                                        {safeArr(teacher?.careers).length === 0 ? (
                                            <div className="hint">등록된 경력이 없습니다.</div>
                                        ) : (
                                            safeArr(teacher?.careers).map((c) => (
                                                <div key={c?.careerId ?? `${c?.orgNm}-${c?.strtDt}`} className="simple-row">
                                                    <div>
                                                        {(c?.strtDt || "-")} ~ {(c?.endDt || "-")}
                                                    </div>
                                                    <div>
                                                        {c?.orgNm || "-"} / {c?.roleNm || "-"}
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>

                                <div className="sub-panel">
                                    <div className="sub-title">자격증</div>
                                    <div className="simple-list">
                                        {safeArr(teacher?.certificates).length === 0 ? (
                                            <div className="hint">등록된 자격증이 없습니다.</div>
                                        ) : (
                                            safeArr(teacher?.certificates).map((c) => (
                                                <div key={c?.certId ?? `${c?.certNm}-${c?.acqDt}`} className="simple-row">
                                                    <div>{c?.certNm || "-"}</div>
                                                    <div>
                                                        {c?.issuer || "-"} / {c?.acqDt || "-"}
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="hint">배정된 수업 목록은 “내 수업 관리” API 연동 시 추가합니다.</div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
