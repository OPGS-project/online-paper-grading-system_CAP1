import React from 'react';
import { useState } from 'react';
import '~~/pages/user/Updatepass.scss';

import { FaEye } from '@react-icons/all-files/fa/FaEye';
import { FaEyeSlash } from '@react-icons/all-files/fa/FaEyeSlash';

import { apiChangePassTeacher } from '~/apis/userService';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

export default function UpdatePass() {
    const [show, setShow] = useState(false);
    const handleShow = () => {
        setShow(!show);
    };
    const [show2, setShow2] = useState(false);
    const handleShow2 = () => {
        setShow2(!show2);
    };
    const [show3, setShow3] = useState(false);
    const handleShow3 = () => {
        setShow3(!show3);
    };
    //
    const notifySuccess = (errorMessage) => {
        toast.success(errorMessage, {
            position: 'top-right',
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'light',
        });
    };
    const notifyError = (errorMessage) => {
        toast.error(errorMessage, {
            position: 'top-right',
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'light',
        });
    };
    //

    const [values, setValues] = useState({
        password: '',
        newPassword: '',
        confirm_password: '',
    });

    const [error, setError] = useState({
        errNewPassword: null,
        errConfirmPass: null,
    });

    //
    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };
    const { token } = useSelector((state) => state.auth);
    // const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (values.newPassword === '') {
            return setError((prev) => ({
                ...prev,
                errNewPassword: 'Mật khẩu mới không được để trống',
            }));
        }
        if (values.confirm_password === '' || String(values.confirm_password) !== String(values.newPassword)) {
            return setError((prev) => ({
                ...prev,
                errConfirmPass: 'Mật khẩu không trùng khớp!!',
            }));
        }

        if (error.errNewPassword === null || error.errConfirmPass === null) {
            const response = await apiChangePassTeacher(token, {
                password: values.password,
                newPassword: values.newPassword,
            });
            // console.log(response);
            if (response?.data.err === 0) {
                notifySuccess('Cập nhật mật khẩu thành công');
            } else {
                notifyError('Có lỗi gì đó');
            }
        } else {
            alert('hahaha');
        }
    };

    return (
        <div className="container pt-5">
            <div className="card o-hidden border-0 shadow-lg ">
                <div className="card-body p-0 ">
                    <div className="p-5">
                        <h1 className="h1 text-center mb-4 text-uppercase">Cập nhật mật khẩu</h1>
                        <form className="user" onSubmit={handleSubmit}>
                            <div className="form-group  ">
                                <div className="mb-3 position-relative d-flex">
                                    <label htmlFor="password" className="ml-2 mt-2 col-3">
                                        Nhập mật khẩu hiện tại
                                    </label>
                                    <input
                                        type={show ? 'text' : 'password'}
                                        className="form-control form-control-user col-5"
                                        id="password"
                                        onChange={handleChange}
                                        name="password"
                                    />
                                    <div className="position-absolute icon-show" onClick={handleShow}>
                                        {show ? <FaEyeSlash /> : <FaEye />}
                                    </div>
                                </div>
                            </div>

                            <div className="form-group mb-3 position-relative d-flex ">
                                <label htmlFor="password" className="ml-2 mt-2 col-3">
                                    Nhập mật khẩu mới
                                </label>
                                <input
                                    type={show2 ? 'text' : 'password'}
                                    className="form-control form-control-user col-5 "
                                    id="password"
                                    onChange={(e) => {
                                        setError((prev) => ({
                                            ...prev,
                                            errNewPassword: null,
                                        }));
                                        handleChange(e);
                                    }}
                                    name="newPassword"
                                />
                                <div className="position-absolute icon-show" onClick={handleShow2}>
                                    {show2 ? <FaEyeSlash /> : <FaEye />}
                                </div>
                            </div>
                            {error.errNewPassword && (
                                <small className="text-danger " style={{ marginLeft: '27%' }}>
                                    {error.errNewPassword}
                                </small>
                            )}
                            <div className="form-group mb-3 position-relative d-flex ">
                                <label htmlFor="password" className="ml-2 mt-2 col-3">
                                    Xác nhận lại mật khẩu
                                </label>
                                <input
                                    type={show3 ? 'text' : 'password'}
                                    className="form-control form-control-user col-5 "
                                    id="password"
                                    onChange={(e) => {
                                        setError((prev) => ({
                                            ...prev,
                                            errConfirmPass: null,
                                        }));
                                        handleChange(e);
                                    }}
                                    name="confirm_password"
                                />
                                <div className="position-absolute icon-show" onClick={handleShow3}>
                                    {show3 ? <FaEyeSlash /> : <FaEye />}
                                </div>
                            </div>
                            {error.errConfirmPass && (
                                <small className="text-danger" style={{ marginLeft: '27%' }}>
                                    {error.errConfirmPass}
                                </small>
                            )}

                            <button className="btn btn-outline-success float-right ">Lưu</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
