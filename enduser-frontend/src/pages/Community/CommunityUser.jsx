import React, { useEffect, useState } from 'react';
import axios from 'axios';

function CommunityUser() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const res = await axios.get('/api/user/community');
      setPosts(res.data);
    } catch (e) {
      alert('커뮤니티 목록 조회 실패');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>커뮤니티</h2>

      {posts.length === 0 && (
        <p>표시할 게시글이 없습니다.</p>
      )}

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {posts.map((post) => (
          <li
            key={post.postId}
            style={{
              border: '1px solid #ddd',
              padding: '12px',
              marginBottom: '10px',
              borderRadius: '6px'
            }}
          >
            <h4 style={{ margin: '0 0 5px 0' }}>{post.title}</h4>
            <div style={{ fontSize: '14px', color: '#666' }}>
              조회수 {post.views}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CommunityUser;
