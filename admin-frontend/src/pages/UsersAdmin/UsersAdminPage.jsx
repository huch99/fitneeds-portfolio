import React, { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../../api';

function AdminMemberPage() {
    // --- State 관리 ---
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(false);

    // 검색 필터 State
    // 초기값을 ''(빈 문자열)로 설정 -> 처음엔 "전체 날짜" 조회
    const [searchDate, setSearchDate] = useState('');
    const [selectedBranch, setSelectedBranch] = useState(''); // '' -> "전체 지점"

    // --- 초기화 (Lifecycle) ---
    useEffect(() => {
        fetchUserList();
    }, []);

    const fetchUserList = async () => {
        setLoading(true);
        try {
            // 파라미터 동적 구성
            const params = {};

            const response = await api.get('/admin/all', { params });
            setSchedules(response.data);
        } catch (error) {
            alert("데이터를 불러오지 못했습니다.");
        } finally {
            setLoading(false);
        }
    };
    const handleIsActiveChange = async (event, userId) => {
        // 1. 체크박스에서 변경된 새로운 isActive 상태를 가져옵니다.
        const newIsActive = event.target.checked; // true 또는 false

        // 2. 먼저 프론트엔드 UI를 즉시 업데이트하여 사용자 경험을 향상시킵니다.
        setUsers(prevUsers =>
            prevUsers.map(user =>
                user.userId === userId ? { ...user, isActive: newIsActive } : user
            )
        );

        // 3. 백엔드 API를 호출하여 데이터베이스에 변경사항을 반영합니다.
        try {
            // TODO: 여기에 실제 백엔드 API 호출 코드를 작성하세요.
            // 예시: await userService.updateUserIsActive(userId, newIsActive);

            console.log(`${userId}의 활성 상태가 ${newIsActive}로 성공적으로 변경되었습니다.`);
            // 성공 알림 (옵션)
        } catch (error) {
            console.error('활성 상태 업데이트 실패:', error);
            // API 호출 실패 시, 프론트엔드 상태를 원래대로 롤백합니다.
            setUsers(prevUsers =>
                prevUsers.map(user =>
                    user.userId === userId ? { ...user, isActive: !newIsActive } : user // 롤백: 현재 시도된 newIsActive의 반대 값
                )
            );
            alert('사용자 활성 상태 업데이트에 실패했습니다.'); // 사용자에게 에러 알림
        }
    };

    // --- 이벤트 핸들러 ---
    const handleSearch = () => fetchUserList();

    return (
        <div className="container" style={{ padding: '20px' }}>
            <h1>[관리자] 관리자 관리</h1>

            <div className="content-box" style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>

                {/* 검색 필터 영역 */}
                <div style={{ marginBottom: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '5px', display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
                    {/* 버튼 그룹 */}
                    <div style={{ marginLeft: 'auto' }}>
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
                                {/* <th>USER ID</th> */}
                                <th>USER NAME</th>
                                <th>E-MAIL</th>
                                <th>PHONE-NUMBER</th>
                                <th>ROLE</th>
                                {/* <th>CASH POINT</th> */}
                                {/* <th>GRADE POINT</th> */}
                                <th>BRANCH</th>
                                <th>AGREE</th>
                                <th>ACTIVE</th>
                            </tr>
                        </thead>
                        <tbody>
                            {schedules.length === 0 ? (
                                <tr>
                                    <td colSpan="7" style={{ padding: '40px', color: '#7f8c8d' }}>
                                        조회된 회원이 없습니다.
                                    </td>
                                </tr>
                            ) : (
                                schedules.map((item, index) => {
                                    // 상태 뱃지 정보 가져오기
                                    // const statusInfo = STATUS_MAP[item.status] || { label: item.status, color: '#333' };

                                    return (
                                        <tr key={item.userId || index} style={{ borderBottom: '1px solid #eee', height: '50px' }}>
                                            {/* <td>{item.userId}</td> */}
                                            <td>{item.userName}</td>
                                            <td>{item.email}</td>
                                            <td>{item.phoneNumber}</td>
                                            {/* <td>{item.cashPoint}</td> */}
                                            {/* <td>{item.gradePoint}</td> */}

                                            <td>{item.role}</td>
                                            <td>{item.brchId?.brchId || '미지정'}</td>
                                            <td>{item.agreeAt}</td>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    checked={item.isActive} // item.isActive 값에 따라 체크박스 상태를 제어 (true면 체크, false면 해제)
                                                    onChange={(e) => handleIsActiveChange(e, item.userId)}
                                                />
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

export default AdminMemberPage;