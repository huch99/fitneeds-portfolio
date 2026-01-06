import { useEffect, useState } from "react";
import "./AdminSportType.css";

const API_BASE = "/api/sport-types";

export default function SportTypeList() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // ✅ 모달 표시 여부
    const [isModalOpen, setIsModalOpen] = useState(false);

    // ✅ 등록 폼 상태
    const [form, setForm] = useState({ name: "", memo: "" });
    const [saving, setSaving] = useState(false);

    // 1) 목록 조회
    const fetchList = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await fetch(API_BASE, { method: "GET" });
            if (!res.ok) throw new Error(`목록 조회 실패 (${res.status})`);
            const data = await res.json();
            setItems(Array.isArray(data) ? data : (data?.content ?? []));
        } catch (e) {
            setError(e?.message ?? "알 수 없는 오류");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchList();
    }, []);

    // ✅ 모달 열기(등록)
    const openCreateModal = () => {
        setForm({ name: "", memo: "" }); // 초기화
        setIsModalOpen(true);
    };

    // ✅ 모달 닫기
    const closeModal = () => {
        if (saving) return;
        setIsModalOpen(false);
    };

    const onOverlayClick = (e) => {
        if(e.target === e.currentTarget)
            closeModal();
    }

    // 2) 저장(등록)
    const saveSportType = async () => {
        const name = form.name.trim();
        const memo = form.memo.trim();

        if (!name) {
            alert("종목명은 필수입니다.");
            return;
        }

        setSaving(true);
        try {
            const res = await fetch(`${API_BASE}/new`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    memo: memo === "" ? null : memo,
                }),
            });

            if (!res.ok) {
                const text = await res.text().catch(() => "");
                throw new Error(`저장 실패 (${res.status}) ${text}`);
            }

            closeModal();
            await fetchList(); // ✅ 저장 후 목록 갱신
        } catch (e) {
            alert(e?.message ?? "저장 중 오류");
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            <h1 className="page-title">[관리자] 운동 종목 관리</h1>
            <p className="page-desc">운동 종목 조회, 운동 종목 관리 (등록 / 수정 / 비활성)</p>

            <div className="content-box">
                <div className="toolbar">
                    <div className="toolbar-left">
                        <input className="input" placeholder="종목명 검색" />
                        <button className="btn btn-primary">검색</button>
                    </div>

                    {/* ✅ 등록 버튼 → 모달 오픈 */}
                    <button className="btn btn-register" onClick={openCreateModal}>
                        + 새 운동 종목 등록
                    </button>
                </div>

                {loading && <div style={{ padding: 10 }}>불러오는 중...</div>}
                {error && <div style={{ padding: 10, color: "crimson" }}>{error}</div>}

                <table className="table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>종목명</th>
                        <th>메모</th>
                        <th>등록일</th>
                        <th>수정일</th>
                        <th>기능</th>
                    </tr>
                    </thead>
                    <tbody>
                    {(!loading && items.length === 0) ? (
                        <tr>
                            <td colSpan={6} style={{ textAlign: "center", padding: 16 }}>
                                등록된 운동 종목이 없습니다.
                            </td>
                        </tr>
                    ) : (
                        items.map((it) => (
                            <tr key={it.sportId}>
                                <td>{it.sportId}</td>
                                <td>{it.sportNm}</td>
                                <td>{it.sportMemo ?? "-"}</td>
                                <td>{it.regDt ?? "-"}</td>
                                <td>{it.updDt ?? "-"}</td>
                                <td>
                                    <button className="btn-sm">수정</button>{" "}
                                    <button className="btn-sm btn-del">비활성화</button>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>

            {/* ✅ 모달: isModalOpen일 때만 보이게 */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={onOverlayClick}>
                    <div className="content-box modal-area" onClick={(e) => e.stopPropagation()}>
                        <h2><span className="modal-title">운동 종목 등록</span></h2>

                        <div className="form-grid">
                            <label>
                                종목명<span className="required">*</span>
                            </label>
                            <input
                                className="input"
                                style={{ width: "80%" }}
                                placeholder="예: 요가"
                                value={form.name}
                                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                                disabled={saving}
                            />
                        </div>

                        <div className="form-grid">
                            <label>메모</label>
                            <input
                                className="input"
                                style={{ width: "80%" }}
                                placeholder="설명(선택)"
                                value={form.memo}
                                onChange={(e) => setForm((p) => ({ ...p, memo: e.target.value }))}
                                disabled={saving}
                            />
                        </div>

                        <div style={{ textAlign: "center", marginTop: 20, borderTop: "1px solid #ddd", paddingTop: 20 }}>
                            <button
                                className="btn btn-primary"
                                style={{ padding: "10px 40px", fontSize: 14 }}
                                onClick={saveSportType}
                                disabled={saving}
                            >
                                {saving ? "저장 중..." : "저장"}
                            </button>{" "}
                            <button
                                className="btn-sm"
                                style={{ padding: "10px 40px",  fontSize: 14, background: "#999", color: "#fff", border: "none" }}
                                onClick={closeModal}
                                disabled={saving}
                            >
                                취소
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
