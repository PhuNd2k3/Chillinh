import React, { useState, useEffect } from "react";
import Header from "../components/Header/Header";
import "./ForumsPage.css";
import NewPostModal from "./NewPostModal";
import { fetchPosts, createVote } from "../api/forumApi";

function ForumsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const postsData = await fetchPosts();
      setPosts(postsData.map(post => ({
        ...post,
        showAllReplies: false
      })));
      setError(null);
    } catch (err) {
      setError("Có lỗi xảy ra khi tải bài viết");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVoteUp = async (postId) => {
    try {
      await createVote(postId, "1", "upvote"); // Using a mock userId of "1" for now
      setPosts(prev =>
        prev.map(post =>
          post.id === postId ? { ...post, voteCount: post.voteCount + 1 } : post
        )
      );
    } catch (err) {
      console.error("Error voting up:", err);
    }
  };

  const handleVoteDown = async (postId) => {
    try {
      await createVote(postId, "1", "downvote"); // Using a mock userId of "1" for now
      setPosts(prev =>
        prev.map(post =>
          post.id === postId ? { ...post, voteCount: post.voteCount - 1 } : post
        )
      );
    } catch (err) {
      console.error("Error voting down:", err);
    }
  };

  const handleShowAllReplies = (postId) => {
    setPosts(prev =>
      prev.map(post =>
        post.id === postId ? { ...post, showAllReplies: !post.showAllReplies } : post
      )
    );
  };

  if (loading) {
    return <div className="loading">Đang tải...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <>
      <Header />
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
                    </div>
                    <h3 className="forums-post-title">{post.title}</h3>
                    <div className="forums-post-content">{post.content}</div>
                    <div className="forums-post-tags">
                      {post.tags && post.tags.map((tag, index) => (
                        <span key={index} className="forums-post-tag">#{tag}</span>
                      ))}
                    </div>
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
                              <div className="forums-reply-content">{reply.content}</div>
                            </div>
                          </div>
                        ))}
                        {post.replies.length > 1 && !post.showAllReplies && (
                          <button 
                            className="show-more-replies" 
                            onClick={() => handleShowAllReplies(post.id)}
                          >
                            Xem thêm {post.replies.length - 1} bình luận
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="forums-sidebar">
            <button className="forums-new-post-btn" onClick={() => setShowModal(true)}>
              Thêm bài viết mới
            </button>
          </div>
        </div>
      </div>
      {showModal && (
        <NewPostModal onClose={() => setShowModal(false)} onSubmit={() => setShowModal(false)} />
      )}
    </>
  );
}

export default ForumsPage; 