import React, { useState } from "react";
import Header from "../components/Header/Header";
import "./ForumsPage.css";
import NewPostModal from "./NewPostModal";

const mockPosts = [
  {
    id: 1,
    author: "Ngô Thức",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    time: "7 ngày trước",
    company: "Công ty Cổ phần MISA",
    companyLink: "/companies/1",
    rating: 4,
    content:
      "Môi trường làm việc thoải mái, văn phòng hiện đại, nhiều hoạt động, chế độ tốt. Tuy nhiên, đôi lúc công việc hơi áp lực, deadline gấp. Sếp thân thiện, đồng nghiệp hỗ trợ nhau tốt. Lương ổn so với mặt bằng chung, có nhiều cơ hội học hỏi và phát triển kỹ năng. Sẽ giới thiệu bạn bè vào làm nếu có cơ hội.",
    votes: 10,
    comments: 5,
    replies: [
      {
        id: 11,
        author: "Hoàng Phong",
        avatar: "https://randomuser.me/api/portraits/men/33.jpg",
        time: "1 giờ trước",
        content: "Bạn có thể mô tả thêm về chính sách phúc lợi và lương thưởng ở đây không?",
      },
      {
        id: 13,
        author: "Nguyễn Văn A",
        avatar: "https://randomuser.me/api/portraits/men/34.jpg",
        time: "30 phút trước",
        content: "Cảm ơn bạn đã chia sẻ thông tin hữu ích!",
      },
      {
        id: 14,
        author: "Trần Thị B",
        avatar: "https://randomuser.me/api/portraits/women/35.jpg",
        time: "10 phút trước",
        content: "Môi trường làm việc có áp lực không bạn?",
      },
    ],
  },
  {
    id: 2,
    author: "Ngô Thức",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    time: "2 ngày trước",
    company: "Công ty Cổ phần MISA",
    companyLink: "/companies/1",
    rating: 4,
    content:
      "Công ty có nhiều training, thích hợp cho sinh viên mới ra trường, chế độ lương ổn định, môi trường làm việc hiện đại.",
    votes: 7,
    comments: 2,
    replies: [
      {
        id: 12,
        author: "Hoàng Phong",
        avatar: "https://randomuser.me/api/portraits/men/33.jpg",
        time: "1 giờ trước",
        content: "Cảm ơn bạn đã chia sẻ!",
      },
      {
        id: 15,
        author: "Nguyễn Văn C",
        avatar: "https://randomuser.me/api/portraits/men/36.jpg",
        time: "5 phút trước",
        content: "Bạn có thể nói rõ hơn về cơ hội thăng tiến không?",
      },
    ],
  },
  // Bài viết mới 3
  {
    id: 3,
    author: "Lê Minh Tuấn",
    avatar: "https://randomuser.me/api/portraits/men/37.jpg",
    time: "5 ngày trước",
    company: "Công ty Công nghệ Cổ phần UPBASE",
    companyLink: "/companies/2",
    rating: 5,
    content:
      "UPBASE là môi trường trẻ trung, năng động, đồng nghiệp thân thiện, sếp tâm lý. Được học hỏi nhiều về công nghệ mới và phát triển bản thân.",
    votes: 15,
    comments: 3,
    replies: [
      {
        id: 16,
        author: "Nguyễn Văn D",
        avatar: "https://randomuser.me/api/portraits/men/38.jpg",
        time: "2 ngày trước",
        content: "Bạn có thể chia sẻ thêm về chế độ đãi ngộ không?",
      },
    ],
  },
  // Bài viết mới 4
  {
    id: 4,
    author: "Trần Thị Mai",
    avatar: "https://randomuser.me/api/portraits/women/39.jpg",
    time: "1 ngày trước",
    company: "Ngân hàng TMCP Hàng Hải Việt Nam (MSB)",
    companyLink: "/companies/3",
    rating: 3,
    content:
      "Áp lực công việc khá lớn nhưng bù lại lương thưởng tốt, có nhiều cơ hội thăng tiến nếu cố gắng.",
    votes: 4,
    comments: 1,
    replies: [
      {
        id: 17,
        author: "Lê Văn E",
        avatar: "https://randomuser.me/api/portraits/men/40.jpg",
        time: "1 ngày trước",
        content: "Cảm ơn bạn đã chia sẻ thực tế!",
      },
    ],
  },
  // Bài viết mới 5
  {
    id: 5,
    author: "Phạm Quốc Bảo",
    avatar: "https://randomuser.me/api/portraits/men/41.jpg",
    time: "3 ngày trước",
    company: "Công ty Cổ phần MISA",
    companyLink: "/companies/1",
    rating: 4,
    content:
      "MISA có nhiều hoạt động ngoại khóa, văn hóa công ty tốt, phù hợp với các bạn trẻ thích môi trường năng động.",
    votes: 9,
    comments: 2,
    replies: [
      {
        id: 18,
        author: "Nguyễn Thị F",
        avatar: "https://randomuser.me/api/portraits/women/42.jpg",
        time: "2 ngày trước",
        content: "Bạn có thể chia sẻ về cơ hội phát triển nghề nghiệp không?",
      },
    ],
  },
];

const mockLatest = [
  {
    id: 1,
    title: "Công ty Cổ phần MISA vừa nhận được review mới",
    author: "Ngô Thức",
    time: "7 ngày trước",
    company: "Công ty Cổ phần MISA",
    companyLink: "/companies/1",
  },
  {
    id: 2,
    title: "Công ty Cổ phần MISA vừa nhận được review mới",
    author: "Ngô Thức",
    time: "2 ngày trước",
    company: "Công ty Cổ phần MISA",
    companyLink: "/companies/1",
  },
  {
    id: 3,
    title: "Công ty Cổ phần MISA vừa nhận được review mới",
    author: "Ngô Thức",
    time: "1 ngày trước",
    company: "Công ty Cổ phần MISA",
    companyLink: "/companies/1",
  },
  {
    id: 4,
    title: "Công ty Cổ phần MISA vừa nhận được review mới",
    author: "Ngô Thức",
    time: "1 ngày trước",
    company: "Công ty Cổ phần MISA",
    companyLink: "/companies/1",
  },
];

function ForumsPage() {
  // State cho vote và hiển thị bình luận
  const [posts, setPosts] = useState(
    mockPosts.map((post) => ({
      ...post,
      showAllReplies: false,
      voteCount: post.votes,
    }))
  );
  const [showModal, setShowModal] = useState(false);

  // Xử lý vote up
  const handleVoteUp = (postId) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId ? { ...post, voteCount: post.voteCount + 1 } : post
      )
    );
  };
  // Xử lý vote down
  const handleVoteDown = (postId) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId ? { ...post, voteCount: post.voteCount - 1 } : post
      )
    );
  };
  // Xử lý xem thêm bình luận
  const handleShowAllReplies = (postId) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId ? { ...post, showAllReplies: !post.showAllReplies } : post
      )
    );
  };

  // Hàm xử lý đăng bài mới (mock, chỉ đóng modal)
  const handleNewPost = (data) => {
    setShowModal(false);
    // Nếu muốn thêm bài mới vào danh sách, có thể push vào posts ở đây
  };

  return (
    <div>
      <Header />
      {showModal && (
        <NewPostModal onClose={() => setShowModal(false)} onSubmit={handleNewPost} />
      )}
      <div className="forums-container">
        <div className="forums-header-block">
          <h1>
            Không chỉ <span className="highlight">tìm việc</span> – hãy chọn nơi <span className="highlight">xứng đáng</span>
          </h1>
          <p className="forums-desc">Khám phá những chia sẻ thật từ cộng đồng người đi làm để có lựa chọn đúng đắn</p>
        </div>
        <div className="forums-content">
          <div className="forums-main">
            <div className="forums-main-header">
              <h2>Bài viết phổ biến</h2>
              <select className="forums-sort">
                <option>Sắp xếp theo</option>
                <option>Mới nhất</option>
                <option>Nhiều vote nhất</option>
              </select>
            </div>
            <div className="forums-post-list">
              {posts.map((post) => (
                <div className="forums-post-item" key={post.id}>
                  <div className="forums-post-avatar">
                    <img src={post.avatar} alt={post.author} />
                  </div>
                  <div className="forums-post-body">
                    <div className="forums-post-meta">
                      <span className="forums-post-author">{post.author}</span>
                      <span className="forums-post-dot">•</span>
                      <span className="forums-post-time">{post.time}</span>
                      <span className="forums-post-dot">•</span>
                      <a href={post.companyLink} className="forums-post-company">{post.company}</a>
                      {post.rating && (
                        <span className="forums-post-rating">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i} className={i < post.rating ? "star filled" : "star"}>★</span>
                          ))}
                        </span>
                      )}
                    </div>
                    <div className="forums-post-content">{post.content}</div>
                    <div className="forums-post-actions">
                      <span className="vote up" onClick={() => handleVoteUp(post.id)}>▲</span>
                      <span className="vote-count">{post.voteCount}</span>
                      <span className="vote down" onClick={() => handleVoteDown(post.id)}>▼</span>
                      <span className="comment-count" onClick={() => handleShowAllReplies(post.id)} style={{cursor:'pointer', color:'#2d6cdf', fontWeight:600}}>
                        {post.replies.length} bình luận
                      </span>
                    </div>
                    {post.replies && post.replies.length > 0 && (
                      <div className="forums-post-replies">
                        {(post.showAllReplies ? post.replies : post.replies.slice(0, 1)).map((reply) => (
                          <div className="forums-reply" key={reply.id}>
                            <img src={reply.avatar} alt={reply.author} className="forums-reply-avatar" />
                            <div className="forums-reply-body">
                              <span className="forums-reply-author">{reply.author}</span>
                              <span className="forums-reply-dot">•</span>
                              <span className="forums-reply-time">{reply.time}</span>
                              <span className="forums-reply-content">{reply.content}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="forums-pagination">
              <span className="forums-pagination-item active">1</span>
              <span className="forums-pagination-item">2</span>
              <span className="forums-pagination-item">3</span>
              <span className="forums-pagination-item">...</span>
              <span className="forums-pagination-item">10</span>
            </div>
          </div>
          <div className="forums-sidebar">
            <button className="forums-new-post-btn" onClick={() => setShowModal(true)}>Thêm bài viết mới</button>
            <div className="forums-latest">
              <h3>Mới nhất</h3>
              <ul className="forums-latest-list">
                {mockLatest.map((item) => (
                  <li key={item.id} className="forums-latest-item">
                    <a href="#" className="forums-latest-title">{item.title}</a>
                    <div className="forums-latest-meta">
                      <a href={item.companyLink} className="forums-latest-company">{item.company}</a>
                      <span className="forums-latest-dot">•</span>
                      <span className="forums-latest-time">{item.time}</span>
                    </div>
                  </li>
                ))}
              </ul>
              <a href="#" className="forums-latest-more">Xem thêm bài viết mới &gt;</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForumsPage; 