import React from "react";
import "./HomePage.css";
import { Link } from "react-router-dom";
import logo from "../../public/pictures/logo.png"; // Adjust the path as necessary

const HomePage = () => {
  return (
    <div className="homepage">
      <nav className="homepage-navbar">
        <div className="homepage-logo">
          <Link to="/" className="homepage-logo-combo">
            <img src={logo} alt="Growell Logo" className="homepage-logo-img" />
            <span className="homepage-logo-text">growell</span>
          </Link>
        </div>
        <div className="homepage-nav-links">
          <Link to="/companies">Danh sách công ty</Link>
          <Link to="/forums">Thảo luận</Link>
          <Link to="/profile">Thông tin cá nhân</Link>
        </div>
      </nav>
      <div className="homepage-content">
        <h1>Không chỉ tìm việc<br />hãy chọn nơi xứng đáng</h1>
        <p>Khám phá những chia sẻ thật từ cộng đồng người đi làm để có lựa chọn đúng đắn</p>
        <Link to="/companies" className="homepage-start-button">Bắt đầu ngay ↗</Link>
      </div>
    </div>
  );
};

export default HomePage;
