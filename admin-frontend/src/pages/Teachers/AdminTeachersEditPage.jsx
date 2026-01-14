import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./css/AdminTeachers.css";
import { getTeacherDetail, updateTeacher } from "../../api/teachers";
import { branchApi, sportTypeApi } from "../../api"; // 필요 시 "../../api/index"로 변경

/**
 * UpdateReq에는 sttsCd 변경이 없음 (상태 변경 불가)
 * - sports/certificates/careers: null이면 변경 안함 / 빈 리스트면 전체 삭제
 * - 여기서는 "현재 화면 상태 그대로" 보내는 방식으로 구현
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

export default function AdminTeachersEditPage() {
    const navigate = useNavigate();
    const { userId } = useParams();

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [errMsg, setErrMsg] = useState("");

    const [userName, setUserName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [hireDt, setHireDt] = useState(""); // 표시만
    const [brchId, setBrchId] = useState("");
    const [intro, setIntro] = useState("");
    const [profileImgUrl, setProfileImgUrl] = useState("");

    // sportIds는 "선택 순서"를 유지해야 mainYn/sortNo를 만들 수 있으므로 배열로 유지
    const [sportIds, setSportIds] = useState([]);
    const [careers, setCareers] = useState([newCareer()]);
    const [certificates, setCertificates] = useState([newCertificate()]);

    // API로 로딩되는 옵션들
    const [branchOptionsApi, setBranchOptionsApi] = useState([{ value: "", label: "지점 선택" }]);
    const [sportOptionsApi, setSportOptionsApi] = useState([]); // [{value,label}]

    // 상세 응답에만 존재하는 값이 옵션에 없을 수도 있어서 보강용
    const [detailBranchOpt, setDetailBranchOpt] = useState(null); // {value,label}
    const [detailSportExtraOpts, setDetailSportExtraOpts] = useState([]); // [{value,label}]

    const previewUrl = useMemo(() => (profileImgUrl ? profileImgUrl : ""), [profileImgUrl]);

    const toggleSport = (id) => {
        const sid = String(id);
        setSportIds((prev) => (prev.includes(sid) ? prev.filter((x) => x !== sid) : [...prev, sid]));
    };

    // 지점/종목 옵션 로딩 (공용 API 사용)
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
                setBranchOptionsApi(opts);
            } catch {
                setBranchOptionsApi([{ value: "", label: "지점 선택" }]);
            }

            try {
                const sports = await sportTypeApi.getAll(); // 기대: [{ sportId, sportNm, ... }]
                const opts = safeArr(sports)
                    .map((s) => ({
                        value: String(s.sportId ?? s.sport_id ?? ""),
                        label: s.sportNm ?? s.sport_nm ?? "-",
                    }))
                    .filter((x) => x.value);
                setSportOptionsApi(opts);
            } catch {
                setSportOptionsApi([]);
            }
        };

        loadFilters();
    }, []);

    // 옵션 보강 + 정렬된 최종 옵션
    const branchOptions = useMemo(() => {
        const map = new Map(branchOptionsApi.map((o) => [o.value, o]));
        if (detailBranchOpt?.value && !map.has(detailBranchOpt.value)) {
            map.set(detailBranchOpt.value, detailBranchOpt);
        }
        // 첫 옵션(지점 선택)은 유지
        const first = map.get("") || { value: "", label: "지점 선택" };
        const rest = Array.from(map.values()).filter((o) => o.value !== "");
        return [first, ...rest];
    }, [branchOptionsApi, detailBranchOpt]);

    const sportOptions = useMemo(() => {
        const map = new Map(sportOptionsApi.map((o) => [o.value, o]));
        safeArr(detailSportExtraOpts).forEach((o) => {
            if (o?.value && !map.has(o.value)) map.set(o.value, o);
        });

        // 선택된 sportIds가 options에 없으면(드물지만) id 그대로라도 보여주기
        sportIds.forEach((sid) => {
            if (sid && !map.has(sid)) map.set(sid, { value: sid, label: sid });
        });

        return Array.from(map.values());
    }, [sportOptionsApi, detailSportExtraOpts, sportIds]);

    const loadDetail = async () => {
        setLoading(true);
        setErrMsg("");
        try {
            const t = await getTeacherDetail(userId);

            setUserName(t?.userName || "");
            setPhoneNumber(t?.phoneNumber || "");
            setEmail(t?.email || "");
            setHireDt(t?.hireDt || "");
            setBrchId(t?.brchId != null ? String(t.brchId) : "");
            setIntro(t?.intro || "");
            setProfileImgUrl(t?.profileImgUrl || "");

            // branch 옵션 보강용 저장
            if (t?.brchId && t?.brchNm) {
                setDetailBranchOpt({ value: String(t.brchId), label: String(t.brchNm) });
            } else {
                setDetailBranchOpt(null);
            }

            // sports (선택 순서 유지: sortNo 기준, 없으면 응답 순서)
            const sports = safeArr(t?.sports)
                .slice()
                .sort((a, b) => (a?.sortNo ?? 999) - (b?.sortNo ?? 999));

            const ids = sports.map((s) => String(s?.sportId)).filter(Boolean);
            setSportIds(ids);

            // sport 옵션 보강
            const extras = sports
                .filter((s) => s?.sportId && s?.sportNm)
                .map((s) => ({ value: String(s.sportId), label: String(s.sportNm) }));
            setDetailSportExtraOpts(extras);

            // careers/certificates
            setCareers(
                safeArr(t?.careers).length
                    ? safeArr(t?.careers).map((c) => ({
                        orgNm: c?.orgNm || "",
                        roleNm: c?.roleNm || "",
                        strtDt: c?.strtDt || "",
                        endDt: c?.endDt || "",
                    }))
                    : [newCareer()]
            );

            setCertificates(
                safeArr(t?.certificates).length
                    ? safeArr(t?.certificates).map((c) => ({
                        certNm: c?.certNm || "",
                        issuer: c?.issuer || "",
                        acqDt: c?.acqDt || "",
                        certNo: c?.certNo || "",
                    }))
                    : [newCertificate()]
            );
        } catch (e) {
            setErrMsg(e?.response?.data?.message || e?.message || "상세 조회 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDetail();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId]);

    const validate = () => {
        if (!userName.trim()) return "강사명은 필수입니다.";
        if (!email.trim()) return "이메일은 필수입니다.";
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
                mainYn: idx === 0, // 첫 번째 선택 = 주종목
                sortNo: idx + 1,
            }));

            const payload = {
                userName: userName.trim(),
                email: email.trim(),
                phoneNumber: phoneNumber?.trim() ? phoneNumber.trim() : null,
                brchId: Number(brchId),
                intro: intro?.trim() ? intro.trim() : null,
                profileImgUrl: profileImgUrl?.trim() ? profileImgUrl.trim() : null,
                sports, // 현재 상태 그대로 보냄

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

            await updateTeacher(userId, payload);
            navigate(`/teachers/${userId}`);
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
                    <div className="teachers-breadcrumb">SYS - 강사 수정</div>
                    <h2 className="teachers-title">강사 수정</h2>
                </div>

                <div className="teachers-header-actions">
                    <button className="btn-sm" onClick={() => navigate(`/teachers/${userId}`)} disabled={saving}>
                        상세로
                    </button>
                    <button className="btn-sm" onClick={() => navigate("/teachers")} disabled={saving}>
                        목록으로
                    </button>
                </div>
            </div>

            <div className="teachers-content">
                {errMsg && <div className="teachers-error">{errMsg}</div>}

                {loading ? (
                    <div className="teachers-loading">로딩 중...</div>
                ) : (
                    <>
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
                                    <input value={userName} onChange={(e) => setUserName(e.target.value)} />
                                </div>

                                <div className="form-row">
                                    <label>
                                        이메일 <span className="req">*</span>
                                    </label>
                                    <input value={email} onChange={(e) => setEmail(e.target.value)} />
                                </div>

                                <div className="form-row">
                                    <label>연락처</label>
                                    <input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                                </div>

                                <div className="form-row">
                                    <label>입사일</label>
                                    <input value={hireDt} disabled />
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
                                    <div className="hint">선택된 순서의 첫 번째 종목이 “주종목(mainYn)”으로 저장됩니다.</div>
                                </div>

                                <div className="form-row">
                                    <label>한줄 소개</label>
                                    <textarea value={intro} onChange={(e) => setIntro(e.target.value)} />
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
                                        <div className="sub-title">경력</div>
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
                                        <div className="sub-title">자격증</div>
                                        <button
                                            type="button"
                                            className="btn-sm"
                                            onClick={() => setCertificates((p) => [...p, newCertificate()])}
                                        >
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
                        </div>

                        <div className="form-actions">
                            <button className="btn-primary" onClick={onSubmit} disabled={saving}>
                                저장
                            </button>
                            <button className="btn-sm" onClick={() => navigate(`/teachers/${userId}`)} disabled={saving}>
                                취소
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
