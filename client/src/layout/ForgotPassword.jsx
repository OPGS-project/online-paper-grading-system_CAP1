import { Link } from 'react-router-dom';
import '~~/layout/ForgotPassword.scss';

function ForgotPassword() {
    return (
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
                                                Chỉ cần nhập địa chỉ email của bạn dưới đây và chúng tôi sẽ gửi cho bạn
                                                một liên kết để đặt lại mật khẩu của bạn!
                                            </p>
                                        </div>
                                        <form className="user">
                                            <div className="form-group">
                                                <input
                                                    type="email"
                                                    className="form-control form-control-user"
                                                    id="exampleInputEmail"
                                                    aria-describedby="emailHelp"
                                                    placeholder="Nhập địa chỉ Email ... "
                                                />
                                            </div>
                                            <Link to="/change-password" className="btn btn-primary btn-user btn-block">
                                                Đặt lại mật khẩu
                                            </Link>
                                        </form>
                                        <hr />
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
