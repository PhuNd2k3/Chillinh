import React, { useState, useEffect } from "react";
import "./NewPostModal.css";
import axios from "axios";
import API_BASE_URL from "../api/config";
import { createPost } from "../api/forumApi";

function NewPostModal({ onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    companyId: "",
    tags: []
  });
  const [companies, setCompanies] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/companies`);
      setCompanies(response.data);
      setLoading(false);
    } catch (err) {
      setError("Không thể tải danh sách công ty");
      setLoading(false);
    }
  };

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
          companyId: "",
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
          <select
            className="modal-select"
            name="companyId"
            value={formData.companyId}
            onChange={handleInputChange}
            required
          >
            <option value="" disabled>Chọn công ty</option>
            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
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