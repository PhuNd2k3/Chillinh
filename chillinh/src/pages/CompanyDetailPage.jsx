import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./CompanyDetailPage.css";
import Header from "../components/Header/Header";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { addCompanyComment, replyToCompanyComment } from "./../api/commentAPI";
import {
  MdLocationOn,
  MdAccessTime,
  MdAttachMoney,
  MdCalendarToday,
} from "react-icons/md";
dayjs.extend(relativeTime);
import API_BASE_URL from "./../api/config";

const API_URL = `${API_BASE_URL}/companies`;

function getInitial(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function timeAgo(date) {
  if (!date) return "";
  return dayjs(date).fromNow();
}

function CompanyDetailPage() {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [replyBox, setReplyBox] = useState({});
  const [replyingTo, setReplyingTo] = useState(null);

  useEffect(() => {
    axios
      .get(`${API_URL}/${id}`)

      .then((res) => {
        setCompany(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Không tìm thấy công ty");
        setLoading(false);
      });
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    const newReview = {
      id: `review${Date.now()}`,
      user: "Bạn",
      rating: 5,
      content: comment,
      date: new Date().toISOString(),
      replies: [],
    };
    const reviews = await addCompanyComment(id, newReview);
    setCompany({ ...company, reviews });
    setComment("");
  };

  const handleReplyChange = (reviewId, value) => {
    setReplyBox((prev) => ({ ...prev, [reviewId]: value }));
  };

  const handleReplySubmit = async (reviewId) => {
    if (!replyBox[reviewId] || !replyBox[reviewId].trim()) return;
    const replyObj = {
      id: `reply${Date.now()}`,
      user: "Bạn",
      content: replyBox[reviewId],
      date: new Date().toISOString(),
    };
    const reviews = await replyToCompanyComment(id, reviewId, replyObj);
    setCompany({ ...company, reviews });
    setReplyBox((prev) => ({ ...prev, [reviewId]: "" }));
    setReplyingTo(null);
  };

  const handleReplyClick = (reviewId, replyUser, replyId) => {
    setReplyingTo({ reviewId, replyId });
    setReplyBox((prev) => ({
      ...prev,
      [reviewId]: replyUser ? `@${replyUser} ` : "",
    }));
  };

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>{error}</div>;
  if (!company) return null;

  return (
    <>
      <Header />
      <div className="bg"></div>
      <div className="companyCard">
        <img className="companyLogo" src={"/pictures/misa.png"} alt="logo" />
        <div className="companyMainInfo">
          <div className="companyName">{company.name}</div>
          <div className="companyDesc">{company.description}</div>
          <div className="companyMetaRow">
            <div className="companyMetaCol">
              <div>
                <b>Trang web</b>
              </div>
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
              >
                {company.website}
              </a>
            </div>
            <div className="companyMetaCol">
              <div>
                <b>Địa điểm</b>
              </div>
              <div>{company.address}</div>
            </div>
            <div className="companyMetaCol">
              <div>
                <b>Quy mô công ty</b>
              </div>
              <div>{company.employees}</div>
            </div>
            <div className="companyMetaCol">
              <div>
                <b>Lĩnh vực</b>
              </div>
              <div>{company.industry}</div>
            </div>
          </div>
        </div>
        <button className="followBtn">+ Theo dõi công ty</button>
      </div>
      <div className="container">
        <div className="sectionTitle">Giới thiệu</div>
        <div>{company.about}</div>
        <div className="sectionTitle">Công việc</div>
        {company.jobs &&
          company.jobs.map((job) => (
            <div key={job.id} className="jobCard">
              <div className="jobLogoWrap">
                <img className="jobLogo" src="/pictures/misa.png" alt="logo" />
              </div>
              <div className="jobInfo">
                <div className="jobCompany">{company.name}</div>
                <div className="jobTitleRow">
                  <span className="jobTitle">{job.title}</span>
                  <span className="badgeNew">Mới</span>
                </div>
                <div className="jobMeta">
                  <span>
                    <span className="jobMetaIcon">
                      <MdLocationOn />
                    </span>
                    {job.location}
                  </span>
                  <span className="jobMetaDot">·</span>
                  <span>
                    <span className="jobMetaIcon">
                      <MdAccessTime />
                    </span>
                    {job.type}
                  </span>
                  <span className="jobMetaDot">·</span>
                  <span>
                    <span className="jobMetaIcon">
                      <MdAttachMoney />
                    </span>
                    {job.salary}
                  </span>
                  <span className="jobMetaDot">·</span>
                  <span>
                    <span className="jobMetaIcon">
                      <MdCalendarToday />
                    </span>
                    {timeAgo(job.posted)}
                  </span>
                </div>
                <div className="jobDesc">{job.description}</div>
              </div>
            </div>
          ))}
        <div className="sectionTitle">Đánh giá</div>
        <div className="reviewHeaderBar">
          <div style={{ display: "flex", alignItems: "center" }}>
            <span className="reviewScore">{company.rating}</span>
            <span className="reviewStars">
              {"★".repeat(Math.round(company.rating))}
              {"☆".repeat(5 - Math.round(company.rating))}
            </span>
          </div>
          <div className="reviewFilterBar">
            <button className="reviewFilterBtn selected">
              Xem các đánh giá có gắn thẻ công ty
            </button>
            <button className="reviewFilterBtn">5 sao</button>
            <button className="reviewFilterBtn">4 sao</button>
            <button className="reviewFilterBtn">3 sao</button>
            <button className="reviewFilterBtn">2 sao</button>
            <button className="reviewFilterBtn">1 sao</button>
          </div>
          <div
            style={{ fontStyle: "italic", color: "#222", fontSize: "1.05rem" }}
          >
            Dựa trên {company.ratingCount} đánh giá
          </div>
        </div>
        <form
          onSubmit={handleCommentSubmit}
          className="form"
          style={{ marginBottom: 24 }}
        >
          <h4>Viết đánh giá</h4>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            className="textarea"
            placeholder="Nhập đánh giá..."
          />
          <button type="submit" className="button">
            Đăng
          </button>
        </form>
        {company.reviews &&
          company.reviews.map((review) => (
            <div key={review.id} className="reviewCard">
              <div className="reviewAvatar">
                {review.avatar ? (
                  <img
                    src={review.avatar}
                    alt="avatar"
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                    }}
                  />
                ) : (
                  review.user[0]
                )}
              </div>
              <div className="reviewMain">
                <div className="reviewUserRow">
                  <span className="reviewUserName">{review.user}</span>
                  <span className="reviewStarsRow">
                    {"★".repeat(review.rating)}
                    {"☆".repeat(5 - review.rating)}
                  </span>
                  <span className="reviewTime">{timeAgo(review.date)}</span>
                </div>
                <div className="reviewContent">{review.content}</div>
                {review.replies && review.replies.length > 0 && (
                  <div className="reviewReplyList">
                    {review.replies.map((reply) => (
                      <div key={reply.id} className="reviewReplyCard">
                        <div className="reviewReplyAvatar">
                          {reply.avatar ? (
                            <img
                              src={reply.avatar}
                              alt="avatar"
                              style={{
                                width: "100%",
                                height: "100%",
                                borderRadius: "50%",
                              }}
                            />
                          ) : (
                            reply.user[0]
                          )}
                        </div>
                        <div className="reviewReplyMain">
                          <div className="reviewReplyUserRow">
                            <span className="reviewReplyUserName">
                              {reply.user}
                            </span>
                            <span className="reviewReplyTime">
                              {timeAgo(reply.date)}
                            </span>
                          </div>
                          <div className="reviewReplyContent">
                            {reply.content}
                          </div>
                          <div style={{ marginTop: 6 }}>
                            {replyingTo &&
                            replyingTo.reviewId === review.id &&
                            replyingTo.replyId === reply.id ? (
                              <div
                                style={{
                                  display: "flex",
                                  gap: 8,
                                  alignItems: "center",
                                }}
                              >
                                <input
                                  type="text"
                                  value={replyBox[review.id] || ""}
                                  onChange={(e) =>
                                    handleReplyChange(review.id, e.target.value)
                                  }
                                  placeholder={`Trả lời @${reply.user}...`}
                                  style={{
                                    flex: 1,
                                    padding: "7px 12px",
                                    borderRadius: 6,
                                    border: "1.2px solid #cfd8dc",
                                    fontSize: "1rem",
                                  }}
                                />
                                <button
                                  onClick={() => handleReplySubmit(review.id)}
                                  style={{
                                    background: "#1976d2",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: 6,
                                    padding: "7px 18px",
                                    fontWeight: 600,
                                    cursor: "pointer",
                                  }}
                                >
                                  Gửi
                                </button>
                                <button
                                  onClick={() => setReplyingTo(null)}
                                  style={{
                                    background: "none",
                                    color: "#888",
                                    border: "none",
                                    fontWeight: 500,
                                    cursor: "pointer",
                                  }}
                                >
                                  Huỷ
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() =>
                                  handleReplyClick(
                                    review.id,
                                    reply.user,
                                    reply.id
                                  )
                                }
                                style={{
                                  background: "none",
                                  color: "#1976d2",
                                  border: "none",
                                  fontWeight: 500,
                                  cursor: "pointer",
                                  marginTop: 2,
                                }}
                              >
                                Trả lời
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div style={{ marginTop: 10 }}>
                  {replyingTo &&
                  replyingTo.reviewId === review.id &&
                  !replyingTo.replyId ? (
                    <div
                      style={{ display: "flex", gap: 8, alignItems: "center" }}
                    >
                      <input
                        type="text"
                        value={replyBox[review.id] || ""}
                        onChange={(e) =>
                          handleReplyChange(review.id, e.target.value)
                        }
                        placeholder="Nhập trả lời..."
                        style={{
                          flex: 1,
                          padding: "7px 12px",
                          borderRadius: 6,
                          border: "1.2px solid #cfd8dc",
                          fontSize: "1rem",
                        }}
                      />
                      <button
                        onClick={() => handleReplySubmit(review.id)}
                        style={{
                          background: "#1976d2",
                          color: "#fff",
                          border: "none",
                          borderRadius: 6,
                          padding: "7px 18px",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        Gửi
                      </button>
                      <button
                        onClick={() => setReplyingTo(null)}
                        style={{
                          background: "none",
                          color: "#888",
                          border: "none",
                          fontWeight: 500,
                          cursor: "pointer",
                        }}
                      >
                        Huỷ
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleReplyClick(review.id, null, null)}
                      style={{
                        background: "none",
                        color: "#1976d2",
                        border: "none",
                        fontWeight: 500,
                        cursor: "pointer",
                        marginTop: 2,
                      }}
                    >
                      Trả lời
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
      </div>
    </>
  );
}

export default CompanyDetailPage;
