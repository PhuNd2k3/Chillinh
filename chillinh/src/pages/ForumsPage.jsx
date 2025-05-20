import React, { useState, useEffect } from "react";
import Header from "../components/Header/Header";
import "./ForumsPage.css";
import NewPostModal from "./NewPostModal";
import { fetchPosts, createVote, fetchComments, createPostComment } from "../api/forumApi";

function ForumsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [comments, setComments] = useState({}); // { [postId]: [comment, ...] }
  const [loadingComments, setLoadingComments] = useState({}); // { [postId]: boolean }
  const [commentInputs, setCommentInputs] = useState({}); // { [postId]: string }
  const [sendingComment, setSendingComment] = useState({}); // { [postId]: boolean }

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

  const handleShowAllReplies = async (postId) => {
    setPosts(prev =>
      prev.map(post =>
        post.id === postId ? { ...post, showAllReplies: !post.showAllReplies } : post
      )
    );
    // Nếu chưa có comment thì mới fetch
    if (!comments[postId]) {
      setLoadingComments(prev => ({ ...prev, [postId]: true }));
      try {
        const fetched = await fetchComments(postId);
        setComments(prev => ({ ...prev, [postId]: fetched }));
      } catch (err) {
        // Có thể xử lý lỗi nếu muốn
      } finally {
        setLoadingComments(prev => ({ ...prev, [postId]: false }));
      }
    }
  };

  const handleCommentInputChange = (postId, value) => {
    setCommentInputs(prev => ({ ...prev, [postId]: value }));
  };

  const handleSendComment = async (postId) => {
    const content = (commentInputs[postId] || '').trim();
    if (!content) return;
    setSendingComment(prev => ({ ...prev, [postId]: true }));
    try {
      await createPostComment(postId, "siuuu", content); // userId có thể lấy từ context/auth nếu có
      setCommentInputs(prev => ({ ...prev, [postId]: '' }));
      // Reload lại comment
      const fetched = await fetchComments(postId);
      setComments(prev => ({ ...prev, [postId]: fetched }));
    } catch (err) {
      // Có thể xử lý lỗi nếu muốn
    } finally {
      setSendingComment(prev => ({ ...prev, [postId]: false }));
    }
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
                        {(comments[post.id] ? comments[post.id].length : post.commentCount)} bình luận
                      </span>
                    </div>
                    {post.showAllReplies && (
                      <div className="forums-post-replies">
                        {loadingComments[post.id] ? (
                          <div>Đang tải bình luận...</div>
                        ) : (
                          (comments[post.id]?.length > 0 ?
                            (comments[post.id].map((reply, idx) => (
                              <div className="forums-reply" key={reply.id || idx}>
                                <img src={reply.avatar} alt={reply.author} className="forums-reply-avatar" />
                                <div className="forums-reply-body">
                                  <span className="forums-reply-author">{reply.author}</span>
                                  <span className="forums-reply-dot">•</span>
                                  <span className="forums-reply-time">{reply.time}</span>
                                  <div className="forums-reply-content">{reply.content}</div>
                                </div>
                              </div>
                            ))) : <div>Chưa có bình luận nào.</div>)
                        )}
                        {/* Form nhập comment */}
                        <div className="forums-comment-form" style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                          <input
                            type="text"
                            placeholder="Nhập bình luận..."
                            value={commentInputs[post.id] || ''}
                            onChange={e => handleCommentInputChange(post.id, e.target.value)}
                            style={{ flex: 1, padding: 6, borderRadius: 4, border: '1px solid #ccc' }}
                            onKeyDown={e => { if (e.key === 'Enter') handleSendComment(post.id); }}
                            disabled={sendingComment[post.id]}
                          />
                          <button
                            onClick={() => handleSendComment(post.id)}
                            disabled={sendingComment[post.id] || !(commentInputs[post.id] || '').trim()}
                            style={{ padding: '6px 12px', borderRadius: 4, background: '#2d6cdf', color: '#fff', border: 'none', fontWeight: 600 }}
                          >
                            Gửi
                          </button>
                        </div>
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
            
            {/* Danh sách tiêu đề bài viết mới */}
            <div className="recent-posts-section" style={{ 
              marginTop: 24, 
              padding: 15, 
              backgroundColor: '#f8f9fa',
              borderRadius: 8
            }}>
              <h3 style={{ 
                fontSize: 18, 
                marginBottom: 16, 
                color: '#333', 
                fontWeight: 700,
                borderBottom: '2px solid #2d6cdf',
                paddingBottom: 8
              }}>Bài viết gần đây</h3>
              <div className="recent-posts-list">
                {posts.slice(0, 5).map(post => (
                  <div key={post.id} className="recent-post-item" style={{ 
                    padding: '12px 0',
                    borderBottom: '1px solid #eee',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    ':hover': {
                      backgroundColor: '#f0f4ff'
                    }
                  }}>
                    <div className="recent-post-title" style={{ 
                      fontSize: 15,
                      fontWeight: 600,
                      marginBottom: 6,
                      color: '#2d6cdf',
                      transition: 'color 0.2s ease'
                    }}>
                      {post.title}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', fontSize: 13, color: '#666' }}>
                      <span style={{ fontWeight: 500 }}>{post.author}</span>
                      <span style={{ margin: '0 6px' }}>•</span>
                      <span>{post.commentCount || 0} bình luận</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
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