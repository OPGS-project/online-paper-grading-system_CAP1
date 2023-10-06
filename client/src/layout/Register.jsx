import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye } from '@react-icons/all-files/fa/FaEye';
import { FaEyeSlash } from '@react-icons/all-files/fa/FaEyeSlash';
import Validation from './RegisterValidation';
import axios from 'axios';
import '~~/layout/Register.scss';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Register() {
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
    });

    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const handleChange = (e) => {
        setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors(Validation(values));
        // console.log(errors.email, '===', errors.password, '===', errors.confirm_password);
        if (Object.is(errors.email, '') && Object.is(errors.password, '') && Object.is(errors.confirm_password, '')) {
            axios
                .post('http://localhost:8081/api/v1/auth/register', values)
                .then((res) => {
                    console.log(res);
                    console.log('okkkk');
                    notifySuccess('Đăng ký thành công !');
                    setTimeout(() => {
                        navigate('/login');
                    }, 3000); // chuyển trang sau 5s
                })
                .catch((err) => {
                    console.log(err);
                });
        } else {
            notifyWarning('Hãy nhập thông tin đầy đủ');
        }
    };

    return (
        <div className="container pt-5">
            <div className="card o-hidden border-0 shadow-lg ">
                <div className="card-body p-0 ">
                    <div className="p-5 m-center ">
                        <div className="text-center">
                            <h1 className="h3 text-gray-900 mb-4 text-uppercase">Tạo tài khoản</h1>

                            <form className="user" onSubmit={handleSubmit}>
                                <div className="form-group has-validation">
                                    <input
                                        type="text"
                                        className="form-control form-control-user"
                                        id="validationCustom02"
                                        placeholder="Họ & Tên "
                                        onChange={handleChange}
                                        name="name"
                                        required
                                    />
                                </div>
                                <div className="form-group has-validation">
                                    <input
                                        type="email"
                                        className="form-control form-control-user"
                                        id="validationCustomUsername"
                                        aria-describedby="inputGroupPrepend"
                                        placeholder="Địa chỉ Email"
                                        onChange={handleChange}
                                        name="email"
                                    />
                                    {errors.email && <span className="text-danger">{errors.email}</span>}
                                </div>
                                <div className="form-group row">
                                    <div className="col-sm-6 mb-3 mb-sm-0">
                                        <input
                                            type={show ? 'text' : 'password'}
                                            className="form-control form-control-user"
                                            placeholder="Mật khẩu"
                                            onChange={handleChange}
                                            name="password"
                                        />
                                        <div className="position-absolute eye cursor-pointer" onClick={handleShow}>
                                            {show ? <FaEyeSlash /> : <FaEye />}
                                        </div>
                                        {errors.password && <span className="text-danger">{errors.password}</span>}
                                    </div>
                                    <div className="col-sm-6">
                                        <input
                                            type={show ? 'text' : 'password'}
                                            className="form-control form-control-user"
                                            placeholder="Nhập lại mật khẩu"
                                            onChange={handleChange}
                                            name="confirm_password"
                                        />
                                        <div className="position-absolute eye  " onClick={handleShow2}>
                                            {show2 ? <FaEyeSlash /> : <FaEye />}
                                        </div>
                                        {errors.confirm_password && (
                                            <span className="text-danger">{errors.confirm_password}</span>
                                        )}
                                    </div>
                                </div>
                                <button className="btn btn-primary btn-user btn-block" type="submit">
                                    Đăng Ký
                                </button>
                                <hr />
                                <Link to="/" className="btn btn-google btn-user btn-block">
                                    <i className="fab fa-google fa-fw"></i> Đăng ký bằng Google
                                </Link>
                            </form>
                            <ToastContainer />

                            <hr />
                            <div className="text-center">
                                <Link className="small" to="/login">
                                    Bạn đã có tài khoản ? Đăng Nhập
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
