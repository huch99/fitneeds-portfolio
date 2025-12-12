import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function AdminCommunityDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // 게시글 Mock 데이터
  const post = {
    id,
    category: '모집',
    title: '주말 풋살 팀원 추가 모집합니다',
    writer: '송민수',
    date: '2024-03-19',
    views: 214,
    content: '주말 오전 10시에 함께 풋살 하실 분을 모집합니다!'
  };

  // 댓글 Mock 데이터
  const [comments, setComments] = useState([
    { id: 1, writer: 'user01', content: '참여하고 싶어요!', date: '2024-03-19', visible: true },
    { id: 2, writer: 'user99', content: '위치가 어디인가요?', date: '2024-03-19', visible: true },
    { id: 3, writer: 'toxicUser', content: '이딴 글 올리지마라', date: '2024-03-20', visible: false }
  ]);

  // 숨김 토글
  const toggleVisible = (commentId) => {
    setComments(
      comments.map((c) =>
        c.id === commentId ? { ...c, visible: !c.visible } : c
      )
    );
  };

  // 삭제 기능
  const deleteComment = (commentId) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    setComments(comments.filter(c => c.id !== commentId));
  };

  return (
    <>
      <button onClick={() => navigate(-1)} style={{ marginBottom: '15px' }}>
        ← 목록으로
      </button>

      <h2 style={{ marginBottom: '10px' }}>{post.title}</h2>

      <div style={{ marginBottom: '20px', color: '#777' }}>
        <div>카테고리: {post.category}</div>
        <div>작성자: {post.writer}</div>
        <div>작성일: {post.date}</div>
        <div>조회수: {post.views}</div>
      </div>

      <div style={{ padding: '15px', background: '#f8f8f8', marginBottom: '30px' }}>
        {post.content}
      </div>

      <h3>댓글 ({comments.length})</h3>

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>작성자</th>
            <th>내용</th>
            <th>작성일</th>
            <th>노출</th>
            <th>관리</th>
          </tr>
        </thead>

        <tbody>
          {comments.map((c) => (
            <tr key={c.id} style={{ opacity: c.visible ? 1 : 0.4 }}>
              <td>{c.id}</td>
              <td>{c.writer}</td>
              <td>{c.content}</td>
              <td>{c.date}</td>

              <td>
                <button onClick={() => toggleVisible(c.id)}>
                  {c.visible ? "숨김" : "보이기"}
                </button>
              </td>

              <td>
                <button style={{ color: 'red' }} onClick={() => deleteComment(c.id)}>
                  삭제
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default AdminCommunityDetailPage;
