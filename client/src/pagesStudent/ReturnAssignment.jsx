import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Gallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import Modal from 'react-modal';

function ReturnAssignment() {
  const data = [
    {
      id: 1,
      name_assignment: "Kiểm tra giữa kỳ 1",
      score_value: 8,
      comments: "Tốt",
      image: [
        {
          original: "https://res.cloudinary.com/dpkkfverq/image/upload/v1700754314/uploads/kzs7iah8ce8tclahjdnq.jpg",
            },
        {
          original: "https://res.cloudinary.com/dpkkfverq/image/upload/v1700583449/uploads/gsdnyh61ddn38mrqhhwu.jpg",
        },
        {
          original: "https://res.cloudinary.com/dpkkfverq/image/upload/v1700318392/assignments/e52wcuptfepvqzgoxhvq.jpg",
        },
      ],
    },
    {
        id: 2,
        name_assignment: "Kiểm tra giữa kỳ 2",
        score_value: 8,
        comments: "Tạm được",
        image: [
          {
            original: "https://res.cloudinary.com/dpkkfverq/image/upload/v1700754314/uploads/kzs7iah8ce8tclahjdnq.jpg",
          },
          {
            original: "https://res.cloudinary.com/dpkkfverq/image/upload/v1700583449/uploads/gsdnyh61ddn38mrqhhwu.jpg",
          },
          {
            original: "https://res.cloudinary.com/dpkkfverq/image/upload/v1700318392/assignments/e52wcuptfepvqzgoxhvq.jpg",
          },
        ],
      },
  ];
  const [currentImage, setCurrentImage] = useState(0);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openLightbox = (index) => {
    setCurrentImage(index);
    setModalIsOpen(true);
  };

  const closeLightbox = () => {
    setCurrentImage(0);
    setModalIsOpen(false);
  };

  return (
    <div className="container-fluid">
      <div className="card shadow">
        <div className="text-left card-header">
          <h4 className=" p-3 d-flex align-items-center">Bài tập đã chấm</h4>
        </div>
        <div className="card-body">
          <table className="table table-hover" id="dataTable" width={100}>
            <thead className="text-center">
              <tr>
                <th>Tên Bài Tập</th>
                <th>Bài đã chấm</th>
                <th>Lời phê</th>
                <th>Điểm</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {data.map((item, index) => (
                <tr key={index}>
                  <td style={{ fontWeight: 500 }}>{item.name_assignment}</td>
                  <td>
                    <button
                      onClick={() => openLightbox(index)}
                      className="btn btn-link"
                    >
                      Xem bài
                    </button>
                  </td>
                  <td>{item.comments}</td>
                  <td>{item.score_value}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeLightbox}
            contentLabel="Image Modal"
          >
            <Gallery
              items={data[currentImage].image}
              startIndex={currentImage}
              onClose={closeLightbox}
            />
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default ReturnAssignment;
