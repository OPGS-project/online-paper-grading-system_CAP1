import React, { useState, useCallback } from 'react';
import { IoDuplicateOutline } from 'react-icons/io5';
import '~~/pages/assignment/AddAssignmentShort.scss';
import axios from 'axios';

export default function AddAssignmentShort() {
  const [inputValueTitle, setInputValueTitle] = useState('Mẫu không có tiêu đề');
  const [inputValueDescription, setInputValueDescription] = useState('Mô tả biểu mẫu');
  const [inputValueTitleQuestion, setInputValueTitleQuestion] = useState('Câu hỏi không có tiêu đề');
  const [isImporting, setIsImporting] = useState(false);
  const [update, setUpdate] = useState(false);
  
  const [newItems, setNewItems] = useState([]);
  const [items, setItems] = useState([
    {
      id: 0,
      title: "Câu hỏi không có tiêu đề",
      grade: 0
    }
  ]);

  const render = useCallback(() => {
    setUpdate(!update);
  }, [update]);

  const handleAddItem = () => {
    const newItem = {
      id: Date.now(),
      title: inputValueTitleQuestion,
      grade: 0
    };
    setNewItems(prevItems => [...prevItems, newItem]);
    setItems(prevItems => [...prevItems, newItem]);
  };

  const handleTitleChange = (e) => {
    setInputValueTitle(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setInputValueDescription(e.target.value);
  };

  const handleTitleQuestionChange = (e, id) => {
    const newItems = items.map(item => {
      if (item.id === id) {
        return { ...item, title: e.target.value };
      }
      return item;
    });
    setItems(newItems);
  };

  const handleSaveQuestion = () => {
    const jsonQuestions = {
      questions: items.map(item => ({
        title: item.title,
        grade: item.grade
      }))
    };
    console.log("JSON các câu hỏi:", jsonQuestions);
  };

  const handleDeleteItem = (id) => {
    const updatedItems = items.filter(item => item.id !== id);
    setItems(updatedItems);
  };

  const handleDuplicateItem = (id) => {
    const selectedItem = items.find(item => item.id === id);
    if (selectedItem) {
      const newItem = { ...selectedItem, id: Date.now() };
      setNewItems(prevItems => [...prevItems, newItem]);
      setItems(prevItems => [...prevItems, newItem]);
    }
  };

  const handleGradeChange = (e) => {
    const inputGrade = parseFloat(e.target.value);
    const id = parseInt(e.target.dataset.id, 10);

    // Tính tổng lại tất cả các điểm
    const totalGrade = items.reduce((total, currentItem) => {
      if (currentItem.id === id) {
        return total + inputGrade;
      } else {
        return total + currentItem.grade;
      }
    }, 0);

    // Kiểm tra nếu tổng điểm vượt quá 10
    if (totalGrade > 10) {
      alert("Tổng điểm của tất cả các câu hỏi không được vượt quá 10");
      e.target.value = '';
      return;
    }

    // Cập nhật điểm cho câu hỏi
    const newItems = items.map(item => {
      if (item.id === id) {
        return { ...item, grade: inputGrade };
      }
      return item;
    });
    setItems(newItems);
  };

  const handleImport = async (e) => {
    if (isImporting) {
      return;
    }
    setIsImporting(true);

    const file = e.target.files[0];

    if (file) {
      const formData = new FormData();
      formData.append('csvFile', file);
      try {
        // await axios.post(`http://localhost:8081/api/student/upload-csv/${params.classID}`, formData);
        alert('CSV file uploaded successfully!');
        render();
        setIsImporting(false);
      } catch (error) {
        console.error(error);
        alert('Error uploading CSV file. Please try again.');
      } finally {
        setIsImporting(false);
      }
    } else {
      alert('Please select a CSV file to upload.');
      setIsImporting(false);
    }
  };


  return (
    <div className="container-fluid d-flex flex-column align-items-center justify-content-center">
      <div className="right-sidebar">
        <button className="add-new-button" onClick={handleAddItem}>
          <i className="bi bi-plus-circle-fill"></i>
        </button>
      </div>
      <div className="header-short-assignment">
        <h1 className="h3 mb-2 text-gray-800">Thêm bài tập ngắn</h1>
        <label htmlFor="import" className="btn btn-warning ml-5 mt-2">
          <i className="fa-solid fa-file-import"></i>
        </label>
        <input type="file" id="import" onChange={handleImport} hidden />
        <button className="btn btn-primary" onClick={handleSaveQuestion}>Lưu</button>

      </div>
      <div className="title-container shadow-sm">
        <div className="line"></div>
        <textarea
          type="text"
          value={inputValueTitle}
          onChange={handleTitleChange}
          className="mt-2 ml-2 title-text"
        />
        <br />
        <input
          type="text"
          value={inputValueDescription}
          onChange={handleDescriptionChange}
          className="description-text"
        />
      </div>

      {items.map(item => (
        <div className={`content-add-item shadow-sm ${newItems.some(newItem => newItem.id === item.id) ? 'add-item-animation' : ''}`} key={item.id}>
          <div className="line"></div>
          <textarea
            type="text"
            value={item.title}
            onChange={(e) => handleTitleQuestionChange(e, item.id)}
            className="title-question ml-2"
          />
          <hr />
          <div className="footer-question">
            <span>
              <i className="duplicate-question-icon mr-2" onClick={() => handleDuplicateItem(item.id)}>
                <IoDuplicateOutline />
              </i>
            </span>
            <span>
              <input type="number" min="0" max="10" className="grade-input" placeholder="Điểm" onChange={handleGradeChange} data-id={item.id} />
            </span>
            <span>
              <i className="bi bi-trash-fill delete-question-icon" onClick={() => handleDeleteItem(item.id)}></i>
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
