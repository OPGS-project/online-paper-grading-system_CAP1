import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function EditAssignment() {
    const navigate = useNavigate();
    return (
        <div className="container-fluid">
            <button
                className="btn btn-back"
                onClick={() => {
                    navigate('/assignment');
                }}
            >
                <i class="fa-solid fa-arrow-left"></i>
            </button>
            <div className="text-center text-uppercase font-italic">
                <h1 className="h5 text-gray-900 mb-4">
                    <i className="fa-regular fa-pen-to-square"></i>Chỉnh sửa bài tập
                </h1>
            </div>
            <div className="row space-row">
                <div className="col-md-4 d-none d-lg-block px-3 ">
                    <form className="user">
                        <div className="form-group">
                            <label htmlFor="name-bt" className="text-capitalize font-weight-bold pl-2">
                                tên bài tập
                            </label>
                            <input type="text" className="form-control form-control-user" id="name-bt" />
                        </div>
                        <div className="form-group row">
                            <div className="col-sm-6 mb-3 mb-sm-0">
                                <label htmlFor="from" className="text-capitalize font-weight-bold pl-2">
                                    Từ
                                </label>
                                <input
                                    type="date"
                                    className="form-control form-control-user"
                                    id="from"
                                    placeholder="Password"
                                />
                            </div>
                            <div className="col-sm-6">
                                <label htmlFor="to" className="text-capitalize font-weight-bold pl-3">
                                    Đến
                                </label>
                                <input type="date" className="form-control form-control-user" id="to" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="name-bt" className="text-capitalize font-weight-bold pl-2">
                                Nội dung
                            </label>
                            <textarea type="textariea" className="form-control content-bt" id="name-bt" />
                        </div>
                        <div className="form-group d-flex justify-content-between row">
                            <div className="col-5">
                                <label htmlFor="name-bt" className="text-capitalize font-weight-bold pl-2">
                                    Cho xem kết Quả
                                </label>
                            </div>
                            <div className="col-5 d-flex justify-content-between">
                                <div className="form-check">
                                    <input className="form-check-input" type="radio" name="flexRadioDefault" id="yes" />
                                    <label className="form-check-label" for="flexRadioDefault1">
                                        Có
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="flexRadioDefault"
                                        id="no"
                                        checked
                                    />
                                    <label className="form-check-label" for="flexRadioDefault2">
                                        Không
                                    </label>
                                </div>
                            </div>
                        </div>
                        <button className="btn btn-outline-success float-right ">Lưu</button>
                    </form>
                </div>
            </div>
        </div>
    );
}
