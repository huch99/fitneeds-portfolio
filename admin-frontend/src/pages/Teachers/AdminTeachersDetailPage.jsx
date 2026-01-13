import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getTeacherDetail, retireTeacher } from "../../api/teachers";

export default function AdminTeachersDetailPage() {
    const { userId } = useParams();
    const nav = useNavigate();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState("");

    const [leaveDt, setLeaveDt] = useState("");
    const [leaveRsn, setLeaveRsn] = useState("");
    const [retiring, setRetiring] = useState(false);

    const updaterId = localStorage.getItem("userId") || "";

    async function load() {
        setLoading(true);
        setErr("");
        try {
            const d = await getTeacherDetail(userId);
            setData(d);
            if (!leaveDt) setLeaveDt("2026-01-31");
        } catch (e) {
            setData(null);
            setErr(e?.response?.data?.message || e?.message || "강사 상세 조회 실패");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId]);

    async function onRetire() {
        if (!leaveDt) return alert("퇴직일(leaveDt)을 입력하세요.");
        if (!updaterId) return alert("updaterId(userId)가 없습니다. 로그인 시 userId를 localStorage에 저장하세요.");
        if (data?.sttsCd === "RESIGNED") return;

        const ok = window.confirm("퇴직 처리(RESIGNED) 하시겠습니까?");
        if (!ok) return;

        setRetiring(true);
        setErr("");
        try {
            await retireTeacher(userId, { leaveDt, leaveRsn, updaterId });
            await load();
            alert("퇴직 처리 완료");
        } catch (e) {
            setErr(e?.response?.data?.message || e?.message || "퇴직 처리 실패");
        } finally {
            setRetiring(false);
        }
    }

    if (loading) return <div className="admin-page">로딩 중...</div>;
    if (err) return <div className="admin-page" style={{ color: "crimson" }}>{err}</div>;
    if (!data) return <div className="admin-page">데이터 없음</div>;

    return (
        <div className="admin-page">
            <div className="admin-page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2 style={{ margin: 0 }}>강사 상세</h2>
                <div style={{ display: "flex", gap: 8 }}>
                    <button className="btn" onClick={() => nav("/teachers")}>목록</button>
                    <button className="btn btn-primary" onClick={() => nav(`/teachers/${userId}/edit`)}>수정</button>
                </div>
            </div>

            <div className="admin-card" style={{ marginTop: 12, marginBottom: 12 }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10 }}>
                    <div><b>USER_ID</b> : {data.userId}</div>
                    <div><b>이름</b> : {data.userName}</div>
                    <div><b>이메일</b> : {data.email}</div>
                    <div><b>전화</b> : {data.phoneNumber}</div>
                    <div><b>지점</b> : {data.brchNm} (ID:{data.brchId})</div>
                    <div><b>상태</b> : {data.sttsCd}</div>
                    <div><b>입사일</b> : {data.hireDt}</div>
                    <div><b>퇴사일</b> : {data.leaveDt || "-"}</div>
                    <div><b>퇴사사유</b> : {data.leaveRsn || "-"}</div>
                </div>

                <div style={{ marginTop: 12 }}>
                    <b>소개</b>
                    <div style={{ marginTop: 6 }}>{data.intro || "-"}</div>
                </div>
            </div>

            <div className="admin-card" style={{ marginBottom: 12 }}>
                <h3>종목</h3>
                {(data.sports || []).length === 0 ? (
                    <div>-</div>
                ) : (
                    <ul>
                        {data.sports.map((s) => (
                            <li key={`${s.sportId}-${s.sortNo}`}>
                                {s.sportNm} (ID:{s.sportId}) / mainYn:{s.mainYn} / sortNo:{s.sortNo}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="admin-card" style={{ marginBottom: 12 }}>
                <h3>자격증</h3>
                {(data.certificates || []).length === 0 ? (
                    <div>-</div>
                ) : (
                    <table className="admin-table" style={{ width: "100%" }}>
                        <thead>
                        <tr>
                            <th>ID</th><th>이름</th><th>발급처</th><th>취득일</th><th>자격증번호</th>
                        </tr>
                        </thead>
                        <tbody>
                        {data.certificates.map((c) => (
                            <tr key={c.certId}>
                                <td>{c.certId}</td>
                                <td>{c.certNm}</td>
                                <td>{c.issuer}</td>
                                <td>{c.acqDt}</td>
                                <td>{c.certNo}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>

            <div className="admin-card" style={{ marginBottom: 12 }}>
                <h3>경력</h3>
                {(data.careers || []).length === 0 ? (
                    <div>-</div>
                ) : (
                    <table className="admin-table" style={{ width: "100%" }}>
                        <thead>
                        <tr>
                            <th>ID</th><th>기관</th><th>직무</th><th>시작</th><th>종료</th>
                        </tr>
                        </thead>
                        <tbody>
                        {data.careers.map((c) => (
                            <tr key={c.careerId}>
                                <td>{c.careerId}</td>
                                <td>{c.orgNm}</td>
                                <td>{c.roleNm}</td>
                                <td>{c.strtDt}</td>
                                <td>{c.endDt || "-"}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>

            <div className="admin-card">
                <h3>퇴직 처리 (RESIGNED)</h3>

                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "end" }}>
                    <div>
                        <div className="label">퇴직일(leaveDt)</div>
                        <input type="date" value={leaveDt} onChange={(e) => setLeaveDt(e.target.value)} />
                    </div>

                    <div style={{ flex: 1, minWidth: 220 }}>
                        <div className="label">퇴직사유(leaveRsn)</div>
                        <input value={leaveRsn} onChange={(e) => setLeaveRsn(e.target.value)} placeholder="예: 개인 사정" />
                    </div>

                    <button
                        className="btn btn-danger"
                        onClick={onRetire}
                        disabled={retiring || data.sttsCd === "RESIGNED"}
                    >
                        {data.sttsCd === "RESIGNED" ? "이미 퇴직" : (retiring ? "처리 중..." : "퇴직 처리")}
                    </button>
                </div>

                {!updaterId && (
                    <div style={{ marginTop: 8, color: "crimson" }}>
                        updaterId(userId)가 localStorage에 없습니다. 로그인 시 userId 저장이 필요합니다.
                    </div>
                )}
            </div>
        </div>
    );
}
