import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '~~/pages/assignment/Assignment.scss';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import Swal from 'sweetalert2';
import moment from 'moment/moment';
import Modal from 'react-modal';

function GradedShort() {
    const navigate = useNavigate();
    const [values, setValues] = useState([]);
    const params = useParams();
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [question, setQuestion] = useState({});
    const [assignmentId, setAssignmentId] = useState('');

    const openModal = (submission) => {
        setSelectedSubmission(submission);
        setModalIsOpen(true);
        const parseQuestion = JSON.parse(submission.answer_short_json);
        console.log(parseQuestion);
        setQuestion(parseQuestion);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    useEffect(() => {
        axios
            .get(`http://localhost:8081/api/gradingShort/${params.id}/${params.student_name}`)
            .then((res) => {
                console.log(res);
                setValues(res.data.response);
                const responseData = res.data.response[0];
                console.log(JSON.parse(responseData.submissionData.answer_short));

                const assignmentId = responseData.submissionData.assignmentData.id;
                setAssignmentId(assignmentId);
            })
            .catch((err) => console.error(err));
    }, [params.id, params.student_name]);

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
            if (result.isConfirmed) {
                axios.delete(`http://localhost:8081/api/grading/delete-short/${gid}`)
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
                                navigate(`/home/assignment/submitted-short/${assignmentId}`);
                            }, 2000);
                        }
                    });
            }
        });
    };

    return (
        <div className="container-fluid">
            <button
                className="btn btn-back"
                onClick={() => navigate(`/home/assignment/submitted-short/${assignmentId}`)}
            >
                <i className="fa-solid fa-arrow-left"></i>
            </button>
            <div className="card shadow mb-4 height-table">
                <div className="card-header py-3 d-flex justify-content-between">
                    <h6 className="m-0 font-weight-bold text-primary">Tên học sinh: {params.student_name}</h6>
                </div>
                <div className="card-body">
                    <div className="table-responsive"></div>
                    <table className="table table-hover" id="dataTable" width="100%" cellSpacing="0">
                        <thead className="text-center">
                            <tr>
                                <th>Bài tập</th>
                                <th>Bài đã chấm</th>
                                <th>Thời gian chấm</th>
                                <th>Điểm</th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody className="text-center">
                            {values?.map((data, i) => (
                                <tr key={i}>
                                    <td>{data.submissionData.assignmentData.assignment_name}</td>
                                    <td>
                                        <button className='btn btn-link' onClick={() => openModal(data)}>xem bài</button>
                                    </td>
                                    <td>{moment(data.createdAt).format('DD-MM-YYYY HH:mm a')}</td>
                                    <td style={{ color: 'red', fontWeight: 500 }}>{data.score_value}</td>
                                    <td title="Chấm lại">
                                        <Link 
                                            to={`/home/edit-graded-short/${params.id}/${data.submissionData.student_name}`}
                                            className="btn"
                                        >
                                            <i className="fa-solid fa-pen-to-square icon-edit"></i>
                                        </Link>
                                    </td>
                                    <td>
                                        <button className="btn" onClick={() => handleDelete(data.id)}>
                                            <i title="Xoá" className="fa-solid fa-trash icon-delete"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <Modal isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Modal">
                    <button className="button-close" onClick={closeModal}>
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                    {selectedSubmission && (
                        <div className="return-assign">
                            <div className="title-return-assign">
                                <div className="line"></div>
                                <h3>{selectedSubmission.assignment_name}</h3>
                            </div>
                            <div className="container-return-assign">
                                {question.map((item, index) => (
                                    <div className="content-return-assign" key={index}>
                                        <div className="question-return">
                                            <div className="question">
                                                <span>Câu {index + 1}: {item.question}</span>
                                            </div>
                                            <div style={{ width: "20%", float: "right" }}>
                                                <span style={{ float: "right" }}>{item.point}/{item.grade}</span>
                                            </div>
                                        </div>
                                        {item.point === 0 ? (
                                            <div style={{ backgroundColor: "rgb(252, 232, 230)" }} className="answer-return">
                                                <span style={{ padding: "10px" }}>{item.studentAnswer}</span>
                                                <i style={{ color: "red" }} className="fa-solid fa-xmark"></i>
                                            </div>
                                        ) : (
                                            <div style={{ backgroundColor: "rgb(185, 252, 185)" }} className="answer-return">
                                                <span className="answer">{item.studentAnswer}</span>
                                                <i style={{ color: "rgb(17, 240, 17)" }} className="fa-solid fa-check"></i>
                                            </div>
                                        )}
                                        {item.comment && (
                                            <div style={{ backgroundColor: "rgb(242 242 242)" }} className="comment-teacher">
                                                <div style={{ padding: "10px 20px", fontWeight: "700", color: "#000" }}>
                                                    <span>Phản hồi của giáo viên</span>
                                                </div>
                                                <div style={{ padding: "10px 40px" }}>
                                                    <span style={{ fontStyle: "italic" }}>{item.comment}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </Modal>
                <ToastContainer />
            </div>
        </div>
    );
}

export default GradedShort;
