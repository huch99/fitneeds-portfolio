import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import AdminLayout from '../components/AdminLayout'; // 중복 사이드바 원인 제거

function AdminTicketPage() {
    // ================= State =================
    const [allTickets, setAllTickets] = useState([]);   // 전체 이용권 (회원 보유)
    const [pendingList, setPendingList] = useState([]); // 무통장 입금 대기
    const [isLoading, setIsLoading] = useState(false);

    // ================= Lifecycle =================
    useEffect(() => {
        fetchAllTickets();      
        fetchPendingPayments(); 
    }, []);

    // ================= API Service =================
    
    // 1. [Real] 전체 회원 이용권 조회
    // Backend: AdminController.getAllMemberTickets() -> GET /api/admin/member-tickets
    const fetchAllTickets = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('/api/admin/member-tickets');
            setAllTickets(response.data);
            console.log("전체 이용권 로드 완료:", response.data);
        } catch (error) {
            console.error("이용권 목록 로드 실패", error);
            alert("이용권 목록을 불러오지 못했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    // 2. [Real] 무통장 입금 대기 조회
    const fetchPendingPayments = async () => {
        try {
            const response = await axios.get('/api/admin/payments/pending');
            setPendingList(response.data);
        } catch (error) {
            console.error("대기 목록 로드 실패", error);
        }
    };

    // 3. 입금 승인 처리
    const handleConfirm = async (paymentId) => {
        if (!window.confirm("입금을 승인하시겠습니까?")) return;
        try {
            await axios.post(`/api/admin/payments/${paymentId}/confirm`);
            alert("승인 완료되었습니다.");
            fetchPendingPayments(); // 대기 목록 갱신
            fetchAllTickets();      // 전체 목록도 갱신 (새로 발급되었을 테니까요)
        } catch (error) {
            alert("승인 실패: " + (error.response?.data?.message || "오류 발생"));
        }
    };

    // ================= View =================
    // 주의: 여기서 <AdminLayout>을 또 쓰면 사이드바가 두 개 나옵니다.
    // 만약 사이드바가 사라졌다면, 다시 <AdminLayout>으로 감싸주세요.
    return (
        <div className="container-fluid" style={{ padding: '20px' }}> 
            <h1>[관리자] 이용권 관리</h1>

            {/* --- 섹션 1: 전체 이용권 목록 (DB 연동됨) --- */}
            <div className="content-box" style={{ background: '#fff', padding: '20px', borderRadius: '8px', marginBottom: '40px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                    <h3>🎫 회원 보유 이용권 전체 조회</h3>
                    <button onClick={fetchAllTickets} style={{ cursor: 'pointer', padding: '5px 10px' }}>🔄 새로고침</button>
                </div>
                
                {isLoading ? (
                    <div style={{ textAlign: 'center', padding: '20px' }}>데이터 로딩중...</div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                        <thead style={{ background: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                            <tr style={{ height: '40px' }}>
                                <th>ID</th>
                                <th>회원명 (Email)</th>
                                <th>상품명</th>
                                <th>잔여량</th>
                                <th>유효기간</th>
                                <th>상태</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allTickets.length === 0 ? (
                                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '30px' }}>데이터가 없습니다.</td></tr>
                            ) : (
                                allTickets.map(ticket => (
                                    <tr key={ticket.ticketId} style={{ borderBottom: '1px solid #eee', textAlign: 'center', height: '45px' }}>
                                        {/* Java DTO: MemberTicketAdminResponse 필드 매핑 */}
                                        <td style={{ color: '#888' }}>{ticket.ticketId}</td>
                                        
                                        <td style={{ textAlign: 'left', paddingLeft: '20px' }}>
                                            <strong>{ticket.memberName}</strong><br/>
                                            <span style={{ fontSize: '12px', color: '#6c757d' }}>{ticket.memberEmail}</span>
                                        </td>
                                        
                                        <td>{ticket.productName}</td>
                                        
                                        {/* 횟수권이면 잔여횟수, 기간권이면 '기간제' 표시 로직 */}
                                        <td style={{ color: '#007bff', fontWeight: 'bold' }}>
                                            {ticket.remainingCount > 0 
                                                ? `${ticket.remainingCount}회` 
                                                : '-'}
                                        </td>
                                        
                                        <td style={{ fontSize: '13px' }}>
                                            {ticket.startDate} ~ {ticket.endDate}
                                        </td>

                                        <td>
                                            <span style={{ 
                                                padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '600',
                                                backgroundColor: ticket.status === 'ACTIVE' ? '#d4edda' : '#f8d7da',
                                                color: ticket.status === 'ACTIVE' ? '#155724' : '#721c24'
                                            }}>
                                                {ticket.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* --- 섹션 2: 무통장 입금 승인 대기 --- */}
            <div className="content-box" style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '2px solid #ffc107' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <h3 style={{ margin: 0 }}>🏦 무통장 입금 승인 대기</h3>
                    <button onClick={fetchPendingPayments} style={{ fontSize: '12px', cursor: 'pointer' }}>새로고침</button>
                </div>
                
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ background: '#fff3cd' }}>
                        <tr style={{ height: '35px' }}>
                            <th>요청일시</th>
                            <th>주문번호</th>
                            <th>회원명</th>
                            <th>상품명</th>
                            <th>입금액</th>
                            <th>승인</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pendingList.length === 0 ? (
                            <tr><td colSpan="6" style={{ textAlign: 'center', padding: '20px', color: '#856404' }}>승인 대기 중인 건이 없습니다.</td></tr>
                        ) : (
                            pendingList.map(pay => (
                                <tr key={pay.paymentId} style={{ borderBottom: '1px solid #ddd', textAlign: 'center', background: '#fff', height: '40px' }}>
                                    <td>{pay.createdAt ? pay.createdAt.replace('T', ' ') : '-'}</td>
                                    <td>{pay.orderNo}</td>
                                    <td>{pay.memberName}</td>
                                    <td>{pay.productName}</td>
                                    <td style={{ fontWeight: 'bold' }}>{pay.amount.toLocaleString()}원</td>
                                    <td>
                                        <button 
                                            onClick={() => handleConfirm(pay.paymentId)}
                                            style={{ 
                                                backgroundColor: '#28a745', color: 'white', border: 'none', 
                                                padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' 
                                            }}
                                        >
                                            승인
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminTicketPage;