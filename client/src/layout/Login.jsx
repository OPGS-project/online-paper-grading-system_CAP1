import axios from 'axios';
import { FaEye } from '@react-icons/all-files/fa/FaEye';
import { FaEyeSlash } from '@react-icons/all-files/fa/FaEyeSlash';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '~~/layout/Login.scss';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Login() {
    const notifyWarning = (errorMessage) => {
        toast.warning(errorMessage, {
            position: 'top-right',
            autoClose: 5000,
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
    const navigate = useNavigate();
    const [values, setValues] = useState({ email: '', password: '' });
    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (values.email === '' && values.password === '') {
        }
        axios
            .post('http://localhost:8081/api/v1/auth/login', values)
            .then((res) => {
                if (res.data === 'Success') {
                    console.log(res);
                    notifySuccess('Đăng nhập thành công !');
                    setTimeout(() => {
                        navigate('/');
                    }, 3000); // chuyển trang sau 3s
                } else {
                    notifyWarning('Email hoặc Mật khẩu không đúng');
                }
            })

            .catch((err) => {
                console.log(err);
            });
    };
    console.log(values);

    const handleLogin = () => {
        window.open('http://localhost:8081/api/auth/google', '_self'); // self load  đè lên trang hiện tại
    };

    return (
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
                                                    type="email"
                                                    className="form-control form-control-user"
                                                    placeholder="example@gmai.com"
                                                    onChange={handleChange}
                                                    name="email"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <input
                                                    type={show ? 'text' : 'password'}
                                                    className="form-control form-control-user"
                                                    placeholder="***************"
                                                    onChange={handleChange}
                                                    name="password"
                                                />
                                                <div className="position-absolute eye-login" onClick={handleShow}>
                                                    {show ? <FaEyeSlash /> : <FaEye />}
                                                </div>
                                            </div>
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
                                                <div className="text-center">
                                                    <Link className="small" to="/forgot-password">
                                                        Quên mật khẩu?
                                                    </Link>
                                                </div>
                                            </div>
                                            <button className="btn btn-primary btn-user btn-block" type="submit">
                                                Đăng Nhập
                                            </button>
                                            <hr />
                                            <button
                                                className="btn btn-google btn-google-color btn-user btn-block"
                                                onClick={handleLogin}
                                            >
                                                <i className="fab fa-google fa-fw"></i> Đăng nhập với Google
                                            </button>
                                        </form>
                                        <ToastContainer />
                                        <hr />

                                        <div className="text-center">
                                            <Link className="small" to="/register">
                                                Tạo tài khoản
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
    );
}
