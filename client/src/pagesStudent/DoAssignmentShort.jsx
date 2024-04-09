import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import '~~/pages/assignment/DoAssignmentShort.scss';
import {apiGetShortAssignmentDetail} from '~/apis/userService';
import { useSelector } from 'react-redux';


export default function DoAssignmentShort() {

  const { token } = useSelector((state) => state.auth);
  const { assignmentId, classId } = useParams();
  console.log(token);
//   const [test ,setTest] = useState([])
//   console.log(test)
  const [content, setContent] = useState({
    title: 'Tên bài tập',
    description: 'Câu hỏi 1',
    items: [
      {
        id: 0,
        question: "Câu hỏi không có tiêu đề"
      }
    ]
  });
  console.log(content)
  const [showModal, setShowModal] = useState(false);
  const [submissionError, setSubmissionError] = useState('');
  const [assignment ,setAssignment] = useState({})
  const [question ,setQuestion] = useState({})
  console.log(question.questions)
  console.log(typeof assignment.question_name)
  

 
  useEffect(() => {
    const fetchAssignmentDetail = async () => {
        try {
            const response = await apiGetShortAssignmentDetail(assignmentId, classId);
            console.log(response.data.assignment.question_name);
            setAssignment(response.data.assignment);

            
            if (response.data.assignment.question_name && typeof response.data.assignment.question_name === 'string') {
                
                const questionData = JSON.parse(response.data.assignment.question_name);
                setQuestion(questionData);
                console.log(questionData)
               
            } else {
                console.error('Invalid question_name format');
            }
        } catch (error) {
            console.error(error);
        }
    };

    fetchAssignmentDetail();
}, [assignmentId, classId]);


  const handleAnswerChange = (data, id) => {
    const newItems = content.items.map(item => {
      if (item.id === id) {
        return { ...item, answer: data };
      }
      return item;
    });
    setContent({ ...content, items: newItems });
  };

  const handleSubmit = () => {
    
    const unansweredQuestions = content.items.filter(item => !item.answer);
    if (unansweredQuestions.length > 0) {
      setSubmissionError('Please answer all questions before submitting.');
    } else {
      
      setShowModal(true);
    }
  };

  const handleModalSubmit = () => {
   
    closeModal();
  };

  const closeModal = () => {
    setShowModal(false);
    setSubmissionError(''); 
  };

  return (
    <div className="container-fluid">
      <div className="header-short-assignment">
        <h1 className="h3 mb-2 text-gray-800">{assignment.assignment_name}</h1> 
      </div>

      {Array.isArray(question.questions) && question.questions.map((item,index) => (
            <div className="title-container shadow-sm" key={index}>
                <span>Câu hỏi {index + 1}: </span><span>{item.title}</span> 
                
                <div className="content-add-item shadow-sm">
                    <CKEditor
                    editor={ClassicEditor}
                    // data={item.answer || ''}
                    onChange={(event, editor) => {
                        const data = editor.getData();
                        // handleAnswerChange(data, item.id);
                    }}
                    />
                </div>
                {/* ))} */}
            </div>
            ))}

      <div className="text-danger mb-3">{submissionError}</div>
      <button className="btn btn-primary" onClick={handleSubmit}>Nộp bài</button>
      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to submit the assignment?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleModalSubmit}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}