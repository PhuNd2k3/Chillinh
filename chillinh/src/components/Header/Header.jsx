import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import logo from "../../../public/pictures/logo.png"; // điều chỉnh nếu đường dẫn khác

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <Link to="/" className="logo-link">
            <img src={logo} alt="growell" />
            <span>growell</span>
          </Link>
        </div>
        <nav className="nav-menu">
          <Link to="/companies" className="nav-link">Danh sách công ty</Link>
          <Link to="/forums" className="nav-link">Thảo luận</Link>
          <Link to="/profile" className="nav-link">Thông tin cá nhân</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
