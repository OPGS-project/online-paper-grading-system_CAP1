import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { CSVLink } from 'react-csv';
import moment from 'moment/moment';

const Submitted = () => {
    const navigate = useNavigate();
    const params = useParams();
    const [values, setValues] = useState([]);
    const [csvData, setCsvData] = useState([]);

    useEffect(() => {
        axios
            .get(`http://localhost:8081/api/studentSubmitted/${params.assignmentId}`)
            .then((res) => {
                setValues(res.data.response);
                setCsvData(prepareCsvData(res.data.response));
            })
            .catch((err) => console.error(err));
    }, [params.assignmentId]);

    const prepareCsvData = (data) => {
        const totalScores = data.reduce((sum, submission) => {
            return sum + (submission.gradeData ? submission.gradeData.score_value || 0 : 0);
        }, 0);

        const averageScore = data.length > 0 ? totalScores / data.length : 0;

        // Prepare data for CSV export
        const csvData = data.map((submission, index) => ({
            'Tên học sinh': submission.student_name,
            'Trạng thái': 'Đã nộp',
            'Ngày nộp': moment(submission.createdAt).format('DD-MM-YYYY HH:mm'),
            'Ngày chấm':
                submission.gradeData && submission.gradeData.createdAt
                    ? moment(submission.gradeData.createdAt).format('DD-MM-YYYY HH:mm')
                    : 'Chưa chấm',
            Điểm:
                submission.gradeData && submission.gradeData.score_value
                    ? submission.gradeData.score_value
                    : 'Chưa chấm',
            'Điểm trung bình của bài tập: ': index === 0 ? averageScore.toFixed(2) : '',
        }));
        return csvData;
    };

    return (
        <div className="container-fluid">
            <button
                className="btn btn-back"
                onClick={() => {
                    navigate('/home/assignment');
                }}
            >
                <i className="fa-solid fa-arrow-left"></i>
            </button>
            <div className="card shadow mb-4 height-table">
                <div className="card-header py-3 d-flex justify-content-between">
                    <h6 className="m-0 font-weight-bold text-primary">Bài Tập Đã Nộp</h6>
                    <div>
                        <CSVLink data={csvData} filename={'Score_Student_data.csv'} className="btn btn-primary ml-2">
                            <i className="fa-solid fa-file-arrow-down"></i> Export csv
                        </CSVLink>
                    </div>
                </div>
                <div className="card-body">
                    <div className="table-responsive"></div>
                    <table className="table table-hover" id="dataTable" width="100%" cellspacing="0">
                        <thead className="text-center">
                            <th>Tên học sinh</th>
                            <th>Trạng Thái</th>
                            <th>Thời gian nộp</th>
                            <th>Thời gian chấm</th>
                            <th>Điểm</th>
                            <th></th>
                        </thead>
                        <tbody className="text-center">
                            {values.length > 0 ? (
                                values?.map((data, i) => (
                                    <tr key={i}>
                                        <td>{data.student_name}</td>
                                        <td>Đã nộp</td>
                                        <td>{moment(data.createdAt).format('DD-MM-YYYY HH:mm ')}</td>
                                        <td>
                                            {data.gradeData && data.gradeData.createdAt
                                                ? moment(data.gradeData.createdAt).format('DD-MM-YYYY HH:mm ')
                                                : 'Chưa chấm'}
                                        </td>
                                        <td>
                                            {data.gradeData && data.gradeData.score_value ? (
                                                <Link
                                                    to={`/home/GradedAssignment/${data.id}/${data.student_name}`}
                                                    className=""
                                                    style={{
                                                        color: 'red',
                                                        fontWeight: 500,
                                                    }}
                                                >
                                                    {data.gradeData.score_value}
                                                </Link>
                                            ) : (
                                                'Chưa chấm'
                                            )}
                                        </td>
                                        <td>
                                            {data.submission_status === 'Đã chấm' ? (
                                                <Link
                                                    to={`/home/GradedAssignment/${data.id}/${data.student_name}`}
                                                    className="btn btn-outline-success"
                                                >
                                                    {data.submission_status}
                                                </Link>
                                            ) : (
                                                <Link
                                                    to={`/home/grading/${data.assignment_id}/${data.student_id}`}
                                                    className="btn btn-outline-success"
                                                >
                                                    {data.submission_status}
                                                </Link>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5}>Hiện tại chưa có học sinh nào nộp bài</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Submitted;
