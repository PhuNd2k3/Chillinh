import React, { useState, useEffect } from "react";
import Header from "../components/Header/Header";
import "./ForumsPage.css";
import NewPostModal from "./NewPostModal";
import { fetchPosts, createVote, fetchComments, createPostComment, fetchUserVotes } from "../api/forumApi";

function ForumsPage() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [comments, setComments] = useState({}); // { [postId]: [comment, ...] }
  const [loadingComments, setLoadingComments] = useState({}); // { [postId]: boolean }
  const [commentInputs, setCommentInputs] = useState({}); // { [postId]: string }
  const [sendingComment, setSendingComment] = useState({}); // { [postId]: boolean }
  const [searchTag, setSearchTag] = useState('');
  const [userVotes, setUserVotes] = useState({}); // { [postId]: 'upvote' | 'downvote' }
  const [votingInProgress, setVotingInProgress] = useState({}); // { [postId]: boolean }

  const currentUserId = "1"; // Mock user ID

  useEffect(() => {
    loadPosts();
    loadUserVotes();
  }, []);

  useEffect(() => {
    // Filter posts when searchTag changes
    if (searchTag.trim() === '') {
      setFilteredPosts(posts);
    } else {
      const filtered = posts.filter(post => 
        post.tags && post.tags.some(tag => 
          tag.toLowerCase().includes(searchTag.toLowerCase())
        )
      );
      setFilteredPosts(filtered);
    }
  }, [posts, searchTag]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const postsData = await fetchPosts();
      const postsWithReplies = postsData.map(post => ({
        ...post,
        showAllReplies: false
      }));
      setPosts(postsWithReplies);
      setFilteredPosts(postsWithReplies);
      setError(null);
    } catch (err) {
      setError("Có lỗi xảy ra khi tải bài viết");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadUserVotes = async () => {
    try {
      const votes = await fetchUserVotes(currentUserId);
      setUserVotes(votes);
    } catch (err) {
      console.error("Error loading user votes:", err);
    }
  };

  const handleVoteUp = async (postId) => {
    if (votingInProgress[postId] || userVotes[postId]) return; // Disable if already voted
    
    setVotingInProgress(prev => ({ ...prev, [postId]: true }));
    try {
      const response = await createVote(postId, currentUserId, "upvote");
      
      if (response.success) {
        // Cập nhật vote state
        setUserVotes(prev => ({ ...prev, [postId]: "upvote" }));
        
        // Cập nhật vote count trong posts
        setPosts(prev =>
          prev.map(post => 
            post.id === postId ? { ...post, upvotes: post.upvotes + 1 } : post
          )
        );
      } else {
        alert(response.message || "Không thể vote");
      }
    } catch (err) {
      console.error("Error voting up:", err);
      alert("Có lỗi xảy ra khi vote");
    } finally {
      setVotingInProgress(prev => ({ ...prev, [postId]: false }));
    }
  };

  const handleVoteDown = async (postId) => {
    if (votingInProgress[postId] || userVotes[postId]) return; // Disable if already voted
    
    setVotingInProgress(prev => ({ ...prev, [postId]: true }));
    try {
      const response = await createVote(postId, currentUserId, "downvote");
      
      if (response.success) {
        // Cập nhật vote state
        setUserVotes(prev => ({ ...prev, [postId]: "downvote" }));
        
        // Cập nhật vote count trong posts
        setPosts(prev =>
          prev.map(post => 
            post.id === postId ? { ...post, downvotes: post.downvotes + 1 } : post
          )
        );
      } else {
        alert(response.message || "Không thể vote");
      }
    } catch (err) {
      console.error("Error voting down:", err);
      alert("Có lỗi xảy ra khi vote");
    } finally {
      setVotingInProgress(prev => ({ ...prev, [postId]: false }));
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

  const handleSearchTag = () => {
    // This function is called when search button is clicked
    // The filtering is already handled by useEffect above
    console.log('Searching for tag:', searchTag);
  };

  const handleClearSearch = () => {
    setSearchTag('');
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
              <div className="forums-search-container">
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tag..."
                  value={searchTag}
                  onChange={(e) => setSearchTag(e.target.value)}
                  className="forums-search-input"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearchTag();
                    }
                  }}
                />
                <button 
                  onClick={handleSearchTag}
                  className="forums-search-btn"
                >
                  Tìm kiếm
                </button>
                {searchTag && (
                  <button 
                    onClick={handleClearSearch}
                    className="forums-clear-btn"
                  >
                    Xóa
                  </button>
                )}
              </div>
            </div>
            {searchTag && (
              <div className="forums-search-result">
                Tìm thấy {filteredPosts.length} bài viết cho tag "{searchTag}"
              </div>
            )}
            <div className="forums-post-list">
              {filteredPosts.map((post) => (
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
                      <span 
                        className={`vote up ${userVotes[post.id] === 'upvote' ? 'voted' : ''} ${votingInProgress[post.id] || userVotes[post.id] ? 'disabled' : ''}`} 
                        onClick={() => !votingInProgress[post.id] && !userVotes[post.id] && handleVoteUp(post.id)}
                        title={
                          userVotes[post.id] === 'upvote' ? 'Bạn đã vote up' : 
                          userVotes[post.id] === 'downvote' ? 'Bạn đã vote cho bài viết này rồi' :
                          'Vote up'
                        }
                      >
                        ▲
                      </span>
                      <span className="vote-count upvotes">{post.upvotes}</span>
                      <span 
                        className={`vote down ${userVotes[post.id] === 'downvote' ? 'voted' : ''} ${votingInProgress[post.id] || userVotes[post.id] ? 'disabled' : ''}`} 
                        onClick={() => !votingInProgress[post.id] && !userVotes[post.id] && handleVoteDown(post.id)}
                        title={
                          userVotes[post.id] === 'downvote' ? 'Bạn đã vote down' : 
                          userVotes[post.id] === 'upvote' ? 'Bạn đã vote cho bài viết này rồi' :
                          'Vote down'
                        }
                      >
                        ▼
                      </span>
                      <span className="vote-count downvotes">{post.downvotes}</span>
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