import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function UpdateClass() {
    const { classID } = useParams();
    const [classData, setClassData] = useState({
        class_name: '',
        total_students: '',
        content: '',
    });

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

    // Fetch data to populate input fields for update
    useEffect(() => {
        const fetchData = async (cid) => {
            const response = await axios.get(`http://localhost:8081/api/class/${cid}`);

            if (response.data.success && response.data.response.length > 0) {
                const classData = response.data.response[0];
                setClassData({
                    class_name: classData.class_name,
                    total_students: classData.total_students,
                    content: classData.content,
                });
            }
        };
        fetchData(classID);
    }, [classID]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await axios({
            method: 'put',
            url: `http://localhost:8081/api/class/update-class/${classID}`,
            data: classData,
        });
        notifySuccess('Cập nhập thành công');
        setTimeout(() => {
            navigate('/home/class');
        }, 2000);
    };

    return (
        <div className="container-fluid">
            <button
                className="btn btn-back"
                onClick={() => {
                    navigate(-1);
                }}
            >
                <i class="fa-solid fa-arrow-left"></i>
            </button>
            <h1 className="h3 mb-4 text-gray-800 text-center">
                <i className="fa-regular fa-pen-to-square"></i>
                Cập nhật lớp học
            </h1>
            <form className="user" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="text-capitalize font-weight-bold pl-3">Tên lớp</label>
                    <input
                        type="text"
                        placeholder="Nhập tên lớp"
                        style={{ fontSize: 16 }}
                        className="form-control form-control-user "
                        onChange={(e) => setClassData({ ...classData, class_name: e.target.value })}
                        value={classData.class_name}
                        id="className"
                        required
                    />
                    <p className="err2"></p>
                </div>

                <div className="form-group">
                    <label className="text-capitalize font-weight-bold pl-3">Khóa</label>
                    <input
                        placeholder="Nhập khóa học của lớp"
                        style={{ fontSize: 16 }}
                        className="form-control form-control-lg form-control-user"
                        onChange={(e) => setClassData({ ...classData, content: e.target.value })}
                        value={classData.content}
                        id="content"
                        required
                    />
                    <p className="err3"></p>
                </div>

                <button className="btn btn-success px-5 py-2 float-right">Lưu Lớp</button>
            </form>
            <ToastContainer />
        </div>
    );
}
