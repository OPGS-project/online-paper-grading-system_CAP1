import { FcList } from 'react-icons/fc';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { apiGetOne } from '~/apis/userService';
import { Input } from 'reactstrap';

export default function CreateClass() {
    const { token } = useSelector((state) => state.auth);

    const navigate = useNavigate();

    const notifyError = (errorMessage) => {
        toast.error(errorMessage, {
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
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'light',
        });
    };

    const [values, setValues] = useState({
        class_name: '',
        content: '2023-2026',
    });
    console.log(values);
    const handleSubmit = (event) => {
        event.preventDefault();

        axios
            .post('http://localhost:8081/api/class/', values, {
                headers: {
                    authorization: token,
                },
            })

            .then((res) => {
                console.log(res);
                if (res.data.err === 0) {
                    notifySuccess('Thêm lớp thành công');

                    setTimeout(() => {
                        navigate('/home/class'); // thành công sẽ chuyển hướng
                    }, 2000);
                } else {
                    notifyError('Đã có lỗi xảy ra khi thêm lớp');
                }
            })
            .catch((e) => console.log(e));
    };

    return (
        <div className="container-fluid">
            <button
                className="btn btn-back"
                onClick={() => {
                    navigate('/home/class');
                }}
            >
                <i className="fa-solid fa-arrow-left"></i>
            </button>
            <h1 className="h3 mb-4 text-gray-800 text-center">
                <FcList className="mr-3" />
                Thêm lớp học
                <small className="d-block mt-2"></small>
            </h1>
            <form className="mt-5 user mx-5" onSubmit={handleSubmit}>
                <div className="form-row">
                    <label className="text-capitalize font-weight-bold pl-2">Tên lớp</label>
                    <input
                        type="text"
                        style={{ fontSize: 16 }}
                        className="form-control form-control-lg form-control-user"
                        required
                        name="class_name"
                        onChange={(e) => setValues((prev) => ({ ...prev, class_name: e.target.value }))}
                    />
                </div>

                <div className="form-row mt-3">
                    <label htmlFor="name-bt" className="text-capitalize font-weight-bold pl-2">
                        Khóa
                    </label>
                    <input
                        style={{ fontSize: 16 }}
                        className="form-control form-control-lg form-control-user"
                        id="name-bt"
                        name="content"
                        value={values.content}
                        onChange={(e) => setValues((prev) => ({ ...prev, content: e.target.value }))}
                    />
                </div>
                <div className="text-center mt-5">
                    <button type="submit" className="btn btn-success px-5 py-2">
                        Lưu
                    </button>
                </div>
            </form>
            <ToastContainer />
        </div>
    );
}
