import React, { useEffect, useState } from 'react';
import { fabric } from 'fabric';
import moment from 'moment/moment';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { FabricJSCanvas, useFabricJSEditor } from 'fabricjs-react';
import { FaUndo, FaRedo, FaDownload } from 'react-icons/fa';
import '~~/pages/GradingShort.scss';
import { Link, useParams } from 'react-router-dom';
import { Collapse } from 'bootstrap';
function GradingShort() {

    // const navigate = useNavigate()
    const params = useParams()
    const [dataSubmit ,setDataSubmit] = useState([])
    console.log(dataSubmit)
    const [answerStudent,setAnswerStudent] = useState([])
    console.log(answerStudent)
    
 
    useEffect(() =>{

        const fetchDataStudent = async () => {
            try {
                const response = await axios.get(`http://localhost:8081/api/submiss/short-get/${params.assignment_id}/${params.student_id}`);
                setDataSubmit(response.data.response)
                const responseData = response.data.response[0]
                const parseQuestion = JSON.parse(responseData.answer_short)
                console.log(parseQuestion)
                setAnswerStudent(parseQuestion)
            } catch (error) {
                console.error(error);
            }
        };

        fetchDataStudent();

    },[params.assignment_id,params.student_id])


   
    return (
        <div className="container-fluid" style={{display:"flex" ,width:"100%"}}>
            {dataSubmit.map((item,index) => (
                <div className="content-container-short" style={{flex:"colum",width:"70%",marginRight:"10px"}} key={index}>
                    <div className="assignment-info-box ">
                        <div className="assignment-info ">
                            <p className='header-infor' >Tên: {item.student_name}</p >
                            <p className='header-infor' >Bài Tập: {item.assignment_name}</p >
                            <p className='header-infor' >Thời gian nộp bài: {moment(item.submission_time).format('DD-MM-YYYY HH:mm a')}</p>
                        </div>
                        
                    </div>
 
                  {answerStudent.map((answer,index) =>(

                    <div className="container-short" key={index}>
                        <div className="question-container shadow-sm">
                           
                        <span>Câu: {index +1}</span> <textarea
                            
                                className="question-textarea"
                                value={answer.question}
                                readOnly
                            />
                            <textarea
                                className="answer-textarea"
                                value={answer.studentAnswer}
                                readOnly
                            />
                        </div>
                        
                    </div>
                  ))}
                </div>       
                
            ))}
            <div style={{width:"30%",margin:"0 auto"}}>
                <h4 className='text-center'>Cho điểm và lưu</h4>
            </div>
            
            <ToastContainer />
        </div>
    );
}

export default GradingShort;
