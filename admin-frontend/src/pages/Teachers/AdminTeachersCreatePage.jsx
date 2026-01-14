import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/AdminTeachers.css";
import { createTeacher } from "../../api/teachers";
import { branchApi, sportTypeApi } from "../../api"; // 필요 시 "../../api/index"로 변경

/**
 * 백엔드 CreateReq 필수:
 * - userName, email, password, brchId, hireDt
 * sports/certificates/careers는 선택
 */

function safeArr(v) {
    return Array.isArray(v) ? v : [];
}

function newCareer() {
    return { orgNm: "", roleNm: "", strtDt: "", endDt: "" };
}

function newCertificate() {
    return { certNm: "", issuer: "", acqDt: "", certNo: "" };
}

export default function AdminTeachersCreatePage() {
    const navigate = useNavigate();

    const [saving, setSaving] = useState(false);
    const [errMsg, setErrMsg] = useState("");

    // 기본정보 (DTO명에 맞춤)
    const [userName, setUserName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [hireDt, setHireDt] = useState("");
    const [brchId, setBrchId] = useState("");
    const [intro, setIntro] = useState("");

    // 등록 시 필수
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");

    // sports: SportReq { sportId, mainYn, sortNo }
    // 선택 순서 유지(첫 선택 = mainYn)
    const [sportIds, setSportIds] = useState([]);

    const [careers, setCareers] = useState([newCareer()]);
    const [certificates, setCertificates] = useState([newCertificate()]);

    // profileImgUrl(문자열) + 미리보기
    const [profileImgUrl, setProfileImgUrl] = useState("");
    const previewUrl = useMemo(() => (profileImgUrl ? profileImgUrl : ""), [profileImgUrl]);

    // 지점/종목 옵션(API 로딩)
    const [branchOptions, setBranchOptions] = useState([{ value: "", label: "지점 선택" }]);
    const [sportOptions, setSportOptions] = useState([]); // [{value,label}]

    useEffect(() => {
        const loadFilters = async () => {
            try {
                const branches = await branchApi.getAll(); // 기대: [{ brchId, brchNm, ... }]
                const opts = [
                    { value: "", label: "지점 선택" },
                    ...safeArr(branches)
                        .map((b) => ({
                            value: String(b.brchId ?? b.brch_id ?? ""),
                            label: b.brchNm ?? b.brch_nm ?? "-",
                        }))
                        .filter((x) => x.value),
                ];
                setBranchOptions(opts);
            } catch {
                setBranchOptions([{ value: "", label: "지점 선택" }]);
            }

            try {
                const sports = await sportTypeApi.getAll(); // 기대: [{ sportId, sportNm, ... }]
                const opts = safeArr(sports)
                    .map((s) => ({
                        value: String(s.sportId ?? s.sport_id ?? ""),
                        label: s.sportNm ?? s.sport_nm ?? "-",
                    }))
                    .filter((x) => x.value);
                setSportOptions(opts);
            } catch {
                setSportOptions([]);
            }
        };

        loadFilters();
    }, []);

    const toggleSport = (id) => {
        const sid = String(id);
        setSportIds((prev) => (prev.includes(sid) ? prev.filter((x) => x !== sid) : [...prev, sid]));
    };

    const validate = () => {
        if (!userName.trim()) return "강사명은 필수입니다.";
        if (!email.trim()) return "이메일은 필수입니다.";
        if (!password.trim()) return "비밀번호는 필수입니다.";
        if (password !== password2) return "비밀번호 확인이 일치하지 않습니다.";
        if (!hireDt) return "입사일은 필수입니다.";
        if (!brchId) return "소속 지점을 선택해주세요.";
        if (sportIds.length === 0) return "주요 종목을 1개 이상 선택해주세요.";
        return "";
    };

    const onSubmit = async () => {
        const v = validate();
        if (v) {
            setErrMsg(v);
            return;
        }

        setSaving(true);
        setErrMsg("");
        try {
            const sports = sportIds.map((id, idx) => ({
                sportId: Number(id),
                mainYn: idx === 0, // 첫 선택을 메인으로
                sortNo: idx + 1,
            }));

            const payload = {
                userName: userName.trim(),
                email: email.trim(),
                password, // 백엔드에서 암호화 처리
                phoneNumber: phoneNumber?.trim() ? phoneNumber.trim() : null,
                brchId: Number(brchId),
                hireDt, // YYYY-MM-DD
                intro: intro?.trim() ? intro.trim() : null,
                profileImgUrl: profileImgUrl?.trim() ? profileImgUrl.trim() : null,
                // updUserId는 선택(없어도 됨)
                sports,

                certificates: certificates
                    .filter((c) => c.certNm || c.issuer || c.acqDt || c.certNo)
                    .map((c) => ({
                        certNm: c.certNm?.trim() || "",
                        issuer: c.issuer?.trim() || "",
                        acqDt: c.acqDt || null,
                        certNo: c.certNo?.trim() || null,
                    })),

                careers: careers
                    .filter((c) => c.orgNm || c.roleNm || c.strtDt || c.endDt)
                    .map((c) => ({
                        orgNm: c.orgNm?.trim() || "",
                        roleNm: c.roleNm?.trim() || "",
                        strtDt: c.strtDt || null,
                        endDt: c.endDt || null,
                    })),
            };

            const created = await createTeacher(payload);
            const newUserId = created?.userId;
            if (newUserId) navigate(`/teachers/${newUserId}`);
            else navigate("/teachers");
        } catch (e) {
            setErrMsg(e?.response?.data?.message || e?.message || "저장 중 오류가 발생했습니다.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="teachers-page">
            <div className="teachers-header">
                <div>
                    <div className="teachers-breadcrumb">SYS - 강사 등록</div>
                    <h2 className="teachers-title">강사 등록</h2>
                </div>

                <button className="btn-sm" onClick={() => navigate("/teachers")} disabled={saving}>
                    목록으로
                </button>
            </div>

            <div className="teachers-content">
                {errMsg && <div className="teachers-error">{errMsg}</div>}

                <div className="panel panel-wide">
                    <div className="panel-title-row">
                        <div className="panel-title">기본 정보</div>
                        <div className="panel-hint">* 필수 입력 항목</div>
                    </div>

                    <div className="form-block">
                        <div className="form-row">
                            <label>
                                강사명 <span className="req">*</span>
                            </label>
                            <input value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="강사명" />
                        </div>

                        <div className="form-row">
                            <label>
                                이메일 <span className="req">*</span>
                            </label>
                            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@email.com" />
                        </div>

                        <div className="form-row">
                            <label>
                                비밀번호 <span className="req">*</span>
                            </label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="비밀번호" />
                        </div>

                        <div className="form-row">
                            <label>
                                비밀번호 확인 <span className="req">*</span>
                            </label>
                            <input
                                type="password"
                                value={password2}
                                onChange={(e) => setPassword2(e.target.value)}
                                placeholder="비밀번호 확인"
                            />
                        </div>

                        <div className="form-row">
                            <label>연락처</label>
                            <input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="010-1234-5678" />
                        </div>

                        <div className="form-row">
                            <label>
                                입사일 <span className="req">*</span>
                            </label>
                            <input type="date" value={hireDt} onChange={(e) => setHireDt(e.target.value)} />
                        </div>

                        <div className="form-row">
                            <label>
                                소속 지점 <span className="req">*</span>
                            </label>
                            <select value={brchId} onChange={(e) => setBrchId(e.target.value)}>
                                {branchOptions.map((o) => (
                                    <option key={o.value} value={o.value}>
                                        {o.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-row">
                            <label>
                                주요 종목 <span className="req">*</span>
                            </label>
                            <div className="chips">
                                {sportOptions.length === 0 ? (
                                    <div className="hint">종목 목록을 불러오지 못했습니다.</div>
                                ) : (
                                    sportOptions.map((o) => {
                                        const checked = sportIds.includes(o.value);
                                        return (
                                            <button
                                                type="button"
                                                key={o.value}
                                                className={`chip ${checked ? "on" : ""}`}
                                                onClick={() => toggleSport(o.value)}
                                            >
                                                {o.label}
                                            </button>
                                        );
                                    })
                                )}
                            </div>
                            <div className="hint">첫 번째로 선택한 종목을 mainYn=true로 저장합니다.</div>
                        </div>

                        <div className="form-row">
                            <label>한줄 소개</label>
                            <textarea value={intro} onChange={(e) => setIntro(e.target.value)} placeholder="소개 문구" />
                        </div>
                    </div>
                </div>

                <div className="panel panel-wide">
                    <div className="panel-title-row">
                        <div className="panel-title">경력 · 자격증</div>
                        <div className="panel-hint">* 선택</div>
                    </div>

                    <div className="two-col">
                        <div className="sub-panel">
                            <div className="sub-title-row">
                                <div className="sub-title">경력 추가</div>
                                <button type="button" className="btn-sm" onClick={() => setCareers((p) => [...p, newCareer()])}>
                                    + 추가
                                </button>
                            </div>

                            {careers.map((c, idx) => (
                                <div key={idx} className="row-card">
                                    <div className="row-card-grid">
                                        <input
                                            value={c.orgNm}
                                            onChange={(e) =>
                                                setCareers((p) => p.map((x, i) => (i === idx ? { ...x, orgNm: e.target.value } : x)))
                                            }
                                            placeholder="기관/지점명(orgNm)"
                                        />
                                        <input
                                            value={c.roleNm}
                                            onChange={(e) =>
                                                setCareers((p) => p.map((x, i) => (i === idx ? { ...x, roleNm: e.target.value } : x)))
                                            }
                                            placeholder="직무/설명(roleNm)"
                                        />
                                        <input
                                            type="date"
                                            value={c.strtDt}
                                            onChange={(e) =>
                                                setCareers((p) => p.map((x, i) => (i === idx ? { ...x, strtDt: e.target.value } : x)))
                                            }
                                        />
                                        <input
                                            type="date"
                                            value={c.endDt}
                                            onChange={(e) =>
                                                setCareers((p) => p.map((x, i) => (i === idx ? { ...x, endDt: e.target.value } : x)))
                                            }
                                        />
                                    </div>

                                    <div className="row-card-actions">
                                        <button type="button" className="danger-btn" onClick={() => setCareers((p) => p.filter((_, i) => i !== idx))}>
                                            삭제
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="sub-panel">
                            <div className="sub-title-row">
                                <div className="sub-title">자격증 추가</div>
                                <button type="button" className="btn-sm" onClick={() => setCertificates((p) => [...p, newCertificate()])}>
                                    + 추가
                                </button>
                            </div>

                            {certificates.map((c, idx) => (
                                <div key={idx} className="row-card">
                                    <div className="row-card-grid">
                                        <input
                                            value={c.certNm}
                                            onChange={(e) =>
                                                setCertificates((p) => p.map((x, i) => (i === idx ? { ...x, certNm: e.target.value } : x)))
                                            }
                                            placeholder="자격증명(certNm)"
                                        />
                                        <input
                                            value={c.issuer}
                                            onChange={(e) =>
                                                setCertificates((p) => p.map((x, i) => (i === idx ? { ...x, issuer: e.target.value } : x)))
                                            }
                                            placeholder="발급기관(issuer)"
                                        />
                                        <input
                                            type="date"
                                            value={c.acqDt}
                                            onChange={(e) =>
                                                setCertificates((p) => p.map((x, i) => (i === idx ? { ...x, acqDt: e.target.value } : x)))
                                            }
                                        />
                                        <input
                                            value={c.certNo}
                                            onChange={(e) =>
                                                setCertificates((p) => p.map((x, i) => (i === idx ? { ...x, certNo: e.target.value } : x)))
                                            }
                                            placeholder="자격증번호(certNo)"
                                        />
                                    </div>

                                    <div className="row-card-actions">
                                        <button type="button" className="danger-btn" onClick={() => setCertificates((p) => p.filter((_, i) => i !== idx))}>
                                            삭제
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="panel panel-wide">
                    <div className="panel-title">프로필 사진</div>

                    <div className="form-row">
                        <label>이미지 URL</label>
                        <input value={profileImgUrl} onChange={(e) => setProfileImgUrl(e.target.value)} placeholder="https://..." />
                    </div>

                    <div className="upload-box">
                        <div className="upload-preview">
                            {previewUrl ? <img src={previewUrl} alt="preview" /> : <div className="upload-placeholder">+</div>}
                        </div>
                    </div>

                    <div className="hint">현재 백엔드는 파일 업로드가 아니라 profileImgUrl(문자열) 저장 방식입니다.</div>
                </div>

                <div className="form-actions">
                    <button className="btn-primary" onClick={onSubmit} disabled={saving}>
                        저장
                    </button>
                    <button className="btn-sm" onClick={() => navigate("/teachers")} disabled={saving}>
                        취소
                    </button>
                </div>
            </div>
        </div>
    );
}
