import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Modal } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { GoMortarBoard } from 'react-icons/go';

export default function Class() {
    const [state, setState] = useState({
        Class: [],
        offset: 0,
        perPage: 7,
        pageCount: 0,
        searchTerm: '',
        originalClass: [],
        showConfirmationModal: false,
        classToDelete: null,
    });

    const { token } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch classes when the component mounts
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        try {
            const response = await axios.get('http://localhost:8081/api/class/', {
                headers: {
                    authorization: token,
                },
            });

            const classData = response.data.classData.rows;

            setState((prevState) => ({
                ...prevState,
                Class: classData,
                originalClass: classData,
                pageCount: Math.ceil(classData.length / prevState.perPage),
            }));
        } catch (error) {
            console.error(error);
        }
    };

    const handlePageClick = (data) => {
        const selectedPage = data.selected;
        setState((prevState) => ({
            ...prevState,
            offset: selectedPage * prevState.perPage,
        }));
    };

    const handleDelete = (id) => {
        setState((prevState) => ({
            ...prevState,
            showConfirmationModal: true,
            classToDelete: id,
        }));
    };

    const handleSearch = () => {
        const { originalClass, searchTerm, perPage } = state;

        if (searchTerm === '') {
            restoreOriginalClasses();
        } else {
            const filteredClass = originalClass.filter((data) =>
                data.class_name.toLowerCase().includes(searchTerm.toLowerCase())
            );

            setState((prevState) => ({
                ...prevState,
                Class: filteredClass,
                pageCount: Math.ceil(filteredClass.length / perPage),
                offset: 0,
            }));
        }
    };

    const restoreOriginalClasses = () => {
        setState((prevState) => ({
            ...prevState,
            Class: prevState.originalClass,
            pageCount: Math.ceil(prevState.originalClass.length / prevState.perPage),
            offset: 0,
        }));
    };

    const generateRows = () => {
        return state.Class.length > 0 ? (
            state.Class.slice(state.offset, state.offset + state.perPage).map((data, i) => (
                <tr
                    key={i}
                    onClick={() => navigate(`/home/class/get-student/${data.id}`)}
                    style={{ cursor: 'pointer' }}
                    className="text-center"
                >
                    <td>{data.class_name}</td>
                    <td>{data.content}</td>
                    <td onClick={(e) => e.stopPropagation()}>
                        <Link to={`/home/class/update-class/${data.id}`} className="bi bi-pencil-square mr-3"></Link>
                        <i
                            className="bi bi-trash-fill text-danger"
                            onClick={() => handleDelete(data.id)}
                            style={{ cursor: 'pointer' }}
                        ></i>
                    </td>
                </tr>
            ))
        ) : (
            <tr>
                <td colSpan={9} className="text-center">
                    Hiện tại chưa có lớp học nào <GoMortarBoard />
                </td>
            </tr>
        );
    };

    const handlePrevious = () => {
        if (state.offset - state.perPage >= 0) {
            setState((prevState) => ({
                ...prevState,
                offset: prevState.offset - prevState.perPage,
            }));
        }
    };

    const handleNext = () => {
        if (state.offset + state.perPage < state.Class.length) {
            setState((prevState) => ({
                ...prevState,
                offset: prevState.offset + prevState.perPage,
            }));
        }
    };

    const handleClearSearch = () => {
        setState((prevState) => ({
            ...prevState,
            searchTerm: '',
        }));
        restoreOriginalClasses();
    };

    const handleConfirmationModalClose = () => {
        setState((prevState) => ({
            ...prevState,
            showConfirmationModal: false,
            classToDelete: null,
        }));
    };

    const handleDeleteConfirmed = async () => {
        try {
            await axios.delete(`http://localhost:8081/api/class/delete-class/${state.classToDelete}`);

            setState((prevState) => ({
                ...prevState,
                Class: prevState.Class.filter((item) => item.id !== state.classToDelete),
                originalClass: prevState.originalClass.filter((item) => item.id !== state.classToDelete),
            }));
        } catch (err) {
            console.log(err);
        } finally {
            handleConfirmationModalClose();
        }
    };

    return (
        <div className="container-fluid">
            <h1 className="h3 mb-2 text-gray-800">Thông tin lớp học</h1>

            <div className="card shadow mb-4">
                <div className="card-header py-3">
                    <Link to="/home/class/createClass" className="btn btn-success py-2">
                        + Thêm lớp học
                    </Link>
                    <p className="float-right"> ({state.Class.length} lớp)</p>
                </div>
                <div className="card-body">
                    <div id="dataTable_filter" className="filteredData mb-2">
                        <label className="mr-3">
                            Tìm Kiếm:
                            <input
                                type="search"
                                className="form-control form-control-sm"
                                placeholder=""
                                aria-controls="dataTable"
                                value={state.searchTerm}
                                onChange={(e) => setState({ ...state, searchTerm: e.target.value })}
                                onKeyUp={(e) => {
                                    if (e.key === 'Enter') {
                                        handleSearch();
                                    }
                                }}
                            />
                        </label>
                        <button className="btn btn-primary" onClick={handleSearch}>
                            <i className="fas fa-search"></i>
                        </button>
                        <button className="btn btn-danger ml-2" onClick={handleClearSearch}>
                            X
                        </button>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-hover" id="dataTable" width="100%" cellSpacing="0">
                            <thead>
                                <tr className="text-center">
                                    <th>Tên lớp</th>
                                    <th>Khóa</th>
                                    <th>Tùy chỉnh</th>
                                </tr>
                            </thead>
                            <tbody>{generateRows()}</tbody>
                        </table>
                    </div>
                    <div className="pagination d-flex m-3 justify-content-center">
                        <button className="btn btn-primary mr-3" onClick={handlePrevious}>
                            <i className="fa fa-angle-left"></i>
                        </button>
                        <button className="btn btn-primary" onClick={handleNext}>
                            <i className="fa fa-angle-right"></i>
                        </button>
                    </div>
                </div>
            </div>

            {/* Confirmation Modal */}
            <Modal show={state.showConfirmationModal} onHide={handleConfirmationModalClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Xác nhận</Modal.Title>
                </Modal.Header>
                <Modal.Body>Bạn chắc chắn muốn xóa ?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleConfirmationModalClose}>
                        Hủy
                    </Button>
                    <Button variant="danger" onClick={handleDeleteConfirmed}>
                        Xóa
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
