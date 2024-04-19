import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { AiFillRead } from 'react-icons/ai';
import { FaAngellist } from 'react-icons/fa';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { apiGetAssignmentOfStudent } from '~/apis/userService';

function AssignmentStudent() {
    const { token } = useSelector((state) => state.auth);
    const [values, setValues] = useState([]);
    const [user, setUser] = useState([]);
    const [classId, setClassId] = useState(null);
    console.log(values)
   

    useEffect(() => {
        const fetchUser = async () => {
            const response = await apiGetAssignmentOfStudent(token);
            if (response?.data.err === 0) {
                const classId = response.data.response.class_id;
                const userName = response.data.response.student_name;
                setClassId(classId);
                setUser(userName);
                setValues(response.data.response.Classes);
                console.log(response)
                console.log(values.assignmentData)
            } else {
                setValues([]);
                setUser([]);
            }
        };
        token && fetchUser();
    }, [token]);

    return (
        <div className="container-fluid">
            <div className="card shadow">
                <div className="text-left card-header">
                    <h3 className="p-3 d-flex align-items-center" style={{ color: '#F3B664' }}>
                        <FaAngellist />
                        <span className="ml-3">
                            Chào bạn {user} <FaAngellist />
                        </span>
                    </h3>
                    {values.length > 0 && (
                        <h4 className="p-3 d-flex align-items-center">Bạn đang có {values.map(item => item.assignmentData.length).reduce((total, length) => total + length, 0)} bài tập</h4>
                    )}

                </div>
                <div className="card-body">
                    <table className="table table-hover" id="dataTable" width={100}>
                        <thead className="text-center">
                            <tr>
                                <th>Tên Bài Tập</th>
                                <th>Lớp</th>
                                <th>Hạn Nộp</th>
                                <th>Trạng thái</th>
                                <th>Chi tiết</th>
                                <th>Nộp bài</th>
                            </tr>
                        </thead>
                        <tbody className="text-center">
                            {values.length > 0 ? (
                                values.map((data, i) => (
                                    <React.Fragment key={i}>
                                        {data.assignmentData.length > 0 ? (
                                             // So sánh ngày hiện tại với deadline của assignment
                                             data.assignmentData.map((assignment, index) => {
                                                 const isClosed = moment().isAfter(assignment.deadline);
                                                return (
                                                    <tr key={index}>
                                                      
                                                        <td style={{ fontWeight: 500 }}>
                                                            {assignment.assignment_name}
                                                        </td>
                                                        <td style={{ fontWeight: 500 }}>{data.class_name}</td>
                                                        <td style={{ fontWeight: 500 }}>
                                                            {moment(assignment.deadline).format('DD-MM-YYYY HH:mm a')}
                                                        </td>
                                                        {isClosed ? (
                                                              <td>
                                                                <span
                                                                    className="p-2"
                                                                    style={{ backgroundColor: '#FF6464', borderRadius: '15px', color: 'white' }}
                                                                >
                                                                    Đã Đóng
                                                                </span>
                                                              </td>
                                                            ) : (
                                                                <td>
                                                                    <span
                                                                        className="p-2"
                                                                        style={{ backgroundColor: '#91C483', borderRadius: '15px', color: 'white' }}
                                                                >
                                                                     Đang Mở
                                                                </span>
                                                                </td>
                                                            )}
                                                        <td>
                                                            <Link
                                                                to={assignment.file_path}
                                                                target="_blank"
                                                                className="nav-link text-center"
                                                            >
                                                                Xem bài tập
                                                            </Link>
                                                        </td>
                                                        <td>
                                                            {isClosed ? (
                                                                <div>
                                                                    Hết hạn
                                                                </div>
                                                            ):(

                                                                <Link
                                                                    to={`/student/upload-assignment/${assignment.id}/${classId}`}
                                                                    className="nav-link text-center"
                                                                >
                                                                    Nộp bài
                                                                </Link>
                                                            )}
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        ) : null}
                                    </React.Fragment>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6}>
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
