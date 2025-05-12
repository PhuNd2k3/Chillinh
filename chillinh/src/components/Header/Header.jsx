import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";

const Header = () => {
  return (
    <header className="header">
      <div className="logo">growell</div>
      <nav className="nav-links">
        <Link to="/companies">Danh sách công ty</Link>
        <Link to="/forum">Thảo luận</Link>
        <Link to="/profile">Thông tin cá nhân</Link>
      </nav>
    </header>
  );
};

export default Header;
