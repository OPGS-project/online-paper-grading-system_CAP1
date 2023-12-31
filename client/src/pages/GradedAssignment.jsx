import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '~~/pages/assignment/Assignment.scss';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { FiSearch } from '@react-icons/all-files//fi/FiSearch';
import Swal from 'sweetalert2';
import moment from 'moment/moment';
import { GiConsoleController } from 'react-icons/gi';

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

    const [assignmentId, setAssignmentId] = useState({
        assignment_Id: '',
    });

    useEffect(() => {
        axios
            .get(`http://localhost:8081/api/grading/${params.id}/${params.student_name}`)
            .then((res) => {
                console.log(res.data);
                setValues(res.data.response);
                const responseData = res.data.response[0];

                const assignmentId = responseData.submissionData.assignmentData.id;
                console.log("Assignment id: " + assignmentId);

                setAssignmentId(
                    assignmentId,
                );
            })
            .catch((err) => console.error(err));
    }, []);


    //Delete graded assignments
    const handleDelete = (gid) => {
        Swal.fire({
            title: `Bạn muốn xóa?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy',
        }).then((result) => {
            if (result.isConfirmed)
                axios
                    .delete('http://localhost:8081/api/grading/' + gid, {
                    })
                    .then((res) => {
                        if (+res.data.err === 0) {
                            toast.success('Xóa thành công', {
                                position: 'top-right',
                                autoClose: 1000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                                theme: 'light',
                            });
                            setTimeout(() => {
                                navigate(`/home/assignment/submitted/${assignmentId}`);
                            }, 2000);
                        }
                    });
        });
    };

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
                            <th>Thời gian chấm</th>
                            <th>Nhận xét</th>
                            <th>Điểm</th>
                            <th></th>
                            <th></th>
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
                                    <td>{moment(data.createdAt).format('DD-MM-YYYY HH:mm a')}</td>
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
                                    <td>
                                        <Link to={`/home/EditGradedAssignment/${params.id}/${data.submissionData.studentData.student_name}`} className="btn">
                                            <i className="fa-solid fa-pen-to-square icon-edit"></i>
                                        </Link>
                                    </td>
                                    <td>
                                        <button className="btn" onClick={() => handleDelete(data.id)}>
                                            <i className="fa-solid fa-trash icon-delete"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <ToastContainer />
            </div>
        </div>
    );
}

export default GradedAssignment;
