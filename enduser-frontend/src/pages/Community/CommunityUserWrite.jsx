import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./CommunityWrite.css";

function CommunityUserWrite() {
  const navigate = useNavigate();

  const [category, setCategory] = useState("자유");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // 모집 전용
  const [sportType, setSportType] = useState("");
  const [recruitMax, setRecruitMax] = useState(2);
  const [recruitEndDate, setRecruitEndDate] = useState("");
  const [guide, setGuide] = useState("");

  /* =========================
     모집 종료일 선택 제한
  ========================= */
  const today = new Date();
  const minDate = today.toISOString().split("T")[0];

  const maxDateObj = new Date();
  maxDateObj.setDate(today.getDate() + 30);
  const maxDate = maxDateObj.toISOString().split("T")[0];

  const submitPost = async () => {
    if (!title || !content) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }

    if (category === "모집" && !recruitEndDate) {
      alert("모집 종료일을 선택해주세요.");
      return;
    }

    const loginUserId = localStorage.getItem("userId");

    if (!loginUserId) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      await axios.post("/api/user/community", {
        postType: "COMMUNITY",
        category,
        title,
        content,

        // 🔥 핵심 수정: 작성자 ID 전달
        writerId: loginUserId,

        // 모집 전용
        sportType: category === "모집" ? sportType : null,
        recruitMax: category === "모집" ? recruitMax : null,
        recruitEndDate: category === "모집" ? recruitEndDate : null
      });

      alert("등록되었습니다.");
      navigate("/community");
    } catch (e) {
      alert("글 등록 실패");
    }
  };

  return (
    <div className="write-container">
      <h2 className="write-title">글쓰기</h2>
      <p className="write-desc">
        커뮤니티에 글을 작성합니다. 모집 선택 시 추가 항목이 나타납니다.
      </p>

      {/* 카테고리 */}
      <div className="write-group">
        <label>카테고리</label>
        <select
          className={`category-select ${category}`}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="모집">모집</option>
          <option value="정보공유">정보공유</option>
          <option value="후기">후기</option>
          <option value="자유">자유</option>
        </select>
      </div>

      {/* 제목 */}
      <div className="write-group">
        <label>제목</label>
        <input
          type="text"
          placeholder="게시글 제목을 입력해주세요."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {/* 내용 */}
      <div className="write-group">
        <label>내용</label>
        <textarea
          rows={6}
          placeholder="내용을 자유롭게 입력해주세요."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      {/* 모집 전용 */}
      {category === "모집" && (
        <div className="recruit-box">
          <h4>모집 글 추가 정보</h4>

          <div className="recruit-grid">
            <input
              type="text"
              placeholder="운동 종목 (예: 풋살, 농구)"
              value={sportType}
              onChange={(e) => setSportType(e.target.value)}
            />

            <div className="people-control">
              <span>필요 인원</span>
              <div>
                <button
                  type="button"
                  onClick={() =>
                    setRecruitMax((prev) => Math.max(1, prev - 1))
                  }
                >
                  -
                </button>
                <strong>{recruitMax}명</strong>
                <button
                  type="button"
                  onClick={() => setRecruitMax((prev) => prev + 1)}
                >
                  +
                </button>
              </div>
            </div>

            <div className="recruit-date">
              <label>모집 종료일 설정</label>
              <input
                type="date"
                value={recruitEndDate}
                min={minDate}
                max={maxDate}
                onChange={(e) => setRecruitEndDate(e.target.value)}
              />
              <p className="recruit-help">
                ※ 모집 시작일은 게시글 등록 시점으로 자동 설정되며,
                종료일은 최대 30일까지만 선택할 수 있습니다.
              </p>
            </div>
          </div>

          <textarea
            rows={3}
            placeholder="참여 시 유의사항, 준비물 등을 적어주세요."
            value={guide}
            onChange={(e) => setGuide(e.target.value)}
          />
        </div>
      )}

      <div className="write-actions">
        <button onClick={() => navigate(-1)}>목록으로</button>
        <button className="submit-btn" onClick={submitPost}>
          등록하기
        </button>
      </div>
    </div>
  );
}

export default CommunityUserWrite;
