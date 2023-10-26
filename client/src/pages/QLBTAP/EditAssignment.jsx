import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import { useSelector } from 'react-redux';

export default function EditAssignment() {
    const navigate = useNavigate();
    const params = useParams();
    const [assignment, setAssignment] = useState({});
    const { token } = useSelector((state) => state.auth);

    useEffect(() => {
        axios
            .get(`http://localhost:8081/api/assignment/${params.assignmentId}`)
            .then((res) => setAssignment({ ...res.data.response }))
            .catch((err) => console.error(err));
    }, [params]);

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
            if (i[0] === 'of_class') continue;

            formData.append(i[0], i[1]);
        }

        axios({
            method: 'put',
            url: `http://localhost:8081/api/assignment/${assignment.id}`,
            headers: {
                // 'Content-Type': 'multipart/form-data',
                authorization: token,
            },
            data: formData,
        }).then((res) => console.log(res));
    };

    return (
        <div className="container-fluid">
            <button
                className="btn btn-back"
                onClick={() => {
                    navigate('/home/assignment');
                }}
            >
                <i class="fa-solid fa-arrow-left"></i>
            </button>

            <h1 className="h3 mb-4 text-gray-800 text-center">
                <i className="fa-regular fa-pen-to-square"></i>
                Cập nhật bài tập
            </h1>

            <form className="user" onSubmit={(e) => handleSubmit(e, token)}>
                <div className="form-group">
                    <label htmlFor="name-bt" className="text-capitalize font-weight-bold pl-2">
                        tên bài tập
                    </label>
                    <input
                        type="text"
                        className="form-control form-control-user"
                        id="name-bt"
                        value={assignment.assignment_name}
                        onChange={(text) => setAssignment((prev) => ({ ...prev, assignment_name: text.target.value }))}
                    />
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
                            value={moment(assignment.start_date).format('YYYY-MM-DD')}
                            onChange={(text) => setAssignment((prev) => ({ ...prev, start_date: text.target.value }))}
                        />
                    </div>
                    <div className="col-sm-6">
                        <label htmlFor="to" className="text-capitalize font-weight-bold pl-3">
                            Đến
                        </label>
                        <input
                            type="date"
                            className="form-control form-control-user"
                            id="to"
                            value={moment(assignment.deadline).format('YYYY-MM-DD')}
                            onChange={(text) => setAssignment((prev) => ({ ...prev, deadline: text.target.value }))}
                        />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="name-bt" className="text-capitalize font-weight-bold pl-2">
                        Nội dung
                    </label>

                    {/* <div className="custom-file mb-2 file-bt ">
                        <input type="file" className="custom-file-input" id="file" />
                        <label className="custom-file-label " for="file">
                            Thêm file bài tập
                        </label>
                    </div> */}
                    <textarea
                        type="textariea"
                        className="form-control content-bt"
                        id="name-bt"
                        value={assignment.content_text}
                        onChange={(text) => setAssignment((prev) => ({ ...prev, content_text: text.target.value }))}
                    />
                </div>
                <button className="btn btn-success px-5 py-2 float-right">Lưu Bài Tập</button>
            </form>
        </div>
    );
}
