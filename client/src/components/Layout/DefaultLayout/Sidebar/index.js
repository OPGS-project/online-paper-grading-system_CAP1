import React, { useEffect, useState } from 'react';
import { FaBookReader } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Collapse } from 'bootstrap';
import '~~/layout/Sidebar.scss';

function Sidebar() {
    var [toggle, setToggle] = useState(false);
    var [toggle2, setToggle2] = useState(false);
    var [toggle3, setToggle3] = useState(false);

    useEffect(() => {
        var myCollapse = document.getElementById('collapseTarget');
        var bsCollapse = new Collapse(myCollapse, { toggle: false });
        toggle ? bsCollapse.show() : bsCollapse.hide();

        var myCollapse2 = document.getElementById('collapseTarget2');
        var bsCollapse2 = new Collapse(myCollapse2, { toggle: false });
        toggle2 ? bsCollapse2.show() : bsCollapse2.hide();

        var btnContainer = document.getElementById('accordionSidebar');
        var btns = btnContainer.getElementsByClassName('nav-item');
        for (var i = 0; i < btns.length; i++) {
            btns[i].addEventListener('click', function () {
                var current = document.querySelector('.nav-item.active');
                if (current) {
                    current.classList.remove('active');
                }
                this.classList.add('active');
            });
        }
    });

    return (
        <ul
            className={`navbar-nav bg-gradient-primary sidebar sidebar-dark accordion ${toggle3 ? 'toggled' : ''}`}
            id="accordionSidebar"
            style={{ minHeight: 900 }}
        >
            <Link className="sidebar-brand d-flex align-items-center justify-content-center" to="#">
                <div className="sidebar-brand-icon rotate-n-15">
                    <FaBookReader style={{ height: '50px', width: '50px' }} />
                </div>
                <div className="sidebar-brand-text mx-3">OPGS</div>
            </Link>

            <hr className="sidebar-divider my-0" />

            <li className="nav-item active">
                <Link to="/home" className="custom-link no-underline" style={{ textDecoration: 'none' }}>
                    <div className="nav-link">
                        <i className="fas fa-fw fa-tachometer-alt"></i>
                        <span>Trang chủ</span>
                    </div>
                </Link>
            </li>

            <li className="nav-item">
                <Link to="/home/statis" className="custom-link no-underline" style={{ textDecoration: 'none' }}>
                    <div className="nav-link" href="/thongke">
                        <i className="fas fa-solid fa-chart-pie"></i>
                        <span>Thống kê</span>
                    </div>
                </Link>
            </li>

            <hr className="sidebar-divider" />

            <li className="nav-item">
                <Link onClick={() => setToggle((toggle) => !toggle)} className="nav-link collapsed">
                    <i className="fas fa-solid fa-school"></i>
                    <span>Quản lý lớp học</span>
                </Link>
                <div
                    id="collapseTarget"
                    className="collapse "
                    aria-labelledby="headingTwo"
                    data-parent="#accordionSidebar"
                >
                    <div className="bg-white py-2 collapse-inner rounded">
                        <Link className="collapse-item" to="/home/class">
                            Thông tin lớp học
                        </Link>
                        <Link className="collapse-item" to="/home/class/createClass">
                            Thêm lớp học
                        </Link>
                    </div>
                </div>
            </li>

            <li className="nav-item">
                <Link className="nav-link collapsed" onClick={() => setToggle2((toggle2) => !toggle2)}>
                    <i className="fas fa-solid fa-book"></i>
                    <span>Quản lý bài tập</span>
                </Link>
                <div
                    id="collapseTarget2"
                    className="collapse"
                    aria-labelledby="headingUtilities"
                    data-parent="#accordionSidebar"
                >
                    <div className="bg-white py-2 collapse-inner rounded">
                        <Link className="collapse-item" to="/home/assignment">
                            Thông tin bài tập
                        </Link>
                        <Link className="collapse-item" to="/home/assignment/add-assignment">
                            Thêm bài tập
                        </Link>
                    </div>
                </div>
            </li>

            <hr className="sidebar-divider d-none d-md-block" />

            <div className="text-center d-none d-md-inline mt-5">
                <Link className="nav-link collapsed" onClick={() => setToggle3((toggle3) => !toggle3)}>
                    <button className="rounded-circle border-0" id="sidebarToggle"></button>
                </Link>
            </div>
        </ul>
    );
}

export default Sidebar;
