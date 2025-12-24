// src/components/auth/RegisterModal.jsx
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import api from '../../api';
import './modalStyles.css';

function RegisterModal({ isOpen, onClose }) {
    // ⭐⭐ 모든 훅 호출은 여기에! (조건부 렌더링보다 먼저) ⭐⭐
    const { isAuthenticated } = useSelector((state) => state.auth); // 훅1
    const currentLoggedInUserId = useSelector((state) => state.auth.userId);
    const [userId, setUserId] = useState(''); // 모달 내에서 입력받는 userId
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    const [cashPoint, setCashPoint] = useState('');
    const [gradePoint, setGradePoint] = useState('');
    const [agreeAt, setAgreeAt] = useState('');

    const [phoneNumber, setPhoneNumber] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch(); // 액션을 디스패치할 때 필요 (예: 로그인 후 상태 업데이트)

    // useEffect 훅도 여기에 선언되어야 합니다.
    useEffect(() => {
        // isAuthenticated가 true이고, 모달이 열려있을 때만 getUserInfo를 호출하는 조건은
        // 이펙트 내부에서 제어합니다.

        if (isOpen && isAuthenticated) { // ⭐ isOpen도 이펙트 의존성으로 추가해야 합니다.
            // 만약 `getUserInfo`가 로그인된 사용자의 정보를 가져오는 것이라면,
            // `userId`는 Redux 스토어(currentLoggedInUserId)에서 가져와야 합니다.
            // 지금 코드에서는 모달 내부의 `userId` state를 보내고 있습니다.
            // 의도가 명확하다면 그대로 사용하고, 아니라면 로그인된 userId를 넘겨야 합니다.
            getUserInfo();
        }
        // 모달이 닫힐 때 상태를 초기화하고 싶다면 여기에 클린업 함수를 추가할 수 있습니다.
        return () => {
            setMessage('');
            setIsLoading(false);
            // 필요한 다른 상태 초기화
        };
    }, [isOpen, isAuthenticated, userId]);

    if (!isOpen) {
        if (userId !== '') setUserId('');
        if (userName !== '') setUserName('');
        if (password !== '') setPassword('');
        if (email !== '') setEmail('');
        if (phoneNumber !== '') setPhoneNumber('');
        if (message !== '') setMessage('');
        if (isLoading !== false) setIsLoading(false);
        return null;
    }

    const getUserInfo = async (e) => {
        setIsLoading(true);
        try {

            // 로그인된 사용자의 정보를 요청할 때는 Redux에서 가져온 loggedInUserId를 사용
            const response = await api.get('/user/userinfo', {
                params: { userId: currentLoggedInUserId }
            });

            console.log('User Info Response:', response.data);

            // 가져온 정보를 모달 상태에 채우기
            setUserId(response.data.userId || ''); // userId는 read-only로 둘 수도 있습니다.
            setUserName(response.data.userName || '');
            setEmail(response.data.email || '');
            setPhoneNumber(response.data.phoneNumber || '');
            setCashPoint(response.data.cashPoint || '');
            setGradePoint(response.data.gradePoint || '');
            setAgreeAt(response.data.agreeAt || '');
            // password는 보안상 채우지 않는 것이 일반적입니다.
        } catch (error) {
            setMessage(error.response?.data?.message || '정보 가져오기 실패');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');
        try {
            if (isAuthenticated) {
                handleUpdateSubmit(e);
                return;
            }

            const response = await api.post('/user/register', { userId, userName, password, email });
            setMessage(response.data.message || '회원가입 성공!');
            alert('회원가입이 완료되었습니다. 로그인해주세요.');
            onClose();

            setUserId('');
            setUserName('');
            setPassword('');
            setEmail('');

        } catch (error) {
            setMessage(error.response?.data?.message || '회원가입 실패');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault(); // 폼 기본 동작 방지
        alert('정보수정');
        setIsLoading(true);
        setMessage('');
        try {
            // 정보 수정 로직 (예시)
            // 로그인된 사용자의 ID를 기반으로 업데이트 (Redux 상태 사용 권장)
            // const response = await api.post('/user/update', { currentLoggedInUserId, userName, password, email, phoneNumber });
            // setMessage(response.data.message || '정보 수정 성공!');
            // alert('정보 수정이 완료되었습니다.');
            onClose();
        } catch (error) {
            setMessage(error.response?.data?.message || '정보 수정 실패');
        } finally {
            setIsLoading(false);
        }
    };

    // 렌더링 부분
    return (
        <>
            <div className="modal-overlay" onClick={onClose}></div>
            <div className="modal-content">
                <h2 style={{ marginBottom: '20px', color: 'black' }}>{isAuthenticated ? '내 정보' : '회원가입'}</h2>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {/* <input
                        type="text"
                        placeholder="아이디"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        className="modal-input"
                        autoComplete="current-password"
                    /> */}
                    <input
                        type="text"
                        placeholder="이름"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="modal-input"
                        autoComplete="current-username"
                    />
                    <input
                        type="password"
                        placeholder="비밀번호"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="modal-input"
                        autoComplete="current-password"
                    />

                    <input
                        type="email"
                        placeholder="이메일"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="modal-input"
                        autoComplete="current-email"
                    />
                    <input
                        type="tel"
                        placeholder="전화번호"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="modal-input"
                        autoComplete="tel-national"
                    />

                    {isAuthenticated ?
                        <>{/* '비 로그인' */}
                            <input
                                type="number"
                                placeholder="cashPoint"
                                value={cashPoint}
                                onChange={(e) => setCashPoint(e.target.value)}
                                className="modal-input"
                            />
                            <input
                                type="number"
                                placeholder="gradePoint"
                                value={gradePoint}
                                onChange={(e) => setGradePoint(e.target.value)}
                                className="modal-input"
                            />
                            <input
                                type="boolean"
                                placeholder="개인정보 사용동의"
                                value={agreeAt}
                                onChange={(e) => setAgreeAt(e.target.value)}
                                className="modal-input"
                            />
                        </>
                        :
                        <>{/* '비 로그인' */}

                        </>}

                    {message && <p style={{ color: message.includes('실패') ? 'red' : 'green', fontSize: '14px' }}>{message}</p>}
                    <button type="submit" disabled={isLoading} className="modal-button-register">
                        {isAuthenticated ? '정보수정' : '회원가입'}
                    </button>
                </form>
                <button onClick={onClose} className="modal-close-button">X</button>
            </div >
        </>
    );
}

export default RegisterModal;