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
    });
    const [student_name, setStudentName] = useState('');
    console.log(values.assignmentOfStudent);

    useEffect(() => {
        axios
            .get(`http://localhost:8081/api/grading/${params.sid}`)
            .then((res) => {
                console.log(res);
                const studentName = res.data.response[0].submissionData.studentData.student_name;
                setStudentName(studentName);
                const assignmentData = res.data.response.map((data) => ({
                    ...data,
                }));

                setValues((prevState) => ({
                    ...prevState,
                    assignmentOfStudent: assignmentData,
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
                <h1 className="h4 my-4 text-center">Kết quả bài tập của {student_name} </h1>
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
                                                        to={`/home/GradedAssignment/${data.submissionData.assignmentData.id}/${student_name}/`}
                                                        style={{ color: "red" }}
                                                        title='Kết quả cụ thể'
                                                    >
                                                        {data.score_value}
                                                    </Link>
                                                ) : (
                                                    <Link style={{ color: "red" }}>{data.score_value}</Link>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr className="text-center">
                                        <td colSpan={5}>Hiện tại chưa có kết quả bài tập nào !</td>
                                    </tr>
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
