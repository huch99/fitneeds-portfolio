import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function CommunityUserDetail() {
  const { postId } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState('');

  const [alreadyJoined, setAlreadyJoined] = useState(false);
  const [joinUsers, setJoinUsers] = useState([]);

  const loginUserId = localStorage.getItem('userId');

  /* =========================
     게시글 상세 조회
  ========================= */
  const fetchPostDetail = async () => {
    const res = await axios.get(`/api/user/community/${postId}`);
    setPost(res.data);
    setLoading(false);
  };

  /* =========================
     댓글 목록 조회
  ========================= */
  const fetchComments = async () => {
    const res = await axios.get(`/api/user/community/${postId}/comments`);
    setComments(res.data);
  };

  /* =========================
     참여 여부 체크 (작성자 제외)
  ========================= */
  const checkJoined = async () => {
    if (!loginUserId) return;

    const res = await axios.get(
      `/api/user/community/${postId}/join/check`,
      { params: { userId: loginUserId } }
    );

    setAlreadyJoined(res.data.joined === true);
  };

  /* =========================
     신청자 목록 조회 (작성자용)
  ========================= */
  const fetchJoinUsers = async () => {
    const res = await axios.get(
      `/api/user/community/${postId}/join/users`
    );
    setJoinUsers(res.data);
  };

  /* =========================
     댓글 작성
  ========================= */
  const submitComment = async () => {
    if (!commentContent.trim()) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }

    if (!loginUserId) {
      alert('로그인이 필요합니다.');
      return;
    }

    await axios.post(`/api/user/community/${postId}/comments`, {
      content: commentContent,
      writerId: loginUserId,
    });

    setCommentContent('');
    fetchComments();
  };

  /* =========================
     모집 참여 신청
  ========================= */
  const handleApplyRecruit = async () => {
    if (alreadyJoined) return;

    if (!window.confirm('해당 모집에 참여 신청하시겠습니까?')) return;

    await axios.post(`/api/user/community/${postId}/join`, {
      userId: loginUserId,
    });

    alert('참여 신청이 완료되었습니다.');
    setAlreadyJoined(true);
  };

  /* =========================
     초기 로딩
  ========================= */
  useEffect(() => {
    fetchPostDetail();
    fetchComments();
  }, [postId]);

  /* =========================
     post 로딩 후 분기 처리
  ========================= */
  useEffect(() => {
    if (!post || !loginUserId) return;

    const isWriter = String(post.writerId) === String(loginUserId);

    if (isWriter) {
      // 🔥 작성자는 절대 참여 체크 안 함
      setAlreadyJoined(false);
      fetchJoinUsers();
    } else if (post.category === '모집') {
      checkJoined();
    }
  }, [post, loginUserId]);

  if (loading) return <div>로딩 중...</div>;
  if (!post) return <div>게시글을 찾을 수 없습니다.</div>;

  const isRecruitPost = post.category === '모집';
  const isWriter = String(post.writerId) === String(loginUserId);

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
      <button onClick={() => navigate(-1)}>← 목록으로</button>

      <h2>{post.title}</h2>
      <div style={{ fontSize: '13px', color: '#666' }}>
        작성자 {post.writerId} · 작성일 {post.createdAt?.substring(0, 10)}
      </div>

      {/* 모집 정보 */}
      {isRecruitPost && (
        <div
          style={{
            border: '1px solid #f0d27a',
            padding: '15px',
            marginTop: '20px',
            background: '#fffdf5',
            borderRadius: '8px',
          }}
        >
          <p>운동 종목: {post.sportType}</p>
          <p>모집 인원: {post.recruitMax}명</p>
          <p>모집 종료일: {post.recruitEndDate}</p>

          {!isWriter && post.recruitStatus === '모집중' && (
            <>
              <button
                onClick={handleApplyRecruit}
                disabled={alreadyJoined}
                style={{
                  marginTop: '10px',
                  padding: '8px 14px',
                  background: alreadyJoined ? '#e0e0e0' : '#ffd54f',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: alreadyJoined ? 'not-allowed' : 'pointer',
                }}
              >
                {alreadyJoined ? '참여 완료' : '참여 신청하기'}
              </button>

              {alreadyJoined && (
                <p style={{ fontSize: '12px', color: '#888', marginTop: '6px' }}>
                  이미 참여 신청한 모집 글입니다.
                </p>
              )}
            </>
          )}
        </div>
      )}

      {/* 게시글 본문 */}
      <div
        className="community-post-content"
        style={{
          marginTop: '20px',
          padding: '15px',
          border: '1px solid #ddd',
          borderRadius: '6px',
        }}
      >
        {post.content}
      </div>

      {/* 신청자 목록 (작성자만) */}
      {isRecruitPost && isWriter && (
        <div
          style={{
            marginTop: '40px',
            padding: '15px',
            border: '1px solid #eee',
            borderRadius: '6px',
            background: '#fafafa',
          }}
        >
          <h4>참여 신청자 목록</h4>

          {joinUsers.length === 0 ? (
            <p style={{ fontSize: '13px', color: '#888' }}>
              아직 참여 신청자가 없습니다.
            </p>
          ) : (
            <ul style={{ paddingLeft: '20px' }}>
              {joinUsers.map((userId, idx) => (
                <li key={idx}>{userId}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* 댓글 */}
      <h3 style={{ marginTop: '40px' }}>댓글</h3>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {comments.map((c) => (
          <li key={c.commentId} style={{ padding: '10px 0' }}>
            <div>{c.content}</div>
          </li>
        ))}
      </ul>

      <textarea
        value={commentContent}
        onChange={(e) => setCommentContent(e.target.value)}
        rows={3}
        placeholder="댓글을 입력하세요"
        style={{ width: '100%', marginTop: '10px' }}
      />
      <button onClick={submitComment} style={{ marginTop: '10px' }}>
        댓글 작성
      </button>
    </div>
  );
}

export default CommunityUserDetail;
