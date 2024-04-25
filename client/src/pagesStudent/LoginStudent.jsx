import axios from 'axios';
import { FaEye } from '@react-icons/all-files/fa/FaEye';
import { FaEyeSlash } from '@react-icons/all-files/fa/FaEyeSlash';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '~~/layout/Login.scss';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux';
import actionTypes from '~/store/actions/actionTypes';
import Swal from 'sweetalert2';

export default function LoginStudent() {
    const notifyWarning = (errorMessage) => {
        toast.warning(errorMessage, {
            position: 'top-right',
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'light',
        });
    };
    const notifySuccess = (errorMessage) => {
        toast.success(errorMessage, {
            position: 'top-right',
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'light',
        });
    };
    const [show, setShow] = useState(false);
    const handleShow = () => {
        setShow(!show);
    };
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [values, setValues] = useState({ username: '', password: '' });
    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const [error, setError] = useState({
        usernamErr: null,
        passwordErr: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (values.username.length < 0 || values.username === '')
            setError((prev) => ({
                ...prev,
                usernamErr: 'Username không được để trống',
            }));

        if (values.password.length < 0 || values.password === '')
            setError((prev) => ({
                ...prev,
                passwordErr: 'Mật khẩu không được để trống',
            }));

        if (error.usernamErr === null || error.passwordErr === null) {
            axios.post('http://localhost:8081/api/authStudent/login', values).then((res) => {
                console.log(res);
                if (res.data.err === 0) {
                    notifySuccess('Đăng nhập thành công !');
                    dispatch({
                        type: actionTypes.LOGIN_SUCCESS,
                        data: res.data.token,
                    });
                    setTimeout(() => {
                        navigate('/student/assignment-of-student ');
                    }, 3000); // chuyển trang sau 3s
                } else {
                    Swal.fire('Thông báo', 'Sai mật khẩu', 'error');
                }
            });
        } else notifyWarning('Nhập thông tin đầy đủ');
    };

    return (
        <div className="bg-gradient-primary">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-xl-10 col-lg-12 col-md-9">
                        <div className="card o-hidden border-0 shadow-lg my-5">
                            <div className="card-body p-0">
                                <div className="row">
                                    <div className="col-lg-6 d-none d-lg-block bg-login-image"></div>
                                    <div className="col-lg-6">
                                        <div className="p-5">
                                            <div className="text-center">
                                                <h1 className="h3 text-gray-900 mb-4">Đăng Nhập</h1>
                                            </div>
                                            <form className="user" method="post" onSubmit={handleSubmit}>
                                                <div className="form-group">
                                                    <input
                                                        type="text"
                                                        className="form-control form-control-user"
                                                        placeholder="Nhập username của bạn"
                                                        onChange={(e) => {
                                                            setError((prev) => ({
                                                                ...prev,
                                                                usernamErr: null,
                                                            }));
                                                            handleChange(e);
                                                        }}
                                                        name="username"
                                                    />
                                                    {error.usernamErr && (
                                                        <small className="text-danger pl-3">{error.usernamErr}</small>
                                                    )}
                                                </div>

                                                <div className="form-group  position-relative">
                                                    <input
                                                        type={show ? 'text' : 'password'}
                                                        className="form-control form-control-user "
                                                        placeholder="***************"
                                                        onChange={(e) => {
                                                            setError((prev) => ({
                                                                ...prev,
                                                                passwordErr: null,
                                                            }));
                                                            handleChange(e);
                                                        }}
                                                        name="password"
                                                    />
                                                    <div
                                                        className="position-absolute"
                                                        style={{ right: '6%', bottom: '24%' }}
                                                        onClick={handleShow}
                                                    >
                                                        {show ? <FaEyeSlash /> : <FaEye />}
                                                    </div>
                                                </div>
                                                {error.passwordErr && (
                                                    <small className="text-danger pl-3">{error.passwordErr}</small>
                                                )}
                                                <div className="form-group d-flex justify-content-between">
                                                    <div className="custom-control custom-checkbox small">
                                                        <input
                                                            type="checkbox"
                                                            className="custom-control-input"
                                                            id="customCheck"
                                                        />
                                                        <label className="custom-control-label " htmlFor="customCheck">
                                                            Nhớ mật khẩu
                                                        </label>
                                                    </div>
                                                </div>
                                                <button to="" className="btn btn-primary btn-user btn-block">
                                                    Đăng Nhập
                                                </button>
                                                <hr />
                                            </form>

                                            <ToastContainer />

                                            <div className="text-center">
                                                <div className="row">
                                                    <Link className="small col-7" to="/login-teacher">
                                                        Đăng nhập với tài khoản giáo viên
                                                    </Link>
                                                    <Link className="small" to="/register-teacher">
                                                        Tạo tài khoản giáo viên
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
