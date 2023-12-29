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
    //
    const [classData, setClassData] = useState([]);

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
    // console.log(assignment.classData.class_name);

    // console.log(params);
    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        for (const i of Object.entries(assignment)) {
            if (i[0] === 'id') continue;
            if (i[1] === null) continue;
            if (i[1] === '') continue;
            if (i[0] === 'createdAt') continue;
            if (i[0] === 'updatedAt') continue;
            // if (i[0] === 'of_className') continue;
            if (i[0] === 'file_path' && typeof i[1] === 'string') continue;

            formData.append(i[0], i[1]);
        }

        // axios
        //     .put(`http://localhost:8081/api/assignment/${assignment.id}`, formData)
        axios({
            method: 'put',
            url: `http://localhost:8081/api/assignment/${assignment.id}`,
            headers: {
                authorization: token,
            },
            data: formData,
        })
            .then((res) => {
                console.log(res);
                notifySuccess('Sửa bài tập thành công!');
                setTimeout(() => {
                    navigate('/home/assignment');
                }, 2000);
            })
            .catch((err) => console.error(err));
    };
    console.log(assignment);
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
                        value={assignment.assignment_name}
                        onChange={(e) => {
                            setAssignment((prev) => ({ ...prev, assignment_name: e.target.value }));
                        }}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="name-bt" className="text-capitalize font-weight-bold pl-2">
                        Lớp
                    </label>

                    <select
                        className="custom-select "
                        style={{ height: 50, borderRadius: 100 }}
                        id="validationTooltip04"
                        required
                        value={assignment.of_class}
                        onChange={(e) => {
                            // setError((prev) => ({ ...prev, errClass: null }));
                            setAssignment((prev) => ({ ...prev, of_class: e.target.value }));
                        }}
                    >
                        <option selected disabled>
                            Chọn Lớp
                        </option>
                        {classData?.map((data, i) => (
                            <option key={i} name="of_class">
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
                            value={moment(assignment.start_date).format('YYYY-MM-DDTHH:mm')}
                            onChange={(e) => {
                                setAssignment((prev) => ({ ...prev, start_date: e.target.value }));
                            }}
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
                            value={moment(assignment.deadline).format('YYYY-MM-DDTHH:mm')}
                            onChange={(e) => {
                                setAssignment((prev) => ({ ...prev, deadline: e.target.value }));
                            }}
                        />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="name-bt" className="text-capitalize font-weight-bold pl-2">
                        Nội dung
                    </label>

                    <textarea
                        type="textariea"
                        className="form-control content-bt"
                        id="name-bt"
                        value={assignment.content_text}
                        onChange={handleChange}
                        style={{ height: 100 }}
                    />
                    <div className="custom-file my-2 file-bt ">
                        <input
                            id="file"
                            type="file"
                            className="custom-file-input "
                            name="file_path"
                            // onChange={handleFile}

                            onChange={async (file) => {
                                setAssignment((prev) => ({
                                    ...prev,
                                    file_path: file.target.files[0],
                                }));
                            }}
                        />

                        <label className="custom-file-label " htmlFor="file">
                            {assignment.file_path?.name}
                        </label>
                    </div>
                </div>
                <button className="btn btn-success px-5 py-2 float-right">Lưu Bài Tập</button>
            </form>
        </div>
    );
}
