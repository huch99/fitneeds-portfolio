import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTeacherList } from "../../api/teachers";

export default function AdminTeachersListPage() {
    const nav = useNavigate();

    const [status, setStatus] = useState("ACTIVE"); // ACTIVE | LEAVE | RESIGNED
    const [branchId, setBranchId] = useState("");
    const [sportId, setSportId] = useState("");

    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState("");

    const queryParams = useMemo(() => {
        return {
            status,
            branchId: branchId ? Number(branchId) : undefined,
            sportId: sportId ? Number(sportId) : undefined,
        };
    }, [status, branchId, sportId]);

    async function load() {
        setLoading(true);
        setErr("");
        try {
            const data = await getTeacherList(queryParams);
            setRows(Array.isArray(data) ? data : []);
        } catch (e) {
            setRows([]);
            setErr(e?.response?.data?.message || e?.message || "강사 목록 조회 실패");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="admin-page">
            <div className="admin-page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2 style={{ margin: 0 }}>강사 관리</h2>
                <div style={{ display: "flex", gap: 8 }}>
                    <button className="btn btn-primary" onClick={() => nav("/teachers/new")}>
                        강사 등록
                    </button>
                    <button className="btn" onClick={load} disabled={loading}>
                        새로고침
                    </button>
                </div>
            </div>

            <div className="admin-card" style={{ marginTop: 12, marginBottom: 12 }}>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "end" }}>
                    <div>
                        <div className="label">상태</div>
                        <select value={status} onChange={(e) => setStatus(e.target.value)}>
                            <option value="ACTIVE">ACTIVE</option>
                            <option value="LEAVE">LEAVE</option>
                            <option value="RESIGNED">RESIGNED</option>
                        </select>
                    </div>

                    <div>
                        <div className="label">지점 ID(선택)</div>
                        <input inputMode="numeric" value={branchId} onChange={(e) => setBranchId(e.target.value)} placeholder="예: 3" />
                    </div>

                    <div>
                        <div className="label">종목 ID(선택)</div>
                        <input inputMode="numeric" value={sportId} onChange={(e) => setSportId(e.target.value)} placeholder="예: 2" />
                    </div>

                    <button className="btn btn-primary" onClick={load} disabled={loading}>
                        조회
                    </button>
                </div>

                {err && <div style={{ marginTop: 10, color: "crimson" }}>{err}</div>}
            </div>

            <div className="admin-card">
                {loading ? (
                    <div>로딩 중...</div>
                ) : (
                    <table className="admin-table" style={{ width: "100%" }}>
                        <thead>
                        <tr>
                            <th>이름</th>
                            <th>이메일</th>
                            <th>전화</th>
                            <th>지점</th>
                            <th>상태</th>
                            <th>입사일</th>
                            <th>주종목</th>
                            <th style={{ width: 180 }}>액션</th>
                        </tr>
                        </thead>
                        <tbody>
                        {rows.length === 0 ? (
                            <tr>
                                <td colSpan={8} style={{ textAlign: "center", padding: 14 }}>
                                    데이터 없음
                                </td>
                            </tr>
                        ) : (
                            rows.map((r) => {
                                const sports = Array.isArray(r.sports) ? r.sports : [];
                                const mainSport = sports.find((s) => s?.mainYn === 1) || sports[0];

                                return (
                                    <tr key={r.userId}>
                                        <td>{r.userName}</td>
                                        <td>{r.email}</td>
                                        <td>{r.phoneNumber}</td>
                                        <td>
                                            {r.brchNm} (ID:{r.brchId})
                                        </td>
                                        <td>{r.sttsCd}</td>
                                        <td>{r.hireDt}</td>
                                        <td>{mainSport ? mainSport.sportNm : "-"}</td>
                                        <td>
                                            <div style={{ display: "flex", gap: 8 }}>
                                                <button className="btn" onClick={() => nav(`/teachers/${r.userId}`)}>
                                                    상세
                                                </button>
                                                <button className="btn" onClick={() => nav(`/teachers/${r.userId}/edit`)}>
                                                    수정
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
