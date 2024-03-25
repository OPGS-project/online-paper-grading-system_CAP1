import { Link, useNavigate } from 'react-router-dom';
import '~~/layout/ForgotPassword.scss';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { useState } from 'react';

function ForgotPassword() {
    const navigate = useNavigate();
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
    const [values, setValues] = useState({
        email: '',
    });
    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };
    const handleResetPass = (e) => {
        e.preventDefault();
        axios
            .post('http://localhost:8081/api/auth/reset-password', values)
            .then((res) => {
                console.log(res);
                notifySuccess('Kiểm tra email của bạn!');
                setTimeout(() => {
                    navigate('/login-teacher');
                }, 3000);
            })
            .catch((err) => {
                console.log(err);
            });
    };
    console.log(values);
    return (
        <div className="bg-gradient-primary">
            <div className="container-fluid ">
                <div className="row justify-content-center">
                    <div className="col-xl-10 col-lg-12 col-md-9">
                        <div className="card o-hidden border-0 shadow-lg my-5">
                            <div className="card-body p-0">
                                <div className="row">
                                    <div className="col-lg-6 d-none d-lg-block bg-password-image"></div>
                                    <div className="col-lg-6">
                                        <div className="p-5">
                                            <div className="text-center">
                                                <h1 className="h4 text-gray-900 mb-2">Bạn quên mật khẩu ?</h1>
                                                <p className="mb-4">
                                                    Chỉ cần nhập địa chỉ email của bạn dưới đây và chúng tôi sẽ gửi cho
                                                    bạn một liên kết để đặt lại mật khẩu của bạn!
                                                </p>
                                            </div>
                                            <form className="user">
                                                <div className="form-group">
                                                    <input
                                                        type="email"
                                                        className="form-control form-control-user"
                                                        name="email"
                                                        aria-describedby="emailHelp"
                                                        placeholder="Nhập địa chỉ Email ... "
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                                <btn
                                                    className="btn btn-primary btn-user btn-block"
                                                    onClick={handleResetPass}
                                                >
                                                    Đặt lại mật khẩu
                                                </btn>
                                                <hr />
                                                <btn
                                                    className="btn btn-user btn-block"
                                                    onClick={() => navigate('/login-teacher')}
                                                >
                                                    Quay lại
                                                </btn>
                                            </form>
                                            <ToastContainer />
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

export default ForgotPassword;
