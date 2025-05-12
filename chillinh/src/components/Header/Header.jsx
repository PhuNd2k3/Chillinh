import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import logo from "../../../public/pictures/logo.png"; // điều chỉnh nếu đường dẫn khác

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <Link to="/" className="logo-combo">
          <img src={logo} alt="Growell Logo" className="logo-img" />
          <span className="logo-text">growell</span>
        </Link>
      </div>
      <nav className="nav-links">
        <Link to="/companies">Danh sách công ty</Link>
        <Link to="/forum">Thảo luận</Link>
        <Link to="/profile">Thông tin cá nhân</Link>
      </nav>
    </header>
  );
};

export default Header;
