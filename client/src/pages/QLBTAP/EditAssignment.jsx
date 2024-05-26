import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';

export default function EditAssignment() {
    const navigate = useNavigate();
    const params = useParams();
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

    const [assignment, setAssignment] = useState({});

    const [classData, setClassData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        axios
            .get('http://localhost:8081/api/class/', {
                headers: {
                    authorization: token,
                },
            })
            .then((res) => setClassData(res.data.classData.rows))
            .catch((err) => console.error(err));
    }, []);
    //
    const { token } = useSelector((state) => state.auth);

    useEffect(() => {
        axios
            .get(`http://localhost:8081/api/assignment/${params.assignmentId}`, {
                headers: {
                    authorization: token,
                },
            })
            .then((res) => setAssignment({ ...res.data.response[0] }))
            .catch((err) => console.error(err));
    }, [params]);

    const handleChange = (e) => {
        setAssignment({ ...assignment, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        for (const i of Object.entries(assignment)) {
            if (i[0] === 'id') continue;
            if (i[1] === null) continue;
            if (i[1] === '') continue;
            if (i[0] === 'createdAt') continue;
            if (i[0] === 'updatedAt') continue;
            if (i[0] === 'file_path' && typeof i[1] === 'string') continue;

            formData.append(i[0], i[1]);
        }
        setIsLoading(true);

        axios({
            method: 'put',
            url: `http://localhost:8081/api/assignment/${assignment.id}`,
            headers: {
                authorization: token,
            },
            data: formData,
        })
            .then((res) => {
                setIsLoading(false);
                notifySuccess('Sửa bài tập thành công!');
                setTimeout(() => {
                    navigate('/home/assignment');
                }, 2000);
            })
            .catch((err) => console.error(err));
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

            <h1 className="h3 mb-4 text-gray-800 text-center">
                <i className="fa-regular fa-pen-to-square"></i>
                Cập nhật bài tập
            </h1>
            <ToastContainer />
            <form className="user" onSubmit={(e) => handleSubmit(e, token)}>
                <div className="form-group">
                    <label htmlFor="name-bt" className="text-capitalize font-weight-bold pl-2">
                        tên bài tập
                    </label>
                    <input
                        type="text"
                        className="form-control form-control-user"
                        style={{ fontSize: 16 }}
                        id="name-bt"
                        name="assignment_name"
                        value={assignment.assignment_name}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="class-select" className="text-capitalize font-weight-bold pl-2">
                        Lớp
                    </label>

                    <select
                        className="custom-select"
                        style={{ height: 50, borderRadius: 100 }}
                        id="class-select"
                        name="of_class"
                        value={assignment.of_class}
                        onChange={handleChange}
                    >
                        {classData?.map((data, i) => (
                            <option key={i} value={data.class_name}>
                                {data.class_name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group row">
                    <div className="col-sm-6 mb-3 mb-sm-0">
                        <label htmlFor="from" className="text-capitalize font-weight-bold pl-2">
                            Từ
                        </label>
                        <input
                            type="datetime-local"
                            className="form-control form-control-user"
                            id="from"
                            name="start_date"
                            value={moment(assignment.start_date).format('YYYY-MM-DDTHH:mm')}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="col-sm-6">
                        <label htmlFor="to" className="text-capitalize font-weight-bold pl-3">
                            Đến
                        </label>
                        <input
                            type="datetime-local"
                            className="form-control form-control-user"
                            id="to"
                            name="deadline"
                            value={moment(assignment.deadline).format('YYYY-MM-DDTHH:mm')}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="content-bt" className="text-capitalize font-weight-bold pl-2">
                        Nội dung
                    </label>

                    <textarea
                        className="form-control content-bt"
                        id="content-bt"
                        name="content_text"
                        value={assignment.content_text}
                        onChange={handleChange}
                        style={{ height: 100 }}
                    />
                    <div className="custom-file my-2 file-bt">
                        <input
                            id="file"
                            type="file"
                            className="custom-file-input"
                            name="file_path"
                            onChange={async (file) => {
                                setAssignment((prev) => ({
                                    ...prev,
                                    file_path: file.target.files[0],
                                }));
                            }}
                        />
                        <label className="custom-file-label" htmlFor="file">
                            {assignment.file_path?.name || "Choose file"}
                        </label>
                    </div>
                </div>
                <button className="btn btn-success px-5 py-2 float-right">Lưu Bài Tập</button>
            </form>
            {isLoading && (
                <div className="loading-overlay">
                    <div className="spinner"></div>
                </div>
            )}
        </div>
    );
}
