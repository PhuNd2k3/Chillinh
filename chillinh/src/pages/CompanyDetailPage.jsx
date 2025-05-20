import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./CompanyDetailPage.css";
import Header from "../components/Header/Header";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { addCompanyComment, getCompanyReviews, replyToCompanyComment, voteForReview } from "./../api/commentAPI";
import {
  MdLocationOn,
  MdAccessTime,
  MdAttachMoney,
  MdCalendarToday,
  MdPeople,
  MdWork,
  MdLanguage,
  MdSchool,
  MdOutlineSchedule,
  MdAdd,
  MdArrowDropUp,
  MdArrowDropDown,
  MdOutlineMessage
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
  const [reviews, setReviews] = useState([]);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [replyBox, setReplyBox] = useState({});
  const [replyingTo, setReplyingTo] = useState(null);
  const [avgRating, setAvgRating] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);

  useEffect(() => {
    axios
      .get(`${API_URL}/${id}`)
      .then((res) => {
        setCompany(res.data);
        setLoading(false);
        loadReviews();
      })
      .catch((err) => {
        setError("Không tìm thấy công ty");
        setLoading(false);
      });
  }, [id]);

  const loadReviews = async () => {
    try {
      setReviewsLoading(true);
      const response = await getCompanyReviews(id);
      setReviews(response.data || []);
      setAvgRating(response.avgRating || 0);
      setRatingCount(response.ratingCount || 0);
      setReviewsLoading(false);
    } catch (error) {
      console.error("Failed to load reviews:", error);
      setReviewsLoading(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    const newReview = {
      id: `review${Date.now()}`,
      user: "Bạn",
      rating: rating,
      content: comment,
      date: new Date().toISOString(),
      replies: [],
    };
    await addCompanyComment(id, newReview);
    setComment("");
    loadReviews(); // Reload reviews to show the new one
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
    await replyToCompanyComment(id, reviewId, replyObj);
    setReplyBox((prev) => ({ ...prev, [reviewId]: "" }));
    setReplyingTo(null);
    loadReviews(); // Reload to show the new reply
  };

  const handleReplyClick = (reviewId, replyUser, replyId) => {
    setReplyingTo({ reviewId, replyId });
    setReplyBox((prev) => ({
      ...prev,
      [reviewId]: replyUser ? `@${replyUser} ` : "",
    }));
  };

  const handleVote = async (reviewId, voteType) => {
    try {
      await voteForReview(id, reviewId, voteType);
      // Optimistically update UI without reloading
      setReviews(prevReviews => 
        prevReviews.map(review => {
          if (review.id === reviewId) {
            const votes = {...review.votes};
            if (voteType === 'upvote') {
              votes.upvotes += 1;
              votes.total += 1;
            } else {
              votes.downvotes += 1;
              votes.total -= 1;
            }
            return {...review, votes};
          }
          return review;
        })
      );
    } catch (error) {
      console.error(`Error ${voteType} review:`, error);
    }
  };

  const renderCompanyLogo = () => {
    // For demo purposes, could be replaced with actual logo from company data
    return "/pictures/misa.png";
  };

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>{error}</div>;
  if (!company) return null;

  return (
    <>
      <Header />
      <div className="bg"></div>
      <div className="companyCard">
        <img className="companyLogo" src={renderCompanyLogo()} alt="logo" />
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
        <button className="followBtn">
          <MdAdd /> Theo dõi công ty
        </button>
      </div>
      <div className="container">
        <div className="sectionTitle">Giới thiệu</div>
        <div>{company.about}</div>
        
        <div className="sectionTitle">Vị trí đang tuyển</div>
        {company.recruitment && company.recruitment.is_hiring && company.recruitment.jobs && company.recruitment.jobs.length > 0 ? (
          company.recruitment.jobs.map((job) => (
            <div key={job.id} className="jobCard">
              <div className="jobLogoWrap">
                <img className="jobLogo" src={renderCompanyLogo()} alt="logo" />
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
                    {job.working_type}
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
                    {job.posted_time}
                  </span>
                </div>
                <div className="jobDesc">{job.description}</div>

                {/* Additional job details */}
                <div className="jobDetailSection">
                  <div className="jobDetailItem">
                    <span className="jobDetailIcon"><MdWork /></span>
                    <span className="jobDetailLabel">Kỹ năng chuyên môn:</span>
                    <span className="jobDetailValue">{job.technical_skills?.join(", ")}</span>
                  </div>
                  <div className="jobDetailItem">
                    <span className="jobDetailIcon"><MdPeople /></span>
                    <span className="jobDetailLabel">Kỹ năng mềm:</span>
                    <span className="jobDetailValue">{job.soft_skills?.join(", ")}</span>
                  </div>
                  <div className="jobDetailItem">
                    <span className="jobDetailIcon"><MdLanguage /></span>
                    <span className="jobDetailLabel">Yêu cầu ngôn ngữ:</span>
                    <span className="jobDetailValue">{job.language_requirement}</span>
                  </div>
                  <div className="jobDetailItem">
                    <span className="jobDetailIcon"><MdSchool /></span>
                    <span className="jobDetailLabel">Trường đại học:</span>
                    <span className="jobDetailValue">{job.student_target?.university}</span>
                  </div>
                  <div className="jobDetailItem">
                    <span className="jobDetailIcon"><MdOutlineSchedule /></span>
                    <span className="jobDetailLabel">Thời gian làm việc:</span>
                    <span className="jobDetailValue">{job.working_hours_per_week}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          company.jobs && company.jobs.length > 0 ? (
            company.jobs.map((job) => (
              <div key={job.id} className="jobCard">
                <div className="jobLogoWrap">
                  <img className="jobLogo" src={renderCompanyLogo()} alt="logo" />
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
            ))
          ) : (
            <div className="noJobs">Công ty hiện không có vị trí tuyển dụng nào</div>
          )
        )}

        <div className="sectionTitle">Đánh giá</div>
        <div className="reviewHeaderBar">
          <div style={{ display: "flex", alignItems: "center" }}>
            <span className="reviewScore">{avgRating.toFixed(1)}</span>
            <div className="starRating">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className={star <= Math.round(avgRating) ? "star filled" : "star"}>★</span>
              ))}
            </div>
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
          <div className="ratingCountText">
            Dựa trên {ratingCount} đánh giá
          </div>
        </div>

        <div className="reviewForm">
          <h3>Viết đánh giá</h3>
          <div className="reviewStarPicker">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={star <= rating ? "reviewStar active" : "reviewStar"}
                onClick={() => handleRatingChange(star)}
              >
                ★
              </span>
            ))}
          </div>
          <form onSubmit={handleCommentSubmit}>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Nhập đánh giá..."
              className="reviewTextarea"
              rows={6}
            />
            <div className="reviewFormFooter">
              <button type="submit" className="reviewSubmitBtn">
                Đăng
              </button>
            </div>
          </form>
        </div>

        <div className="reviewsSection">
          {reviewsLoading ? (
            <div className="loadingReviews">Đang tải đánh giá...</div>
          ) : reviews.length === 0 ? (
            <div className="noReviews">Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá!</div>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="reviewItem">
                <div className="reviewHeader">
                  <div className="reviewUser">
                    <img 
                      src={review.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.user)}&background=random`} 
                      alt={review.user} 
                      className="reviewAvatar" 
                    />
                    <div className="reviewUserInfo">
                      <div className="reviewUserName">
                        {review.user}
                        {review.isCompanyMember && <span className="companyBadge">Công ty</span>}
                      </div>
                      <div className="reviewStars">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span key={star} className={star <= review.rating ? "reviewStar active" : "reviewStar"}>
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="reviewTime">{timeAgo(review.date)}</div>
                </div>

                {review.company && (
                  <div className="reviewCompanyTag">
                    <a href={`/companies/${id}`}>@{review.company}</a>
                  </div>
                )}

                <div className="reviewContent">{review.content}</div>

                <div className="reviewActions">
                  <div className="voteButtons">
                    <div className="voteBtn upvote" onClick={() => handleVote(review.id, 'upvote')}>
                      <MdArrowDropUp className="voteIcon" />
                    </div>
                    <div className="voteCount">{review.votes?.total || 0}</div>
                    <div className="voteBtn downvote" onClick={() => handleVote(review.id, 'downvote')}>
                      <MdArrowDropDown className="voteIcon" />
                    </div>
                  </div>
                  
                  <button 
                    className="replyButton"
                    onClick={() => handleReplyClick(review.id, null, null)}
                  >
                    <MdOutlineMessage className="replyIcon" /> Trả lời
                  </button>
                </div>

                {(review.replies && review.replies.length > 0) && (
                  <div className="reviewReplies">
                    {review.replies.map((reply) => (
                      <div key={reply.id} className="reviewReply">
                        <div className="replyHeader">
                          <div className="reviewUser">
                            <img 
                              src={reply.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(reply.user)}&background=random`} 
                              alt={reply.user} 
                              className="replyAvatar" 
                            />
                            <div className="reviewUserInfo">
                              <div className="replyUserName">
                                {reply.user}
                                {reply.location && <span className="replyLocation">{reply.location}</span>}
                              </div>
                            </div>
                          </div>
                          <div className="replyTime">{timeAgo(reply.date)}</div>
                        </div>
                        <div className="replyContent">{reply.content}</div>
                        
                        <div className="replyActions">
                          <button 
                            className="replyButton"
                            onClick={() => handleReplyClick(review.id, reply.user, reply.id)}
                          >
                            <MdOutlineMessage className="replyIcon" /> Trả lời
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {replyingTo && replyingTo.reviewId === review.id && (
                  <div className="replyForm">
                    <textarea
                      value={replyBox[review.id] || ""}
                      onChange={(e) => handleReplyChange(review.id, e.target.value)}
                      placeholder={replyingTo.replyId ? `Trả lời...` : "Viết trả lời..."}
                      className="replyTextarea"
                    />
                    <div className="replyFormActions">
                      <button 
                        className="cancelReplyBtn"
                        onClick={() => setReplyingTo(null)}
                      >
                        Huỷ
                      </button>
                      <button 
                        className="submitReplyBtn"
                        onClick={() => handleReplySubmit(review.id)}
                      >
                        Gửi
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default CompanyDetailPage;
