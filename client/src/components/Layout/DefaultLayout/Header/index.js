import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AiOutlineLogin } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '~/store/actions/authAction';
import { apiGetOne } from '~/apis/userService';
import { Collapse } from 'bootstrap';

function Header() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isLoggedIn, token } = useSelector((state) => state.auth);
    const [userData, setUserData] = useState({});

    useEffect(() => {
        const fetchUser = async () => {
            const response = await apiGetOne(token);
            // console.log(response);
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
            <button id="sidebarToggleTop" className="btn btn-link d-md-none rounded-circle mr-3">
                <i className="fa fa-bars"></i>
            </button>

            <div></div>

            <ul className="navbar-nav ml-auto">
                <div className="topbar-divider d-none d-sm-block"></div>

                <li className="nav-item dropdown no-arrow">
                    <Link onClick={() => setToggle3((toggl3) => !toggle3)} className="nav-link dropdown-toggle">
                        <span className="mr-2 d-none d-lg-inline text-gray-600 small">{userData?.name}</span>
                        <img className="img-profile rounded-circle" src={userData?.avatar} alt="avatar" />
                    </Link>

                    <div className="dropdown-menu dropdown-menu-right shadow animated--grow-in" id="collapseTarget3">
                        <Link className="dropdown-item" to="/home/user-profile">
                            <i className="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
                            Hồ sơ
                        </Link>
                        <Link className="dropdown-item" to="/home/update-password">
                            <i className="fas fa-cogs fa-sm fa-fw mr-2 text-gray-400"></i>
                            Đổi mật khẩu
                        </Link>

                        <div className="dropdown-divider"></div>
                        {isLoggedIn ? (
                            <button
                                className="dropdown-item"
                                onClick={() => dispatch(logout()) && navigate('/login-teacher')}
                            >
                                <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                                Đăng xuất
                            </button>
                        ) : (
                            <button className="dropdown-item" onClick={() => navigate('/login-teacher')}>
                                <AiOutlineLogin className="mr-2 text-gray-400" />
                                Đăng nhập
                            </button>
                        )}
                    </div>
                </li>
            </ul>
        </nav>
    );
}

export default Header;
