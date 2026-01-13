import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTeacher } from "../../api/teachers";

export default function AdminTeachersCreatePage() {
    const nav = useNavigate();
    const updUserId = localStorage.getItem("userId") || "";

    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState("");

    const [form, setForm] = useState({
        userName: "",
        email: "",
        password: "",
        phoneNumber: "",
        brchId: "",
        hireDt: "",
        intro: "",
        profileImgUrl: "",
    });

    const [sports, setSports] = useState([{ sportId: "", mainYn: true, sortNo: 1 }]);
    const [certificates, setCertificates] = useState([]);
    const [careers, setCareers] = useState([]);

    function setField(k, v) {
        setForm((p) => ({ ...p, [k]: v }));
    }

    function addCert() {
        setCertificates((p) => [...p, { certNm: "", issuer: "", acqDt: "", certNo: "" }]);
    }
    function addCareer() {
        setCareers((p) => [...p, { orgNm: "", roleNm: "", strtDt: "", endDt: "" }]);
    }

    async function onSubmit(e) {
        e.preventDefault();
        setErr("");

        if (!updUserId) return setErr("updUserId(userId)가 없습니다. 로그인 시 userId를 localStorage에 저장하세요.");
        if (!form.userName || !form.email || !form.password || !form.phoneNumber) return setErr("필수값(userName/email/password/phoneNumber)을 입력하세요.");
        if (!form.brchId) return setErr("brchId는 필수입니다.");
        if (!form.hireDt) return setErr("hireDt는 필수입니다.");

        const payload = {
            userId: "", // 빈 값이면 서버에서 생성
            userName: form.userName,
            email: form.email,
            password: form.password,
            phoneNumber: form.phoneNumber,
            brchId: Number(form.brchId),
            hireDt: form.hireDt,
            intro: form.intro,
            profileImgUrl: form.profileImgUrl,
            updUserId,

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
                    endDt: c.endDt || null,
                })),
        };

        setLoading(true);
        try {
            const created = await createTeacher(payload);
            nav(`/teachers/${created.userId}`);
        } catch (e2) {
            setErr(e2?.response?.data?.message || e2?.message || "강사 등록 실패");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="admin-page">
            <div className="admin-page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2 style={{ margin: 0 }}>강사 등록</h2>
                <button className="btn" onClick={() => nav("/teachers")}>목록</button>
            </div>

            <form className="admin-card" style={{ marginTop: 12 }} onSubmit={onSubmit}>
                {err && <div style={{ color: "crimson", marginBottom: 10 }}>{err}</div>}

                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10 }}>
                    <div>
                        <div className="label">이름 *</div>
                        <input value={form.userName} onChange={(e) => setField("userName", e.target.value)} />
                    </div>
                    <div>
                        <div className="label">이메일 *</div>
                        <input value={form.email} onChange={(e) => setField("email", e.target.value)} />
                    </div>
                    <div>
                        <div className="label">비밀번호 *</div>
                        <input type="password" value={form.password} onChange={(e) => setField("password", e.target.value)} />
                    </div>
                    <div>
                        <div className="label">전화번호 *</div>
                        <input value={form.phoneNumber} onChange={(e) => setField("phoneNumber", e.target.value)} />
                    </div>
                    <div>
                        <div className="label">지점 ID(brchId) *</div>
                        <input inputMode="numeric" value={form.brchId} onChange={(e) => setField("brchId", e.target.value)} placeholder="예: 3" />
                    </div>
                    <div>
                        <div className="label">입사일(hireDt) *</div>
                        <input type="date" value={form.hireDt} onChange={(e) => setField("hireDt", e.target.value)} />
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
                    {sports.map((s, i) => (
                        <div key={i} style={{ display: "flex", gap: 8, alignItems: "end", marginBottom: 8, flexWrap: "wrap" }}>
                            <div>
                                <div className="label">sportId</div>
                                <input
                                    inputMode="numeric"
                                    value={s.sportId}
                                    onChange={(e) => {
                                        const v = e.target.value;
                                        setSports((p) => p.map((x, idx) => (idx === i ? { ...x, sportId: v } : x)));
                                    }}
                                    placeholder="예: 2"
                                />
                            </div>
                            <div>
                                <div className="label">mainYn</div>
                                <select
                                    value={s.mainYn ? "Y" : "N"}
                                    onChange={(e) => {
                                        const v = e.target.value === "Y";
                                        setSports((p) => p.map((x, idx) => (idx === i ? { ...x, mainYn: v } : x)));
                                    }}
                                >
                                    <option value="Y">Y</option>
                                    <option value="N">N</option>
                                </select>
                            </div>
                            <div>
                                <div className="label">sortNo</div>
                                <input
                                    inputMode="numeric"
                                    value={s.sortNo}
                                    onChange={(e) => {
                                        const v = Number(e.target.value || 1);
                                        setSports((p) => p.map((x, idx) => (idx === i ? { ...x, sortNo: v } : x)));
                                    }}
                                />
                            </div>
                            <button
                                type="button"
                                className="btn"
                                onClick={() => setSports((p) => p.filter((_, idx) => idx !== i))}
                                disabled={sports.length === 1}
                            >
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
                    <button type="button" className="btn" onClick={addCert}>자격증 추가</button>
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
                    <button type="button" className="btn" onClick={addCareer}>경력 추가</button>
                </div>

                <div style={{ marginTop: 18, display: "flex", gap: 8 }}>
                    <button className="btn btn-primary" type="submit" disabled={loading}>
                        {loading ? "등록 중..." : "등록"}
                    </button>
                    <button className="btn" type="button" onClick={() => nav("/teachers")}>
                        취소
                    </button>
                </div>
            </form>
        </div>
    );
}
