import React from 'react';
import { useState } from 'react';
import '~~/pages/user/Updatepass.scss';
import { Link } from 'react-router-dom';
import { FaEye } from '@react-icons/all-files/fa/FaEye';
import { FaEyeSlash } from '@react-icons/all-files/fa/FaEyeSlash';

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
    return (
        <div className="container pt-5">
            <div className="card o-hidden border-0 shadow-lg ">
                <div className="card-body p-0 ">
                    <div className="p-5">
                        <h1 className="h1 text-center mb-4 text-uppercase">Cập nhật mật khẩu</h1>
                        <form className="user">
                            <div className="form-group mb-3 position-relative d-flex ">
                                <label htmlFor="password" className="ml-2 mt-2 col-3">
                                    Nhập mật khẩu hiện tại
                                </label>
                                <input
                                    type={show ? 'text' : 'password'}
                                    className="form-control form-control-user col-5"
                                    id="password"
                                />
                                <div className="position-absolute icon-show" onClick={handleShow}>
                                    {show ? <FaEyeSlash /> : <FaEye />}
                                </div>
                            </div>
                            <div className="form-group mb-3 position-relative d-flex ">
                                <label htmlFor="password" className="ml-2 mt-2 col-3">
                                    Nhập mật khẩu mới
                                </label>
                                <input
                                    type={show ? 'text' : 'password'}
                                    className="form-control form-control-user col-5 "
                                    id="password"
                                />
                                <div className="position-absolute icon-show" onClick={handleShow2}>
                                    {show2 ? <FaEyeSlash /> : <FaEye />}
                                </div>
                            </div>
                            <div className="form-group mb-3 position-relative d-flex ">
                                <label htmlFor="password" className="ml-2 mt-2 col-3">
                                    Xác nhận lại mật khẩu
                                </label>
                                <input
                                    type={show ? 'text' : 'password'}
                                    className="form-control form-control-user col-5 "
                                    id="password"
                                />
                                <div className="position-absolute icon-show" onClick={handleShow3}>
                                    {show3 ? <FaEyeSlash /> : <FaEye />}
                                </div>
                            </div>

                            <Link to="/" className="btn btn-outline-success float-right ">
                                Lưu<t></t>
                            </Link>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
