import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

function StudentScores() {
    const navigate = useNavigate();
    const params = useParams();
    const [values, setValues] = useState({
        assignment: [],
        student: [],
    });
    useEffect(() => {
        axios
            .get(`http://localhost:8081/api/assignment/${params.sid}`)
            .then((res) => {
                // console.log(res);
                const assignmentData = res.data.response.rows[0].classData.assignmentData;
                const studentData = res.data.response.rows[0];

                setValues((prev) => ({
                    ...prev,
                    assignment: assignmentData,
                    student: studentData,
                }));
            })
            .catch((err) => console.error(err));
    }, [params]);

    console.log(true);
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

            <div className="card shadow mb-4">
                <h1 className="h4 my-4 text-center">Bài tập của {values.student.student_name} </h1>

                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-hover" id="dataTable" width="100%" cellSpacing="0">
                            <thead>
                                <tr className="text-center">
                                    <th>Tên Bài Tập</th>
                                    <th>Trạng Thái</th>
                                    <th>Điểm</th>
                                </tr>
                            </thead>
                            <tbody>
                                {values.assignment.length > 0 ? (
                                    values.assignment.map((data, i) => (
                                        <tr className="text-center" key={i}>
                                            <td>{data.assignment_name}</td>
                                            {data.submissionData.length > 0 ? <td>Đã nộp</td> : <td>Chưa nộp</td>}
                                            {data.submissionData.length > 0 ? (
                                                <td>
                                                    {/* {data.submissionData[0].gradeData !== null
                                                        ? data.submissionData[0].gradeData
                                                        : 0} */}
                                                </td>
                                            ) : (
                                                <td>
                                                    <Link
                                                        to={`/home/grading/${data.id}/${params.sid}`}
                                                        className="btn btn-outline-success"
                                                    >
                                                        Chấm bài
                                                    </Link>
                                                </td>
                                            )}
                                        </tr>
                                    ))
                                ) : (
                                    <tr className="text-center">
                                        <td colSpan={5}>Hiện tại chưa có bài tập đã giao nào !</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StudentScores;
