import { FcList } from 'react-icons/fc';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { apiGetOne } from '~/apis/userService';

export default function CreateClass() {
    const { token } = useSelector((state) => state.auth);

    const [class_name, setClassName] = useState('');
    const [total_students, setTotalStudent] = useState('');
    const [content, setContent] = useState('');
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

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const user = await apiGetOne(token);
            const id_teacher = user.data.response.id;

            const postData = {
                class_name,
                total_students,
                content,
                id_teacher,
            };

            const response = await axios.post('http://localhost:8081/api/class/', postData);

            console.log(response);

            notifySuccess('Thêm lớp thành công');

            setTimeout(() => {
                navigate('/home/class'); // thành công sẽ chuyển hướng
            }, 2000);
        } catch (error) {
            console.error(error);
            notifyError('Đã có lỗi xảy ra khi thêm lớp');
        }
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
                        className="form-control form-control-lg form-control-user"
                        required
                        onChange={(e) => setClassName(e.target.value)}
                    />
                </div>

                <div className="form-row mt-3">
                    <label htmlFor="name-bt" className="text-capitalize font-weight-bold pl-2">
                        Ghi chú
                    </label>
                    <textarea
                        type="textaria"
                        className="form-control content-bt"
                        id="name-bt"
                        value="Không"
                        onChange={(e) => setContent(e.target.value)}
                    />
                </div>
                <div className="text-center mt-5">
                    <button type="submit" className="btn btn-success px-5 py-2">
                        Lưu
                    </button>
                    <button className="btn btn-light px-5 py-2 ml-3">Hủy</button>
                </div>
            </form>
            <ToastContainer />
        </div>
    );
}
