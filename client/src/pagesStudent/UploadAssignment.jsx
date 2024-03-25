import React, { useEffect, useState } from 'react';
import DropFileInput from './DropFileInput';
import { ToastContainer } from 'react-toastify';
import '~~/student/UploadAssignment.scss';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
//

function UploadAssignment() {
    const navigate = useNavigate();

    const [submitted, setSubmitted] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState([]);

    const onFileChange = (files) => {
        setUploadedFiles(files);
    };

    return (
        <div className="container-fluid">
            <button
                className="btn btn-back"
                onClick={() => {
                    navigate(-1);
                }}
            >
                <i className="fa-solid fa-arrow-left"></i>
            </button>
            <div className="box">
                <h2 className="header">Tải lên bài tập của bạn!</h2>
                <DropFileInput onFileChange={onFileChange} />

                <ToastContainer />
            </div>
        </div>
    );
}

export default UploadAssignment;
