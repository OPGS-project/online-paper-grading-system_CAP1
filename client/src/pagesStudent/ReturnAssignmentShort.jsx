import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import 'react-image-gallery/styles/css/image-gallery.css';
import axios from 'axios';
import { apiGetStudent } from '~/apis/userService';
import Modal from 'react-modal';
import "../assets/student/ReturnAssignmentShort.scss"

function ReturnAssignmentShort() {
    const { token } = useSelector((state) => state.auth);
    const [data, setData] = useState([]);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [question,setQuestion]= useState({})
    const [modalIsOpen, setModalIsOpen] = useState(false);
    
    console.log(selectedSubmission)
    console.log(question)
    console.log(data)
    
    
    const openModal = (submission) => {

        setSelectedSubmission(submission);
        setModalIsOpen(true);
        const parseQuestion = JSON.parse(submission.answer_short_json)
        setQuestion(parseQuestion)
        
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    useEffect(() => {
        const fetchUser = async () => {
            const user = await apiGetStudent(token);
            const idStudent = user.data.response.id;
            console.log(idStudent);
            const response = await axios.get(`http://localhost:8081/api/main-student/get-graded-short/${idStudent}`);
            console.log(response);

            if (response?.data.err === 0) {
                setData(response.data.response);
            } else {
                // Xử lý lỗi
            }
        };
        token && fetchUser();
    }, [token]);

    return (
        <div className="container-fluid">
            <div className="card shadow">
                <div className="text-left card-header">
                    <h4 className=" p-3 d-flex align-items-center">Bài tập đã chấm</h4>
                </div>
                <div className="card-body">
                    <table className="table table-hover" id="dataTable" width={100}>
                        <thead className="text-center">
                            <tr>
                                <th>Tên Bài Tập</th>
                                <th>Bài đã chấm</th>
                                <th>Lời phê</th>
                                <th>Điểm</th>
                            </tr>
                        </thead>
                        <tbody className="text-center">
                            {data.length > 0 ? (
                                data.map((item, index) => (
                                    <tr key={index}>
                                        <td style={{ fontWeight: 500 }}>
                                            {item.assignment_name}
                                        </td>
                                        <td>
                                            <button onClick={() => openModal(item)} className="btn btn-link">
                                                Xem bài
                                            </button>
                                        </td>
                                        <td>{item.comments}</td>
                                        <td>{item.score_value}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4}>Hiện chưa có bài tập nào </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <Modal isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Modal">
                        <button className='button-close'  onClick={closeModal}><i class="fa-solid fa-xmark"></i></button>
                        
                        {selectedSubmission && (
                            <div className='return-assign'>
                                

                               
                                <div className='title-return-assign'>
                                    <div className='line'> </div>
                                     {selectedSubmission.assignment_name}
                                   
                                </div>
                                <div className='container-return-assign'>
                                    {question.map((item,index) => (
                                        <div className='content-return-assign'  key={index}>
                                            <div className='question-return'>

                                                <div className='question' >
                                                    <span >Câu {index +1} : {item.question} </span>
                                                </div>
                                                <div  style={{width:"20%",float:"right"}}> 
                                                    <span style={{float:"right"}} > {item.point}/{item.grade} </span>
                                                </div>
                                            </div>

                                            <div style={{border:"1px solid blue" ,marginTop:"20px",marginBottom:"20px"}}>
                                            <span > {item.studentAnswer} </span>
                                            </div>
                                        </div>
                                       
                                    ))}
                                </div>
                            </div>
                        )}
                    </Modal>
                </div>
            </div>
        </div>
    );
}

export default ReturnAssignmentShort;
