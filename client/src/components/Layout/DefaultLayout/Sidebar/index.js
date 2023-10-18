import React from 'react';
import { FaBookReader } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function Sidebar() {
    return (
        <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">
            <Link className="sidebar-brand d-flex align-items-center justify-content-center" to="#">
                <div className="sidebar-brand-icon rotate-n-15">
                    <FaBookReader style={{ height: '50px', width: '50px' }} />
                </div>
                <div className="sidebar-brand-text mx-3">OPGS</div>
            </Link>

            <hr className="sidebar-divider my-0" />

            <li className="nav-item">
                <Link to="/home" className="custom-link no-underline" style={{ textDecoration: 'none' }}>
                    <div className="nav-link">
                        <i className="fas fa-fw fa-tachometer-alt"></i>
                        <span>Trang chủ</span>
                    </div>
                </Link>
            </li>

            <li className="nav-item">
                <Link to="/Thongke" className="custom-link no-underline" style={{ textDecoration: 'none' }}>
                    <div className="nav-link" href="/thongke">
                        <i className="fas fa-solid fa-chart-pie"></i>
                        <span>Thống kê</span>
                    </div>
                </Link>
            </li>

            <hr className="sidebar-divider" />

            <li className="nav-item">
                <a
                    className="nav-link collapsed"
                    href="/#"
                    data-toggle="collapse"
                    data-target="#collapseTwo"
                    aria-expanded="true"
                    aria-controls="collapseTwo"
                >
                    <i className="fas fa-solid fa-school"></i>
                    <span>Quản lý lớp học</span>
                </a>
                <div id="collapseTwo" className="collapse" aria-labelledby="headingTwo" data-parent="#accordionSidebar">
                    <div className="bg-white py-2 collapse-inner rounded">
                        <Link className="collapse-item" to="/class">
                            Thông tin lớp học
                        </Link>
                        <Link className="collapse-item" to="/createClass">
                            Thêm lớp học
                        </Link>
                    </div>
                </div>
            </li>

            <li className="nav-item">
                <Link
                    to="#"
                    className="nav-link collapsed"
                    href="/#"
                    data-toggle="collapse"
                    data-target="#collapseUtilities"
                    aria-expanded="true"
                    aria-controls="collapseUtilities"
                >
                    <i className="fas fa-solid fa-book"></i>
                    <span>Quản lý bài tập</span>
                </Link>
                <div
                    id="collapseUtilities"
                    className="collapse"
                    aria-labelledby="headingUtilities"
                    data-parent="#accordionSidebar"
                >
                    <div className="bg-white py-2 collapse-inner rounded">
                        <Link className="collapse-item" to="/add-assignment">
                            Thêm bài tập
                        </Link>
                        <Link className="collapse-item" to="/assignment">
                            Bài tập đã giao
                        </Link>
                    </div>
                </div>
            </li>

            <hr className="sidebar-divider d-none d-md-block" />

            <div className="text-center d-none d-md-inline">
                <button className="rounded-circle border-0" id="sidebarToggle"></button>
            </div>
        </ul>
    );
}

export default Sidebar;
