import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye } from '@react-icons/all-files/fa/FaEye';
import { FaEyeSlash } from '@react-icons/all-files/fa/FaEyeSlash';
import axios from 'axios';
import '~~/layout/Register.scss';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux';
import actionTypes from '~/store/actions/actionTypes';

export default function Register() {
    const dispatch = useDispatch();
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
    const [show2, setShow2] = useState(false);
    const handleShow2 = () => {
        setShow2(!show2);
    };

    const [values, setValues] = useState({
        name: '',
        email: '',
        password: '',
        confirm_password: '',
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const password_pattern = /^(?=.*[a-z]).{8,}$/;
    const [error, setError] = useState({
        emailErr: null,
        passwordErr: null,
        confirm_passwordErr: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (values.email.length < 0 || values.email === '')
            return setError((prev) => ({
                ...prev,
                emailErr: 'Email không được để trống',
            }));

        if (values.password.length < 0 || !password_pattern.test(values.password) || values.password === '')
            return setError((prev) => ({
                ...prev,
                passwordErr: 'Mật khẩu không được để trống và có ít nhất 8 ký tự',
            }));

        if (
            values.confirm_password.length < 0 ||
            values.confirm_password === '' ||
            String(values.confirm_password) !== String(values.password)
        )
            return setError((prev) => ({
                ...prev,
                confirm_passwordErr: 'Mật khẩu không trùng khớp!!',
            }));

        if (error.emailErr === null || error.passwordErr === null || error.confirm_passwordErr === null)
            axios
                .post('http://localhost:8081/api/auth/register', {
                    name: values.name,
                    email: values.email,
                    password: values.password,
                })
                .then((res) => {
                    console.log(res);
                    if (res.data.err === 1) {
                        notifyWarning('Email đã tồn tại');
                    } else {
                        notifySuccess('Đăng ký thành công !');
                        dispatch({
                            type: actionTypes.LOGIN_SUCCESS,
                            data: res.data.token,
                        });
                        setTimeout(() => {
                            navigate('/home');
                        }, 3000);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        // } else {
        //     notifyWarning('Hãy nhập thông tin đầy đủ');
        // }
    };

    return (
        <div className="bg-gradient-primary">
            <div className="container p-5">
                <div className="card o-hidden border-0 shadow-lg mb-5">
                    <div className="card-body p-0 ">
                        <div className=" m-center ">
                            <div className="text-center">
                                <h1 className="h3 text-gray-900 mb-4 text-uppercase">Tạo tài khoản</h1>

                                <form className="user" onSubmit={handleSubmit}>
                                    <div className="form-group ">
                                        <label className="float-left ml-3 label-regis ">Họ & Tên</label>
                                        <input
                                            type="text"
                                            className="form-control form-control-user"
                                            placeholder="Họ tên"
                                            onChange={handleChange}
                                            name="name"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="float-left ml-3 label-regis ">Email</label>
                                        <input
                                            type="email"
                                            className="form-control form-control-user"
                                            placeholder="example@gmail.com"
                                            onChange={handleChange}
                                            name="email"
                                        />
                                        {error.emailErr && <small className="text-danger pl-3">{error.emailErr}</small>}
                                    </div>

                                    <div className="form-group ">
                                        <label className="float-left ml-3 label-regis ">Mật Khẩu</label>
                                        <input
                                            type={show ? 'text' : 'password'}
                                            className="form-control form-control-user"
                                            placeholder="Mật khẩu"
                                            onChange={(e) => {
                                                setError((prev) => ({
                                                    ...prev,
                                                    passwordErr: null,
                                                }));
                                                handleChange(e);
                                            }}
                                            name="password"
                                        />
                                        <div className="position-absolute eye  cursor-pointer" onClick={handleShow}>
                                            {show ? <FaEyeSlash /> : <FaEye />}
                                        </div>
                                        {error.passwordErr && (
                                            <small className="text-danger pl-3">{error.passwordErr}</small>
                                        )}
                                    </div>

                                    <div className="form-group position-relative">
                                        <label className="float-left ml-3  label-regis ">Nhập Lại Mật Khẩu</label>

                                        <input
                                            type={show2 ? 'text' : 'password'}
                                            className="form-control form-control-user"
                                            placeholder="Nhập lại mật khẩu"
                                            onChange={handleChange}
                                            name="confirm_password"
                                        />
                                        <div
                                            className="position-absolute eye "
                                            style={{ right: '3%' }}
                                            onClick={handleShow2}
                                        >
                                            {show2 ? <FaEyeSlash /> : <FaEye />}
                                        </div>
                                        {error.confirm_passwordErr && (
                                            <small className="text-danger pl-3">{error.confirm_passwordErr}</small>
                                        )}
                                    </div>

                                    <div className="mx-5">
                                        <button className="btn btn-primary btn-user px-5" type="submit">
                                            Đăng Ký
                                        </button>
                                    </div>
                                </form>
                                <ToastContainer />

                                <hr />
                                <div className="text-center">
                                    <Link className="small" to="/login-teacher">
                                        Bạn đã có tài khoản ? Đăng Nhập
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
