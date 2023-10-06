import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPenTool } from '@react-icons/all-files//fi/FiPenTool';

function Marking() {
    // const [currentImageIndex, setCurrentImageIndex] = useState(0);
    // const images = [
    //     'https://cdn.lazi.vn/storage/uploads/edu/answer/1631780134_lazi_339834.jpeg',
    //     'https://scontent.xx.fbcdn.net/v/t1.15752-9/373082863_140608115779501_753902912200915243_n.png?stp=dst-png_p206x206&_nc_cat=108&ccb=1-7&_nc_sid=aee45a&_nc_ohc=gvHowFos4pMAX--ngOG&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.xx&oh=03_AdQZ-8PX18yQ4ez1YlF7A53bcvw5OeHnPMdMQ2l7IYOllw&oe=651FCFB5',
    // ];

    // useEffect(() => {
    //     const prevButton = document.querySelector('.fa-chevron-left');
    //     const nextButton = document.querySelector('.fa-chevron-right');

    //     const updateImage = () => {
    //         const image = document.getElementById('assignmentImage');
    //         image.src = images[currentImageIndex];
    //     };

    //     const handlePrevClick = () => {
    //         setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    //     };

    //     const handleNextClick = () => {
    //         setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    //     };

    //     prevButton.addEventListener('click', handlePrevClick);
    //     nextButton.addEventListener('click', handleNextClick);

    //     updateImage();

    //     return () => {
    //         prevButton.removeEventListener('click', handlePrevClick);
    //         nextButton.removeEventListener('click', handleNextClick);
    //     };
    // }, [currentImageIndex, images]);
    const navigate = useNavigate();
    return (
        <div className="container-fluid mb-5">
            <div className="d-flex align-items-center">
                <button
                    className="btn btn-back"
                    onClick={() => {
                        navigate('/add-assignment');
                    }}
                >
                    <i class="fa-solid fa-arrow-left"></i>
                </button>
                <h1 className="h4 text-uppercase pl-5">
                    <FiPenTool className="mr-2" />
                    CHẤM BÀI
                </h1>
            </div>
            <div className="row w-100">
                <div className="col-md-8">
                    <div class="card-header py-3 d-flex justify-content-between">
                        <span> Tên : Nguyễn Hà</span>
                        <span> Lớp : 3A1</span>
                        <span> Thời gian nộp : 14:00 23/08/2023</span>
                    </div>
                    <div className="container mt-3">
                        <p className="text-center">Hình ảnh bài tập</p>
                        <div className="text-center">
                            <i className="fa-solid fa-chevron-left mr-3 curson-pointer"></i>1/2
                            <i className="fa-solid fa-chevron-right ml-3"></i>
                        </div>
                        <div className="img-fluid ">
                            <img
                                id="assignmentImage"
                                className="img-bt"
                                src="https://cdn.lazi.vn/storage/uploads/edu/answer/1631780134_lazi_339834.jpeg"
                                alt="Ảnh bài tập nộp"
                            />
                        </div>
                    </div>
                </div>
                <div className="col-md-5"></div>
            </div>
        </div>
    );
}

export default Marking;
