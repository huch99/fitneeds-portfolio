import React, { useState, useEffect } from 'react';
import axios from 'axios';

// 1. 상태(Status) 뱃지 설정
const STATUS_MAP = {
    'RSV': { label: '예약중', color: '#2ecc71' }, // Green
    'ATD': { label: '출석', color: '#3498db' },   // Blue
    'NOS': { label: '노쇼', color: '#e74c3c' },   // Red
    'CNCL': { label: '취소', color: '#95a5a6' },  // Gray
    'OPEN': { label: '예약가능', color: '#f39c12' }, // Yellow
    'FULL': { label: '마감', color: '#e74c3c' },     // Red
    'CLOSE': { label: '종료', color: '#7f8c8d' }     // Grey
};

// [Mock Data] 지점 목록 (나중에 API로 대체 가능)
const BRANCH_LIST = [
    { id: 1, name: '강남점' },
    { id: 2, name: '잠실점' },
    { id: 3, name: '판교점' }
];

function AdminReservationPage() {
    // --- State 관리 ---
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(false);

    // 검색 필터 State
    // 초기값을 ''(빈 문자열)로 설정 -> 처음엔 "전체 날짜" 조회
    const [searchDate, setSearchDate] = useState('');
    const [selectedBranch, setSelectedBranch] = useState(''); // '' -> "전체 지점"

    // --- 초기화 (Lifecycle) ---
    useEffect(() => {
        fetchSchedules();
    }, []);

    // --- API 호출 (Backend 연동) ---
    const fetchSchedules = async () => {
        setLoading(true);
        try {
            // 파라미터 동적 구성
            const params = {};

            // 1. 날짜가 비어있지 않을 때만 파라미터 추가
            if (searchDate) {
                params.date = searchDate;
            }

            // 2. 지점이 '전체'가 아닐 때만 파라미터 추가
            if (selectedBranch && selectedBranch !== "") {
                params.branchId = selectedBranch;
            }

            console.log("요청 파라미터:", params); // 디버깅용

            // GET /api/admin/schedules
            const response = await axios.get('/api/admin/schedules', { params });

            setSchedules(response.data);
            console.log("응답 데이터:", response.data);

        } catch (error) {
            console.error("스케줄 로드 실패:", error);
            alert("데이터를 불러오지 못했습니다.");
        } finally {
            setLoading(false);
        }
    };

    // --- 이벤트 핸들러 ---
    const handleSearch = () => fetchSchedules();

    const handleReset = () => {
        setSearchDate('');      // 날짜 초기화
        setSelectedBranch('');  // 지점 초기화
        // UX: 사용자가 '조회하기'를 눌러야 갱신되도록 하거나, 여기서 바로 fetchSchedules() 호출 가능
    };

    // --- 화면 렌더링 ---
    return (
        <div className="container" style={{ padding: '20px' }}>
            <h1>[관리자] 예약 현황 관리</h1>

            <div className="content-box" style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>

                {/* 검색 필터 영역 */}
                <div style={{ marginBottom: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '5px', display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>

                    {/* 지점 선택 */}
                    <div>
                        <label style={{ fontWeight: 'bold', marginRight: '5px' }}>🏢 지점:</label>
                        <select
                            value={selectedBranch}
                            onChange={(e) => setSelectedBranch(e.target.value)}
                            style={{ padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }}
                        >
                            <option value="">전체 지점</option>
                            {BRANCH_LIST.map(branch => (
                                <option key={branch.id} value={branch.id}>{branch.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* 날짜 선택 */}
                    <div>
                        <label style={{ fontWeight: 'bold', marginRight: '5px' }}>📅 날짜:</label>
                        <input
                            type="date"
                            value={searchDate}
                            onChange={(e) => setSearchDate(e.target.value)}
                            style={{ padding: '5px', border: '1px solid #ccc', borderRadius: '4px' }}
                        />
                    </div>

                    {/* 버튼 그룹 */}
                    <div style={{ marginLeft: 'auto' }}>
                        <button
                            onClick={handleReset}
                            style={{ padding: '8px 16px', marginRight: '10px', background: '#95a5a6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                        >
                            조건 초기화
                        </button>
                        <button
                            onClick={handleSearch}
                            style={{ padding: '8px 16px', background: '#2c3e50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                            조회하기
                        </button>
                    </div>
                </div>

                {/* 데이터 테이블 */}
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '50px' }}>데이터를 불러오는 중입니다...</div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', fontSize: '14px' }}>
                        <thead style={{ background: '#ecf0f1', borderBottom: '2px solid #bdc3c7', color: '#2c3e50', height: '40px' }}>
                            <tr>
                                <th style={{ width: '50px' }}>ID</th>
                                <th style={{ width: '250px' }}>시간</th>
                                <th>지점</th>
                                <th>수업명/강사</th>
                                <th>예약현황</th>
                                <th style={{ width: '80px' }}>상태</th>
                            </tr>
                        </thead>
                        <tbody>
                            {schedules.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ padding: '40px', color: '#7f8c8d' }}>
                                        조회된 스케줄이 없습니다.
                                    </td>
                                </tr>
                            ) : (
                                schedules.map((item, index) => {
                                    // 상태 뱃지 정보 가져오기
                                    const statusInfo = STATUS_MAP[item.status] || { label: item.status, color: '#333' };

                                    return (
                                        <tr key={item.scheduleId || index} style={{ borderBottom: '1px solid #eee', height: '50px' }}>
                                            <td>{item.scheduleId}</td>

                                            {/* [핵심 수정] 백엔드가 보내준 String 그대로 출력 */}
                                            <td style={{ fontWeight: 'bold', color: '#333' }}>
                                                {/* startTime: "2025-12-10 10:00" */}
                                                {item.startTime}

                                                {/* endTime: "11:00" */}
                                                {item.endTime ? ` ~ ${item.endTime}` : ''}
                                            </td>

                                            <td>{item.branchName}</td>

                                            <td>
                                                <div style={{ fontWeight: 'bold' }}>{item.programName}</div>
                                                <div style={{ fontSize: '12px', color: '#888' }}>({item.instructorName})</div>
                                            </td>

                                            <td>
                                                <span style={{ fontWeight: 'bold', color: item.currentCount >= item.maxCount ? '#e74c3c' : '#2ecc71' }}>
                                                    {item.currentCount}
                                                </span>
                                                / {item.maxCount}
                                            </td>

                                            <td>
                                                <span style={{
                                                    backgroundColor: statusInfo.color,
                                                    color: 'white',
                                                    padding: '4px 10px',
                                                    borderRadius: '20px',
                                                    fontSize: '12px',
                                                    fontWeight: 'bold'
                                                }}>
                                                    {statusInfo.label}
                                                </span>
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

export default AdminReservationPage;