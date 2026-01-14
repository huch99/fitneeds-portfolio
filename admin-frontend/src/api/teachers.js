// file: src/api/teachers.js
import api from "./index";

/**
 * 목록 조회
 * @param {Object} params
 * @param {string} [params.status="ACTIVE"] - ACTIVE | LEAVE | RESIGNED
 * @param {number} [params.branchId]
 * @param {number} [params.sportId]
 */
export async function getTeacherList(params = {}) {
    const { status = "ACTIVE", branchId, sportId } = params;

    const res = await api.get("/teachers", {
        params: {
            status,
            branchId: branchId ?? undefined,
            sportId: sportId ?? undefined,
        },
    });
    return res.data; // TeacherResp[]
}

/**
 * 상세 조회
 */
export async function getTeacherDetail(userId) {
    const res = await api.get(`/teachers/${userId}`);
    return res.data; // TeacherResp
}

/**
 * 신규 등록
 */
export async function createTeacher(payload) {
    const res = await api.post("/teachers/new", payload);
    return res.data; // TeacherResp
}

/**
 * 수정
 */
export async function updateTeacher(userId, payload) {
    const res = await api.put(`/teachers/${userId}`, payload);
    return res.data; // TeacherResp
}

/**
 * 퇴직 처리
 */
export async function retireTeacher(userId, payload) {
    const res = await api.patch(`/teachers/${userId}/retire`, payload);
    return res.data; // (204이면 undefined)
}

/**
 * 상태 변경
 */
export async function updateTeacherStatus(userId, payload) {
    const res = await api.patch(`/teachers/${userId}/status`, payload);
    return res.data; // 204면 undefined
}