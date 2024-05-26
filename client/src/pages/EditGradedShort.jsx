import React, { useEffect, useState } from 'react';
import moment from 'moment/moment';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '~~/pages/GradingShort.scss';
 

function EditGradedShort() {
    const params = useParams();
    const navigate = useNavigate()
    const [dataSubmit, setDataSubmit] = useState([]);
    const [answerStudent, setAnswerStudent] = useState([]);
    const [points, setPoints] = useState({});
    const [showAnswer, setShowAnswer] = useState({});
    const [total, setTotal] = useState('')
    const [idSubmit, setIdSubmit] = useState('')
    const [loading, setLoading] = useState(false);
    const [showInputComment, setShowCommentInput] = useState({})
    const [comments, setComments] = useState({})
    const [idGrading ,setIdGrading] = useState('')
    const [idStudent ,setIdStudent] = useState('')
    const [idAssignment,setIdAssignment] = useState('')
    const [idSubmission,setIdSubmission] = useState('')
    console.log(idGrading)
    console.log(idAssignment)
    useEffect(() => {
        const fetchDataStudent = async () => {
            try {
                const response = await axios.get(`http://localhost:8081/api/gradingShort/${params.id}/${params.student_name}`);
                const responseData = response.data.response[0];
                console.log(responseData)
                setDataSubmit(response.data.response);
                setIdStudent(responseData.student_id)
                setIdAssignment(responseData.submissionData.assignmentData.id)
                setIdSubmission(responseData.submissionData.id)

                const parseQuestion = JSON.parse(responseData.answer_short_json);
                setAnswerStudent(parseQuestion);
                setIdGrading(responseData.id)

                const idSubmit = responseData.id
                setIdSubmit(idSubmit)

                
                const initialShowAnswerStates = {};
                const initialPoints = {};
                parseQuestion.forEach((item, index) => {
                    initialShowAnswerStates[index] = false;
                    initialPoints[index] = item.point || 0;
                });
                setShowAnswer(initialShowAnswerStates);
                setPoints(initialPoints);

            } catch (error) {
                console.error(error);
            }
        };
        fetchDataStudent();
    }, [params.id, params.student_name]);

    const toggleAnswer = (index) => {
        setShowAnswer((prevStates) => ({
            ...prevStates,
            [index]: !prevStates[index],
        }));
    };

    const toggleCommentInput = (index) => {
        setShowCommentInput((prevShowCommentInput) => ({
            ...prevShowCommentInput,
            [index]: !prevShowCommentInput[index],
        }));
    };

    const handleCommentChange = (index, event) => {
        const { value } = event.target;
        setComments((prevComments) => ({
            ...prevComments,
            [index]: value,
        }));
    }

    const handleGrade = (index, grade) => {
        if (grade > answerStudent[index].grade) {
            alert(`Điểm không được vượt quá ${answerStudent[index].grade}`);
            return;
        }
        setPoints((prevPoints) => ({
            ...prevPoints,
            [index]: grade,
        }));
    };

    // Calculate total points
    useEffect(() => {
        let sum = 0;
        for (let key in points) {
            sum += points[key] || 0;
        }
        setTotal(sum);
    }, [points])

    const handleSaveGraded = async () => {
        try {
            const updatedAnswerStudent = answerStudent.map((item, index) => ({
                ...item,
                point: points[index],
                comment: comments[index],
            }));

            const data = {
                student_id: parseInt(idStudent, 10),
                submission_id: idSubmission,
                score_value: total,
                comments: "aaaa",
                answer_short_json: JSON.stringify(updatedAnswerStudent),
            }

            const response = await axios.put(`http://localhost:8081/api/gradingShort/update-graded/${idGrading}`, data)
            if (response.data.err === 0) {
                toast.success(response.data.message, {
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
                    navigate(`/home/graded-short/${params.id}/${params.student_name}`);
                }, 2000);
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleGradingAuto = async () => {
        setLoading(true);
        const data = { answerStudent };
        const response = await axios.post(`http://localhost:8081/api/grading/graded-short-auto`, data);

        const results = response.data.similarityPercentages;
        const grades = response.data.grades;
        const calculatedScores = results.map((result, index) => {
            const score = grades[index] / 100 * result;
            return parseFloat(score.toFixed(2));
        });

        const updatedPoints = {};
        calculatedScores.forEach((score, index) => {
            updatedPoints[index] = score;
        });
        setPoints(updatedPoints);

        setLoading(false);
    };

    const handleSaveComment = (index) => {
        const comment = comments[index];
        setComments((prevComments) => ({
            ...prevComments,
            [index]: comment,
        }));
        setShowCommentInput((prevShowCommentInput) => ({
            ...prevShowCommentInput,
            [index]: false,
        }));
    }

    const handleHiddenComment = (index) => {
        toggleCommentInput(index)
    }

    return (
        <div className="container-fluid container-gradingShort" style={{ display: "flex", width: "100%" }}>
            {dataSubmit.map((item, index) => (
                <div className="content-container-short" style={{ flex: "column", width: "70%", marginRight: "10px" }} key={index}>
                    <div className="assignment-info-box ">
                        <div className="assignment-info ">
                            <p className='header-infor'>Tên: {item.submissionData.student_name}</p>
                            <p className='header-infor'>Bài Tập: {item.submissionData.assignmentData.assignment_name}</p>
                            {/* <p className='header-infor'>Thời gian nộp bài: {moment(item.submission_time).format('DD-MM-YYYY HH:mm a')}</p> */}
                            <p className='header-infor'>Thời gian chấm cũ: {moment(item.createdAt).format('DD-MM-YYYY HH:mm a')}</p>
                        </div>
                        <div>
                            <button onClick={handleGradingAuto} type='button' className='btn btn-primary mt-4'>
                                {loading ? <span>Loading...</span> : <span><i className="fa-solid fa-wand-magic-sparkles"></i>Grading auto</span>}
                            </button>
                        </div>
                    </div>
                    {answerStudent.map((answer, index) => (
                        <div className="container-short" key={index}>
                            <div className="question-container shadow-sm">
                                <div className='question-teacherAnswer'>
                                    <div className='question-content'>
                                        <span>Câu {index + 1}: </span>
                                        <span>{answer.question}</span>
                                    </div>
                                    <div className='button-teacher-answer'>
                                        <button className='button-hidden' onClick={() => toggleAnswer(index)}>
                                            {showAnswer[index] ? "Ẩn đáp án" : "Xem đáp án"} <span><i className={`fa-solid fa-angle-${showAnswer[index] ? "up" : "down"}`}></i></span>
                                        </button>
                                    </div>
                                </div>
                                {showAnswer[index] && (
                                    <div className='teacher-answer'>
                                        <span style={{ marginRight: "20px" }}>{answer.teacherAnswer}</span>
                                        <i className="fas fa-thin fa-check" style={{ color: "rgb(12, 245, 12)" }}></i>
                                    </div>
                                )}
                                <div className='grading-answer-student'>
                                    <div className='answer-student'>
                                        <span>{answer.studentAnswer}</span>
                                    </div>
                                    <div className='_grading'>
                                        <div className='comment'>
                                            {comments[index] ? (
                                                <div style={{display:"flex",gap:"10px"}} className='aaaa'>
                                                    <span>{comments[index]}</span>
                                                    <div>
                                                        <button style={{border:"none",backgroundColor:"transparent"}}><i className="fa-solid fa-pen-to-square"></i></button>
                                                        <button style={{border:"none",backgroundColor:"transparent"}}><i className="fa-solid fa-trash"></i></button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <button className='button-appear-comment' onClick={() => toggleCommentInput(index)}> <i className="fa-solid fa-plus"></i>Thêm phản hồi</button>
                                            )}
                                            {showInputComment[index] && (
                                                <div className='show-input'>
                                                   <div className='sub-show-input'>
                                                        <div className='sub-sub-show-input'>
                                                            <div className='header-comment'>
                                                                <span>Thêm phản hồi</span>
                                                            </div>
                                                            <div className='content-comment'>
                                                                <input className='input-comment' type="text" value={comments[index]} onChange={(e) => handleCommentChange(index, e)} placeholder='Nhập phản hồi'/>
                                                            </div>
                                                            <div className='cancel-save'>
                                                                <button style={{backgroundColor:""}} onClick={() => handleHiddenComment(index)}>Huỷ</button>
                                                                <button style={{backgroundColor:"rgb(111, 159, 247)"}} onClick={() => handleSaveComment(index)}>Lưu</button>
                                                            </div>
                                                        </div>
                                                   </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className='aaaaaa'>
                                            <div className='button-grading'>
                                                <button style={{ color: "red" }} className='incorrect-answer' onClick={() => handleGrade(index, 0)} ><i className="fas fa-thin fa-xmark"></i></button>
                                                <button style={{ color: "rgb(12, 245, 12)" }} className='correct-answer' onClick={() => handleGrade(index, answer.grade)} ><i className="fas fa-thin fa-check"></i></button>
                                            </div>
                                            <div className='point-grading'>
                                                <input className='input-point' type="number" step="0.1" name='grade' min={0} max={answer.grade} value={points[index] } onChange={(e) => handleGrade(index, parseFloat(e.target.value))} />
                                                <span>/</span>
                                                <span style={{ marginLeft: "5px" }}>{answer.grade}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ))}

            <div className='give-save-grade text-center' style={{ width: "30%", margin: "0 auto" }}>
                <h4 className='text-center mb-4 mt-4'>Cho điểm và lưu</h4>
                <span>Total score : <span style={{ color: "red" }}>{total}</span></span>
                <div className='save-grade mt-4'>
                    <button className='text-white' onClick={handleSaveGraded}>Cập nhật</button>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}

export default EditGradedShort;
