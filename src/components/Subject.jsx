import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../css/Sidebar.css";
import { useContext } from "react";
import { UserContext } from "../UserContext";

const Sidebar = () => {
  const { logout } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  
  const menuItems = [
    {
      id: "dashboard",
      icon: "📊",
      text: "Дашборд",
      path: "/student-portal",
    },
    {
      id: "lessons",
      icon: "📝",
      text: "Хичээл",
      path: "/lessons",
    },
    {
      id: "assignments",
      icon: "📋",
      text: "Дасгал",
      path: "/assignments",
    },
    {
      id: "completion",
      icon: "🎮",
      text: "Тоглоом",
      path: "/completion",
    },
    {
      id: "payment",
      icon: "💳",
      text: "Төлбөр",
      path: "/payment",
    },
  ];

  const handleNavigation = (item) => {
    if (item.id === "home") {
      navigate("/");
    } else {
      navigate(item.path);
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="sidebar">
      <div className="sidebar-content">
        <div className="logo-section">
          <div className="logo">
            <span className="logo-text">SP</span>
          </div>
          <span className="portal-title">Student portal</span>
        </div>
        
        <nav className="nav-menu">
          {menuItems.map((item) => (
            <div
              key={item.id}
              className={`nav-item ${isActive(item.path) ? "active" : ""}`}
              onClick={() => handleNavigation(item)}
            >
              <div className="nav-icon">{item.icon}</div>
              <span className="nav-text">{item.text}</span>
            </div>
          ))}
        </nav>
      </div>
      
      <div className="sidebar-footer">
        <div className="nav-item" onClick={() => navigate("/settings")}>
          <div className="nav-icon">⚙️</div>
          <span className="nav-text">Тохиргоо</span>
        </div>
        <div className="nav-item logout-item" onClick={handleLogout}>
          <div className="nav-icon">🚪</div>
          <span className="nav-text">Гарах</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;