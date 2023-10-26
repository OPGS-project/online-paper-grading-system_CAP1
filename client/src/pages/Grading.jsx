import React, { useEffect, useState } from 'react';
import '~~/pages/Grading.scss';

function Grading() {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const images = [
        'https://cdn.lazi.vn/storage/uploads/edu/answer/1631780134_lazi_339834.jpeg',
        'https://cdn.lazi.vn/storage/uploads/edu/answer/1631780134_lazi_339834.jpeg',
    ];

    useEffect(() => {
        const prevButton = document.querySelector('.fa-chevron-left');
        const nextButton = document.querySelector('.fa-chevron-right');

        const updateImage = () => {
            const image = document.getElementById('assignmentImage');
            image.src = images[currentImageIndex];
        };

        const handlePrevClick = () => {
            setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
        };

        const handleNextClick = () => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        };

        prevButton.addEventListener('click', handlePrevClick);
        nextButton.addEventListener('click', handleNextClick);

        updateImage();

        return () => {
            prevButton.removeEventListener('click', handlePrevClick);
            nextButton.removeEventListener('click', handleNextClick);
        };
    }, [currentImageIndex, images]);
    return (
        <div class="container-fluid m-0">
            <div className="content-container">
                <div class="assignment-info-box">
                    <div class="assignment-info">
                        <p>Tên: Nguyễn Văn A</p>
                        <p>Lớp: CMU TPM1</p>
                        <p>Thời gian nộp bài: 2023-08-28 14:30:00</p>
                    </div>
                    <div class="assigment-images">
                        <i class="fa-solid fa-chevron-left"></i>
                        <span>1/2</span>
                        <i class="fa-solid fa-chevron-right"></i>
                    </div>
                    <div class="image-container">
                        <img
                            id="assignmentImage"
                            class="img-assigment"
                            src="https://cdn.lazi.vn/storage/uploads/edu/answer/1631780134_lazi_339834.jpeg"
                            alt="Ảnh bài tập nộp"
                        />
                    </div>
                </div>
                <div class="criteria_result-assignment">
                    <div class="grading-criteria-box">
                        <div class="grading-criteria">
                            <div class="item-criteria">
                                <p class="criteria-text">Tiêu chí bài tập</p>
                                <span class="criterias-score">6</span>
                            </div>
                            <div class="item-criteria">
                                <div class="end-criteria">
                                    <p>Rõ ràng, sạch sẽ</p>
                                    <span>0.5</span>
                                </div>
                            </div>
                            <div class="item-criteria">
                                <div class="end-criteria">
                                    <p>Đúng các bước giải</p>
                                    <span>3</span>
                                </div>
                            </div>
                            <div class="item-criteria">
                                <div class="end-criteria">
                                    <p>Câu a: 5/16 </p>
                                    <span>1</span>
                                </div>
                            </div>
                            <div class="item-criteria">
                                <div class="end-criteria">
                                    <p>Câu b: 3/16 </p>
                                    <span>1.5</span>
                                </div>
                            </div>
                            <div class="question">
                                <div class="first-item">
                                    <p>Câu a: Diện tích tờ giấy</p>
                                    <i class="fa-solid fa-ellipsis fa-fade"></i>
                                </div>
                                <div class="item-criteria">
                                    <div class="end-criteria">
                                        <p>Theo một trình tự</p>
                                        <span>2</span>
                                    </div>
                                </div>
                                <div class="end-item">
                                    <i class="fa-solid fa-plus"></i>
                                    <span>Thêm tiêu chí cho câu hỏi</span>
                                </div>
                            </div>
                            <div class="question">
                                <div class="first-item">
                                    <p>Câu b: Diện tích tờ giấy còn lại</p>
                                    <i class="fa-solid fa-ellipsis fa-fade"></i>
                                </div>
                                <div class="end-item">
                                    <i class="fa-solid fa-plus"></i>
                                    <span>Thêm tiêu chí cho câu hỏi</span>
                                </div>
                            </div>
                            <div class="question">
                                <div class="first-item">
                                    <p>Câu 1: Tính nhanh</p>
                                    <i class="fa-solid fa-ellipsis fa-fade"></i>
                                </div>
                                <div class="item-criteria">
                                    <div class="start-criteria">
                                        <p>Kết quả</p>
                                        <i class="fa-solid fa-angle-down"></i>
                                    </div>
                                    <div class="end-criteria">
                                        <p>Câu 1: 170 </p>
                                        <span>1</span>
                                    </div>
                                </div>
                                <div class="item-criteria">
                                    <div class="start-criteria">
                                        <p>Trình bày</p>
                                        <i class="fa-solid fa-angle-down"></i>
                                    </div>
                                    <div class="end-criteria">
                                        <p>Giải thích rõ ràng</p>
                                        <span>0.5</span>
                                    </div>
                                </div>
                                <div class="end-item">
                                    <i class="fa-solid fa-plus"></i>
                                    <span>Thêm tiêu chí cho câu hỏi</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="grading-result">
                        <div class="comment-box">
                            <p>Nhận xét bài tập</p>
                            <div class="input-container">
                                <textarea className="textarea" placeholder="Nhập nội dung ở đây..." rows="4"></textarea>
                            </div>
                        </div>
                        <div class="result-container">
                            <div class="result-box">
                                <p>Tổng điểm</p>
                                <input type="number" value="0" />
                            </div>
                            <button>Lưu</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Grading;
