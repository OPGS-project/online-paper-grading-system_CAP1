import React from "react";
import "../css/sidebar.css";

function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-container">
        <div className="heading">IESS</div>
        <div className="home-box">
          <i className="fa-solid fa-house"></i>
          <p className="home-text">Trang chủ</p>
        </div>
        <div className="statistic-box">
          <i className="fa-solid fa-chart-simple"></i>
          <p className="statistic-text">Thống kê</p>
        </div>
        <div className="class-management-box">
          <div className="first-item">
            <i className="fa-solid fa-school"></i>
            <p className="class-management-text">Quản lý lớp học</p>
            <i className="fa-solid fa-arrow-down-wide-short"></i>
          </div>
          <p className="second-item">Thông tin lớp học</p>
          <p className="three-item">Xem lớp học</p>
        </div>
        <div className="assignment-management-box">
          <div className="first-item2">
            <i className="fa-solid fa-book"></i>
            <p className="assignment-management-text">Quản lý bài tập</p>
            <i className="fa-solid fa-arrow-down-wide-short"></i>
          </div>
          <p className="second-item2">Thêm bài tập</p>
          <p className="three-item2">Bài tập đã giao</p>
        </div>
        <div className="setting-box">
          <div className="first-item3">
            <i className="fa-solid fa-gear"></i>
            <p className="setting-text">Cài đặt</p>
            <i className="fa-solid fa-arrow-down-wide-short"></i>
          </div>
          <p className="second-item3">Thông tin cá nhân</p>
          <p className="three-item3">Bảo mật</p>
        </div>
        <div className="logout-box">
          <i className="fa-solid fa-right-from-bracket"></i>
          <div className="logout-text">Đăng xuất</div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
