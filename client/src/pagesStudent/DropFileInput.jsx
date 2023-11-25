import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '~~/student/DropFileInput.scss';
import { ImageConfig } from '~/utils/helper';
import uploadImg from '~~/images/cloud-upload-regular-240.png';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const DropFileInput = (props) => {
    const wrapperRef = useRef(null);
    const [fileList, setFileList] = useState([]);
    const { token } = useSelector(state => state.auth)
    const params = useParams()
    console.log(params)
    // console.log(token)

    const onDragEnter = () => wrapperRef.current.classList.add('dragover');
    const onDragLeave = () => wrapperRef.current.classList.remove('dragover');
    const onDrop = () => wrapperRef.current.classList.remove('dragover');

    const onFileDrop = async (e) => {
        if (e.target.files) setFileList(prev => [...prev, e.target.files[0]])
        // const newFile = e.target.files[0];
        // if (newFile) {
        //     const formData = new FormData();
        //     formData.append('image', newFile);

        //     try {
        //         const response = await axios.post('http://localhost:8081/api/submission', formData, {
        //             headers: {
        //               'Content-Type': 'multipart/form-data',                     
        //                 authorization: token,                      
        //             },
        //         });

        //         const uploadedFile = response.data;

        //         const updatedList = [...fileList, uploadedFile];
        //         setFileList(updatedList);
        //         props.onFileChange(updatedList);
        //         // Hiển thị thông báo thành công
        //         toast.success('Tải lên thành công');
        //     } catch (error) {
        //         console.error('Lỗi tải lên:', error);
        //         // Hiển thị thông báo lỗi
        //         toast.error('Lỗi tải lên');
        //     }
        // }
    };

    const fileRemove = (file) => {
        const updatedList = [...fileList];
        updatedList.splice(fileList.indexOf(file), 1);
        setFileList(updatedList);
        props.onFileChange(updatedList);
    };

    // Xử lý sự kiện khi nút "Nộp Bài" được nhấn
    const handleSubmission = async () => {
        if (fileList.length > 0) {
            const formData = new FormData();
            fileList.forEach((file, index) => {
                formData.append(`image`, file);
            });
            formData.append('assignment_id', params.aid)

            try {
                const response = await axios.post('http://localhost:8081/api/submission', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        authorization: token,
                    },
                });

                // Xử lý phản hồi từ máy chủ (response.data)
                // Hiển thị thông báo thành công
                toast.success('Nộp bài thành công');
            } catch (error) {
                console.error('Lỗi nộp bài:', error);
                // Hiển thị thông báo lỗi
                toast.error('Lỗi nộp bài');
            }
        } else {
            alert('Vui lòng tải lên ít nhất một tệp trước khi nộp bài.');
        }
    };

    return (
        <>
            <div
                ref={wrapperRef}
                className="drop-file-input"
                onDragEnter={onDragEnter}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
            >
                <div className="drop-file-input__label">
                    <img src={uploadImg} alt="" />
                    <p>Kéo & Thả Files</p>
                </div>
                <input className="input" type="file" value="" onChange={onFileDrop} />
            </div>
            {fileList.length > 0 ? (
                <div className="drop-file-preview">
                    <p className="drop-file-preview__title">Đã tải lên</p>
                    {fileList.map((item, index) => (
                        <div key={index} className="drop-file-preview__item">
                            <img src={ImageConfig[item.format] || ImageConfig['default']} alt="" />
                            <div className="drop-file-preview__item__info">
                                <p>{item.original_filename}</p>
                                <p>{item.bytes}B</p>
                            </div>
                            <span className="drop-file-preview__item__del" onClick={() => fileRemove(item)}>
                                x
                            </span>
                        </div>
                    ))}
                </div>
            ) : null}
            {/* Nút Nộp Bài */}
            <button className="submit-button mt-5" onClick={handleSubmission}>
                Nộp Bài
            </button>
        </>
    );
};

DropFileInput.propTypes = {
    onFileChange: PropTypes.func,
};

export default DropFileInput;
