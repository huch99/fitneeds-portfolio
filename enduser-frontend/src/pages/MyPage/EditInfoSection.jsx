import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const EditInfoSection = () => {
  // Redux에서 로그인한 사용자 정보 가져오기
  const userName = useSelector((state) => state.auth.userName);

  // 나의 정보 수정 상태
  const [userInfo, setUserInfo] = useState({
    name: userName || '',
    email: '',
    phone: '',
    address: ''
  });

  const [userInfoLoading, setUserInfoLoading] = useState(false);

  // userName이 변경될 때 userInfo 업데이트
  useEffect(() => {
    if (userName) {
      setUserInfo(prev => ({
        ...prev,
        name: userName
      }));
    }
  }, [userName]);

  // 사용자 정보 가져오기 (나의 정보 수정 화면 진입 시)
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setUserInfoLoading(true);
        // TODO: 사용자 정보 API 호출
        // const data = await getUserInfo();
        // setUserInfo(data);
      } catch (error) {
        console.error('사용자 정보 조회 실패:', error);
      } finally {
        setUserInfoLoading(false);
      }
    };

    fetchUserInfo();
  }, [userName]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('정보가 수정되었습니다.');
    // 실제로는 API 호출로 정보 수정
  };

  if (userInfoLoading) {
    return (
      <section className="mypage-content-section">
        <h2 className="content-title">나의 정보 수정</h2>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>로딩 중...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mypage-content-section">
      <h2 className="content-title">나의 정보 수정</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">이름</label>
          <input
            type="text"
            id="name"
            name="name"
            value={userInfo.name}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">이메일</label>
          <input
            type="email"
            id="email"
            name="email"
            value={userInfo.email}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label htmlFor="phone">전화번호</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={userInfo.phone}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label htmlFor="address">주소</label>
          <input
            type="text"
            id="address"
            name="address"
            value={userInfo.address}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>
        <button type="submit" className="btn-submit">
          수정하기
        </button>
      </form>
    </section>
  );
};

export default EditInfoSection;
