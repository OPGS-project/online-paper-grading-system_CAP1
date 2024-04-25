import '~~/pages/assignment/AddAssignmentShort.scss';

import React, { useState } from 'react';

export default function AddAssignmentShort() {
    const [inputValueTitle, setInputValueTitle] = useState("Mẫu không có tiêu đề");
    const [inputValueDescription, setInputValueDescription] = useState("Mô tả biểu mẫu");

    const handleTitleChange = (e) => {
        setInputValueTitle(e.target.value);
    };

    const handleDescriptionChange = (e) => {
        setInputValueDescription(e.target.value);
    };

    return (
        <div className="container-fluid d-flex flex-column align-items-center justify-content-center">
            <div className=''></div>
            <div className="header-short-assignment">
                <h1 className="h3 mb-2 text-gray-800">Thêm bài tập ngắn</h1>
                <button className="btn btn-primary">Lưu</button>
            </div>
            <div className="title-container shadow-sm">
                <div className='line'></div>
                <input
                    type="text"
                    value={inputValueTitle}
                    onChange={handleTitleChange}
                    className='mt-2 ml-2 title-text'
                />
                <br />
                <input 
                    type="text" 
                    value={inputValueDescription}
                    onChange={handleDescriptionChange}
                    className='description-text'
                />
            </div>
        </div>
    );
}