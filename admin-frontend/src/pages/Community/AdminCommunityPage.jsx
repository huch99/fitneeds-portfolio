import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AdminCommunityPage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.get('/api/admin/community');
      setPosts(res.data);
      console.log('📌 서버에서 내려온 postVisible 정규화: ', res.data);
    } catch (e) {
      alert('커뮤니티 목록 조회 실패');
    }
  };

  const toggleVisible = async (postId, postVisible) => {
    if (!window.confirm('노출 상태를 변경하시겠습니까?')) return;

    try {
      await axios.put(`/api/admin/community/${postId}/visible`, null, {
        params: { postVisible: !postVisible }
      });
      fetchPosts();
    } catch (e) {
      console.error('숨김/보이기 업데이트 실패:', e);
      alert('숨김/보이기 업데이트 실패');
    }
  };

  const deletePost = async (postId) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;

    await axios.delete(`/api/admin/community/${postId}`);
    fetchPosts();
  };

  return (
    <div>
      <h1>커뮤니티 관리</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th><th>제목</th><th>작성자</th><th>조회수</th><th>노출</th><th>관리</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((p) => (
            <tr key={p.postId} style={{ opacity: p.postVisible ? 1 : 0.4 }}>
              <td>{p.postId}</td>
              <td>{p.title}</td>
              <td>{p.writerId}</td>
              <td>{p.views}</td>
              <td>
                <button onClick={() => toggleVisible(p.postId, p.postVisible)}>
                  {p.postVisible ? '숨김' : '보이기'}
                </button>
              </td>
              <td>
                <button style={{ color: 'red' }} onClick={() => deletePost(p.postId)}>삭제</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminCommunityPage;
