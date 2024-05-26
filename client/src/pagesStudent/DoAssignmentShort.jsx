import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import '~~/pages/assignment/DoAssignmentShort.scss';
import { apiGetShortAssignmentDetail } from '~/apis/userService';
import { useSelector } from 'react-redux';
import axios from 'axios';
import moment from 'moment';

export default function DoAssignmentShort() {
  const { token } = useSelector((state) => state.auth);
  const { assignmentId, classId } = useParams();
  const navigate = useNavigate();

  const [questionAnswers, setQuestionAnswers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [submissionError, setSubmissionError] = useState('');
  const [assignment, setAssignment] = useState({});
  const [question, setQuestion] = useState({});

  useEffect(() => {
    const fetchAssignmentDetail = async () => {
      try {
        const response = await apiGetShortAssignmentDetail(assignmentId, classId);
        setAssignment(response.data.assignment);
        if (response.data.assignment.question_name && typeof response.data.assignment.question_name === 'string') {
          const questionData = JSON.parse(response.data.assignment.question_name);
          setQuestion(questionData);
        } else {
          console.error('Invalid question_name format');
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchAssignmentDetail();
  }, [assignmentId, classId]);

  const handleAnswerChange = (data, index) => {
    setQuestionAnswers(prevAnswers => {
      const updatedAnswers = [...prevAnswers];
      updatedAnswers[index] = data;
      return updatedAnswers;
    });
  };

  const handleSubmit = () => {
    setShowModal(true);
  };

  const handleModalSubmit = async () => {
    setShowModal(false);
    const response = await submitAssignment();
    if (response.data.errorCode === 1) {
      alert(response.data.message);
      setTimeout(() => {
        navigate("/student/assignment-short-student");
      }, 1000);
    } else {
      navigate("/student/assignment-short-student");
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSubmissionError('');
  };

  const stripTags = (html) => {
    // Replace <br> and <br/> with \n
    let text = html.replace(/<br\s*\/?>/gi, '\n');
    // Replace <p> and </p> with \n
    text = text.replace(/<\/p>\s*<p>/gi, '\n').replace(/<\/?p>/gi, '\n');
    // Replace &nbsp; with a space
    text = text.replace(/&nbsp;/g, '\n');
    // Remove all other HTML tags
    text = text.replace(/<\/?[^>]+(>|$)/g, "");
    // Remove multiple consecutive newlines
    text = text.replace(/\n{2,}/g, '\n');
    return text.trim();
  };

  const submitAssignment = async () => {
    const submissionData = question.questions.map((question, index) => ({
      question: question.title,
      teacherAnswer: question.answer,
      grade: question.grade,
      studentAnswer: questionAnswers[index] ? stripTags(questionAnswers[index]) : ""
    }));
    console.log('2222222', submissionData);
    const classIdInt = parseInt(classId, 10);
    const assignmentIdInt = parseInt(assignmentId, 10);
    const answerJson = JSON.stringify(submissionData);

    const data = {
      assignment_id: assignmentIdInt,
      class_id: classIdInt,
      submission_time: new Date(),
      answer_short: answerJson
    };

    return await axios.post(
      'http://localhost:8081/api/main-student/submit-short',
      data,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
      }
    );
  };

  return (
    <div className="container-fluid exam-short-assignment">
      <div className="header-short-assignment do-assignment">
        <p className="header-infor">Tên bài tập: {assignment.assignment_name}</p>
        <p className='header-infor'>Hạn nộp bài: {moment(assignment.deadline).format('DD-MM-YYYY HH:mm a')}</p>
      </div>

      {Array.isArray(question.questions) && question.questions.map((item, index) => (
        <div className="title-container shadow-sm" key={index}>
          <span className='question'><b style={{ color: "#000" }}>Câu {index + 1}: </b></span>
          <span className='question' style={{ color: "#000" }}>{item.title}</span>

          <div className="content-add-item shadow-sm ckeditor-short">
            <CKEditor
              editor={ClassicEditor}
              data={questionAnswers[index] || ''}
              onChange={(event, editor) => {
                const data = editor.getData();
                handleAnswerChange(data, index);
              }}
            />
          </div>
        </div>
      ))}

      <div className="text-danger mb-3">{submissionError}</div>
      <button className="btn btn-primary mt-3 mb-5" onClick={handleSubmit}>Nộp bài</button>
      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header>
          <Modal.Title>Thông báo</Modal.Title>
        </Modal.Header>
        <Modal.Body>Bạn có chắc muốn nộp bài?</Modal.Body>
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
