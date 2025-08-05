import React, { useState, useRef } from "react";
import { Menu, Bell, X } from "lucide-react";
import AdminSidebar from "./AdminSidebar";
import { Outlet } from "react-router-dom";
import "../Css/Admin.css";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const sidebarRef = useRef(null);
  const [animatingOut, setAnimatingOut] = useState(false);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  const toggleNotifications = () => {
    if (showNotifications) {
      setAnimatingOut(true);
      setTimeout(() => {
        setShowNotifications(false);
        setAnimatingOut(false);
      }, 300);
    } else {
      setShowNotifications(true);
    }
  };

  return (
    <>
      <AdminSidebar
        isOpen={sidebarOpen}
        sidebarRef={sidebarRef}
        closeSidebar={closeSidebar}
      />

      {sidebarOpen && (
        <div className="sidebar-backdrop" onClick={closeSidebar}></div>
      )}

      <div className="notification-fixed">
        <button className="notification-button" onClick={toggleNotifications}>
          <Bell size={24} />
          <span className="notification-badge">3</span>
        </button>
      </div>

      {showNotifications && (
        <>
          <div
            className={`notification-modal ${
              animatingOut ? "fade-out" : "fade-in"
            }`}
          >
            <div className="modal-header">
              <h3>Мэдэгдэл</h3>
              <button className="close-modal" onClick={toggleNotifications}>
                <X size={20} />
              </button>
            </div>
            <ul className="notification-list">
              <li>Шинэ багш бүртгүүллээ</li>
              <li>Хэрэглэгч худалдан авалт хийлээ</li>
              <li>Сэтгэгдэл бичигдлээ</li>
            </ul>
          </div>

          <div
            className={`notification-backdrop ${
              animatingOut ? "fade-out" : ""
            }`}
            onClick={toggleNotifications}
          ></div>
        </>
      )}

      <div className="admin-main">
        <div className="mobile-header">
          <Menu
            id="menu-toggle"
            className="menu-icon"
            size={28}
            onClick={toggleSidebar}
          />
          <span className="mobile-title">Admin panel</span>
        </div>

        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default AdminLayout;
