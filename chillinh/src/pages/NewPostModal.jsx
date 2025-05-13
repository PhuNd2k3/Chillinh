import React, { useState } from "react";
import "./NewPostModal.css";

// Danh sách tên công ty mẫu
const COMPANIES = [
  "Công ty Cổ phần MISA",
  "Công ty Công nghệ Cổ phần UPBASE",
  "Ngân hàng TMCP Hàng Hải Việt Nam (MSB)",
  "Khác"
];

function NewPostModal({ onClose, onSubmit }) {
  const [content, setContent] = useState("");
  const [company, setCompany] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (content.trim()) {
      onSubmit({ content, company });
      setContent("");
      setCompany("");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <button className="modal-close" onClick={onClose}>&times;</button>
        <h2 className="modal-title">Bài đăng mới</h2>
        <form onSubmit={handleSubmit}>
          <textarea
            className="modal-textarea"
            placeholder="Nhập nội dung..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={7}
            required
          />
          <select
            className="modal-select"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            required
          >
            <option value="" disabled>Chọn công ty muốn gắn thẻ</option>
            {COMPANIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <button className="modal-submit" type="submit">Đăng bài</button>
        </form>
      </div>
    </div>
  );
}

export default NewPostModal; 