import React from 'react';
import { useNavigate } from 'react-router-dom';
import '~~/pages/user/Profile.scss';

function Profile() {
    const navigate = useNavigate();
    return (
        <div class="container-fluid">
            <div className="d-flex mb-3">
                <button
                    className="btn btn-back"
                    onClick={() => {
                        navigate('/add-assignment');
                    }}
                >
                    <i class="fa-solid fa-arrow-left"></i>
                </button>
                <h3 className="text-center ml-5 ">Thông tin cá nhân</h3>
            </div>
            <form className="user">
                <div className="row justify-content-around">
                    <div className="col-md-5 flex-grow-1">
                        <div className="form-group">
                            <label htmlFor="name-bt" className="pl-2">
                                Họ và Tên
                            </label>
                            <input type="text" className="form-control form-control-user" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="name-bt" className="pl-2">
                                Email
                            </label>
                            <input type="text" className="form-control form-control-user" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="name-bt" className="pl-2">
                                Số điện thoại
                            </label>
                            <input type="text" className="form-control form-control-user" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="name-bt" className="pl-2">
                                Địa chỉ
                            </label>
                            <input type="text" className="form-control form-control-user" />
                        </div>
                    </div>
                    <div className="col-md-3 update-img mt-5">
                        <img
                            className=" img"
                            src="https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png"
                            alt=""
                        />
                        <button className="btn btn-success p-2">Chọn hình ảnh</button>
                    </div>
                </div>
                <div className="row justify-content-center mt-5">
                    <button className="col-1 mr-5 btn btn-outline-warning">Hủy</button>
                    <button className="col-1 btn btn-primary ">Cập Nhật</button>
                </div>
            </form>
        </div>
    );
}

export default Profile;
