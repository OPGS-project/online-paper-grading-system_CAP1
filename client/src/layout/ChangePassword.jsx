import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEye } from '@react-icons/all-files/fa/FaEye';
import { FaEyeSlash } from '@react-icons/all-files/fa/FaEyeSlash';
import '~~/layout/ChangePassword.scss';

export default function ChangePassword() {
    const [show, setShow] = useState(false);
    const handleShow = () => {
        setShow(!show);
    };
    const [show2, setShow2] = useState(false);
    const handleShow2 = () => {
        setShow2(!show2);
    };
    return (
        <div className="container pt-5">
            <div className="card o-hidden border-0 shadow-lg ">
                <div className="card-body p-0 ">
                    <div className="p-5 m-center ">
                        <h1 className="h1 text-gray-900 mb-4 text-uppercase text-center">Thay đổi mật khẩu</h1>
                        <form className="user">
                            <div className="form-group mb-3 position-relative d-flex justify-content-around">
                                <label htmlFor="password" className="mr-5 mt-2  ">
                                    Nhập mật khẩu mới
                                </label>
                                <input
                                    type={show ? 'text' : 'password'}
                                    className="form-control form-control-user col-5 "
                                    id="password"
                                />
                                <div className="position-absolute eye" onClick={handleShow}>
                                    {show ? <FaEyeSlash /> : <FaEye />}
                                </div>
                            </div>
                            <div className="form-group mb-3 position-relative d-flex justify-content-around">
                                <label htmlFor="password" className="mr-5 mt-2">
                                    Xác nhận lại mật khẩu
                                </label>
                                <input
                                    type={show ? 'text' : 'password'}
                                    className="form-control form-control-user col-5 "
                                    id="password"
                                />
                                <div className="position-absolute eye" onClick={handleShow2}>
                                    {show2 ? <FaEyeSlash /> : <FaEye />}
                                </div>
                            </div>
                            <Link to="/login" className="btn btn-success btn-user btn-pass">
                                Xác Nhận
                            </Link>
                            <hr />
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
