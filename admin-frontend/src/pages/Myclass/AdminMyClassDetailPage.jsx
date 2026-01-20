// file: src/pages/MyClass/AdminMyClassDetailPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../Teachers/css/AdminTeachers.css";
import { getMyScheduleDetail, getMyScheduleReservations } from "../../api/myclass";

function safeArr(v) {
    return Array.isArray(v) ? v : [];
}

const SCHEDULE_STATUS_LABEL = {
    OPEN: "오픈",
    CLOSED: "마감",
    CANCELED: "취소",
};

const RSVP_STATUS_LABEL = {
    RESERVED: "예약",
    COMPLETED: "완료",
    CANCELED: "취소",
};

function fmtTime(v) {
    if (!v) return "-";
    // "19:00:00" -> "19:00"
    if (typeof v === "string" && v.length >= 5) return v.slice(0, 5);
    return String(v);
}

export default function AdminMyClassDetailPage() {
    const navigate = useNavigate();
    const { schdId } = useParams();

    const [detail, setDetail] = useState(null);
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errMsg, setErrMsg] = useState("");

    const loadAll = async () => {
        setLoading(true);
        setErrMsg("");
        try {
            const [d, rs] = await Promise.all([
                getMyScheduleDetail(schdId),
                getMyScheduleReservations(schdId),
            ]);
            setDetail(d || null);
            setReservations(safeArr(rs));
        } catch (e) {
            setErrMsg(
                e?.response?.data?.message ||
                e?.message ||
                "상세 조회 중 오류가 발생했습니다."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAll();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [schdId]);

    const vm = useMemo(() => {
        const d = detail || {};
        const strtTm = d.strtTm ?? d.strt_tm;
        const endTm = d.endTm ?? d.end_tm;

        const progNm = d.progNm ?? d.prog_nm;
        const brchNm = d.brchNm ?? d.brch_nm;
        const teacherName = d.teacherName ?? d.teacher_name;

        const sttsCd = d.sttsCd ?? d.stts_cd;
        const sttsLabel = SCHEDULE_STATUS_LABEL[sttsCd] || sttsCd || "-";

        return {
            // 화면 표시용: ID는 숨기고 "이름" 위주로
            progNm: progNm || "-", // 수업명(프로그램명)
            brchNm: brchNm || "-", // 지점명
            teacherName: teacherName || "-", // 강사명

            date: d.strtDt ?? d.strt_dt,
            time: `${fmtTime(strtTm)} ~ ${fmtTime(endTm)}`,
            max: d.maxNopCnt ?? d.max_nop_cnt,
            rsv: d.rsvCnt ?? d.rsv_cnt,
            sttsLabel,
            desc: d.description ?? d.DESCRIPTION ?? "",
        };
    }, [detail]);

    return (
        <div className="teachers-page">
            <div className="teachers-header">
                <div>
                    <div className="teachers-breadcrumb">MYCLASS - 수업 상세</div>
                    <h2 className="teachers-title">내 수업 상세</h2>
                </div>

                <div className="teachers-header-actions">
                    <button
                        className="btn-sm"
                        onClick={() => navigate("/myclass")}
                        disabled={loading}
                    >
                        목록으로
                    </button>
                </div>
            </div>

            <div className="teachers-content">
                {errMsg && <div className="teachers-error">{errMsg}</div>}

                {loading ? (
                    <div className="teachers-loading">로딩 중...</div>
                ) : !detail ? (
                    <div className="teachers-empty">데이터가 없습니다.</div>
                ) : (
                    <>
                        <div className="detail-grid">
                            <div className="panel">
                                <div className="panel-title">수업(스케줄) 정보</div>
                                <div className="kv">
                                    <div className="kv-row">
                                        <div className="kv-k">수업명</div>
                                        <div className="kv-v">{vm.progNm}</div>
                                    </div>
                                    <div className="kv-row">
                                        <div className="kv-k">지점명</div>
                                        <div className="kv-v">{vm.brchNm}</div>
                                    </div>
                                    <div className="kv-row">
                                        <div className="kv-k">강사명</div>
                                        <div className="kv-v">{vm.teacherName}</div>
                                    </div>

                                    <div className="kv-row">
                                        <div className="kv-k">일자</div>
                                        <div className="kv-v">{vm.date}</div>
                                    </div>
                                    <div className="kv-row">
                                        <div className="kv-k">시간</div>
                                        <div className="kv-v">{vm.time}</div>
                                    </div>
                                    <div className="kv-row">
                                        <div className="kv-k">정원</div>
                                        <div className="kv-v">{vm.max}</div>
                                    </div>
                                    <div className="kv-row">
                                        <div className="kv-k">예약</div>
                                        <div className="kv-v">{vm.rsv}</div>
                                    </div>
                                    <div className="kv-row">
                                        <div className="kv-k">상태</div>
                                        <div className="kv-v">{vm.sttsLabel}</div>
                                    </div>
                                    <div className="kv-row">
                                        <div className="kv-k">설명</div>
                                        <div className="kv-v">{vm.desc || "-"}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="panel">
                                <div className="panel-title">예약자 현황</div>
                                <div className="hint">
                                    RESERVATION + (선택) CLASS_ATTENDANCE 조인 결과를 표시합니다.
                                </div>

                                <div className="teachers-table-wrap" style={{ marginTop: 12 }}>
                                    <table>
                                        <thead>
                                        <tr>
                                            <th>회원명</th>
                                            <th>예약일</th>
                                            <th>예약시간</th>
                                            <th>상태</th>
                                            <th>출석</th>
                                            <th>체크인</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {reservations.length === 0 ? (
                                            <tr>
                                                <td colSpan={6} style={{ padding: 20 }}>
                                                    예약자가 없습니다.
                                                </td>
                                            </tr>
                                        ) : (
                                            reservations.map((r, idx) => {
                                                const userName = r.userName ?? r.user_name; // 백엔드에서 내려주면 이름 표시
                                                const rsvDt = r.rsvDt ?? r.rsv_dt;
                                                const rsvTime = fmtTime(r.rsvTime ?? r.rsv_time);

                                                const sttsCd = r.sttsCd ?? r.stts_cd;
                                                const sttsLabel = RSVP_STATUS_LABEL[sttsCd] || sttsCd || "-";

                                                const atnd = r.atndYn ?? r.atnd_yn;
                                                const atndLabel =
                                                    atnd === 1 || atnd === true
                                                        ? "출석"
                                                        : atnd === 0 || atnd === false
                                                            ? "미출석"
                                                            : "-";

                                                const checkinAt = r.checkinAt ?? r.checkin_at ?? "-";

                                                return (
                                                    <tr key={(r.rsvId ?? r.rsv_id) ?? idx}>
                                                        <td style={{ maxWidth: 260, wordBreak: "break-all" }}>
                                                            {userName || "-"}
                                                        </td>
                                                        <td>{rsvDt || "-"}</td>
                                                        <td>{rsvTime}</td>
                                                        <td>{sttsLabel}</td>
                                                        <td>{atndLabel}</td>
                                                        <td>{checkinAt}</td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* 참고:
                    userName(회원명)이 계속 "-"로 나오면,
                    예약자 API 응답에 user_name 조인이 빠진 상태라 백엔드에서 USERS.user_name(또는 회원명 컬럼) 조인 추가가 필요합니다.
                */}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
