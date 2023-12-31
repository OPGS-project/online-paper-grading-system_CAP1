import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { AiFillRead } from 'react-icons/ai';
import { FaAngellist } from 'react-icons/fa';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { apiGetAssignmentOfStudent, apiGetStudent } from '~/apis/userService';
function AssignmentStudent() {
    // const navigate = useNavigate();
    const { token } = useSelector((state) => state.auth);
    console.log(token)

    const [values, setValues] = useState([]);
    const [data, setData] = useState([]);
    const [classId, setClassId] = useState(null);
    const [studentId, setStudentId] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            const response = await apiGetAssignmentOfStudent(token);
            const user = await apiGetStudent(token);
            const classId = user.data.response.class_id;
            setClassId(classId);
            const studentId = user.data.response.id;
            console.log(studentId);
            setStudentId(studentId);
            // console.log(classId);
            if (response?.data.err === 0) {
                setValues(response.data.response.rows[0].classData.assignmentData);
                setData(user.data.response);
            } else {
                setValues([]);
                setData([]);
            }
        };
        token && fetchUser();
    }, [token]);

    // useEffect(() => {
    //     axios
    //         .get(`http://localhost:8081/api/submiss/${studentId}`)
    //         .then((res) => {
    //             // console.log(res.data);
    //             setValues(res.data.response);
    //         })
    //         .catch((err) => console.error(err));
    // }, []);

    return (
        <div className="container-fluid">
            <div className="card shadow">
                <div className="text-left card-header">
                    <h3 className="p-3  d-flex align-items-center" style={{ color: '#F3B664' }}>
                        <FaAngellist />
                        <span className=" ml-3">
                            Chào bạn {data.student_name} <FaAngellist />
                        </span>
                    </h3>
                    {values.length > 0 ? (
                        <h4 className=" p-3 d-flex align-items-center">Bạn đang có {values.length} bài tập</h4>
                    ) : null}
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
                            {values.length > 0 ? (
                                values?.map((data, i) => (
                                    <tr key={i}>
                                        <td style={{ fontWeight: 500 }}>{data.assignment_name}</td>
                                        <td style={{ fontWeight: 500 }}>
                                            {moment(data.deadline).format('DD-MM-YYYY HH:mm a')}
                                        </td>
                                        <td>
                                            <Link
                                                to={data.file_path}
                                                target="_blank"
                                                className=" nav-link text-center "
                                            >
                                                Xem bài tập
                                            </Link>
                                        </td>
                                        <td>
                                            <Link
                                                to={`/student/upload-assignment/${data.id}/${classId}`}
                                                className=" nav-link text-center "
                                            >
                                                Nộp bài
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4}>
                                        Hiện tại chưa có bài tập nào <AiFillRead />
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default AssignmentStudent;
