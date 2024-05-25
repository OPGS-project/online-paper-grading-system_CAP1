import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { AiFillRead } from 'react-icons/ai';
import { FaAngellist } from 'react-icons/fa';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { apiGetShortAssignment } from '~/apis/userService';

function AssignmentShort() {
    const { token } = useSelector((state) => state.auth);
    const [values, setValues] = useState([]);
    const [user, setUser] = useState([]);
    const [classId, setClassId] = useState(null);
    const [studentId, setStudentId] = useState('');
    const [submissionStatuses, setSubmissionStatuses] = useState({});

    useEffect(() => {
        const fetchUser = async () => {
            const response = await apiGetShortAssignment(token);
            if (response?.data.err === 0) {
                const classId = response.data.response.class_id;
                const userName = response.data.response.student_name;
                const fetchStudentId = response.data.response.id;
                setStudentId(fetchStudentId);
                setClassId(classId);
                setUser(userName);
                setValues(response.data.response.Classes);
            } else {
                setValues([]);
                setUser([]);
            }
        };

        const fetchSubmissionStatus = async (assignmentId, studentId) => {
            try {
                const response = await axios.get(`http://localhost:8081/api/checkDoAssignShort/${assignmentId}/${studentId}`);
                return response.data.message;
            } catch (error) {
                console.error("Không tìm được", error);
                return "Làm bài"; 
            }
        };

        const updateSubmissionStatuses = async (classes) => {
            const statuses = {};
            for (const classData of classes) {
                for (const assignment of classData.assignmentData) {
                    const status = await fetchSubmissionStatus(assignment.id, studentId); 
                    statuses[assignment.id] = status;
                }
            }
            setSubmissionStatuses(statuses);
        };

        if (token) {
            fetchUser().then(() => {
                updateSubmissionStatuses(values);
            });
        }
    }, [token, values]);

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
                                <th>Nộp bài</th>
                            </tr>
                        </thead>
                        <tbody className="text-center">
                            {values.length > 0 ? (
                                values.map((data, i) => (
                                    <React.Fragment key={i}>
                                        {data.assignmentData.length > 0 ? (
                                            data.assignmentData.map((assignment, index) => {
                                                const isClosed = moment().isAfter(assignment.deadline);
                                                const submissionStatus = submissionStatuses[assignment.id] || "Làm bài";

                                                return (
                                                    <tr key={index}>
                                                        <td style={{ fontWeight: 500 }}>
                                                            {assignment.assignment_name}
                                                        </td>
                                                        <td style={{ fontWeight: 500 }}>{data.class_name}</td>
                                                        <td style={{ fontWeight: 500 }}>
                                                            {moment(assignment.deadline).format('DD-MM-YYYY HH:mm a')}
                                                        </td>
                                                        <td>
                                                            {isClosed ? (
                                                                <span
                                                                    className="p-2"
                                                                    style={{ backgroundColor: '#FF6464', borderRadius: '15px', color: 'white' }}
                                                                >
                                                                    Đã Đóng
                                                                </span>
                                                            ) : (
                                                                <span
                                                                    className="p-2"
                                                                    style={{ backgroundColor: '#91C483', borderRadius: '15px', color: 'white' }}
                                                                >
                                                                    Đang Mở
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td>
                                                            {isClosed ? (
                                                                <span>Hết hạn</span>
                                                            ) : (
                                                                submissionStatus === "Đã nộp" ? (
                                                                    <span>Đã nộp</span>
                                                                ) : (
                                                                    <Link
                                                                        to={`/student/do-assignment-short/${assignment.id}/${data.id}`}
                                                                        className="nav-link text-center"
                                                                    >
                                                                        Làm bài
                                                                    </Link>
                                                                )
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
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

export default AssignmentShort;
