import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import moment from 'moment/moment';
import { useReactToPrint } from 'react-to-print';

function StudentAssignment() {
    const navigate = useNavigate();
    const params = useParams();

    const [values, setValues] = useState({
        assignmentOfStudent: [],
        gradeShort: []
    });

    const [studentName, setStudentName] = useState('');

    useEffect(() => {
        axios
            .get(`http://localhost:8081/api/resultAssignment/${params.sid}/${params.classId}`)
            .then((res) => {
                console.log(res);

                const { grade, gradeShort } = res.data.combinedResponse;
                const allGrades = [...grade, ...gradeShort];

                const studentName = allGrades.map(item => item.submissionData.studentData.student_name);
                setStudentName(studentName[0]);

                const assignmentData = res.data.combinedResponse.grade.map((data) => ({
                    ...data,
                }));
                const gradeShortData = res.data.combinedResponse.gradeShort.map((data) => ({
                    ...data,
                }));

                setValues((prevState) => ({
                    ...prevState,
                    assignmentOfStudent: assignmentData,
                    gradeShort: gradeShortData
                }));
            })
            .catch((err) => console.error(err));
    }, [params]);

    const printRef = useRef();

    const exportToPDF = useReactToPrint({
        content: () => printRef.current,
    });

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
            <div className="card shadow mb-4" ref={printRef}>
                <h1 className="h4 my-4 text-center">Kết quả bài tập của {studentName} </h1>
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-hover table-bordered" id="dataTable" width="100%" cellSpacing="0">
                            <thead>
                                <tr className="text-center">
                                    <th>Tên Bài Tập</th>
                                    <th>Loại bài tập</th>
                                    <th>Giao cho</th>
                                    <th>Thời gian chấm</th>
                                    <th>Điểm</th>
                                </tr>
                            </thead>
                            <tbody>
                                {values.assignmentOfStudent.length > 0 ? (
                                    values.assignmentOfStudent.map((data, i) => (
                                        <tr className="text-center" key={i}>
                                            <td>{data.submissionData.assignmentData.assignment_name}</td>
                                            <td>
                                                {data.submissionData.assignmentData.type_assignment === '0' ? (
                                                    <span>Tự luận</span>
                                                ) : (
                                                    <span>Câu trả lời ngắn</span>
                                                )}
                                            </td>
                                            <td>{data.submissionData.assignmentData.classData.class_name}</td>
                                            <td>{moment(data.createdAt).format('DD-MM-YYYY HH:mm a')}</td>
                                            <td>
                                                {data.submissionData.assignmentData.type_assignment === '0' ? (
                                                    <Link
                                                        to={`/home/GradedAssignment/${data.submissionData.id}/${studentName}/`}
                                                        style={{ color: "red" }}
                                                        title='Kết quả cụ thể'
                                                    >
                                                        {data.score_value}
                                                    </Link>
                                                ) : (
                                                    <span style={{ color: 'red' }}>{data.score_value}</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr className="text-center">
                                        <td colSpan={5}>Hiện tại chưa có kết quả bài tập nào !</td>
                                    </tr>
                                )}
                                {/* Hiển thị gradeShort */}
                                {values.gradeShort.length > 0 && (
                                    values.gradeShort.map((data, i) => (
                                        <tr className="text-center" key={i}>
                                            <td>{data.submissionData.assignmentData.assignment_name}</td>
                                            <td>
                                                {data.submissionData.assignmentData.type_assignment === '0' ? (
                                                    <span>Tự luận</span>
                                                ) : (
                                                    <span>Câu trả lời ngắn</span>
                                                )}
                                            </td>
                                            <td>{data.submissionData.assignmentData.classData.class_name}</td>
                                            <td>{moment(data.createdAt).format('DD-MM-YYYY HH:mm a')}</td>
                                            <td>
                                                {data.score_value !== undefined ? (
                                                    <Link
                                                        to={`/home/graded-short/${data.submissionData.id}/${studentName}/`}
                                                        style={{ color: "red" }}
                                                        title='Kết quả cụ thể'
                                                    >
                                                        {data.score_value}
                                                    </Link>
                                                ) : (
                                                    <span style={{ color: 'red' }}>{data.score_value}</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <button className="btn btn-primary float-right" onClick={exportToPDF}>
                <i class="fa-solid fa-file-arrow-down"></i> Export to PDF
            </button>
        </div>
    );
}

export default StudentAssignment;