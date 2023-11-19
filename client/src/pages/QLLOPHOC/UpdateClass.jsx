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
            autoClose: 5000,
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
        }, 5000);
    };

    return (
        <div className="container-fluid">
            <button className="btn btn-primary" onClick={() => navigate('/home/class')}>
                <i className="bi bi-arrow-left"></i> Quay lại
            </button>
            <h1 className="h3 mb-4 text-gray-800 text-center">
                Cập nhật lớp
                <small className="d-block mt-2">(Điền thông tin lớp vào biểu mẫu dưới đây)</small>
            </h1>
            <form className="mt-5" onSubmit={handleSubmit}>
                <h4 className="h4 mb-4 text-gray-800">Biểu mẫu:</h4>
                <div className="form-row">
                    <div className="col-12">
                        <label htmlFor="className">Tên lớp:</label>
                        <input
                            type="text"
                            placeholder="Nhập tên lớp"
                            className="form-control form-control-lg"
                            onChange={(e) => setClassData({ ...classData, class_name: e.target.value })}
                            value={classData.class_name}
                            id="className"
                            required
                        />
                        <p className="err2"></p>
                    </div>
                </div>
                <div className="form-row">
                    <div className="col-6">
                        <label htmlFor="totalStudent">Sĩ số:</label>
                        <input
                            type="text"
                            placeholder="Nhập sĩ số học sinh"
                            className="form-control form-control-lg"
                            onChange={(e) => setClassData({ ...classData, total_students: Number(e.target.value) })}
                            value={classData.total_students}
                            id="totalStudent"
                            required
                        />
                        <p className="err2"></p>
                    </div>
                    <div className="col-6">
                        <label htmlFor="status">Ghi chú:</label>
                        <input
                            type="text"
                            placeholder="Nhập ghi chú"
                            className="form-control form-control-lg"
                            onChange={(e) => setClassData({ ...classData, content: e.target.value })}
                            value={classData.content}
                            id="content"
                            required
                        />
                        <p className="err3"></p>
                    </div>
                </div>
                <div className="text-center mt-5">
                    <button type="submit" className="btn-lg btn-primary">
                        Cập nhật lớp
                    </button>
                </div>
            </form>
            <ToastContainer />
        </div>
    );
}
