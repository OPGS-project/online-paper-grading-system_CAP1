import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Gallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import Modal from 'react-modal';
import { apiGetGradingForStudent, apiGetStudent } from '~/apis/userService';

function ReturnAssignment() {
    const { token } = useSelector((state) => state.auth);

    const [values, setValues] = useState([]);
    const [data, setData] = useState([]);
    useEffect(() => {
        const fetchUser = async () => {
            const user = await apiGetStudent(token);
            const idStudent = user.data.response.id;
            console.log(idStudent);
            const response = await apiGetGradingForStudent(token, idStudent);
            // console.log(user);
            // console.log(response);
            if (response?.data.err === 0) {
                // setValues(response.data.response.rows[0].classData.assignmentData);
                setValues(response.data.response);
                setData(user.data.response);
            } else {
                setValues([]);
                setData([]);
            }
        };
        token && fetchUser();
    }, [token]);

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
                            {values.length > 0 ? (
                                values.map((item, index) => (
                                    <tr key={index}>
                                        <td style={{ fontWeight: 500 }}>
                                            {item.submissionData.assignmentData.assignment_name}
                                        </td>
                                        <td>
                                            <button onClick={() => openLightbox(index)} className="btn btn-link">
                                                Xem bài
                                            </button>
                                        </td>
                                        <td>{item.comments}</td>
                                        <td>{item.score_value}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4}>Hiện chưa có bài tập nào </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <Modal isOpen={modalIsOpen} onRequestClose={closeLightbox} contentLabel="Image Modal">
                        <Gallery
                            items={values.map((item) => ({ original: item.image, description: item.comments }))}
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
