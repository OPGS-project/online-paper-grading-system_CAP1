import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AiOutlineLogin } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '~/store/actions/authAction';
import { apiGetStudent } from '~/apis/userService';
// import Collapsible from 'react-collapsible';
import { Collapse } from 'bootstrap';

function HeaderStudent() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { token } = useSelector((state) => state.auth);
    const [userData, setUserData] = useState({});
    useEffect(() => {
        const fetchUser = async () => {
            const response = await apiGetStudent(token);

            if (response?.data.err === 0) {
                setUserData(response.data?.response);
            } else {
                setUserData({});
            }
        };
        token && fetchUser();
    }, [token]);

    //toggle
    var [toggle3, setToggle3] = useState(false);

    useEffect(() => {
        var myCollapse3 = document.getElementById('collapseTarget3');
        var bsCollapse3 = new Collapse(myCollapse3, { toggle: false });
        toggle3 ? bsCollapse3.show() : bsCollapse3.hide();
    });

    return (
        <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
            <ul className="navbar-nav ml-auto">
                <div className="topbar-divider d-none d-sm-block"></div>

                <li className="nav-item dropdown no-arrow">
                    <Link className="nav-link dropdown-toggle" onClick={() => setToggle3((toggle3) => !toggle3)}>
                        <span className="mr-2 d-none d-lg-inline text-gray-600 small">{userData?.student_name}</span>
                        <img className="img-profile rounded-circle" src={userData.avatar} alt="avatar" />
                    </Link>

                    <div
                        trigger="Start Here"
                        className="dropdown-menu dropdown-menu-right shadow animated--grow-in"
                        id="collapseTarget3"
                    >
                        <Link className="dropdown-item" to="/student/student-profile">
                            <i className="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
                            Hồ sơ
                        </Link>
                        <Link className="dropdown-item" to="/student/update-password">
                            <i className="fas fa-cogs fa-sm fa-fw mr-2 text-gray-400"></i>
                            Đổi mật khẩu
                        </Link>

                        <div className="dropdown-divider"></div>

                        <button
                            className="dropdown-item"
                            onClick={() => dispatch(logout()) && navigate('/login-student')}
                        >
                            <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                            Đăng xuất
                        </button>
                    </div>
                </li>
            </ul>
        </nav>
    );
}

export default HeaderStudent;
