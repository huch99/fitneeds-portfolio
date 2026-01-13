import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getTeacherDetail, updateTeacher } from "../../api/teachers";

export default function AdminTeachersEditPage() {
    const { userId } = useParams();
    const nav = useNavigate();
    const updUserId = localStorage.getItem("userId") || "";

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [err, setErr] = useState("");

    const [form, setForm] = useState({
        userName: "",
        email: "",
        phoneNumber: "",
        brchId: "",
        intro: "",
        profileImgUrl: "",
    });

    const [sports, setSports] = useState([]);
    const [certificates, setCertificates] = useState([]);
    const [careers, setCareers] = useState([]);

    function setField(k, v) {
        setForm((p) => ({ ...p, [k]: v }));
    }

    async function load() {
        setLoading(true);
        setErr("");
        try {
            const d = await getTeacherDetail(userId);

            setForm({
                userName: d.userName || "",
                email: d.email || "",
                phoneNumber: d.phoneNumber || "",
                brchId: d.brchId ? String(d.brchId) : "",
                intro: d.intro || "",
                profileImgUrl: d.profileImgUrl || "",
            });

            setSports(
                (d.sports || []).map((s) => ({
                    sportId: String(s.sportId),
                    mainYn: s.mainYn === 1,
                    sortNo: s.sortNo ?? 1,
                }))
            );

            setCertificates(
                (d.certificates || []).map((c) => ({
                    certNm: c.certNm || "",
                    issuer: c.issuer || "",
                    acqDt: c.acqDt || "",
                    certNo: c.certNo || "",
                }))
            );

            setCareers(
                (d.careers || []).map((c) => ({
                    orgNm: c.orgNm || "",
                    roleNm: c.roleNm || "",
                    strtDt: c.strtDt || "",
                    endDt: c.endDt || "",
                }))
            );
        } catch (e) {
            setErr(e?.response?.data?.message || e?.message || "강사 상세 조회 실패");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId]);

    async function onSave(e) {
        e.preventDefault();
        setErr("");

        if (!updUserId) return setErr("updUserId(userId)가 없습니다. 로그인 시 userId를 localStorage에 저장하세요.");
        if (!form.userName || !form.phoneNumber) return setErr("필수값(userName/phoneNumber)을 입력하세요.");

        const payload = {
            userName: form.userName,
            email: form.email,
            phoneNumber: form.phoneNumber,
            brchId: form.brchId ? Number(form.brchId) : null,
            intro: form.intro,
            profileImgUrl: form.profileImgUrl,
            updUserId,

            // 백엔드 로직: null=유지, []=전체삭제
            // 수정 화면에서는 “편집한 상태 그대로 반영”이 자연스러우니 항상 배열로 보냄
            sports: sports
                .filter((s) => s.sportId)
                .map((s, idx) => ({
                    sportId: Number(s.sportId),
                    mainYn: Boolean(s.mainYn),
                    sortNo: s.sortNo ?? idx + 1,
                })),

            certificates: certificates
                .filter((c) => c.certNm || c.issuer || c.acqDt || c.certNo)
                .map((c) => ({
                    certNm: c.certNm,
                    issuer: c.issuer,
                    acqDt: c.acqDt,
                    certNo: c.certNo,
                })),

            careers: careers
                .filter((c) => c.orgNm || c.roleNm || c.strtDt || c.endDt)
                .map((c) => ({
                    orgNm: c.orgNm,
                    roleNm: c.roleNm,
                    strtDt: c.strtDt,
                    endDt: c.endDt ? c.endDt : null,
                })),
        };

        setSaving(true);
        try {
            const updated = await updateTeacher(userId, payload);
            nav(`/teachers/${updated.userId}`);
        } catch (e2) {
            setErr(e2?.response?.data?.message || e2?.message || "강사 수정 실패");
        } finally {
            setSaving(false);
        }
    }

    if (loading) return <div className="admin-page">로딩 중...</div>;

    return (
        <div className="admin-page">
            <div className="admin-page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2 style={{ margin: 0 }}>강사 수정</h2>
                <div style={{ display: "flex", gap: 8 }}>
                    <button className="btn" onClick={() => nav(`/teachers/${userId}`)}>상세</button>
                    <button className="btn" onClick={() => nav("/teachers")}>목록</button>
                </div>
            </div>

            <form className="admin-card" style={{ marginTop: 12 }} onSubmit={onSave}>
                {err && <div style={{ color: "crimson", marginBottom: 10 }}>{err}</div>}

                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10 }}>
                    <div>
                        <div className="label">이름 *</div>
                        <input value={form.userName} onChange={(e) => setField("userName", e.target.value)} />
                    </div>
                    <div>
                        <div className="label">이메일</div>
                        <input value={form.email} onChange={(e) => setField("email", e.target.value)} />
                    </div>
                    <div>
                        <div className="label">전화번호 *</div>
                        <input value={form.phoneNumber} onChange={(e) => setField("phoneNumber", e.target.value)} />
                    </div>
                    <div>
                        <div className="label">지점 ID(brchId)</div>
                        <input inputMode="numeric" value={form.brchId} onChange={(e) => setField("brchId", e.target.value)} />
                    </div>
                </div>

                <div style={{ marginTop: 12 }}>
                    <div className="label">소개</div>
                    <input value={form.intro} onChange={(e) => setField("intro", e.target.value)} />
                </div>

                <div style={{ marginTop: 12 }}>
                    <div className="label">프로필 이미지 URL</div>
                    <input value={form.profileImgUrl} onChange={(e) => setField("profileImgUrl", e.target.value)} />
                </div>

                <div style={{ marginTop: 16 }}>
                    <h3>종목</h3>
                    {sports.length === 0 ? <div style={{ marginBottom: 8 }}>-</div> : null}
                    {sports.map((s, i) => (
                        <div key={i} style={{ display: "flex", gap: 8, alignItems: "end", marginBottom: 8, flexWrap: "wrap" }}>
                            <div>
                                <div className="label">sportId</div>
                                <input inputMode="numeric" value={s.sportId} onChange={(e) => {
                                    const v = e.target.value; setSports((p) => p.map((x, idx) => idx === i ? { ...x, sportId: v } : x));
                                }} />
                            </div>
                            <div>
                                <div className="label">mainYn</div>
                                <select value={s.mainYn ? "Y" : "N"} onChange={(e) => {
                                    const v = e.target.value === "Y"; setSports((p) => p.map((x, idx) => idx === i ? { ...x, mainYn: v } : x));
                                }}>
                                    <option value="Y">Y</option>
                                    <option value="N">N</option>
                                </select>
                            </div>
                            <div>
                                <div className="label">sortNo</div>
                                <input inputMode="numeric" value={s.sortNo} onChange={(e) => {
                                    const v = Number(e.target.value || 1); setSports((p) => p.map((x, idx) => idx === i ? { ...x, sortNo: v } : x));
                                }} />
                            </div>
                            <button type="button" className="btn" onClick={() => setSports((p) => p.filter((_, idx) => idx !== i))}>
                                삭제
                            </button>
                        </div>
                    ))}
                    <button type="button" className="btn" onClick={() => setSports((p) => [...p, { sportId: "", mainYn: false, sortNo: p.length + 1 }])}>
                        종목 추가
                    </button>
                </div>

                <div style={{ marginTop: 16 }}>
                    <h3>자격증</h3>
                    {certificates.length === 0 ? <div style={{ marginBottom: 8 }}>-</div> : null}
                    {certificates.map((c, i) => (
                        <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 170px 200px 80px", gap: 8, marginBottom: 8 }}>
                            <input placeholder="자격증명" value={c.certNm} onChange={(e) => {
                                const v = e.target.value; setCertificates((p) => p.map((x, idx) => idx === i ? { ...x, certNm: v } : x));
                            }} />
                            <input placeholder="발급처" value={c.issuer} onChange={(e) => {
                                const v = e.target.value; setCertificates((p) => p.map((x, idx) => idx === i ? { ...x, issuer: v } : x));
                            }} />
                            <input type="date" value={c.acqDt} onChange={(e) => {
                                const v = e.target.value; setCertificates((p) => p.map((x, idx) => idx === i ? { ...x, acqDt: v } : x));
                            }} />
                            <input placeholder="자격증번호" value={c.certNo} onChange={(e) => {
                                const v = e.target.value; setCertificates((p) => p.map((x, idx) => idx === i ? { ...x, certNo: v } : x));
                            }} />
                            <button type="button" className="btn" onClick={() => setCertificates((p) => p.filter((_, idx) => idx !== i))}>
                                삭제
                            </button>
                        </div>
                    ))}
                    <button type="button" className="btn" onClick={() => setCertificates((p) => [...p, { certNm: "", issuer: "", acqDt: "", certNo: "" }])}>
                        자격증 추가
                    </button>
                </div>

                <div style={{ marginTop: 16 }}>
                    <h3>경력</h3>
                    {careers.length === 0 ? <div style={{ marginBottom: 8 }}>-</div> : null}
                    {careers.map((c, i) => (
                        <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 170px 170px 80px", gap: 8, marginBottom: 8 }}>
                            <input placeholder="기관명" value={c.orgNm} onChange={(e) => {
                                const v = e.target.value; setCareers((p) => p.map((x, idx) => idx === i ? { ...x, orgNm: v } : x));
                            }} />
                            <input placeholder="직무" value={c.roleNm} onChange={(e) => {
                                const v = e.target.value; setCareers((p) => p.map((x, idx) => idx === i ? { ...x, roleNm: v } : x));
                            }} />
                            <input type="date" value={c.strtDt} onChange={(e) => {
                                const v = e.target.value; setCareers((p) => p.map((x, idx) => idx === i ? { ...x, strtDt: v } : x));
                            }} />
                            <input type="date" value={c.endDt || ""} onChange={(e) => {
                                const v = e.target.value; setCareers((p) => p.map((x, idx) => idx === i ? { ...x, endDt: v } : x));
                            }} />
                            <button type="button" className="btn" onClick={() => setCareers((p) => p.filter((_, idx) => idx !== i))}>
                                삭제
                            </button>
                        </div>
                    ))}
                    <button type="button" className="btn" onClick={() => setCareers((p) => [...p, { orgNm: "", roleNm: "", strtDt: "", endDt: "" }])}>
                        경력 추가
                    </button>
                </div>

                <div style={{ marginTop: 18, display: "flex", gap: 8 }}>
                    <button className="btn btn-primary" type="submit" disabled={saving}>
                        {saving ? "저장 중..." : "저장"}
                    </button>
                    <button className="btn" type="button" onClick={() => nav(`/teachers/${userId}`)}>
                        취소
                    </button>
                </div>
            </form>
        </div>
    );
}
