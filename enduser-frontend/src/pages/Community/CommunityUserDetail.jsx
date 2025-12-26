import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function CommunityUserDetail() {
  const { postId } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState("");

  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingContent, setEditingContent] = useState("");

  const [alreadyJoined, setAlreadyJoined] = useState(false);
  const [joinUsers, setJoinUsers] = useState([]);

  const loginUserId = localStorage.getItem("userId");

  /* =========================
     데이터 조회
  ========================= */
  const fetchPostDetail = async () => {
    const res = await axios.get(`/api/user/community/${postId}`);
    setPost(res.data);
    setLoading(false);
  };

  const fetchComments = async () => {
    const res = await axios.get(`/api/user/community/${postId}/comments`);
    setComments(res.data);
  };

  useEffect(() => {
    setLoading(true);
    fetchPostDetail();
    fetchComments();
  }, [postId]);

  if (loading) return <div>로딩 중...</div>;
  if (!post) return <div>게시글을 찾을 수 없습니다.</div>;

  const isWriter = String(post.writerId) === String(loginUserId);
  const isRecruitPost = post.category === "모집";
  const isRecruitClosed = post.recruitStatus === "모집종료";

  return (
    <div className="community-detail-page">
      <button
        className="community-action-btn"
        onClick={() => navigate(-1)}
      >
        ← 목록으로
      </button>

      {/* =========================
          게시글 카드
      ========================= */}
      <div className="community-card post-card">
        <h2 className="post-title">{post.title}</h2>

        <div className="post-meta">
          <span>
            작성자 {post.writerId} · {post.createdAt?.substring(0, 10)}
          </span>

          {isWriter && (
            <div>
              <button
                className="community-action-btn"
                onClick={() => navigate(`/community/write?edit=${post.postId}`)}
              >
                수정
              </button>
              <button
                className="community-action-btn delete"
                onClick={async () => {
                  if (!window.confirm("게시글을 삭제하시겠습니까?")) return;
                  await axios.delete(`/api/user/community/${post.postId}`, {
                    params: { userId: loginUserId },
                  });
                  navigate("/community");
                }}
              >
                삭제
              </button>
            </div>
          )}
        </div>

        <div className="post-content">
          {post.content}
        </div>
      </div>

      {/* =========================
          댓글 작성 카드
      ========================= */}
      <div className="community-card comment-write-card">
        <h3>댓글 작성</h3>
        <textarea
          className="comment-textarea"
          value={commentContent}
          onChange={(e) => setCommentContent(e.target.value)}
          placeholder="댓글을 입력하세요"
        />
        <button
          className="comment-submit-btn"
          onClick={async () => {
            if (!commentContent.trim()) return alert("댓글 내용을 입력해주세요.");
            await axios.post(`/api/user/community/${postId}/comments`, {
              content: commentContent,
              writerId: loginUserId,
            });
            setCommentContent("");
            fetchComments();
          }}
        >
          댓글 작성
        </button>
      </div>

      {/* =========================
          댓글 목록 카드
      ========================= */}
      <div className="community-card comment-list-card">
        <h3>댓글</h3>

        {comments.length === 0 && (
          <p style={{ color: "#999" }}>아직 댓글이 없습니다.</p>
        )}

        {comments.map((c) => {
          const isMy = String(c.writerId) === String(loginUserId);
          const editing = editingCommentId === c.commentId;

          return (
            <div key={c.commentId} className="comment-item">
              <div className="comment-meta">
                <strong>{c.writerId}</strong>

                {isMy && !editing && (
                  <>
                    <button
                      className="community-action-btn"
                      onClick={() => {
                        setEditingCommentId(c.commentId);
                        setEditingContent(c.content);
                      }}
                    >
                      수정
                    </button>
                    <button
                      className="community-action-btn delete"
                      onClick={async () => {
                        if (!window.confirm("댓글을 삭제하시겠습니까?")) return;
                        await axios.delete(`/api/community/comments/${c.commentId}`, {
                          data: { userId: loginUserId },
                        });
                        fetchComments();
                      }}
                    >
                      삭제
                    </button>
                  </>
                )}
              </div>

              {editing ? (
                <>
                  <textarea
                    className="comment-textarea"
                    value={editingContent}
                    onChange={(e) => setEditingContent(e.target.value)}
                  />
                  <button
                    className="community-action-btn"
                    onClick={async () => {
                      await axios.put(`/api/community/comments/${c.commentId}`, {
                        userId: loginUserId,
                        content: editingContent,
                      });
                      setEditingCommentId(null);
                      setEditingContent("");
                      fetchComments();
                    }}
                  >
                    저장
                  </button>
                  <button
                    className="community-action-btn delete"
                    onClick={() => setEditingCommentId(null)}
                  >
                    취소
                  </button>
                </>
              ) : (
                <p className="community-post-content">{c.content}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CommunityUserDetail;
