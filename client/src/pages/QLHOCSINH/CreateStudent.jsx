import { Link, useParams } from 'react-router-dom';
import React, { useState } from 'react';
import { FcHighPriority } from 'react-icons/fc';
import { FcList } from 'react-icons/fc';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import axios from 'axios';

export default function CreateStudent({ classID }) {
    const [student_name, setStudentName] = useState('');
    const [gender, setGender] = useState('');
    const [address, setAddress] = useState('');
    const [birthday, setBirthday] = useState(new Date()); // Sử dụng new Date() để khởi tạo ngày mặc định
    const [isAdding, setIsAdding] = useState(false);
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');

    //
    const navigate = useNavigate();
    const params = useParams();

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

    const handleSubmit = (event) => {
        event.preventDefault();
        if (isAdding) return;
        if (!student_name || !birthday || !gender) {
            notifyError('Vui lòng điền đầy đủ thông tin tên, ngày sinh và giới tính.');
            return;
        }

        setIsAdding(true);

        axios
            .post('http://localhost:8081/api/student/', {
                classID: params.classID,
                student_name,
                gender,
                address,
                birthday: birthday.toISOString().split('T')[0], // Chuyển đổi ngày sinh thành chuỗi "yyyy-MM-dd"
                username,
                password,
            })
            .then((res) => {
                console.log(res);
                notifySuccess('Thêm học sinh thành công');
                setTimeout(() => {
                    navigate('/home/class/get-student/' + params.classID);
                    setIsAdding(false);
                }, 2000);
            })
            .catch((err) => {
                console.log(err);
                setIsAdding(false);
            });
    };

    return (
        <div className="container-fluid">
            <button
                className="btn btn-back"
                onClick={() => {
                    navigate(-1);
                }}
            >
                <i className="fa-solid fa-arrow-left"></i>
            </button>
            <h1 className="h3 mb-5 text-gray-800 text-center">
                <FcList className="mr-3" />
                Thêm học sinh
            </h1>
            <form className="mt-3 user mx-5" onSubmit={handleSubmit}>
                <div className="form-row">
                    <div className="col-6">
                        <label className="text-capitalize font-weight-bold pl-2">
                            Họ và tên <b className="text-danger">*</b>
                        </label>
                        <input
                            type="text"
                            style={{ fontSize: 16 }}
                            placeholder="Nhập tên học sinh"
                            className="form-control form-control-user"
                            onChange={(text) => setStudentName(text.target.value)}
                        />
                    </div>
                    <div className="col-6">
                        <label htmlFor="" className="font-weight-bold">
                            Ngày sinh <b className="text-danger">*</b>
                        </label>
                        <div>
                            <DatePicker
                                selected={birthday}
                                onChange={(date) => setBirthday(date)}
                                placeholderText="Chọn ngày sinh"
                                dateFormat="dd-MM-yyyy"
                                className="form-control form-control-user"
                                wrapperClassName="custom-datepicker-wrapper form-control form-control-l"
                            />
                        </div>
                    </div>
                </div>
                <div className="form-row mt-5">
                    <div className="col-6">
                        <label className="text-capitalize font-weight-bold pl-2">
                            username <b className="text-danger">*</b>
                        </label>
                        <input
                            type="text"
                            style={{ fontSize: 16 }}
                            placeholder="Nhập tên đăng nhập của học sinh"
                            className="form-control form-control-user"
                            onChange={(text) => setUserName(text.target.value)}
                        />
                    </div>
                    <div className="col-6">
                        <label htmlFor="" className="font-weight-bold">
                            Mật khẩu <b className="text-danger">*</b>
                        </label>
                        <input
                            type="text"
                            style={{ fontSize: 16 }}
                            placeholder="Nhập mật khẩu của học sinh"
                            className="form-control form-control-user"
                            onChange={(text) => setPassword(text.target.value)}
                        />
                    </div>
                </div>
                <div className="form-row mt-5">
                    <div className="col-6">
                        <label className="text-capitalize font-weight-bold pl-2">Quê quán</label>
                        <input
                            type="text"
                            style={{ fontSize: 16 }}
                            placeholder="Nhập quê quán"
                            className="form-control form-control-user"
                            onChange={(text) => setAddress(text.target.value)}
                        />
                    </div>
                    <div className="col-6">
                        <label className="text-capitalize font-weight-bold pl-2">
                            Giới tính <b className="text-danger">*</b>
                        </label>
                        <select
                            className="custom-select"
                            style={{ height: 50, borderRadius: 100 }}
                            value={gender}
                            onChange={(text) => setGender(text.target.value)}
                        >
                            <option value="">Chọn giới tính</option>
                            <option value="Nam">Nam</option>
                            <option value="Nữ">Nữ</option>
                            <option value="Khác">Khác</option>
                        </select>
                    </div>
                </div>
                <div className="text-center mt-5">
                    <button type="submit" className="btn btn-success px-5 py-2" disabled={isAdding}>
                        {isAdding ? 'Đang thêm...' : 'Lưu'}
                    </button>
                </div>
            </form>
            <ToastContainer />
        </div>
    );
}
