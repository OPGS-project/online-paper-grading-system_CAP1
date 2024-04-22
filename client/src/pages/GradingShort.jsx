import React, { useEffect, useState } from 'react';
import moment from 'moment/moment';
import axios from 'axios';
import { useParams ,useNavigate} from 'react-router-dom';
import { ToastContainer,toast } from 'react-toastify';
import '~~/pages/GradingShort.scss';

function GradingShort() {
    const params = useParams();
    const navigate = useNavigate()
    const [dataSubmit, setDataSubmit] = useState([]);
    const [answerStudent, setAnswerStudent] = useState([]);
    const [points, setPoints] = useState({});
    const [showAnswer, setShowAnswer] = useState({});
    const [total , setTotal] = useState('')
    // const [iconDirection, setIconDirection] = useState("down");
    console.log(total)
    const [idSubmit,setIdSubmit] = useState('')
    console.log(points)
    console.log(JSON.stringify(answerStudent))
    console.log(idSubmit)

    useEffect(() => {
        const fetchDataStudent = async () => {
            try {
                const response = await axios.get(`http://localhost:8081/api/submiss/short-get/${params.assignment_id}/${params.student_id}`);
                setDataSubmit(response.data.response);
                const responseData = response.data.response[0];
                const parseQuestion = JSON.parse(responseData.answer_short);
                setAnswerStudent(parseQuestion);

                const idSubmit = responseData.id
                setIdSubmit(idSubmit)
                console.log(idSubmit)
                console.log(responseData)
                //  tạo trạng thái showAnswer cho mỗi câu
                const initialShowAnswerStates = {};
                parseQuestion.forEach((_, index) => {
                    initialShowAnswerStates[index] = false;
                });
                setShowAnswer(initialShowAnswerStates);
            } catch (error) {
                console.error(error);
            }
        };
        fetchDataStudent();
    }, [params.assignment_id, params.student_id]);

    // const toggleAnswer = () => {
    //     setShowAnswer(!showAnswer);
    //     setIconDirection(iconDirection === "down" ? "up" : "down");
    // };

    // const handleInputGrade = ()=>{

    // }
    const toggleAnswer = (index) => {
        setShowAnswer((prevStates) => ({
            ...prevStates,
            [index]: !prevStates[index],
        }));
    };

    const handleGrade = (index, grade) => {
        // const finalGrade = grade === answerStudent[index].grade ? grade : 0;
        setPoints((prevPoints) => ({
            ...prevPoints,
            [index]: grade,
        }));
        console.log("grade :", grade);
    };
    // const hanleTotal = () =>{
    //     let sum =0;
    //     for(let key in points){
    //        sum +=points[key]
    //        setTotal(sum)
    //     }
    // }

    //tính tổng điểm
    useEffect(() =>{
          let sum = 0;
          for (let key in points) {
            sum += points[key] || 0;
          }
          setTotal(sum);
    },[points])

    const handleSaveGraded = async() =>{
        try {
            
            const data = {
                student_id:parseInt( params.student_id, 10),
                submission_id:idSubmit,
                score_value:total,
                comments:"aaaa",
                answer_short_json:JSON.stringify(answerStudent)
            }
            const response =await axios.post(`http://localhost:8081/api/grading/graded-short`,data)
            console.log(response)
                if(response.data.err === 0){
                    toast.success(response.data.mes, {
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
                        navigate(`/home/assignment/submitted-short/${params.assignment_id}`);
                    }, 2000);
                }
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div className="container-fluid" style={{ display: "flex", width: "100%" }}>
            {dataSubmit.map((item, index) => (
                <div className="content-container-short" style={{ flex: "column", width: "70%", marginRight: "10px" }} key={index}>
                    <div className="assignment-info-box ">
                        <div className="assignment-info ">
                            <p className='header-infor'>Tên: {item.student_name}</p>
                            <p className='header-infor'>Bài Tập: {item.assignment_name}</p>
                            <p className='header-infor'>Thời gian nộp bài: {moment(item.submission_time).format('DD-MM-YYYY HH:mm a')}</p>
                        </div>
                    </div>
                    {/* {console.log(item.answer_short)} */}
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
                                    <div className='answer-student' >
                                        <span>{answer.studentAnswer}</span>
                                    </div>

                                    <div className='_grading'>
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
                    ))}
                </div>
            ))}
            <div className='give-save-grade' style={{ width: "30%", margin: "0 auto" }}>
                <h4 className='text-center'>Cho điểm và lưu</h4>
                {/* <button onClick={hanleTotal}>total </button> */}

                <span >total score : <span style={{color:"red"}}> {total}</span></span>
                <div className='save-grade'>
                    <button  onClick={handleSaveGraded}>Lưu</button>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}

export default GradingShort;
