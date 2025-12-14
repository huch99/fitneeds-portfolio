import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function CommunityUserDetail() {
  const { postId } = useParams();
  const navigate = useNavigate();

  // 게시글
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  // 댓글
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState('');

  /* =========================
     게시글 상세 조회
  ========================= */
  const fetchPostDetail = async () => {
    try {
      const res = await axios.get(`/api/user/community/${postId}`);
      setPost(res.data);
    } catch (e) {
      alert('게시글 조회 실패');
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     댓글 목록 조회
  ========================= */
  const fetchComments = async () => {
    try {
      const res = await axios.get(`/api/user/community/${postId}/comments`);
      setComments(res.data);
    } catch (e) {
      alert('댓글 조회 실패');
    }
  };

  /* =========================
     댓글 작성
  ========================= */
  const submitComment = async () => {
    if (!commentContent.trim()) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }

    try {
      await axios.post(`/api/user/community/${postId}/comments`, {
        content: commentContent
      });
      setCommentContent('');
      fetchComments();
    } catch (e) {
      alert('댓글 작성 실패');
    }
  };

  useEffect(() => {
    fetchPostDetail();
    fetchComments();
  }, [postId]);

  if (loading) return <div>로딩 중...</div>;
  if (!post) return <div>게시글을 찾을 수 없습니다.</div>;

  return (
    <div style={{ padding: '20px' }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: '15px' }}>
        ← 목록으로
      </button>

      <h2>{post.title}</h2>

      <div style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>
        조회수 {post.views}
      </div>

      <div
        style={{
          padding: '15px',
          border: '1px solid #ddd',
          borderRadius: '6px',
          marginBottom: '30px'
        }}
      >
        {post.content}
      </div>

      {/* 댓글 영역 */}
      <h3>댓글</h3>

      {comments.length === 0 && (
        <p style={{ color: '#777' }}>아직 댓글이 없습니다.</p>
      )}

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {comments.map((c) => (
          <li
            key={c.commentId}
            style={{
              borderBottom: '1px solid #eee',
              padding: '10px 0'
            }}
          >
            <div style={{ fontSize: '14px' }}>{c.content}</div>
            <div style={{ fontSize: '12px', color: '#999' }}>
              {c.createdAt}
            </div>
          </li>
        ))}
      </ul>

      {/* 댓글 작성 */}
      <div style={{ marginTop: '20px' }}>
        <textarea
          value={commentContent}
          onChange={(e) => setCommentContent(e.target.value)}
          rows={3}
          placeholder="댓글을 입력하세요"
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '4px',
            border: '1px solid #ccc'
          }}
        />
        <button
          onClick={submitComment}
          style={{ marginTop: '10px', padding: '8px 16px' }}
        >
          댓글 작성
        </button>
      </div>
    </div>
  );
}

export default CommunityUserDetail;
