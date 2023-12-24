import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import moment from 'moment/moment';
import 'react-toastify/dist/ReactToastify.css';

export default function UpdateStudent() {
    const navigate = useNavigate();
    const { studentID, classID } = useParams();
    const [studentData, setStudentData] = useState({
        student_name: '',
        gender: '',
        address: '',
        birthday: '',
    });
    const location = useLocation();
    const initialStudentData = location.state ? location.state.studentData : {};

    useEffect(() => {
        setStudentData(initialStudentData);
    }, [initialStudentData]);

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!studentData.student_name || !studentData.birthday || !studentData.gender) {
            notifyError('Vui lòng điền đầy đủ thông tin tên, ngày sinh và giới tính.');
            return;
        }

        try {
            const formattedBirthday = moment(studentData.birthday, 'YYYY-MM-DD').format('YYYY-MM-DD');

            const response = await axios.put(
                `http://localhost:8081/api/student/update-student/${classID}/${studentID}`,
                {
                    ...studentData,
                    birthday: formattedBirthday,
                },
            );

            if (response.status === 200) {
                notifySuccess('Cập nhập thành công');
                setTimeout(() => {
                    navigate('/home/class/get-student/' + classID);
                }, 2000);
            } else {
                notifyError('Lỗi cập nhật dữ liệu: ' + response.data);
            }
        } catch (err) {
            notifyError('Lỗi cập nhật dữ liệu: ' + err.message);
        }
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
                Cập nhật học sinh
            </h1>
            <form className="mt-3 user mx-5" onSubmit={handleSubmit}>
                <div className="form-row">
                    <div className="col-6">
                        <label htmlFor="" className="text-capitalize font-weight-bold pl-3">
                            Tên học sinh
                        </label>
                        <input
                            type="text"
                            placeholder="Nhập tên học sinh"
                            style={{ fontSize: 16 }}
                            className="form-control form-control-user"
                            onChange={(e) => setStudentData({ ...studentData, student_name: e.target.value })}
                            value={studentData.student_name}
                        />
                    </div>
                    <div className="col-6">
                        <label className="text-capitalize font-weight-bold pl-3">Ngày sinh</label>
                        <input
                            type="date"
                            className="form-control form-control-user"
                            style={{ fontSize: 16 }}
                            onChange={(e) => setStudentData({ ...studentData, birthday: e.target.value })}
                            value={moment(studentData.birthday, 'YYYY-MM-DD').format('YYYY-MM-DD')}
                        />
                    </div>
                </div>
                <div className="form-row mt-5">
                    <div className="col-6 mt-3">
                        <label className="text-capitalize font-weight-bold pl-3">Giới tính</label>
                        <select
                            type="text"
                            style={{ height: 50, borderRadius: 100 }}
                            className="custom-select"
                            onChange={(e) => setStudentData({ ...studentData, gender: e.target.value })}
                            value={studentData.gender}
                        >
                            <option value="">Chọn giới tính</option>
                            <option value="Nam">Nam</option>
                            <option value="Nữ">Nữ</option>
                            <option value="Khác">Khác</option>
                        </select>
                    </div>
                    <div className="col-6 mt-3">
                        <label htmlFor="status" className="text-capitalize font-weight-bold pl-3">
                            Quê quán
                        </label>
                        <input
                            type="text"
                            placeholder="Nhập ghi chú"
                            style={{ fontSize: 16 }}
                            className="form-control form-control-user"
                            onChange={(e) => setStudentData({ ...studentData, address: e.target.value })}
                            value={studentData.address}
                        />
                    </div>
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
