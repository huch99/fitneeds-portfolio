import React, { useState, useEffect } from 'react';
import api from '../../api';

function AdminMemberPage() {
    /* ===============================
       State
    =============================== */
    const [userList, setUserList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const ITEMS_PER_PAGE = 8;

    const [branchList, setBranchList] = useState([]);
    const [editingUserId, setEditingUserId] = useState(null);

    const ROLE_OPTIONS = ['ADMIN', 'USER', 'TEACHER'];

    /* ===============================
       Derived Data (파생 데이터)
    =============================== */
    const totalPages = Math.ceil(userList.length / ITEMS_PER_PAGE);

    const currentItems = userList.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const getBranchName = (branchId) => {
        return branchList.find(b => b.id === branchId)?.name || '-';
    };

    /* ===============================
       Lifecycle
    =============================== */
    useEffect(() => {
        fetchUserList();
        fetchBranches();
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [currentPage]);

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(1);
        }
    }, [userList, totalPages]);

    /* ===============================
       API
    =============================== */
    const fetchUserList = async () => {
        setLoading(true);
        try {
            // ✅ 기존 API 유지
            const response = await api.get('/admin/all');
            setUserList(response.data);
        } catch (error) {
            alert('데이터를 불러오지 못했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const fetchBranches = async () => {
        const response = await api.get('/admin/branchCode', {
            headers: {
                Accept: 'application/xml'
            }
        });
        try {
            const parser = new DOMParser();
            const xml = parser.parseFromString(response.data, 'text/xml');

            const items = Array.from(xml.getElementsByTagName('item')).map(item => ({
                id: Number(item.getElementsByTagName('brchId')[0].textContent),
                name: item.getElementsByTagName('brchNm')[0].textContent
            }));

            console.log(items);
            setBranchList(items);
        } catch (error) {
            console.error(error);
        }
    };
    /* ===============================
       Event Handlers
    =============================== */
    const handleSearch = () => {
        setCurrentPage(1);
        fetchUserList();
    };

    const handleIsActiveChange = async (e, userId) => {
        const newIsActive = e.target.checked;

        console.log('User ID:', userId);
        console.log('newIsActive:', newIsActive);

        setUserList(prev =>
            prev.map(user =>
                user.userId === userId
                    ? { ...user, isActive: newIsActive }
                    : user
            )
        );
        try {
            await api.post(`/admin/updateUserIsActive`, {
                isActive: newIsActive,
                userId: userId
            });
        } catch (error) {
            // 실패 시 롤백
            setUserList(prev =>
                prev.map(user =>
                    user.userId === userId
                        ? { ...user, isActive: !newIsActive }
                        : user
                )
            );
            alert('사용자 활성 상태 변경에 실패했습니다.');
        }
    };

    const handleBranchChange = async (userId, newBranchId) => {
        // 1. UI 즉시 반영
        console.log('User ID:', userId);
        console.log('Selected Branch ID:', newBranchId);
        setUserList(prev =>
            prev.map(user =>
                user.userId === userId
                    ? { ...user, brchId: Number(newBranchId) }
                    : user
            )
        );

        try {
            // 2. 서버 반영
            await api.post(`/admin/updateUserBranch`, {
                brchId: newBranchId,
                userId: userId
            });
        } catch (error) {
            alert('지점 변경에 실패했습니다.');
            fetchUserList(); // 실패 시 서버 값으로 복구
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        // 1. UI 즉시 반영
        console.log('User ID:', userId);
        console.log('Selected Role:', newRole);
        setUserList(prev =>
            prev.map(user =>
                user.userId === userId
                    ? { ...user, role: newRole }
                    : user
            )
        );

        try {
            // 2. 서버 반영
            await api.post(`/admin/updateUserRole`, {
                role: newRole,
                userId: userId
            });
        } catch (error) {
            alert('역할 변경에 실패했습니다.');
            fetchUserList(); // 실패 시 서버 값으로 복구
        }
    };

    /* ===============================
       Render
    =============================== */
    return (
        <div className="container" style={{ padding: '20px' }}>
            <h1>[관리자] 회원 관리</h1>

            <div
                className="content-box"
                style={{
                    background: '#fff',
                    padding: '20px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
            >
                {/* 검색 영역 */}
                <div
                    style={{
                        marginBottom: '20px',
                        padding: '15px',
                        background: '#f8f9fa',
                        borderRadius: '5px',
                        display: 'flex',
                        justifyContent: 'flex-end'
                    }}
                >
                    <button
                        onClick={handleSearch}
                        style={{
                            padding: '8px 16px',
                            background: '#2c3e50',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}
                    >
                        조회하기
                    </button>
                </div>

                {/* 테이블 */}
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '50px' }}>
                        데이터를 불러오는 중입니다...
                    </div>
                ) : (
                    <table
                        style={{
                            width: '100%',
                            borderCollapse: 'collapse',
                            textAlign: 'center',
                            fontSize: '14px'
                        }}
                    >
                        <thead
                            style={{
                                background: '#ecf0f1',
                                borderBottom: '2px solid #bdc3c7',
                                color: '#2c3e50',
                                height: '40px'
                            }}
                        >
                            <tr>
                                <th>USER NAME</th>
                                <th>E-MAIL</th>
                                <th>PHONE-NUMBER</th>
                                <th>ROLE</th>
                                <th>BRANCH</th>
                                <th>AGREE</th>
                                <th>ACTIVE</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.length === 0 ? (
                                <tr>
                                    <td colSpan="7" style={{ padding: '40px', color: '#7f8c8d' }}>
                                        조회된 회원이 없습니다.
                                    </td>
                                </tr>
                            ) : (
                                currentItems.map(user => (
                                    <tr
                                        key={user.userId}
                                        style={{ borderBottom: '1px solid #eee', height: '50px' }}
                                    >
                                        <td>{user.userName}</td>
                                        <td>{user.email}</td>
                                        <td>{user.phoneNumber}</td>
                                        <td style={{ cursor: 'pointer' }} onClick={() => setEditingUserId(`role-${user.userId}`)}>
                                            {editingUserId === `role-${user.userId}` ? (
                                                <select
                                                    value={user.role}
                                                    onChange={(e) => {
                                                        handleRoleChange(user.userId, e.target.value);
                                                        setEditingUserId(null);
                                                    }}
                                                    autoFocus
                                                >
                                                    {ROLE_OPTIONS.map(role => (
                                                        <option key={role} value={role}>
                                                            {role}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                user.role
                                            )}
                                        </td>
                                        {/* <td>{user.brchId}</td> */}
                                        <td style={{ cursor: 'pointer' }} onClick={() => setEditingUserId(user.userId)}>
                                            {editingUserId === user.userId ? (
                                                <select style={{ padding: '4px' }}
                                                    value={user.brchId ?? ''}
                                                    onChange={(e) => {
                                                        handleBranchChange(user.userId, e.target.value);
                                                    }}
                                                    onBlur={() => setEditingUserId(null)}
                                                    autoFocus
                                                >
                                                    {branchList.map(branch => (
                                                        <option key={branch.id} value={branch.id}>
                                                            {branch.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                getBranchName(user.brchId)
                                            )}
                                        </td>
                                        <td>{user.agreeAt}</td>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={user.isActive}
                                                onChange={e =>
                                                    handleIsActiveChange(e, user.userId)
                                                }
                                            />
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Pagination */}
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                >
                    이전
                </button>

                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        style={{
                            margin: '0 4px',
                            fontWeight: currentPage === i + 1 ? 'bold' : 'normal'
                        }}
                    >
                        {i + 1}
                    </button>
                ))}

                <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                >
                    다음
                </button>
            </div>
        </div>
    );
}

export default AdminMemberPage;
