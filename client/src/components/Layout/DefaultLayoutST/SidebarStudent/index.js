import { FaBookOpen, FaBookReader, FaDoorClosed } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Link, Navigate } from 'react-router-dom';

function SidebarStudent() {
    return (
        <ul
            className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion"
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
            <li className="nav-item my-5">
                <Link
                    to="/student/assignment-of-student"
                    className="custom-link no-underline"
                    style={{ textDecoration: 'none' }}
                >
                    <div className="nav-link">
                        <FaBookOpen />
                        <span className="ml-2" style={{ fontSize: 16 }}>
                            Bài Tập
                        </span>
                    </div>
                </Link>
            </li>

            <li className="nav-item mb-5">
                <Link
                    to="/student/class-of-student"
                    className="custom-link no-underline"
                    style={{ textDecoration: 'none' }}
                >
                    <div className="nav-link">
                        <FaDoorClosed />
                        <span className="ml-2" style={{ fontSize: 16 }}>
                            Lớp Học
                        </span>
                    </div>
                </Link>
            </li>
            <hr className="sidebar-divider my-0" />
        </ul>
    );
}

export default SidebarStudent;
