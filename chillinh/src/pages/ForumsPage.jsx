import React, { useState, useEffect } from "react";
import Header from "../components/Header/Header";
import "./ForumsPage.css";
import NewPostModal from "./NewPostModal";
import axios from 'axios';

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
      const [postsRes, usersRes, commentsRes, votesRes] = await Promise.all([
        axios.get('http://localhost:3001/posts'),
        axios.get('http://localhost:3001/users'),
        axios.get('http://localhost:3001/comments'),
        axios.get('http://localhost:3001/votes')
      ]);

      const postsData = postsRes.data.map(post => {
        const author = usersRes.data.find(user => user.id === post.userId);
        const postComments = commentsRes.data.filter(comment => comment.postId === post.id);
        const postVotes = votesRes.data.filter(vote => vote.postId === post.id);
        
        return {
          id: post.id,
          author: author?.name || 'Unknown User',
          avatar: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 50)}.jpg`,
          time: new Date(post.createdAt).toLocaleString('vi-VN', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
          }),
          content: post.content,
          title: post.title,
          voteCount: postVotes.filter(v => v.type === 'upvote').length - postVotes.filter(v => v.type === 'downvote').length,
          showAllReplies: false,
          replies: postComments.map(comment => {
            const commentAuthor = usersRes.data.find(u => u.id === comment.userId);
            return {
              id: comment.id,
              author: commentAuthor?.name || 'Unknown User',
              avatar: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 50)}.jpg`,
              time: new Date(comment.createdAt).toLocaleString('vi-VN', {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric'
              }),
              content: comment.content
            };
          }),
          tags: post.tags || []
        };
      });

      setPosts(postsData);
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
      await axios.post('http://localhost:3001/votes', {
        postId,
        userId: "1", // Using a mock userId for now
        type: "upvote"
      });
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
      await axios.post('http://localhost:3001/votes', {
        postId,
        userId: "1", // Using a mock userId for now
        type: "downvote"
      });
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