import { FcList } from 'react-icons/fc';
import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CreateClass() {
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
          autoClose: 5000,
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
        axios
            .post('http://localhost:8081/api/class/', {
                class_name,
                total_students,
                content,
            })
            .then((res) => {
                console.log(res);
                notifySuccess("Thêm lớp thành công");
                setTimeout(() => {
                    navigate('/home/class'); // thành công sẽ chuyển hướng
                }, 5000);
            })
            .catch((err) => console.log(err));
    };
    return (
        <div className="container-fluid">
            <button
                className="btn btn-back"
                onClick={() => {
                    navigate('/home/class');
                }}
            >
                <i class="fa-solid fa-arrow-left"></i>
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
                    <label className="text-capitalize font-weight-bold pl-2">Sĩ số</label>
                    <input
                        type="text"
                        className="form-control form-control-lg form-control-user"
                        required
                        name="total_students"
                        onChange={(e) => setTotalStudent(e.target.value)}
                    />
                </div>

                <div className="form-row mt-3">
                    <label htmlFor="name-bt" className="text-capitalize font-weight-bold pl-2">
                        Ghi chú
                    </label>
                    <textarea
                        type="textariea"
                        className="form-control content-bt"
                        id="name-bt"
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


