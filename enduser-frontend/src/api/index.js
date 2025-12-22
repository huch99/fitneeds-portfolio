// src/api/index.js
import axios from 'axios';
import { ACCESS_TOKEN_KEY, USER_ID_KEY } from '../store/authSlice';

/**
 * API 인스턴스 설정
 * 
 * 모든 API 호출은 이 인스턴스를 통해 이루어지며,
 * 요청 인터셉터가 자동으로 localStorage에서 인증 토큰을 가져와 헤더에 추가합니다.
 * 
 * 각 API 파일(reservation.js, payment.js, review.js 등)에서는
 * 이 인스턴스를 import하여 사용하면 됩니다.
 * 별도로 토큰을 가져오거나 헤더에 추가할 필요가 없습니다.
 */

// 개발 환경에서는 Vite proxy를 사용하므로 baseURL을 빈 문자열로 설정
// 프로덕션 환경에서는 환경 변수에서 가져옴
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || '',
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * 요청 인터셉터
 * 
 * 모든 API 요청 전에 자동으로 실행됩니다.
 * localStorage에서 인증 토큰을 가져와 Authorization 헤더에 추가합니다.
 * 
 * 각 API 파일에서 토큰을 직접 가져올 필요가 없습니다.
 * 이 인터셉터가 자동으로 처리합니다.
 */
api.interceptors.request.use(
    (config) => {
        // localStorage에서 토큰과 사용자 정보 가져오기
        // 모든 API 호출에서 자동으로 토큰과 userId가 포함됩니다
        const token = localStorage.getItem(ACCESS_TOKEN_KEY);
        const userId = localStorage.getItem(USER_ID_KEY);

        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        } else {
            // 토큰이 없는 경우 경고 (선택적)
            // 로그인하지 않은 상태에서 API 호출 시도 시
            console.warn('인증 토큰이 없습니다. 로그인이 필요할 수 있습니다.');
        }

        // localStorage에서 가져온 userId를 헤더에 추가
        // 백엔드에서 SecurityContext 대신 이 헤더를 사용합니다
        if (userId) {
            config.headers['X-User-Id'] = userId;
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/**
 * 응답 인터셉터
 * 
 * API 응답을 가로채서 에러를 처리합니다.
 * 401 Unauthorized 에러 발생 시 localStorage에서 토큰을 제거합니다.
 */
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            // 인증 실패 시 localStorage에서 토큰 제거
            localStorage.removeItem(ACCESS_TOKEN_KEY);
            console.log('401 Unauthorized. Access token removed from localStorage.');
            
            // 필요시 로그인 페이지로 리디렉션
            // window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;