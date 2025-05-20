import React, { useState, useEffect } from "react";
import "./NewPostModal.css";
import axios from "axios";
import { createPost } from "../api/forumApi";

const API_BASE_URL = import.meta.env.VITE_API_URL;

function NewPostModal({ onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    tags: []
  });
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.title.trim() && formData.content.trim()) {
      try {
        const newPost = await createPost(formData);
        onSubmit(newPost);
        setFormData({
          title: "",
          content: "",
          tags: []
        });
      } catch (err) {
        console.error("Error creating post:", err);
      }
    }
  };

  if (loading) return <div className="modal-overlay"><div className="modal-box">Đang tải...</div></div>;
  if (error) return <div className="modal-overlay"><div className="modal-box">{error}</div></div>;

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <button className="modal-close" onClick={onClose}>&times;</button>
        <h2 className="modal-title">Bài đăng mới</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="modal-input"
            name="title"
            placeholder="Tiêu đề bài viết..."
            value={formData.title}
            onChange={handleInputChange}
            required
          />
          <textarea
            className="modal-textarea"
            name="content"
            placeholder="Nội dung bài viết..."
            value={formData.content}
            onChange={handleInputChange}
            rows={7}
            required
          />
          <div className="modal-tags">
            <div className="tag-input-container">
              <input
                type="text"
                className="tag-input"
                placeholder="Thêm tag..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
              />
              <button className="add-tag-btn" onClick={handleAddTag}>Thêm</button>
            </div>
            <div className="tags-container">
              {formData.tags.map((tag, index) => (
                <span key={index} className="tag">
                  #{tag}
                  <button
                    type="button"
                    className="remove-tag"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
          <button className="modal-submit" type="submit">Đăng bài</button>
        </form>
      </div>
    </div>
  );
}

export default NewPostModal; 