import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import '~~/pages/assignment/DoAssignmentShort.scss';
import {apiGetAssignmentOfStudent} from '~/apis/userService';
import { useSelector } from 'react-redux';
export default function DoAssignmentShort() {

  const { token } = useSelector((state) => state.auth);
  console.log(token);
  const [test ,setTest] = useState([])
  console.log(test)
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
  

  // // Fetch data from database (example)
  // useEffect(() => {
  //   // Example fetch
  //   // Replace with your actual fetch logic to get content from database
  //   fetchDataFromDatabase().then(data => {
  //     setContent(data);
  //   }).catch(error => {
  //     console.error('Error fetching data:', error);
  //   });
  // }, []);

  // // Function to fetch data from database (example)
  // const fetchDataFromDatabase = async () => {
  //   // Example API call, replace with your actual API call
  //   const response = await fetch('http://localhost:8081/api/main-student/get-assignment-of-student');
  //   console.log(response)
  //   return response;
  // };
  useEffect(() => {
    const fetchUser = async () => {
        const response = await apiGetAssignmentOfStudent(token);
      
        console.log(response);
        setTest(response.data.response.classes)
        // console.log(response.data.response.Classes);
        if (response?.data.err === 0) {
           
        } else {
            
        }
    };
    token && fetchUser();
}, [token]);

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
    // Validate if all questions are answered
    const unansweredQuestions = content.items.filter(item => !item.answer);
    if (unansweredQuestions.length > 0) {
      setSubmissionError('Please answer all questions before submitting.');
    } else {
      // Implement API submission logic here
      setShowModal(true);
    }
  };

  const handleModalSubmit = () => {
    // Here you can implement the logic for submitting the form
    // and then close the modal
    // For now, just closing the modal
    closeModal();
  };

  const closeModal = () => {
    setShowModal(false);
    setSubmissionError(''); // Clear submission error
    // Reset form or navigate to another page upon successful submission
  };

  return (
    <div className="container-fluid">
      <div className="header-short-assignment">
        <h1 className="h3 mb-2 text-gray-800">{content.title}</h1> {/* Display title */}
      </div>
      <div className="title-container shadow-sm">
        <p>{content.description}</p> {/* Display description */}
        {/* {content.items.map(item => ( */}
          <div className="content-add-item shadow-sm"> {/* key={item.id} */}
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
