import React, { useState } from 'react';
import { IoDuplicateOutline } from 'react-icons/io5';
import '~~/pages/assignment/AddAssignmentShort.scss';

export default function AddAssignmentShort() {
  const [inputValueTitle, setInputValueTitle] = useState('Mẫu không có tiêu đề');
  const [inputValueDescription, setInputValueDescription] = useState('Mô tả biểu mẫu');
  const [inputValueTitleQuestion] = useState('Câu hỏi không có tiêu đề');
  const [newItems, setNewItems] = useState([]);
  const [items, setItems] = useState([
    {
      id: 0,
      title: "Câu hỏi không có tiêu đề"
    }
  ]);

  const handleAddItem = () => {
    const newItem = {
      id: Date.now(),
      title: inputValueTitleQuestion
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

  const handleTitleQuestion = (e, id) => {
    const newItems = items.map(item => {
      if (item.id === id) {
        return { ...item, title: e.target.value };
      }
      return item;
    });
    setItems(newItems);
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

  return (
    <div className="container-fluid d-flex flex-column align-items-center justify-content-center">
        <div className="right-sidebar">
            <button className="add-new-button" onClick={handleAddItem}>
                <i className="bi bi-plus-circle-fill"></i>
            </button>
        </div>
        <div className="header-short-assignment">
            <h1 className="h3 mb-2 text-gray-800">Thêm bài tập ngắn</h1>
            <button className="btn btn-primary">Lưu</button>
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
            onChange={(e) => handleTitleQuestion(e, item.id)}
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
                <i className="bi bi-trash-fill delete-question-icon" onClick={() => handleDeleteItem(item.id)}></i>
            </span>
            </div>
        </div>
        ))}
    </div>
  );
}
