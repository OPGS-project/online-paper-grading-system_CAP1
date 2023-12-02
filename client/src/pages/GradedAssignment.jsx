import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '~~/pages/assignment/Assignment.scss';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { FiSearch } from '@react-icons/all-files//fi/FiSearch';
import moment from 'moment/moment';

function GradedAssignment() {
    const navigate = useNavigate();
    const [values, setValues] = useState([]);
    const params = useParams();

    console.log(`Student name: ${params.student_name}`);
    console.log(`Submission id: ${params.id}`);

    const [expandedImage, setExpandedImage] = useState(null);
    const [expandedSubmissionImage, setExpandedSubmissionImage] = useState(null);


    const [expandedComments, setExpandedComments] = useState(null);
    const maxCommentsLength = 20;

    useEffect(() => {
        axios
            .get(`http://localhost:8081/api/grading/${params.id}/${params.student_name}`)
            .then((res) => {
                console.log(res.data);
                setValues(res.data.response)
            })
            .catch((err) => console.error(err));
    }, []);

    return (
        <div className="container-fluid">
            <div className="card shadow mb-4 height-table">
                <div className="card-header py-3 d-flex justify-content-between">
                    <h6 className="m-0 font-weight-bold text-primary">Tên học sinh: {params.student_name}</h6>
                    {/* <h6 className="m-0 font-weight-bold text-primary">Lớp </h6> */}
                </div>
                <div className="card-body">
                    <div className="table-responsive"></div>
                    <table className="table table-hover" id="dataTable" width="100%" cellspacing="0">
                        <thead className="text-center">
                            <th>Bài tập</th>
                            <th>Bài nộp</th>
                            <th>Bài chấm</th>
                            <th>Nhận xét</th>
                            <th>Điểm</th>
                        </thead>
                        <tbody className="text-center">
                            {values?.map((data, i) => (
                                <tr key={i}>
                                    <td>{data.submissionData.assignmentData.assignment_name}</td>
                                    <td>
                                        {expandedSubmissionImage === i ? (
                                            <div
                                                className="expanded-image-overlay"
                                                onClick={() => setExpandedSubmissionImage(null)}
                                            >
                                                <img
                                                    src={data.submissionData.image}
                                                    alt="Images of graded assignment"
                                                    style={{
                                                        maxWidth: '80%',
                                                        maxHeight: '80%',
                                                        cursor: 'pointer',
                                                        position: 'fixed',
                                                        top: '50%',
                                                        left: '50%',
                                                        transform: 'translate(-50%, -50%)',
                                                        zIndex: 9999,
                                                    }}
                                                />
                                            </div>
                                        ) : (
                                            <img
                                                src={data.submissionData.image}
                                                alt="Images of graded assignment"
                                                onClick={() => setExpandedSubmissionImage(i)}
                                                style={{ maxWidth: '50px', maxHeight: '50px', cursor: 'pointer' }}
                                            />
                                        )}
                                    </td>
                                    <td>
                                        {expandedImage === i ? (
                                            <div
                                                className="expanded-image-overlay"
                                                onClick={() => setExpandedImage(null)}
                                            >
                                                <img
                                                    src={data.image}
                                                    alt="Images of graded assignment"
                                                    style={{
                                                        maxWidth: '80%',
                                                        maxHeight: '80%',
                                                        cursor: 'pointer',
                                                        position: 'fixed',
                                                        top: '50%',
                                                        left: '50%',
                                                        transform: 'translate(-50%, -50%)',
                                                        zIndex: 9999,
                                                    }}
                                                />
                                            </div>
                                        ) : (
                                            <img
                                                src={data.image}
                                                alt="Images of graded assignment"
                                                onClick={() => setExpandedImage(i)}
                                                style={{ maxWidth: '50px', maxHeight: '50px', cursor: 'pointer' }}
                                            />
                                        )}
                                    </td>
                                    <td>
                                        {data.comments.length > maxCommentsLength ? (
                                            <>
                                                {expandedComments === i ? (
                                                    <span onClick={() => setExpandedComments(null)}>{data.comments}</span>
                                                ) : (
                                                    <>
                                                        {data.comments.slice(0, maxCommentsLength)}...
                                                        <span
                                                            style={{ color: 'rgb(78, 115, 223)', cursor: 'pointer', textDecoration: 'underline' }}
                                                            onClick={() => setExpandedComments(i)}
                                                        >
                                                            Xem thêm
                                                        </span>
                                                    </>
                                                )}
                                            </>
                                        ) : (
                                            data.comments
                                        )}
                                    </td>
                                    <td style={{ color: 'red', fontWeight: 500 }}>{data.score_value}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default GradedAssignment;
