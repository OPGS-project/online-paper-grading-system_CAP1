import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { FaAngellist } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { apiGetAssignmentOfStudent } from '~/apis/userService';
function AssignmentStudent() {
    // const navigate = useNavigate();
    const { token } = useSelector((state) => state.auth);

    const [values, setValues] = useState([]);

    useEffect(() => {
        const fetchUser = async () => {
            const response = await apiGetAssignmentOfStudent(token);
            // console.log(response);
            if (response?.data.err === 0) {
                setValues(response.data.response.rows[0].classData.assignmentData);
            } else {
                setValues([]);
            }
        };
        token && fetchUser();
    }, [token]);

    return (
        <div className="container-fluid">
            <div className="card shadow">
                <div className="text-left card-header">
                    <h3 className="p-3  d-flex align-items-center" style={{ color: '#F3B664' }}>
                        <FaAngellist />
                        <span className=" ml-3"> Chào bạn {} !</span>
                    </h3>
                    <h4 className=" p-3 d-flex align-items-center">Bạn đang có {values.length} bài tập</h4>
                </div>
                <div className="card-body">
                    <table className="table table-hover" id="dataTable" width={100}>
                        <thead className="text-center">
                            <tr>
                                <th>Tên Bài Tập</th>
                                <th>Hạn Nộp</th>
                                <th>Chi tiết</th>
                                <th>Nộp bài</th>
                            </tr>
                        </thead>
                        <tbody className="text-center">
                            {values?.map((data, i) => (
                                <tr key={i}>
                                    <th style={{ fontWeight: 500 }}>{data.assignment_name}</th>
                                    <th style={{ fontWeight: 500 }}>
                                        {moment(data.deadline).format('DD-MM-YYYY HH:mm a')}
                                    </th>
                                    <th>
                                        <Link to={data.file_path} target="_blank" className=" nav-link text-center ">
                                            Xem bài tập
                                        </Link>
                                    </th>
                                    <th>
                                        <Link
                                            to={`/student/upload-assignment/${data.id}`}
                                            className=" nav-link text-center "
                                        >
                                            Nộp bài
                                        </Link>
                                    </th>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default AssignmentStudent;
