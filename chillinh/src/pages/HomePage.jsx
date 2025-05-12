import React from "react";
import "./HomePage.css";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="homepage">
      <nav className="navbar">
        <div className="logo">growell</div>
        <div className="nav-links">
          <Link to="/companies">Danh sách công ty</Link>
          <Link to="/forum">Thảo luận</Link>
          <Link to="/profile">Thông tin cá nhân</Link>
        </div>
      </nav>
      <div className="content">
        <h1>Không chỉ tìm việc<br />hãy chọn nơi xứng đáng</h1>
        <p>Khám phá những chia sẻ thật từ cộng đồng người đi làm để có lựa chọn đúng đắn</p>
        <Link to="/users" className="start-button">Bắt đầu ngay ↗</Link>
      </div>
    </div>
  );
};

export default HomePage;
